import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const WAVE_API_KEY = Deno.env.get("WAVE_API_KEY");
const WAVE_API_URL = "https://api.wave.com/v1";

// Helper function to call Wave API
async function waveRequest(endpoint: string, method: string, body?: any) {
  const headers: any = {
    Authorization: `Bearer ${WAVE_API_KEY}`,
    "Content-Type": "application/json",
  };

  const options: any = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${WAVE_API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Erreur Wave API");
  }

  return data;
}

// Initiate Wave payment
app.post("/initiate", async (c) => {
  try {
    if (!WAVE_API_KEY) {
      return c.json({
        success: false,
        error: "Wave non configuré. Ajoutez WAVE_API_KEY dans les secrets Supabase.",
      }, 500);
    }

    const token = c.req.header("X-User-Token");
    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    const body = await c.req.json();
    const { planId, phoneNumber } = body;

    // Validate phone number (Senegal format)
    const phoneRegex = /^(\+221|221)?[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return c.json({
        success: false,
        error: "Numéro de téléphone invalide. Format attendu: +221XXXXXXXXX",
      }, 400);
    }

    // Get plan details
    const planKey = `subscription_plan:${planId}`;
    const { data: planData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", planKey)
      .single();

    if (!planData?.value) {
      return c.json({ success: false, error: "Plan non trouvé" }, 404);
    }

    const plan = planData.value;
    const amount = plan.priceXOF; // Wave only supports XOF

    // Create Wave checkout
    const waveCheckout = await waveRequest("/checkout/sessions", "POST", {
      amount,
      currency: "XOF",
      error_url: `${c.req.header("origin")}/pricing`,
      success_url: `${c.req.header("origin")}/payment/success?wave_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId,
        planId,
        phoneNumber,
      },
    });

    // Save transaction
    const transactionId = crypto.randomUUID();
    const transaction = {
      id: transactionId,
      userId,
      planId,
      amount,
      currency: "XOF",
      phoneNumber,
      waveCheckoutId: waveCheckout.id,
      status: "pending",
      method: "wave_mobile_money",
      createdAt: new Date().toISOString(),
    };

    await supabase.from("kv_store_6378cc81").insert({
      key: `wave_transaction:${transactionId}`,
      value: transaction,
    });

    return c.json({
      success: true,
      data: {
        checkoutId: waveCheckout.id,
        waveUrl: waveCheckout.wave_launch_url,
        qrCode: waveCheckout.qr_code,
        transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur initiation paiement Wave:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Check Wave payment status
app.get("/status/:checkoutId", async (c) => {
  try {
    if (!WAVE_API_KEY) {
      return c.json({ success: false, error: "Wave non configuré" }, 500);
    }

    const checkoutId = c.req.param("checkoutId");

    // Get checkout status from Wave
    const checkout = await waveRequest(`/checkout/sessions/${checkoutId}`, "GET");

    // Find our transaction
    const { data: transactions } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "wave_transaction:%");

    const transaction = transactions?.find(
      (t) => t.value.waveCheckoutId === checkoutId
    );

    if (!transaction) {
      return c.json({ success: false, error: "Transaction non trouvée" }, 404);
    }

    const txValue = transaction.value;

    // Update transaction status
    if (checkout.payment_status === "completed" && txValue.status !== "completed") {
      txValue.status = "completed";
      txValue.completedAt = new Date().toISOString();

      await supabase.from("kv_store_6378cc81").upsert({
        key: transaction.key,
        value: txValue,
      });

      // Create subscription
      const { data: planData } = await supabase
        .from("kv_store_6378cc81")
        .select("value")
        .eq("key", `subscription_plan:${txValue.planId}`)
        .single();

      if (planData?.value) {
        const plan = planData.value;
        const subscriptionId = crypto.randomUUID();

        const startDate = new Date();
        const endDate = new Date(startDate);
        
        if (plan.duration === "1 mois") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (plan.duration === "3 mois") {
          endDate.setMonth(endDate.getMonth() + 3);
        } else if (plan.duration === "6 mois") {
          endDate.setMonth(endDate.getMonth() + 6);
        } else if (plan.duration === "1 an") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        const subscription = {
          id: subscriptionId,
          userId: txValue.userId,
          planId: txValue.planId,
          planName: plan.name,
          status: "active",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          amount: txValue.amount,
          currency: "XOF",
          paymentMethod: "wave_mobile_money",
          waveCheckoutId: checkoutId,
          createdAt: new Date().toISOString(),
        };

        await supabase.from("kv_store_6378cc81").upsert({
          key: `user_subscription:${txValue.userId}`,
          value: subscription,
        });

        console.log("✅ Abonnement Wave créé:", subscriptionId);
      }
    }

    return c.json({
      success: true,
      data: {
        status: checkout.payment_status,
        transaction: txValue,
      },
    });
  } catch (error) {
    console.error("Erreur vérification statut Wave:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Wave webhook
app.post("/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const { type, data } = body;

    console.log("📨 Wave webhook reçu:", type);

    if (type === "checkout.completed") {
      const checkoutId = data.id;

      // Find transaction
      const { data: transactions } = await supabase
        .from("kv_store_6378cc81")
        .select("key, value")
        .like("key", "wave_transaction:%");

      const transaction = transactions?.find(
        (t) => t.value.waveCheckoutId === checkoutId
      );

      if (transaction && transaction.value.status !== "completed") {
        const txValue = transaction.value;
        txValue.status = "completed";
        txValue.completedAt = new Date().toISOString();

        await supabase.from("kv_store_6378cc81").upsert({
          key: transaction.key,
          value: txValue,
        });

        console.log("✅ Paiement Wave confirmé:", checkoutId);
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Wave:", error);
    return c.json({ error: String(error) }, 500);
  }
});

export default app;
