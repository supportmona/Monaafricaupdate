import { Hono } from "npm:hono";
import { supabase as db } from "./db.tsx";
import * as kv from "./kv_store.tsx";
import * as memberAuth from "./member_auth.tsx";

export function registerSubscriptionRoutes(app: Hono) {
  /**
   * Récupérer une session de paiement
   * GET /make-server-6378cc81/checkout-sessions/:sessionId
   */
  app.get("/make-server-6378cc81/checkout-sessions/:sessionId", async (c) => {
    try {
      const sessionId = c.req.param("sessionId");

      if (!sessionId) {
        return c.json({ error: "Session ID requis" }, 400);
      }

      // Récupérer la session
      const session = await kv.get(`checkout_session:${sessionId}`);
      if (!session) {
        return c.json({ error: "Session introuvable" }, 404);
      }

      return c.json({
        success: true,
        data: session,
      });
    } catch (error) {
      console.error("❌ Erreur récupération session:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Créer une session de paiement Stripe
   * POST /make-server-6378cc81/subscriptions/create-checkout-session
   */
  app.post("/make-server-6378cc81/subscriptions/create-checkout-session", async (c) => {
    try {
      const accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const body = await c.req.json();
      const { planKey, currency } = body;

      console.log("💳 Création session paiement:", { userId, planKey, currency });

      // Validation
      if (!planKey || !currency) {
        return c.json({ error: "Plan et devise requis" }, 400);
      }

      const validPlans = ["essentiel", "premium", "excellence"];
      if (!validPlans.includes(planKey)) {
        return c.json({ error: "Plan invalide" }, 400);
      }

      if (!["USD", "XOF"].includes(currency)) {
        return c.json({ error: "Devise invalide" }, 400);
      }

      // Prix des plans
      const prices = {
        essentiel: { USD: 25, XOF: 15000 },
        premium: { USD: 49, XOF: 29000 },
        excellence: { USD: 149, XOF: 89000 },
      };

      const amount = prices[planKey as keyof typeof prices][currency as "USD" | "XOF"];

      // Pour le prototype, créer une session simulée
      const checkoutSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Enregistrer la session en attente
      await kv.set(`checkout_session:${checkoutSessionId}`, {
        userId,
        planKey,
        currency,
        amount,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      console.log("✅ Session créée:", checkoutSessionId);

      return c.json({
        success: true,
        data: {
          sessionId: checkoutSessionId,
          checkoutUrl: `/payment/checkout/${checkoutSessionId}`,
          amount,
          currency,
        },
      });
    } catch (error) {
      console.error("❌ Erreur création session:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Confirmer un paiement simulé
   * POST /make-server-6378cc81/subscriptions/confirm-payment
   */
  app.post("/make-server-6378cc81/subscriptions/confirm-payment", async (c) => {
    try {
      const body = await c.req.json();
      const { sessionId, paymentMethod } = body;

      console.log("✅ Confirmation paiement:", { sessionId, paymentMethod });

      if (!sessionId) {
        return c.json({ error: "Session ID requis" }, 400);
      }

      // Récupérer la session
      const session = await kv.get(`checkout_session:${sessionId}`);
      if (!session) {
        return c.json({ error: "Session introuvable" }, 404);
      }

      if (session.status !== "pending") {
        return c.json({ error: "Session déjà traitée" }, 400);
      }

      // Mettre à jour le statut de la session
      await kv.set(`checkout_session:${sessionId}`, {
        ...session,
        status: "completed",
        paymentMethod,
        completedAt: new Date().toISOString(),
      });

      // Mettre à jour le profil membre avec le nouveau plan
      const userId = session.userId;
      const memberProfile = await kv.get(`member:${userId}`);

      if (memberProfile) {
        const updatedProfile = {
          ...memberProfile,
          plan: session.planKey,
          subscription: {
            planKey: session.planKey,
            status: "active",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            currency: session.currency,
            amount: session.amount,
            paymentMethod,
          },
          updatedAt: new Date().toISOString(),
        };

        await kv.set(`member:${userId}`, updatedProfile);

        // Mettre à jour aussi dans SQL
        await db
          .from("users")
          .update({
            membership_type: session.planKey,
            status: "active",
            last_activity: new Date().toISOString(),
          })
          .eq("id", userId);

        console.log("✅ Abonnement activé pour:", userId);
      }

      // Enregistrer la transaction
      const transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: "subscription",
        planKey: session.planKey,
        amount: session.amount,
        currency: session.currency,
        paymentMethod,
        status: "completed",
        createdAt: new Date().toISOString(),
      };

      const transactionsKey = `member:${userId}:transactions`;
      const transactions = (await kv.get(transactionsKey)) || [];
      transactions.unshift(transaction);

      if (transactions.length > 100) {
        transactions.length = 100;
      }

      await kv.set(transactionsKey, transactions);

      return c.json({
        success: true,
        message: "Paiement confirmé avec succès",
        data: {
          transaction,
          subscription: {
            planKey: session.planKey,
            status: "active",
          },
        },
      });
    } catch (error) {
      console.error("❌ Erreur confirmation paiement:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Récupérer l'abonnement actuel d'un membre
   * GET /make-server-6378cc81/subscriptions/current
   */
  app.get("/make-server-6378cc81/subscriptions/current", async (c) => {
    try {
      const accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const memberProfile = await kv.get(`member:${userId}`);

      if (!memberProfile || !memberProfile.subscription) {
        return c.json({
          success: true,
          data: null,
        });
      }

      return c.json({
        success: true,
        data: memberProfile.subscription,
      });
    } catch (error) {
      console.error("❌ Erreur récupération abonnement:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Annuler un abonnement
   * POST /make-server-6378cc81/subscriptions/cancel
   */
  app.post("/make-server-6378cc81/subscriptions/cancel", async (c) => {
    try {
      const accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const memberProfile = await kv.get(`member:${userId}`);

      if (!memberProfile || !memberProfile.subscription) {
        return c.json({ error: "Aucun abonnement actif" }, 400);
      }

      // Mettre à jour le profil avec statut annulé
      const updatedProfile = {
        ...memberProfile,
        plan: "free",
        subscription: {
          ...memberProfile.subscription,
          status: "canceled",
          canceledAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`member:${userId}`, updatedProfile);

      // Mettre à jour aussi dans SQL
      await db
        .from("users")
        .update({
          membership_type: "free",
          status: "active",
          last_activity: new Date().toISOString(),
        })
        .eq("id", userId);

      console.log("✅ Abonnement annulé pour:", userId);

      return c.json({
        success: true,
        message: "Abonnement annulé avec succès",
      });
    } catch (error) {
      console.error("❌ Erreur annulation abonnement:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Récupérer l'historique des transactions
   * GET /make-server-6378cc81/subscriptions/transactions
   */
  app.get("/make-server-6378cc81/subscriptions/transactions", async (c) => {
    try {
      const accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const transactionsKey = `member:${userId}:transactions`;
      const transactions = (await kv.get(transactionsKey)) || [];

      return c.json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.error("❌ Erreur récupération transactions:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });
}