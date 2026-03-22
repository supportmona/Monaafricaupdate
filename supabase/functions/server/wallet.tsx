import * as kv from "./kv_store.tsx";
import * as memberAuth from "./member_auth.tsx";
import { Context } from "npm:hono";

/**
 * Récupérer le solde du wallet d'un membre
 */
export async function getWalletBalance(c: Context) {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) {
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    const walletKey = `member:${userId}:wallet`;
    const wallet = await kv.get(walletKey) || { balance: 0 };

    return c.json({
      success: true,
      data: { balance: wallet.balance || 0 },
    });
  } catch (error) {
    console.error("❌ Erreur récupération solde wallet:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
}

/**
 * Récupérer les transactions du wallet d'un membre
 */
export async function getWalletTransactions(c: Context) {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) {
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    const transactionsKey = `member:${userId}:wallet:transactions`;
    const transactions = await kv.get(transactionsKey) || [];

    return c.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("❌ Erreur récupération transactions wallet:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
}

/**
 * Recharger le wallet d'un membre
 */
export async function rechargeWallet(c: Context) {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

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
    const wallet = await kv.get(walletKey) || { balance: 0 };
    
    // Mettre à jour le solde
    const newBalance = (wallet.balance || 0) + amount;
    await kv.set(walletKey, { balance: newBalance });

    // Ajouter la transaction
    const transactionsKey = `member:${userId}:wallet:transactions`;
    const transactions = await kv.get(transactionsKey) || [];
    
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

    console.log(`✅ Wallet rechargé pour membre ${userId}: +${amount} XOF (nouveau solde: ${newBalance} XOF)`);

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
}

/**
 * Mettre à jour les préférences de notifications d'un membre
 */
export async function updateMemberPreferences(c: Context) {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) {
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    const body = await c.req.json();
    
    const currentProfile = await kv.get(`member:${userId}`) || {};
    
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

    console.log(`✅ Préférences de notifications mises à jour pour membre ${userId}`);

    return c.json({
      success: true,
      message: "Préférences enregistrées avec succès",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour préférences:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
}
