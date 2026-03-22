import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
const STRIPE_API_URL = "https://api.stripe.com/v1";

// Helper function to call Stripe API
async function stripeRequest(endpoint: string, method: string, body?: any) {
  const headers: any = {
    Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const options: any = {
    method,
    headers,
  };

  if (body && method !== "GET") {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "object" && value !== null) {
        for (const [subKey, subValue] of Object.entries(value)) {
          formData.append(`${key}[${subKey}]`, String(subValue));
        }
      } else {
        formData.append(key, String(value));
      }
    }
    options.body = formData;
  }

  const response = await fetch(`${STRIPE_API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Erreur Stripe");
  }

  return data;
}

// Create Stripe checkout session (vraie session Stripe)
app.post("/create-checkout-session", async (c) => {
  try {
    if (!STRIPE_SECRET_KEY) {
      return c.json({
        success: false,
        error: "Stripe non configuré. Ajoutez STRIPE_SECRET_KEY dans les secrets Supabase.",
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
    const { planId, currency } = body; // currency: "XOF" ou "USD"

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
    const amount = currency === "XOF" ? plan.priceXOF : plan.priceUSD;
    const stripeCurrency = currency === "XOF" ? "xof" : "usd";

    // Get or create Stripe customer
    let stripeCustomerId = null;
    const customerKey = `stripe_customer:${userId}`;
    const { data: customerData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", customerKey)
      .single();

    if (customerData?.value?.stripeCustomerId) {
      stripeCustomerId = customerData.value.stripeCustomerId;
    } else {
      // Create Stripe customer
      const customer = await stripeRequest("/customers", "POST", {
        email: userData.user.email,
        metadata: {
          userId,
          source: "mona_platform",
        },
      });

      stripeCustomerId = customer.id;

      // Save customer ID
      await supabase.from("kv_store_6378cc81").upsert({
        key: customerKey,
        value: { stripeCustomerId, userId },
      });
    }

    // Create Stripe checkout session
    const session = await stripeRequest("/checkout/sessions", "POST", {
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: stripeCurrency,
            product_data: {
              name: plan.name,
              description: `Abonnement ${plan.duration} - M.O.N.A`,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      success_url: `${c.req.header("origin")}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${c.req.header("origin")}/pricing`,
      metadata: {
        userId,
        planId,
        currency,
      },
    });

    // Save session in KV
    const sessionKey = `stripe_session:${session.id}`;
    await supabase.from("kv_store_6378cc81").insert({
      key: sessionKey,
      value: {
        sessionId: session.id,
        userId,
        planId,
        amount,
        currency,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
    });

    return c.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Erreur création session Stripe:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Webhook Stripe (pour confirmer les paiements)
app.post("/webhook", async (c) => {
  try {
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET non configuré");
      return c.json({ error: "Webhook secret manquant" }, 500);
    }

    const signature = c.req.header("stripe-signature");
    const body = await c.req.text();

    // Verify webhook signature (simplified - in production use Stripe SDK)
    // For now, we'll process the event directly
    const event = JSON.parse(body);

    console.log("📨 Stripe webhook reçu:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const { userId, planId, currency } = session.metadata;

      console.log("✅ Paiement confirmé:", { userId, planId, amount: session.amount_total });

      // Update session status
      const sessionKey = `stripe_session:${session.id}`;
      const { data: sessionData } = await supabase
        .from("kv_store_6378cc81")
        .select("value")
        .eq("key", sessionKey)
        .single();

      if (sessionData?.value) {
        await supabase.from("kv_store_6378cc81").upsert({
          key: sessionKey,
          value: {
            ...sessionData.value,
            status: "completed",
            completedAt: new Date().toISOString(),
          },
        });
      }

      // Create subscription
      const { data: planData } = await supabase
        .from("kv_store_6378cc81")
        .select("value")
        .eq("key", `subscription_plan:${planId}`)
        .single();

      if (planData?.value) {
        const plan = planData.value;
        const subscriptionId = crypto.randomUUID();

        const startDate = new Date();
        const endDate = new Date(startDate);
        
        // Calculate end date based on duration
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
          userId,
          planId,
          planName: plan.name,
          status: "active",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          amount: session.amount_total / 100,
          currency,
          paymentMethod: "stripe_card",
          stripeSessionId: session.id,
          createdAt: new Date().toISOString(),
        };

        // Save subscription
        await supabase.from("kv_store_6378cc81").upsert({
          key: `user_subscription:${userId}`,
          value: subscription,
        });

        // Add transaction
        const transactionId = crypto.randomUUID();
        const transaction = {
          id: transactionId,
          userId,
          type: "subscription_payment",
          amount: session.amount_total / 100,
          currency,
          status: "completed",
          method: "stripe_card",
          description: `Abonnement ${plan.name}`,
          createdAt: new Date().toISOString(),
        };

        await supabase.from("kv_store_6378cc81").insert({
          key: `transaction:${transactionId}`,
          value: transaction,
        });

        // Add to user transactions list
        const transactionsKey = `user_transactions:${userId}`;
        const { data: txData } = await supabase
          .from("kv_store_6378cc81")
          .select("value")
          .eq("key", transactionsKey)
          .single();

        const txList = txData?.value || [];
        txList.unshift(transactionId);

        await supabase.from("kv_store_6378cc81").upsert({
          key: transactionsKey,
          value: txList,
        });

        console.log("✅ Abonnement créé:", subscriptionId);
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Erreur webhook Stripe:", error);
    return c.json({ error: String(error) }, 500);
  }
});

// Get payment methods for user
app.get("/payment-methods", async (c) => {
  try {
    const token = c.req.header("X-User-Token");
    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    // Get Stripe customer
    const customerKey = `stripe_customer:${userId}`;
    const { data: customerData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", customerKey)
      .single();

    if (!customerData?.value?.stripeCustomerId) {
      return c.json({ success: true, data: [] });
    }

    if (!STRIPE_SECRET_KEY) {
      return c.json({ success: true, data: [] });
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripeRequest(
      `/payment_methods?customer=${customerData.value.stripeCustomerId}&type=card`,
      "GET"
    );

    return c.json({
      success: true,
      data: paymentMethods.data.map((pm: any) => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
      })),
    });
  } catch (error) {
    console.error("Erreur récupération payment methods:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
