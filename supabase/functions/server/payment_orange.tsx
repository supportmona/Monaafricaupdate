import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const ORANGE_MONEY_API_KEY = Deno.env.get("ORANGE_MONEY_API_KEY");
const ORANGE_MONEY_MERCHANT_ID = Deno.env.get("ORANGE_MONEY_MERCHANT_ID");
const ORANGE_MONEY_API_URL = "https://api.orange.com/orange-money-webpay/dev/v1";

// Helper to get OAuth token
async function getOrangeToken() {
  const response = await fetch("https://api.orange.com/oauth/v3/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(ORANGE_MONEY_API_KEY!)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Helper function to call Orange Money API
async function orangeRequest(endpoint: string, method: string, body?: any) {
  const token = await getOrangeToken();

  const headers: any = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const options: any = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${ORANGE_MONEY_API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erreur Orange Money API");
  }

  return data;
}

// Initiate Orange Money payment
app.post("/initiate", async (c) => {
  try {
    if (!ORANGE_MONEY_API_KEY || !ORANGE_MONEY_MERCHANT_ID) {
      return c.json({
        success: false,
        error: "Orange Money non configuré. Ajoutez ORANGE_MONEY_API_KEY et ORANGE_MONEY_MERCHANT_ID.",
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
    const { planId, phoneNumber, country } = body; // country: "SN", "CI", "ML", etc.

    // Validate phone number format (varies by country)
    if (!phoneNumber || phoneNumber.length < 8) {
      return c.json({
        success: false,
        error: "Numéro de téléphone invalide",
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
    const amount = plan.priceXOF; // Orange Money uses XOF for West Africa

    const orderReference = `MONA_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;

    // Create Orange Money payment
    const payment = await orangeRequest("/webpayment", "POST", {
      merchant_key: ORANGE_MONEY_MERCHANT_ID,
      currency: "XOF",
      order_id: orderReference,
      amount,
      return_url: `${c.req.header("origin")}/payment/success?orange_order=${orderReference}`,
      cancel_url: `${c.req.header("origin")}/pricing`,
      notif_url: `${c.req.header("origin")}/api/payment/orange/webhook`,
      lang: "fr",
      reference: orderReference,
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
      country: country || "unknown",
      orangeOrderId: orderReference,
      orangePaymentToken: payment.payment_token,
      status: "pending",
      method: "orange_money",
      createdAt: new Date().toISOString(),
    };

    await supabase.from("kv_store_6378cc81").insert({
      key: `orange_transaction:${transactionId}`,
      value: transaction,
    });

    return c.json({
      success: true,
      data: {
        orderId: orderReference,
        paymentUrl: payment.payment_url,
        paymentToken: payment.payment_token,
        transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur initiation paiement Orange Money:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Check Orange Money payment status
app.get("/status/:orderId", async (c) => {
  try {
    if (!ORANGE_MONEY_API_KEY) {
      return c.json({ success: false, error: "Orange Money non configuré" }, 500);
    }

    const orderId = c.req.param("orderId");

    // Get payment status from Orange Money
    const status = await orangeRequest(`/webpayment/${orderId}`, "GET");

    // Find our transaction
    const { data: transactions } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "orange_transaction:%");

    const transaction = transactions?.find(
      (t) => t.value.orangeOrderId === orderId
    );

    if (!transaction) {
      return c.json({ success: false, error: "Transaction non trouvée" }, 404);
    }

    const txValue = transaction.value;

    // Update transaction status
    if (status.status === "SUCCESS" && txValue.status !== "completed") {
      txValue.status = "completed";
      txValue.completedAt = new Date().toISOString();
      txValue.orangeTransactionId = status.txnid;

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
          paymentMethod: "orange_money",
          orangeOrderId: orderId,
          createdAt: new Date().toISOString(),
        };

        await supabase.from("kv_store_6378cc81").upsert({
          key: `user_subscription:${txValue.userId}`,
          value: subscription,
        });

        console.log("✅ Abonnement Orange Money créé:", subscriptionId);
      }
    }

    return c.json({
      success: true,
      data: {
        status: status.status,
        transaction: txValue,
      },
    });
  } catch (error) {
    console.error("Erreur vérification statut Orange Money:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Orange Money webhook
app.post("/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const { order_id, status, txnid } = body;

    console.log("📨 Orange Money webhook reçu:", { order_id, status });

    if (status === "SUCCESS") {
      // Find transaction
      const { data: transactions } = await supabase
        .from("kv_store_6378cc81")
        .select("key, value")
        .like("key", "orange_transaction:%");

      const transaction = transactions?.find(
        (t) => t.value.orangeOrderId === order_id
      );

      if (transaction && transaction.value.status !== "completed") {
        const txValue = transaction.value;
        txValue.status = "completed";
        txValue.completedAt = new Date().toISOString();
        txValue.orangeTransactionId = txnid;

        await supabase.from("kv_store_6378cc81").upsert({
          key: transaction.key,
          value: txValue,
        });

        console.log("✅ Paiement Orange Money confirmé:", order_id);
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Orange Money:", error);
    return c.json({ error: String(error) }, 500);
  }
});

export default app;
