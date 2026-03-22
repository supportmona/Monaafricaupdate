import * as kv from "./kv_store.tsx";
import * as memberAuth from "./member_auth.tsx";
import { getMemberRecommendations } from "./recommendations.tsx";
import { getArticleRecommendations } from "./articles_recommendations.tsx";
import { Hono } from "npm:hono";

export function registerWalletRoutes(app: Hono) {
  /**
   * Récupérer le solde du wallet d'un membre
   * GET /make-server-6378cc81/member/wallet/balance
   */
  app.get("/make-server-6378cc81/member/wallet/balance", async (c) => {
    try {
      // Essayer d'abord le header personnalisé X-User-Token (nouveau)
      let accessToken = c.req.header("X-User-Token");
      
      // Fallback sur Authorization header (ancien) pour compatibilité
      if (!accessToken) {
        const authHeader = c.req.header("Authorization");
        accessToken = authHeader?.split(" ")[1];
      }

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const walletKey = `member:${userId}:wallet`;
      const wallet = (await kv.get(walletKey)) || { balance: 0 };

      return c.json({
        success: true,
        data: { balance: wallet.balance || 0 },
      });
    } catch (error) {
      console.error("❌ Erreur récupération solde wallet:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Récupérer les transactions du wallet d'un membre
   * GET /make-server-6378cc81/member/wallet/transactions
   */
  app.get("/make-server-6378cc81/member/wallet/transactions", async (c) => {
    try {
      // Essayer d'abord le header personnalisé X-User-Token (nouveau)
      let accessToken = c.req.header("X-User-Token");
      
      // Fallback sur Authorization header (ancien) pour compatibilité
      if (!accessToken) {
        const authHeader = c.req.header("Authorization");
        accessToken = authHeader?.split(" ")[1];
      }

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const transactionsKey = `member:${userId}:wallet:transactions`;
      const transactions = (await kv.get(transactionsKey)) || [];

      return c.json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      console.error("❌ Erreur récupération transactions wallet:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Recharger le wallet d'un membre
   * POST /make-server-6378cc81/member/wallet/recharge
   */
  app.post("/make-server-6378cc81/member/wallet/recharge", async (c) => {
    try {
      // Essayer d'abord le header personnalisé X-User-Token (nouveau)
      let accessToken = c.req.header("X-User-Token");
      
      // Fallback sur Authorization header (ancien) pour compatibilité
      if (!accessToken) {
        const authHeader = c.req.header("Authorization");
        accessToken = authHeader?.split(" ")[1];
      }

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const body = await c.req.json();
      const { amount } = body;

      if (!amount || amount <= 0) {
        return c.json({ error: "Montant invalide" }, 400);
      }

      // Récupérer le wallet actuel
      const walletKey = `member:${userId}:wallet`;
      const wallet = (await kv.get(walletKey)) || { balance: 0 };

      // Mettre à jour le solde
      const newBalance = (wallet.balance || 0) + amount;
      await kv.set(walletKey, { balance: newBalance });

      // Ajouter la transaction
      const transactionsKey = `member:${userId}:wallet:transactions`;
      const transactions = (await kv.get(transactionsKey)) || [];

      const newTransaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "credit",
        amount: amount,
        description: "Recharge du wallet",
        date: new Date().toISOString(),
        balance: newBalance,
      };

      transactions.unshift(newTransaction);

      // Garder seulement les 50 dernières transactions
      if (transactions.length > 50) {
        transactions.length = 50;
      }

      await kv.set(transactionsKey, transactions);

      console.log(
        `✅ Wallet rechargé pour membre ${userId}: +${amount} XOF (nouveau solde: ${newBalance} XOF)`
      );

      return c.json({
        success: true,
        message: "Recharge effectuée avec succès",
        data: {
          balance: newBalance,
          transaction: newTransaction,
        },
      });
    } catch (error) {
      console.error("❌ Erreur recharge wallet:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Mettre à jour les préférences de notifications d'un membre
   * PUT /make-server-6378cc81/member/profile/preferences
   */
  app.put("/make-server-6378cc81/member/profile/preferences", async (c) => {
    try {
      // Essayer d'abord le header personnalisé X-User-Token (nouveau)
      let accessToken = c.req.header("X-User-Token");
      
      // Fallback sur Authorization header (ancien) pour compatibilité
      if (!accessToken) {
        const authHeader = c.req.header("Authorization");
        accessToken = authHeader?.split(" ")[1];
      }

      if (!accessToken) {
        return c.json({ error: "Token d'authentification manquant" }, 401);
      }

      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (sessionResult.error) {
        return c.json({ error: sessionResult.error }, 401);
      }

      const userId = sessionResult.data.user.id;
      const body = await c.req.json();

      const currentProfile = (await kv.get(`member:${userId}`)) || {};

      const updatedProfile = {
        ...currentProfile,
        preferences: {
          ...currentProfile.preferences,
          emailNotifications: body.emailNotifications,
          smsNotifications: body.smsNotifications,
          pushNotifications: body.pushNotifications,
          marketingEmails: body.marketingEmails,
          twoFactorAuth: body.twoFactorAuth,
        },
        updatedAt: new Date().toISOString(),
      };

      await kv.set(`member:${userId}`, updatedProfile);

      console.log(
        `✅ Préférences de notifications mises à jour pour membre ${userId}`
      );

      return c.json({
        success: true,
        message: "Préférences enregistrées avec succès",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("❌ Erreur mise à jour préférences:", error);
      return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
    }
  });

  /**
   * Récupérer les recommandations personnalisées d'un membre
   * GET /make-server-6378cc81/member/recommendations
   */
  app.get("/make-server-6378cc81/member/recommendations", getMemberRecommendations);

  /**
   * Récupérer les recommandations d'articles d'un membre
   * GET /make-server-6378cc81/member/articles/recommendations
   */
  app.get(
    "/make-server-6378cc81/member/articles/recommendations",
    getArticleRecommendations
  );
}