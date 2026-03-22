import * as kv from "./kv_store.tsx";
import { sendApprovalEmail, sendRejectionEmail, sendAdminToExpertEmail, sendExpertInvitationEmail } from "./emailService.tsx";
import { sendContactEmail, sendSupportEmail } from "./emailService.tsx";
import { sendConsultationNotificationEmail, sendMessageNotificationEmail } from "./notificationEmailService.tsx";
import * as expertAuth from "./expert_auth.tsx";
import * as adminAuth from "./admin_auth.tsx";
import * as memberAuth from "./member_auth.tsx";
import * as messaging from "./messaging.tsx";
import * as tickets from "./tickets.tsx";
import * as appointments from "./appointments.tsx";
import * as templates from "./templates.ts";
import { registerWalletRoutes } from "./wallet_routes.tsx";
import { registerSubscriptionRoutes } from "./subscription_routes.tsx";
import { handleChat } from "./chat.ts";
import { handleContactSend } from "./contact.ts";
import consultationRoutes from "./consultation_routes.tsx";
import rhRoutes from "./rh_routes.tsx";
import entrepriseRoutes from "./entreprise_routes.tsx";
import companyRoutes from "./company_routes.tsx";
import { getAdminAnalytics } from "./admin_analytics_sql.tsx";
import * as adminUsersSQL from "./admin_users_sql.tsx";
import expertDocuments from "./expert_documents.tsx";
import expertAvailability from "./expert_availability.tsx";
import expertPatients from "./expert_patients.tsx";
import chatRoutes from "./chat_routes.tsx";
import paymentStripe from "./payment_stripe.tsx";
import paymentWave from "./payment_wave.tsx";
import paymentOrange from "./payment_orange.tsx";
import invoiceGenerator from "./invoice_generator.tsx";
import calWebhook from "./cal_webhook.tsx";
import { Hono } from 'npm:hono';
import { logger } from 'npm:hono/logger';
import { cors } from 'npm:hono/cors';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token", "X-Expert-Id"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6378cc81/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== ADMIN AUTHENTICATION ROUTES ====================

/**
 * Vérifier si un compte admin existe
 * GET /make-server-6378cc81/admin/check
 */
app.get("/make-server-6378cc81/admin/check", async (c) => {
  try {
    const result = await adminAuth.hasAdminAccount();
    
    return c.json({
      success: true,
      hasAdmin: result.exists,
    });
  } catch (error) {
    console.error("❌ Erreur vérification admin:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Créer le premier compte admin (one-time setup)
 * POST /make-server-6378cc81/admin/setup
 */
app.post("/make-server-6378cc81/admin/setup", async (c) => {
  try {
    // Vérifier qu'aucun admin n'existe déjà
    const checkResult = await adminAuth.hasAdminAccount();
    if (checkResult.exists) {
      return c.json(
        { error: "Un compte administrateur existe déjà. Utilisez la page de connexion." },
        403
      );
    }

    const body = await c.req.json();
    const { email, password, name } = body;

    console.log("🔐 Tentative création premier admin:", { email, name });

    if (!email || !password || !name) {
      return c.json(
        { error: "Email, mot de passe et nom requis" },
        400
      );
    }

    if (password.length < 8) {
      return c.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        400
      );
    }

    const result = await adminAuth.createAdminAccount(email, password, {
      name,
      role: "admin",
    });

    if (result.error) {
      console.error("❌ Erreur création premier admin:", result.error);
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ Premier compte admin créé:", email);
    return c.json({
      success: true,
      message: "Compte administrateur créé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur dans la route setup admin:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Connexion admin
 * POST /make-server-6378cc81/admin/login
 */
app.post("/make-server-6378cc81/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, code2FA } = body;

    console.log("🔐 Tentative connexion admin:", email);

    if (!email || !password) {
      return c.json(
        { error: "Email et mot de passe requis" },
        400
      );
    }

    const result = await adminAuth.loginAdmin(email, password, code2FA);

    if (result.error) {
      console.error("❌ Erreur login admin:", result.error);
      
      // Si c'est une demande de 2FA, on renvoie un status 200 avec success: false
      if (result.error === "2FA_REQUIRED") {
        return c.json({ 
          success: false, 
          error: "2FA_REQUIRED",
          message: "Code 2FA requis" 
        }, 200);
      }
      
      return c.json({ error: result.error }, 401);
    }

    console.log("✅ Admin connecté:", email);
    return c.json({
      success: true,
      message: "Connexion réussie",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route login admin:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Déconnexion admin
 * POST /make-server-6378cc81/admin/logout
 */
app.post("/make-server-6378cc81/admin/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await adminAuth.logoutAdmin(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ Admin déconnecté");
    return c.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("❌ Erreur dans la route logout admin:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer la session admin
 * GET /make-server-6378cc81/admin/session
 */
app.get("/make-server-6378cc81/admin/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await adminAuth.getAdminSession(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 401);
    }

    return c.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route session admin:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

// ==================== MEMBER AUTHENTICATION ROUTES ====================

/**
 * Inscription d'un nouveau membre
 * POST /make-server-6378cc81/member/signup
 */
app.post("/make-server-6378cc81/member/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    console.log("📝 Tentative création compte membre:", { email, name });

    // Validation des champs requis
    if (!email || !password || !name) {
      console.error("❌ Champs manquants:", { email, password: !!password, name });
      return c.json(
        { error: "Tous les champs obligatoires doivent être remplis (email, password, name)" },
        400
      );
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      console.error("❌ Mot de passe trop court:", password.length);
      return c.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        400
      );
    }

    const result = await memberAuth.signupMember(email, password, {
      name,
    });

    if (result.error) {
      console.error("❌ Erreur signup membre:", result.error);
      
      // Retourner le code d'erreur approprié selon le type d'erreur
      if (result.code === "email_exists") {
        return c.json({ error: result.error }, 409); // 409 Conflict
      }
      
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ Compte membre créé:", result.data?.user?.id);
    return c.json({
      success: true,
      message: "Compte membre créé avec succès",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route signup membre:", error);
    return c.json(
      { error: `Erreur serveur lors de l'inscription: ${error.message}` },
      500
    );
  }
});

/**
 * 🧹 DELETE /make-server-6378cc81/member/cleanup-test/:email
 * Route de nettoyage pour supprimer un utilisateur de test (Auth + SQL + KV)
 */
app.delete("/make-server-6378cc81/member/cleanup-test/:email", async (c) => {
  try {
    const email = c.req.param("email");
    console.log("🧹 Nettoyage utilisateur de test:", email);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Chercher dans SQL
    const { data: sqlUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (sqlUser) {
      console.log("🗑️ Suppression de SQL:", sqlUser.id);
      await supabase.from('users').delete().eq('id', sqlUser.id);
    }

    // 2. Chercher dans Auth
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const authUser = users?.find(u => u.email === email);

    if (authUser) {
      console.log("🗑️ Suppression de Auth:", authUser.id);
      await supabase.auth.admin.deleteUser(authUser.id);
      
      // 3. Supprimer du KV Store
      await kv.del(`member:${authUser.id}`);
      console.log("🗑️ Suppression du KV Store");
    }

    console.log("✅ Nettoyage terminé pour:", email);
    return c.json({
      success: true,
      message: `Utilisateur ${email} supprimé de Auth, SQL et KV Store`,
      cleaned: {
        sql: !!sqlUser,
        auth: !!authUser,
      }
    });
  } catch (error) {
    console.error("❌ Erreur nettoyage:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Connexion d'un membre
 * POST /make-server-6378cc81/member/login
 */
app.post("/make-server-6378cc81/member/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    console.log("🔐 Tentative connexion membre:", email);

    if (!email || !password) {
      return c.json(
        { error: "Email et mot de passe requis" },
        400
      );
    }

    const result = await memberAuth.loginMember(email, password);

    if (result.error) {
      console.error("❌ Erreur login membre:", result.error);
      return c.json({ error: result.error }, 401);
    }

    console.log("✅ Membre connecté:", email);
    console.log("🎫 Token généré:", result.data.session.access_token ? `${result.data.session.access_token.substring(0, 30)}...` : "AUCUN");
    
    return c.json({
      success: true,
      message: "Connexion réussie",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route login membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Déconnexion membre
 * POST /make-server-6378cc81/member/logout
 */
app.post("/make-server-6378cc81/member/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await memberAuth.logoutMember(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ Membre déconnecté");
    return c.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("❌ Erreur dans la route logout membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer la session membre
 * GET /make-server-6378cc81/member/session
 */
app.get("/make-server-6378cc81/member/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await memberAuth.getMemberSession(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 401);
    }

    return c.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route session membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer le profil complet d'un membre
 * GET /make-server-6378cc81/member/profile
 */
app.get("/make-server-6378cc81/member/profile", async (c) => {
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
    const profile = await kv.get(`member:${userId}`);

    if (!profile) {
      return c.json({ error: "Profil introuvable" }, 404);
    }

    return c.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("❌ Erreur récupération profil membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Mettre à jour le profil d'un membre
 * PUT /make-server-6378cc81/member/profile
 */
app.put("/make-server-6378cc81/member/profile", async (c) => {
  try {
    // Essayer d'abord le header personnalisé X-User-Token (nouveau)
    let accessToken = c.req.header("X-User-Token");
    
    // Fallback sur Authorization header (ancien) pour compatibilité
    if (!accessToken) {
      const authHeader = c.req.header("Authorization");
      accessToken = authHeader?.split(" ")[1];
    }

    console.log("🔑 PUT /member/profile - Token reçu:", accessToken ? `${accessToken.substring(0, 20)}...` : "AUCUN");
    console.log("🔍 Headers présents:", {
      hasXUserToken: !!c.req.header("X-User-Token"),
      hasAuthorization: !!c.req.header("Authorization")
    });

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    console.log("🔍 Validation du token membre...");
    const sessionResult = await memberAuth.getMemberSession(accessToken);
    
    if (sessionResult.error) {
      console.error("❌ Erreur validation token:", sessionResult.error);
      console.error("❌ Type erreur:", typeof sessionResult.error);
      console.error("❌ Erreur complète:", JSON.stringify(sessionResult));
      return c.json({ 
        error: sessionResult.error,
        message: sessionResult.error, // Compatibilité avec différents formats
        details: "La session a expiré ou le token est invalide. Veuillez vous reconnecter."
      }, 401);
    }

    console.log("✅ Token validé pour utilisateur:", sessionResult.data.user.id);

    const userId = sessionResult.data.user.id;
    const body = await c.req.json();
    
    console.log("📝 Mise à jour profil membre:", userId, body);
    
    const currentProfile = await kv.get(`member:${userId}`) || {};

    const updatedProfile = {
      ...currentProfile,
      name: body.name !== undefined ? body.name : currentProfile.name,
      phone: body.phone !== undefined ? body.phone : currentProfile.phone,
      location: body.location !== undefined ? body.location : currentProfile.location,
      dateOfBirth: body.dateOfBirth !== undefined ? body.dateOfBirth : currentProfile.dateOfBirth,
      medicalInfo: body.medicalInfo !== undefined ? body.medicalInfo : currentProfile.medicalInfo,
      preferences: body.preferences !== undefined ? body.preferences : currentProfile.preferences,
      interests: body.interests !== undefined ? body.interests : currentProfile.interests,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`member:${userId}`, updatedProfile);
    
    console.log("✅ Profil membre mis à jour:", updatedProfile);

    return c.json({
      success: true,
      message: "Profil mis à jour avec succès",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour profil membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer les consultations d'un membre
 * GET /make-server-6378cc81/member/consultations
 */
app.get("/make-server-6378cc81/member/consultations", async (c) => {
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
    const userAppointments = await appointments.getUserAppointments(userId);

    if (userAppointments.error) {
      return c.json({ error: userAppointments.error }, 500);
    }

    return c.json({
      success: true,
      data: userAppointments.data || [],
    });
  } catch (error) {
    console.error("❌ Erreur récupération consultations membre:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Créer une nouvelle réservation pour un membre
 * POST /make-server-6378cc81/member/bookings
 */
app.post("/make-server-6378cc81/member/bookings", async (c) => {
  try {
    // Essayer d'abord le header personnalisé X-User-Token (nouveau)
    let accessToken = c.req.header("X-User-Token");
    
    // Fallback sur Authorization header (ancien) pour compatibilité
    if (!accessToken) {
      const authHeader = c.req.header("Authorization");
      accessToken = authHeader?.split(" ")[1];
    }

    let userId = null;
    let userName = "";
    let userEmail = "";

    if (accessToken) {
      const sessionResult = await memberAuth.getMemberSession(accessToken);
      if (!sessionResult.error) {
        userId = sessionResult.data.user.id;
        const profile = await kv.get(`member:${userId}`);
        userName = profile?.name || "";
        userEmail = sessionResult.data.user.email || "";
      }
    }

    const body = await c.req.json();
    const {
      expertId,
      date,
      time,
      consultationType,
      name,
      email,
      phone,
      reason,
    } = body;

    const finalName = userName || name;
    const finalEmail = userEmail || email;

    if (!expertId || !date || !time || !finalName || !finalEmail) {
      return c.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        400
      );
    }

    const appointment = await appointments.createAppointment({
      userId: userId || `guest_${Date.now()}`,
      expertId,
      date,
      time,
      consultationType: consultationType || "online",
      memberName: finalName,
      memberEmail: finalEmail,
      memberPhone: phone,
      reason: reason || "",
      status: "scheduled",
    });

    return c.json({
      success: true,
      message: "Rendez-vous créé avec succès",
      data: appointment,
    });
  } catch (error) {
    console.error("❌ Erreur création réservation:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

// ==================== EXPERT AUTHENTICATION ROUTES ====================

/**
 * Inscription d'un nouvel expert
 * POST /make-server-6378cc81/expert/signup
 */
app.post("/make-server-6378cc81/expert/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, specialty, licenseNumber, phone } = body;

    console.log("📝 Tentative création compte expert:", { email, firstName, lastName, specialty, licenseNumber });

    // Validation des champs requis
    if (!email || !password || !firstName || !lastName || !specialty || !licenseNumber) {
      console.error("❌ Champs manquants:", { email, password: !!password, firstName, lastName, specialty, licenseNumber });
      return c.json(
        { error: "Tous les champs obligatoires doivent être remplis (email, password, firstName, lastName, specialty, licenseNumber)" },
        400
      );
    }

    // Validation du mot de passe (minimum 8 caractères)
    if (password.length < 8) {
      console.error("❌ Mot de passe trop court:", password.length);
      return c.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        400
      );
    }

    const result = await expertAuth.signupExpert(email, password, {
      firstName,
      lastName,
      specialty,
      licenseNumber,
      phone,
    });

    if (result.error) {
      console.error("❌ Erreur signup:", result.error);
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ Compte expert créé:", result.data?.user?.id);
    return c.json({
      success: true,
      message: "Compte expert créé avec succès",
      data: result.data,
    });
  } catch (error) {
    console.error("❌ Erreur dans la route signup expert:", error);
    return c.json(
      { error: `Erreur serveur lors de l'inscription: ${error.message}` },
      500
    );
  }
});

/**
 * Connexion d'un expert
 * POST /make-server-6378cc81/expert/login
 */
app.post("/make-server-6378cc81/expert/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json(
        { error: "Email et mot de passe requis" },
        400
      );
    }

    const result = await expertAuth.loginExpert(email, password);

    if (result.error) {
      return c.json({ error: result.error }, 401);
    }

    return c.json({
      success: true,
      message: "Connexion réussie",
      data: result.data,
    });
  } catch (error) {
    console.error("Erreur dans la route login expert:", error);
    return c.json(
      { error: `Erreur serveur lors de la connexion: ${error.message}` },
      500
    );
  }
});

/**
 * Créer le compte démo expert (idempotent)
 * POST /make-server-6378cc81/expert/init-demo
 */
app.post("/make-server-6378cc81/expert/init-demo", async (c) => {
  try {
    const demoData = {
      email: "demo.expert@monafrica.net",
      password: "Expert2025!",
      firstName: "Dr. Sarah",
      lastName: "Koné",
      specialty: "Psychiatre",
      licenseNumber: "PSY-2024-001",
      phone: "+225 07 00 00 00"
    };

    console.log("🎯 [DEMO] Initialisation compte démo:", demoData.email);

    // Essayer de créer le compte
    const result = await expertAuth.signupExpert(demoData.email, demoData.password, {
      firstName: demoData.firstName,
      lastName: demoData.lastName,
      specialty: demoData.specialty,
      licenseNumber: demoData.licenseNumber,
      phone: demoData.phone,
    });

    if (result.error) {
      // Si le compte existe déjà, c'est OK
      if (result.error.includes("already") || result.error.includes("existe")) {
        console.log("✅ [DEMO] Compte démo existe déjà");
        return c.json({
          success: true,
          message: "Compte démo existe déjà",
          credentials: {
            email: demoData.email,
            password: demoData.password
          }
        });
      }
      
      console.error("❌ [DEMO] Erreur création:", result.error);
      return c.json({ error: result.error }, 400);
    }

    console.log("✅ [DEMO] Compte démo créé avec succès");
    return c.json({
      success: true,
      message: "Compte démo créé avec succès",
      credentials: {
        email: demoData.email,
        password: demoData.password
      }
    });
  } catch (error) {
    console.error("❌ [DEMO] Exception:", error);
    return c.json(
      { error: `Erreur serveur: ${error.message}` },
      500
    );
  }
});

/**
 * Déconnexion d'un expert
 * POST /make-server-6378cc81/expert/logout
 */
app.post("/make-server-6378cc81/expert/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await expertAuth.logoutExpert(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    console.error("Erreur dans la route logout expert:", error);
    return c.json(
      { error: `Erreur serveur lors de la déconnexion: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer la session active d'un expert
 * GET /make-server-6378cc81/expert/session
 */
app.get("/make-server-6378cc81/expert/session", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const result = await expertAuth.getExpertSession(accessToken);

    if (result.error) {
      return c.json({ error: result.error }, 401);
    }

    return c.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("Erreur dans la route session expert:", error);
    return c.json(
      { error: `Erreur serveur lors de la récupération de la session: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer le profil d'un expert
 * GET /make-server-6378cc81/expert/profile
 */
app.get("/make-server-6378cc81/expert/profile", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    // Vérifier la session
    const sessionResult = await expertAuth.getExpertSession(accessToken);
    if (sessionResult.error) {
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    const userEmail = sessionResult.data.user.email;
    const userMetadata = sessionResult.data.user.user_metadata || {};

    // Récupérer le profil depuis KV
    const profileKey = `expert:${userId}`;
    const profileData = await kv.get(profileKey);

    // Retourner le profil tel quel depuis KV
    const profile = profileData || {
      id: userId,
      email: userEmail,
      firstName: userMetadata.firstName || "",
      lastName: userMetadata.lastName || "",
      specialty: userMetadata.specialty || "",
      licenseNumber: userMetadata.licenseNumber || "",
      phone: userMetadata.phone || "",
      status: "active",
      createdAt: new Date().toISOString(),
      totalConsultations: 0,
      rating: 0,
      languages: ["Français"],
      availability: {},
      bio: "",
    };

    return c.json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Erreur dans la route get profile expert:", error);
    return c.json(
      { error: `Erreur serveur lors de la récupération du profil: ${error.message}` },
      500
    );
  }
});

/**
 * Mettre à jour le profil d'un expert
 * PUT /make-server-6378cc81/expert/profile
 */
app.put("/make-server-6378cc81/expert/profile", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const accessToken = authHeader?.split(" ")[1];

    if (!accessToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    // Vérifier la session
    const sessionResult = await expertAuth.getExpertSession(accessToken);
    if (sessionResult.error) {
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    const body = await c.req.json();

    // Extraire les champs modifiables
    const { phone, bio, languages, availability, specialty, firstName, lastName } = body;

    // Récupérer et mettre à jour le profil dans KV
    const profileKey = `expert:${userId}`;
    const currentProfile = await kv.get(profileKey) || {};

    const updatedProfile = {
      ...currentProfile,
      firstName: firstName !== undefined ? firstName : currentProfile.firstName,
      lastName: lastName !== undefined ? lastName : currentProfile.lastName,
      phone: phone !== undefined ? phone : currentProfile.phone,
      bio: bio !== undefined ? bio : currentProfile.bio,
      languages: languages || currentProfile.languages,
      availability: availability || currentProfile.availability,
      specialty: specialty || currentProfile.specialty,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(profileKey, updatedProfile);

    return c.json({
      success: true,
      message: "Profil mis à jour avec succès",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Erreur dans la route update profile expert:", error);
    return c.json(
      { error: `Erreur serveur lors de la mise à jour du profil: ${error.message}` },
      500
    );
  }
});

/**
 * Soumettre une candidature expert
 * POST /make-server-6378cc81/expert/application
 */
app.post("/make-server-6378cc81/expert/application", async (c) => {
  try {
    const body = await c.req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      profession,
      experience,
      diplomas,
      specialties,
      languages,
      availability,
      linkedin,
      motivation,
      licenseNumber,
      status,
      submittedAt,
      files,
    } = body;

    // Validation des champs requis
    if (!firstName || !lastName || !email || !phone || !profession || !licenseNumber) {
      return c.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        400
      );
    }

    // Générer un ID unique pour la candidature
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Log pour vérifier les fichiers reçus
    console.log(`📎 Candidature ${applicationId} - Fichiers reçus:`, {
      cv: files?.cv ? `${files.cv.name} (${files.cv.size} bytes)` : "Aucun",
      diplomas: files?.diplomas ? `${files.diplomas.name} (${files.diplomas.size} bytes)` : "Aucun",
      certifications: files?.certifications ? `${files.certifications.name} (${files.certifications.size} bytes)` : "Aucun",
    });

    // Stocker la candidature dans le KV store
    const application = {
      id: applicationId,
      firstName,
      lastName,
      email,
      phone,
      city,
      profession,
      experience,
      diplomas,
      specialties,
      languages,
      availability,
      linkedin,
      motivation,
      licenseNumber,
      files,
      status: status || "pending",
      submittedAt: submittedAt || new Date().toISOString(),
    };

    await kv.set(`application:${applicationId}`, application);
    console.log(`✅ Candidature ${applicationId} enregistrée avec ${files ? Object.keys(files).length : 0} fichier(s)`);

    // Ajouter à la liste des candidatures en attente
    const pendingApplications = await kv.get("applications:pending") || [];
    pendingApplications.push(applicationId);
    await kv.set("applications:pending", pendingApplications);

    return c.json({
      success: true,
      message: "Candidature enregistrée avec succès",
      data: { applicationId },
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la candidature:", error);
    return c.json(
      { error: `Erreur serveur lors de l'enregistrement: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer toutes les candidatures en attente (admin uniquement pour l'instant)
 * GET /make-server-6378cc81/expert/applications
 */
app.get("/make-server-6378cc81/expert/applications", async (c) => {
  try {
    // Récupérer toutes les candidatures (pas seulement pending)
    const allApps = await kv.getByPrefix("application:") || [];
    const applications = allApps.filter((app: any) => app && app.id);

    return c.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des candidatures:", error);
    return c.json(
      { error: `Erreur serveur lors de la récupération: ${error.message}` },
      500
    );
  }
});

/**
 * Récupérer tous les experts approuvés
 * GET /make-server-6378cc81/expert/list
 */
app.get("/make-server-6378cc81/expert/list", async (c) => {
  try {
    const approvedIds = await kv.get("applications:approved") || [];
    const experts = [];

    for (const id of approvedIds) {
      const expert = await kv.get(`application:${id}`);
      if (expert) {
        experts.push(expert);
      }
    }

    return c.json({
      success: true,
      data: experts,
    });
  } catch (error) {
    console.error("Erreur récupération experts:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Créer un expert manuellement (admin)
 * POST /make-server-6378cc81/expert/create
 */
app.post("/make-server-6378cc81/expert/create", async (c) => {
  try {
    const body = await c.req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      profession,
      experience,
      specialties,
      languages,
      licenseNumber,
    } = body;

    if (!firstName || !lastName || !email || !profession || !licenseNumber) {
      return c.json({ error: "Champs obligatoires manquants" }, 400);
    }

    console.log("🔍 Vérification de l'existence d'une candidature pour:", email);

    // Vérifier si une candidature existe déjà avec cet email
    let existingApplication = null;
    let expertId = null;
    
    // Récupérer toutes les candidatures
    const allApplicationKeys = await kv.getByPrefix("application:");
    for (const key of allApplicationKeys) {
      const app = await kv.get(key);
      if (app && app.email === email) {
        existingApplication = app;
        expertId = app.id;
        console.log("✅ Candidature existante trouvée:", {
          id: expertId,
          name: `${app.firstName} ${app.lastName}`,
          status: app.status,
        });
        break;
      }
    }

    let expert;
    let isFromExistingApplication = false;

    if (existingApplication) {
      // Mise à jour de la candidature existante
      isFromExistingApplication = true;
      expert = {
        ...existingApplication,
        // Mettre à jour avec les nouvelles données
        firstName: firstName || existingApplication.firstName,
        lastName: lastName || existingApplication.lastName,
        phone: phone || existingApplication.phone,
        city: city || existingApplication.city,
        profession: profession || existingApplication.profession,
        experience: experience || existingApplication.experience,
        specialties: specialties || existingApplication.specialties,
        languages: languages || existingApplication.languages,
        licenseNumber: licenseNumber || existingApplication.licenseNumber,
        status: "approved",
        updatedAt: new Date().toISOString(),
        approvedBy: "admin",
        approvedAt: new Date().toISOString(),
      };
      
      console.log("🔄 Mise à jour de la candidature existante en 'approved'");
    } else {
      // Créer un nouvel expert
      expertId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      expert = {
        id: expertId,
        firstName,
        lastName,
        email,
        phone,
        city,
        profession,
        experience,
        specialties,
        languages,
        licenseNumber,
        status: "approved",
        createdAt: new Date().toISOString(),
        createdBy: "admin",
      };
      
      console.log("✨ Création d'un nouvel expert");
    }

    await kv.set(`application:${expertId}`, expert);

    // Ajouter à la liste des approuvés (si pas déjà présent)
    const approvedIds = await kv.get("applications:approved") || [];
    if (!approvedIds.includes(expertId)) {
      approvedIds.push(expertId);
      await kv.set("applications:approved", approvedIds);
    }

    // Envoyer l'email d'invitation
    console.log("📧 Envoi de l'email d'invitation à:", email);
    const emailResult = await sendExpertInvitationEmail(
      email,
      firstName,
      lastName
    );

    if (!emailResult.success) {
      console.error("⚠️ Erreur envoi email d'invitation:", emailResult.error);
      // Ne pas bloquer la création, juste logger l'erreur
    } else {
      console.log("✅ Email d'invitation envoyé avec succès");
    }

    return c.json({
      success: true,
      message: `Expert ${isFromExistingApplication ? "mis à jour" : "créé"} avec succès. Un email d'invitation a été envoyé à ${email}`,
      data: expert,
      fromExistingApplication: isFromExistingApplication,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error("Erreur création expert:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Modifier un expert (admin)
 * PUT /make-server-6378cc81/expert/:id
 */
app.put("/make-server-6378cc81/expert/:id", async (c) => {
  try {
    const expertId = c.req.param("id");
    const body = await c.req.json();

    const existingExpert = await kv.get(`application:${expertId}`);
    if (!existingExpert) {
      return c.json({ error: "Expert introuvable" }, 404);
    }

    const updatedExpert = {
      ...existingExpert,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`application:${expertId}`, updatedExpert);

    return c.json({
      success: true,
      message: "Expert mis à jour avec succès",
      data: updatedExpert,
    });
  } catch (error) {
    console.error("Erreur mise à jour expert:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Supprimer un expert (admin)
 * DELETE /make-server-6378cc81/expert/:id
 */
app.delete("/make-server-6378cc81/expert/:id", async (c) => {
  try {
    const expertId = c.req.param("id");

    const expert = await kv.get(`application:${expertId}`);
    if (!expert) {
      return c.json({ error: "Expert introuvable" }, 404);
    }

    // Retirer de toutes les listes
    const approvedIds = await kv.get("applications:approved") || [];
    const newApprovedIds = approvedIds.filter((id: string) => id !== expertId);
    await kv.set("applications:approved", newApprovedIds);

    const pendingIds = await kv.get("applications:pending") || [];
    const newPendingIds = pendingIds.filter((id: string) => id !== expertId);
    await kv.set("applications:pending", newPendingIds);

    // Supprimer l'expert
    await kv.del(`application:${expertId}`);

    return c.json({
      success: true,
      message: "Expert supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression expert:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Activer/Désactiver un expert (admin)
 * PUT /make-server-6378cc81/expert/:id/toggle-active
 */
app.put("/make-server-6378cc81/expert/:id/toggle-active", async (c) => {
  try {
    const expertId = c.req.param("id");

    const expert = await kv.get(`application:${expertId}`);
    if (!expert) {
      return c.json({ error: "Expert introuvable" }, 404);
    }

    expert.active = !expert.active;
    expert.updatedAt = new Date().toISOString();
    await kv.set(`application:${expertId}`, expert);

    return c.json({
      success: true,
      message: expert.active ? "Expert activé" : "Expert désactivé",
      data: expert,
    });
  } catch (error) {
    console.error("Erreur toggle active expert:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour une candidature
 * PUT /make-server-6378cc81/expert/application/:id
 */
app.put("/make-server-6378cc81/expert/application/:id", async (c) => {
  try {
    const applicationId = c.req.param("id");
    const body = await c.req.json();

    // Récupérer la candidature existante
    const existingApp = await kv.get(`application:${applicationId}`);

    if (!existingApp) {
      return c.json({ error: "Candidature introuvable" }, 404);
    }

    // Mettre à jour la candidature
    const updatedApp = {
      ...existingApp,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`application:${applicationId}`, updatedApp);

    // Si le statut passe à "approved", retirer de la liste pending
    if (body.status === "approved") {
      const pendingIds = await kv.get("applications:pending") || [];
      const newPendingIds = pendingIds.filter((id: string) => id !== applicationId);
      await kv.set("applications:pending", newPendingIds);

      // Ajouter à la liste des approuvés
      const approvedIds = await kv.get("applications:approved") || [];
      approvedIds.push(applicationId);
      await kv.set("applications:approved", approvedIds);

      // Envoyer un email d'approbation
      await sendApprovalEmail(updatedApp.email, updatedApp.firstName, updatedApp.lastName);
    } else if (body.status === "rejected") {
      // Envoyer un email de rejet
      await sendRejectionEmail(updatedApp.email, updatedApp.firstName, updatedApp.lastName);
    }

    return c.json({
      success: true,
      message: "Candidature mise à jour avec succès",
      data: updatedApp,
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la candidature:", error);
    return c.json(
      { error: `Erreur serveur lors de la mise à jour: ${error.message}` },
      500
    );
  }
});

// ==================== MESSAGERIE INTERNE ROUTES ====================

/**
 * Récupérer toutes les conversations (admin)
 * GET /make-server-6378cc81/messages/conversations
 */
app.get("/make-server-6378cc81/messages/conversations", async (c) => {
  try {
    const archived = c.req.query("archived") === "true";
    
    // Récupérer toutes les conversations
    const allConvs = await kv.getByPrefix("conversation:") || [];
    const conversations = allConvs
      .filter((item: any) => item && item.id && !item.id.includes(":messages"))
      .filter((conv: any) => archived ? conv.archived === true : !conv.archived)
      .map((conv: any) => ({
        id: conv.id,
        memberId: conv.participants?.find((p: any) => p.role === "member")?.id || "",
        memberName: conv.participants?.find((p: any) => p.role === "member")?.name || "Inconnu",
        expertId: conv.participants?.find((p: any) => p.role === "expert")?.id || "",
        expertName: conv.participants?.find((p: any) => p.role === "expert")?.name || "Inconnu",
        lastMessage: conv.lastMessage || "",
        lastMessageAt: conv.lastMessageTime || new Date().toISOString(),
        unreadCount: Object.values(conv.unreadCount || {}).reduce((a: any, b: any) => a + b, 0),
        archived: conv.archived || false,
      }));

    // Trier par date décroissante
    conversations.sort((a: any, b: any) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return c.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Erreur récupération conversations admin:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les messages d'une conversation (admin)
 * GET /make-server-6378cc81/messages/conversation/:conversationId
 */
app.get("/make-server-6378cc81/messages/conversation/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messages = await messaging.getConversationMessages(conversationId);

    const formattedMessages = messages.map((msg: any) => ({
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      senderName: msg.senderName,
      senderRole: msg.senderRole,
      message: msg.content,
      sentAt: msg.timestamp,
      read: msg.read,
      cc: msg.cc || [],
      attachments: msg.attachments || [],
    }));

    return c.json({
      success: true,
      data: formattedMessages,
    });
  } catch (error) {
    console.error("Erreur récupération messages:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Créer une nouvelle conversation avec un message
 * POST /make-server-6378cc81/messages/create
 */
app.post("/make-server-6378cc81/messages/create", async (c) => {
  try {
    console.log("📨 Création d'une nouvelle conversation");
    
    const body = await c.req.json();
    const { senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content, cc } = body;

    if (!senderId || !senderName || !senderRole || !recipientId || !recipientName || !recipientRole || !content) {
      return c.json({ error: "Tous les champs sont requis" }, 400);
    }

    console.log(`✅ Envoi message de ${senderName} vers ${recipientName}`);

    const result = await messaging.sendMessage(
      senderId,
      senderName,
      senderRole,
      recipientId,
      recipientName,
      recipientRole,
      content,
      false, // urgent
      cc || []
    );

    if (result.success) {
      console.log("✅ Message créé avec succès");
      return c.json({ success: true, message: result.message });
    } else {
      console.error("❌ Erreur création message:", result.error);
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error("❌ Exception création message:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Envoyer un message admin avec CC et pièces jointes
 * POST /make-server-6378cc81/messages/send
 */
app.post("/make-server-6378cc81/messages/send", async (c) => {
  try {
    console.log("📨 Tentative d'envoi de message admin");
    
    // Parser le body avec gestion d'erreur
    let body;
    try {
      body = await c.req.json();
      console.log("📦 Body reçu:", JSON.stringify(body).substring(0, 200));
    } catch (parseError) {
      console.error("❌ Erreur parsing JSON:", parseError.message);
      return c.json({ error: "Format de données invalide. JSON attendu." }, 400);
    }

    const { conversationId, message, cc, attachments } = body;

    if (!conversationId || !message) {
      console.error("❌ Champs manquants:", { conversationId: !!conversationId, message: !!message });
      return c.json({ error: "conversationId et message requis" }, 400);
    }

    console.log("✅ Champs valides - conversationId:", conversationId);

    // Récupérer la conversation
    const conversation = await kv.get(`conversation:${conversationId}`);
    if (!conversation) {
      console.error("❌ Conversation introuvable:", conversationId);
      return c.json({ error: "Conversation introuvable" }, 404);
    }

    console.log("✅ Conversation trouvée");

    // Créer le message avec admin comme expéditeur
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();

    const newMessage = {
      id: messageId,
      conversationId,
      senderId: "admin",
      senderName: "Administrateur M.O.N.A",
      senderRole: "admin",
      recipientId: conversation.participants[0].id,
      recipientName: conversation.participants[0].name,
      recipientRole: conversation.participants[0].role,
      content: message,
      timestamp,
      read: false,
      cc: cc || [],
      attachments: attachments || [],
    };

    // Sauvegarder le message
    await kv.set(`message:${messageId}`, newMessage);
    console.log("✅ Message sauvegardé:", messageId);

    // Ajouter à la liste des messages
    const conversationMessagesKey = `conversation:${conversationId}:messages`;
    const existingMessages = await kv.get(conversationMessagesKey) || [];
    existingMessages.push(messageId);
    await kv.set(conversationMessagesKey, existingMessages);

    // Mettre à jour la conversation
    conversation.lastMessage = message.substring(0, 100);
    conversation.lastMessageTime = timestamp;
    await kv.set(`conversation:${conversationId}`, conversation);

    // Envoyer un email à l'expert (si c'est un expert dans la conversation)
    const expertParticipant = conversation.participants.find((p: any) => p.role === "expert");
    if (expertParticipant && expertParticipant.email) {
      console.log("📧 Préparation envoi email à l'expert:", expertParticipant.email);
      
      // Déterminer l'email admin (contact@ ou support@)
      const fromAdmin = newMessage.senderName.includes("Support") 
        ? "support@monafrica.net" 
        : "contact@monafrica.net";
      
      try {
        // Envoyer l'email
        const emailResult = await sendAdminToExpertEmail(
          fromAdmin,
          expertParticipant.email,
          expertParticipant.name,
          `Nouveau message de l'équipe M.O.N.A`,
          message,
          cc
        );
        
        if (emailResult.success) {
          console.log(`✅ Email envoyé avec succès à ${expertParticipant.email}`);
        } else {
          console.error(`⚠️ Erreur envoi email:`, emailResult.error);
        }
      } catch (emailError) {
        console.error(`❌ Exception lors de l'envoi email:`, emailError);
      }
    } else {
      console.log("ℹ️ Pas d'expert avec email dans cette conversation");
    }

    return c.json({
      success: true,
      message: "Message envoyé avec succès",
      data: newMessage,
    });
  } catch (error) {
    console.error("Erreur envoi message admin:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Archiver une conversation
 * PUT /make-server-6378cc81/messages/conversation/:conversationId/archive
 */
app.put("/make-server-6378cc81/messages/conversation/:conversationId/archive", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    
    const conversation = await kv.get(`conversation:${conversationId}`);
    if (!conversation) {
      return c.json({ error: "Conversation introuvable" }, 404);
    }

    conversation.archived = !conversation.archived;
    await kv.set(`conversation:${conversationId}`, conversation);

    return c.json({
      success: true,
      message: conversation.archived ? "Conversation archivée" : "Conversation désarchivée",
    });
  } catch (error) {
    console.error("Erreur archivage conversation:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Supprimer une conversation
 * DELETE /make-server-6378cc81/messages/conversation/:conversationId
 */
app.delete("/make-server-6378cc81/messages/conversation/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    
    // Supprimer tous les messages
    const conversationMessagesKey = `conversation:${conversationId}:messages`;
    const messageIds = await kv.get(conversationMessagesKey) || [];
    
    for (const msgId of messageIds) {
      await kv.del(`message:${msgId}`);
    }
    
    // Supprimer la liste des messages
    await kv.del(conversationMessagesKey);
    
    // Supprimer la conversation
    await kv.del(`conversation:${conversationId}`);

    return c.json({
      success: true,
      message: "Conversation supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression conversation:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Envoyer un message
 * POST /make-server-6378cc81/messaging/send
 */
app.post("/make-server-6378cc81/messaging/send", async (c) => {
  try {
    const body = await c.req.json();
    const { senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content } = body;

    if (!senderId || !senderName || !senderRole || !recipientId || !recipientName || !recipientRole || !content) {
      return c.json({ error: "Tous les champs sont requis" }, 400);
    }

    const result = await messaging.sendMessage(
      senderId,
      senderName,
      senderRole,
      recipientId,
      recipientName,
      recipientRole,
      content
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Message envoyé avec succès",
      data: result.message,
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les conversations d'un utilisateur
 * GET /make-server-6378cc81/messaging/conversations/:userId
 */
app.get("/make-server-6378cc81/messaging/conversations/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const conversations = await messaging.getUserConversations(userId);

    return c.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des conversations:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les messages d'une conversation
 * GET /make-server-6378cc81/messaging/conversation/:conversationId/messages
 */
app.get("/make-server-6378cc81/messaging/conversation/:conversationId/messages", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messages = await messaging.getConversationMessages(conversationId);

    return c.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Marquer une conversation comme lue
 * POST /make-server-6378cc81/messaging/conversation/:conversationId/read
 */
app.post("/make-server-6378cc81/messaging/conversation/:conversationId/read", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const body = await c.req.json();
    const { userId } = body;

    if (!userId) {
      return c.json({ error: "userId requis" }, 400);
    }

    const result = await messaging.markConversationAsRead(conversationId, userId);

    if (!result.success) {
      return c.json({ error: "Erreur lors de la mise à jour" }, 500);
    }

    return c.json({
      success: true,
      message: "Conversation marquée comme lue",
    });
  } catch (error) {
    console.error("Erreur lors du marquage comme lu:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer le nombre de messages non lus
 * GET /make-server-6378cc81/messaging/unread/:userId
 */
app.get("/make-server-6378cc81/messaging/unread/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const count = await messaging.getUnreadCount(userId);

    return c.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Erreur lors du comptage des messages non lus:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== SYSTÈME DE TICKETS ROUTES ====================

/**
 * Créer un nouveau ticket
 * POST /make-server-6378cc81/tickets/create
 */
app.post("/make-server-6378cc81/tickets/create", async (c) => {
  try {
    const body = await c.req.json();
    const { createdBy, createdByName, createdByRole, category, subject, description, priority } = body;

    if (!createdBy || !createdByName || !createdByRole || !category || !subject || !description) {
      return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    }

    const result = await tickets.createTicket(
      createdBy,
      createdByName,
      createdByRole,
      category,
      subject,
      description,
      priority || 'medium'
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Ticket créé avec succès",
      data: result.ticket,
    });
  } catch (error) {
    console.error("Erreur lors de la création du ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Ajouter un message à un ticket
 * POST /make-server-6378cc81/tickets/:ticketId/message
 */
app.post("/make-server-6378cc81/tickets/:ticketId/message", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const body = await c.req.json();
    const { authorId, authorName, authorRole, content, isStaffReply } = body;

    if (!authorId || !authorName || !authorRole || !content) {
      return c.json({ error: "Tous les champs sont requis" }, 400);
    }

    const result = await tickets.addTicketMessage(
      ticketId,
      authorId,
      authorName,
      authorRole,
      content,
      isStaffReply || false
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Message ajouté au ticket",
      data: result.message,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du message au ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour le statut d'un ticket
 * PUT /make-server-6378cc81/tickets/:ticketId/status
 */
app.put("/make-server-6378cc81/tickets/:ticketId/status", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const body = await c.req.json();
    const { status, assignedTo } = body;

    if (!status) {
      return c.json({ error: "Le statut est requis" }, 400);
    }

    const result = await tickets.updateTicketStatus(ticketId, status, assignedTo);

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Statut du ticket mis à jour",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer tous les tickets
 * GET /make-server-6378cc81/tickets/all
 */
app.get("/make-server-6378cc81/tickets/all", async (c) => {
  try {
    const allTickets = await tickets.getAllTickets();

    return c.json({
      success: true,
      data: allTickets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les tickets d'un utilisateur
 * GET /make-server-6378cc81/tickets/user/:userId
 */
app.get("/make-server-6378cc81/tickets/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userTickets = await tickets.getUserTickets(userId);

    return c.json({
      success: true,
      data: userTickets,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des tickets utilisateur:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer un ticket par ID
 * GET /make-server-6378cc81/tickets/:ticketId
 */
app.get("/make-server-6378cc81/tickets/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const ticket = await tickets.getTicket(ticketId);

    if (!ticket) {
      return c.json({ error: "Ticket non trouvé" }, 404);
    }

    return c.json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les statistiques des tickets
 * GET /make-server-6378cc81/tickets/stats
 */
app.get("/make-server-6378cc81/tickets/stats", async (c) => {
  try {
    const stats = await tickets.getTicketStats();

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== GESTION DES RENDEZ-VOUS ROUTES ====================

/**
 * Cr��er un nouveau rendez-vous
 * POST /make-server-6378cc81/appointments/create
 */
app.post("/make-server-6378cc81/appointments/create", async (c) => {
  try {
    const body = await c.req.json();
    const { expertId, memberId, date, time, duration, location, type, status } = body;

    if (!expertId || !memberId || !date || !time || !duration || !location || !type) {
      return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    }

    const result = await appointments.createAppointment(
      expertId,
      memberId,
      date,
      time,
      duration,
      location,
      type,
      status || 'scheduled'
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Rendez-vous créé avec succès",
      data: result.appointment,
    });
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Ajouter un message à un rendez-vous
 * POST /make-server-6378cc81/appointments/:appointmentId/message
 */
app.post("/make-server-6378cc81/appointments/:appointmentId/message", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");
    const body = await c.req.json();
    const { authorId, authorName, authorRole, content, isStaffReply } = body;

    if (!authorId || !authorName || !authorRole || !content) {
      return c.json({ error: "Tous les champs sont requis" }, 400);
    }

    const result = await appointments.addAppointmentMessage(
      appointmentId,
      authorId,
      authorName,
      authorRole,
      content,
      isStaffReply || false
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Message ajouté au rendez-vous",
      data: result.message,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du message au rendez-vous:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour le statut d'un rendez-vous
 * PUT /make-server-6378cc81/appointments/:appointmentId/status
 */
app.put("/make-server-6378cc81/appointments/:appointmentId/status", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");
    const body = await c.req.json();
    const { status, assignedTo } = body;

    if (!status) {
      return c.json({ error: "Le statut est requis" }, 400);
    }

    const result = await appointments.updateAppointmentStatus(appointmentId, status, assignedTo);

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Statut du rendez-vous mis à jour",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer tous les rendez-vous
 * GET /make-server-6378cc81/appointments/all
 */
app.get("/make-server-6378cc81/appointments/all", async (c) => {
  try {
    const allAppointments = await appointments.getAllAppointments();

    return c.json({
      success: true,
      data: allAppointments,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les rendez-vous d'un utilisateur
 * GET /make-server-6378cc81/appointments/user/:userId
 */
app.get("/make-server-6378cc81/appointments/user/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userAppointments = await appointments.getUserAppointments(userId);

    if (userAppointments.error) {
      return c.json({ error: userAppointments.error }, 500);
    }

    return c.json({
      success: true,
      data: userAppointments.data || [],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous utilisateur:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer un rendez-vous par ID
 * GET /make-server-6378cc81/appointments/:appointmentId
 */
app.get("/make-server-6378cc81/appointments/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");
    const appointment = await appointments.getAppointment(appointmentId);

    if (!appointment) {
      return c.json({ error: "Rendez-vous non trouvé" }, 404);
    }

    return c.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du rendez-vous:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les statistiques des rendez-vous
 * GET /make-server-6378cc81/appointments/stats
 */
app.get("/make-server-6378cc81/appointments/stats", async (c) => {
  try {
    const stats = await appointments.getAppointmentStats();

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== HEALTH PASSPORT ROUTES ====================

/**
 * Récupérer les données du passeport santé d'un utilisateur
 * GET /make-server-6378cc81/health-passport/:userId
 */
app.get("/make-server-6378cc81/health-passport/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");

    // Vérifier que l'utilisateur accède à ses propres données OU qu'un expert accède aux données
    const isOwner = userToken === userId;
    const isExpert = !!expertId;
    
    if (!isOwner && !isExpert) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    // Récupérer les données du passeport
    const vitals = await kv.get(`health_passport:${userId}:vitals`);
    const allergies = await kv.get(`health_passport:${userId}:allergies`);
    const conditions = await kv.get(`health_passport:${userId}:conditions`);
    const vaccinations = await kv.get(`health_passport:${userId}:vaccinations`);
    const documents = await kv.get(`health_passport:${userId}:documents`);

    return c.json({
      success: true,
      vitals: vitals || { bloodType: "", height: "", weight: "", bloodPressure: "", lastCheckup: "" },
      allergies: allergies || [],
      conditions: conditions || [],
      vaccinations: vaccinations || [],
      documents: documents || [],
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du passeport santé:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Sauvegarder les données du passeport santé d'un utilisateur
 * POST /make-server-6378cc81/health-passport/:userId
 * Accessible par le membre lui-même OU par un expert
 */
app.post("/make-server-6378cc81/health-passport/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");

    // Vérifier que l'utilisateur accède à ses propres données OU qu'un expert accède aux données
    const isOwner = userToken === userId;
    const isExpert = !!expertId;
    
    if (!isOwner && !isExpert) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    const body = await c.req.json();
    const { type, data } = body;

    if (!type || !data) {
      return c.json({ error: "Type et données requis" }, 400);
    }

    // Sauvegarder selon le type
    const key = `health_passport:${userId}:${type}`;
    await kv.set(key, data);

    // Log différent selon qui modifie
    if (isExpert) {
      console.log(`✅ Données du passeport santé modifiées par expert ${expertId}: ${type} pour patient ${userId}`);
    } else {
      console.log(`✅ Données du passeport santé sauvegardées: ${type} pour ${userId}`);
    }

    return c.json({
      success: true,
      message: "Données sauvegardées avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du passeport santé:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== DASHBOARD ENTREPRISE ROUTES ====================

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/stats', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const employes = await kv.getByPrefix(`entreprise:${entrepriseId}:employe:`);
    const consultations = await kv.getByPrefix(`entreprise:${entrepriseId}:consultation:`);
    const totalEmployes = employes.length;
    const employesActifs = employes.filter((e: any) => e.statut === 'actif').length;
    const totalConsultations = consultations.length;
    const consultationsMoisEnCours = consultations.filter((c: any) => {
      const date = new Date(c.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const tauxEngagement = totalEmployes > 0 ? Math.round((employesActifs / totalEmployes) * 100) : 0;
    const entreprise = await kv.get(`entreprise:${entrepriseId}`);
    const creditsRestants = entreprise?.credits || 0;
    return c.json({ totalEmployes, employesActifs, tauxEngagement, totalConsultations, consultationsMoisEnCours, creditsRestants, derniereMiseAJour: new Date().toISOString() });
  } catch (error) {
    console.error('Erreur stats entreprise:', error);
    return c.json({ error: 'Erreur récupération stats' }, 500);
  }
});

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const employes = await kv.getByPrefix(`entreprise:${entrepriseId}:employe:`);
    return c.json({ employes: employes || [] });
  } catch (error) {
    console.error('Erreur employes:', error);
    return c.json({ error: 'Erreur récupération employés' }, 500);
  }
});

app.post('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const employeData = await c.req.json();
    const employeId = `emp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nouvelEmploye = { id: employeId, entrepriseId, ...employeData, dateInscription: new Date().toISOString(), statut: 'actif', nombreConsultations: 0, derniereConsultation: null };
    await kv.set(`entreprise:${entrepriseId}:employe:${employeId}`, nouvelEmploye);
    return c.json({ employe: nouvelEmploye }, 201);
  } catch (error) {
    console.error('Erreur ajout employé:', error);
    return c.json({ error: 'Erreur ajout employé' }, 500);
  }
});

app.put('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes/:employeId', async (c) => {
  try {
    const { entrepriseId, employeId } = c.req.param();
    const updates = await c.req.json();
    const employe = await kv.get(`entreprise:${entrepriseId}:employe:${employeId}`);
    if (!employe) return c.json({ error: 'Employé non trouvé' }, 404);
    const employeMisAJour = { ...employe, ...updates };
    await kv.set(`entreprise:${entrepriseId}:employe:${employeId}`, employeMisAJour);
    return c.json({ employe: employeMisAJour });
  } catch (error) {
    console.error('Erreur maj employé:', error);
    return c.json({ error: 'Erreur maj employé' }, 500);
  }
});

app.delete('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes/:employeId', async (c) => {
  try {
    const { entrepriseId, employeId } = c.req.param();
    const employe = await kv.get(`entreprise:${entrepriseId}:employe:${employeId}`);
    if (!employe) return c.json({ error: 'Employé non trouvé' }, 404);
    employe.statut = 'inactif';
    await kv.set(`entreprise:${entrepriseId}:employe:${employeId}`, employe);
    return c.json({ message: 'Employé désactivé' });
  } catch (error) {
    console.error('Erreur désactivation employé:', error);
    return c.json({ error: 'Erreur désactivation' }, 500);
  }
});

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/analytics', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const consultations = await kv.getByPrefix(`entreprise:${entrepriseId}:consultation:`);
    const now = new Date();
    const consultationsParMois = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mois = date.toLocaleDateString('fr-FR', { month: 'short' });
      const total = consultations.filter((c: any) => {
        const consultDate = new Date(c.date);
        return consultDate.getMonth() === date.getMonth() && consultDate.getFullYear() === date.getFullYear();
      }).length;
      consultationsParMois.push({ mois, total });
    }
    const consultationsParService: { [key: string]: number } = {};
    consultations.forEach((c: any) => {
      const service = c.service || 'Autre';
      consultationsParService[service] = (consultationsParService[service] || 0) + 1;
    });
    return c.json({ consultationsParMois, consultationsParService: Object.entries(consultationsParService).map(([service, total]) => ({ service, total })) });
  } catch (error) {
    console.error('Erreur analytics:', error);
    return c.json({ error: 'Erreur analytics' }, 500);
  }
});

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/sante-globale', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const scores = await kv.getByPrefix(`entreprise:${entrepriseId}:score:`);
    const scoreMoyen = scores.length > 0 ? Math.round(scores.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / scores.length) : 0;
    const distribution = {
      excellent: scores.filter((s: any) => s.score >= 80).length,
      bon: scores.filter((s: any) => s.score >= 60 && s.score < 80).length,
      moyen: scores.filter((s: any) => s.score >= 40 && s.score < 60).length,
      faible: scores.filter((s: any) => s.score < 40).length
    };
    const now = new Date();
    const tendance = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mois = date.toLocaleDateString('fr-FR', { month: 'short' });
      const scoresduMois = scores.filter((s: any) => {
        const scoreDate = new Date(s.date);
        return scoreDate.getMonth() === date.getMonth() && scoreDate.getFullYear() === date.getFullYear();
      });
      const moyenne = scoresduMois.length > 0 ? Math.round(scoresduMois.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / scoresduMois.length) : 0;
      tendance.push({ mois, score: moyenne });
    }
    return c.json({ scoreMoyen, distribution, tendance, totalEvaluations: scores.length });
  } catch (error) {
    console.error('Erreur santé globale:', error);
    return c.json({ error: 'Erreur santé globale' }, 500);
  }
});

// ==================== ADMIN ROUTES ====================

app.get('/make-server-6378cc81/admin/stats', async (c) => {
  try {
    const membres = await kv.getByPrefix('membre:');
    const experts = await kv.getByPrefix('expert:');
    const entreprises = await kv.getByPrefix('entreprise:');
    const consultations = await kv.getByPrefix('consultation:');
    const membresActifs = membres.filter((m: any) => m.statut === 'actif').length;
    const expertsActifs = experts.filter((e: any) => e.statut === 'actif').length;
    const entreprisesActives = entreprises.filter((e: any) => e.statut === 'active' && !e.id?.includes(':')).length;
    const now = new Date();
    const consultationsMoisEnCours = consultations.filter((c: any) => {
      const date = new Date(c.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const revenuMensuel = consultations.filter((c: any) => {
      const date = new Date(c.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum: number, c: any) => sum + (c.montant || 0), 0);
    return c.json({ totalMembres: membres.length, membresActifs, totalExperts: experts.length, expertsActifs, totalEntreprises: entreprisesActives, entreprisesActives, totalConsultations: consultations.length, consultationsMoisEnCours, revenuMensuel, derniereMiseAJour: new Date().toISOString() });
  } catch (error) {
    console.error('Erreur stats admin:', error);
    return c.json({ error: 'Erreur stats admin' }, 500);
  }
});

/**
 * Récupère les analytics complètes de la plateforme admin
 * GET /make-server-6378cc81/admin/analytics
 */
app.get('/make-server-6378cc81/admin/analytics', async (c) => {
  try {
    console.log('📊 Récupération analytics admin...');
    const analytics = await getAdminAnalytics();
    return c.json(analytics);
  } catch (error) {
    console.error('❌ Erreur analytics admin:', error);
    return c.json({ 
      success: false, 
      error: `Erreur récupération analytics: ${error.message}` 
    }, 500);
  }
});

// ==================== ADMIN USERS ROUTES (SQL) ====================

/**
 * Liste tous les utilisateurs avec filtres
 * GET /make-server-6378cc81/admin/users-sql
 */
app.get('/make-server-6378cc81/admin/users-sql', async (c) => {
  try {
    const search = c.req.query('search');
    const status = c.req.query('status');
    const membershipType = c.req.query('membershipType');
    const country = c.req.query('country');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await adminUsersSQL.getUsers({
      search,
      status,
      membershipType,
      country,
      limit,
      offset
    });

    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur liste utilisateurs SQL:', error);
    return c.json({ 
      success: false, 
      error: `Erreur récupération utilisateurs: ${error.message}` 
    }, 500);
  }
});

/**
 * Récupère les stats utilisateurs
 * GET /make-server-6378cc81/admin/users-sql/stats
 */
app.get('/make-server-6378cc81/admin/users-sql/stats', async (c) => {
  try {
    const result = await adminUsersSQL.getUserStats();
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur stats utilisateurs:', error);
    return c.json({ 
      success: false, 
      error: `Erreur récupération stats: ${error.message}` 
    }, 500);
  }
});

/**
 * Récupère un utilisateur par ID
 * GET /make-server-6378cc81/admin/users-sql/:userId
 */
app.get('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const result = await adminUsersSQL.getUserById(userId);
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur récupération utilisateur:', error);
    return c.json({ 
      success: false, 
      error: `Erreur récupération utilisateur: ${error.message}` 
    }, 500);
  }
});

/**
 * Met à jour un utilisateur
 * PUT /make-server-6378cc81/admin/users-sql/:userId
 */
app.put('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    const adminId = c.req.header('X-Admin-Id') || 'unknown';

    const result = await adminUsersSQL.updateUser(userId, updates, adminId);
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur mise à jour utilisateur:', error);
    return c.json({ 
      success: false, 
      error: `Erreur mise à jour: ${error.message}` 
    }, 500);
  }
});

/**
 * Suspend un utilisateur
 * POST /make-server-6378cc81/admin/users-sql/:userId/suspend
 */
app.post('/make-server-6378cc81/admin/users-sql/:userId/suspend', async (c) => {
  try {
    const userId = c.req.param('userId');
    const { reason } = await c.req.json();
    const adminId = c.req.header('X-Admin-Id') || 'unknown';

    const result = await adminUsersSQL.suspendUser(userId, adminId, reason);
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur suspension utilisateur:', error);
    return c.json({ 
      success: false, 
      error: `Erreur suspension: ${error.message}` 
    }, 500);
  }
});

/**
 * Réactive un utilisateur
 * POST /make-server-6378cc81/admin/users-sql/:userId/reactivate
 */
app.post('/make-server-6378cc81/admin/users-sql/:userId/reactivate', async (c) => {
  try {
    const userId = c.req.param('userId');
    const adminId = c.req.header('X-Admin-Id') || 'unknown';

    const result = await adminUsersSQL.reactivateUser(userId, adminId);
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur réactivation utilisateur:', error);
    return c.json({ 
      success: false, 
      error: `Erreur réactivation: ${error.message}` 
    }, 500);
  }
});

/**
 * Supprime un utilisateur (soft delete)
 * DELETE /make-server-6378cc81/admin/users-sql/:userId
 */
app.delete('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const adminId = c.req.header('X-Admin-Id') || 'unknown';

    const result = await adminUsersSQL.deleteUser(userId, adminId);
    return c.json(result);
  } catch (error) {
    console.error('❌ Erreur suppression utilisateur:', error);
    return c.json({ 
      success: false, 
      error: `Erreur suppression: ${error.message}` 
    }, 500);
  }
});

app.get('/make-server-6378cc81/admin/entreprises', async (c) => {
  try {
    const entreprises = await kv.getByPrefix('entreprise:');
    const entreprisesPrincipales = entreprises.filter((e: any) => e.id && !e.id.includes(':employe:') && !e.id.includes(':consultation:') && !e.id.includes(':score:'));
    return c.json({ entreprises: entreprisesPrincipales || [] });
  } catch (error) {
    console.error('Erreur liste entreprises:', error);
    return c.json({ error: 'Erreur liste entreprises' }, 500);
  }
});

app.post('/make-server-6378cc81/admin/entreprises', async (c) => {
  try {
    const entrepriseData = await c.req.json();
    const entrepriseId = `ent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const nouvelleEntreprise = { id: entrepriseId, ...entrepriseData, dateInscription: new Date().toISOString(), statut: 'active', credits: entrepriseData.credits || 100, nombreEmployes: 0 };
    await kv.set(`entreprise:${entrepriseId}`, nouvelleEntreprise);
    return c.json({ entreprise: nouvelleEntreprise }, 201);
  } catch (error) {
    console.error('Erreur création entreprise:', error);
    return c.json({ error: 'Erreur création entreprise' }, 500);
  }
});

app.get('/make-server-6378cc81/admin/entreprises/:entrepriseId', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const entreprise = await kv.get(`entreprise:${entrepriseId}`);
    if (!entreprise) return c.json({ error: 'Entreprise non trouvée' }, 404);
    const employes = await kv.getByPrefix(`entreprise:${entrepriseId}:employe:`);
    entreprise.employes = employes;
    entreprise.nombreEmployes = employes.length;
    return c.json({ entreprise });
  } catch (error) {
    console.error('Erreur détails entreprise:', error);
    return c.json({ error: 'Erreur détails entreprise' }, 500);
  }
});

app.put('/make-server-6378cc81/admin/entreprises/:entrepriseId', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const updates = await c.req.json();
    const entreprise = await kv.get(`entreprise:${entrepriseId}`);
    if (!entreprise) return c.json({ error: 'Entreprise non trouvée' }, 404);
    const entrepriseMiseAJour = { ...entreprise, ...updates };
    await kv.set(`entreprise:${entrepriseId}`, entrepriseMiseAJour);
    return c.json({ entreprise: entrepriseMiseAJour });
  } catch (error) {
    console.error('Erreur maj entreprise:', error);
    return c.json({ error: 'Erreur maj entreprise' }, 500);
  }
});

app.delete('/make-server-6378cc81/admin/entreprises/:entrepriseId', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    await kv.del(`entreprise:${entrepriseId}`);
    const employes = await kv.getByPrefix(`entreprise:${entrepriseId}:employe:`);
    for (const employe of employes) {
      await kv.del(`entreprise:${entrepriseId}:employe:${employe.id}`);
    }
    return c.json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    console.error('Erreur suppression entreprise:', error);
    return c.json({ error: 'Erreur suppression entreprise' }, 500);
  }
});

// ==================== EMAIL ROUTES ====================

app.post('/make-server-6378cc81/contact/send', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, subject, message, category } = body;
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
    }
    const result = await sendContactEmail(name, email, phone || '', subject, message, category || 'général');
    if (result.success) {
      return c.json({ success: true, message: 'Message envoyé avec succès' });
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error('Erreur envoi email contact:', error);
    return c.json({ error: 'Erreur lors de l\'envoi du message' }, 500);
  }
});

app.post('/make-server-6378cc81/support/send', async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, subject, message, priority, userType } = body;
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
    }
    const result = await sendSupportEmail(name, email, phone || '', subject, message, priority || 'normale', userType || 'membre');
    if (result.success) {
      return c.json({ success: true, message: 'Demande de support enregistrée avec succès' });
    } else {
      return c.json({ error: result.error }, 500);
    }
  } catch (error) {
    console.error('Erreur envoi email support:', error);
    return c.json({ error: 'Erreur lors de l\'envoi de la demande de support' }, 500);
  }
});

/**
 * ADMIN UNIQUEMENT - Nettoyer toutes les données de démo
 * DELETE /make-server-6378cc81/admin/cleanup-demo-data
 */
app.delete("/make-server-6378cc81/admin/cleanup-demo-data", async (c) => {
  try {
    console.log("🧹 Début du nettoyage des données de démo...");
    
    let deletedCount = 0;
    
    // 1. Supprimer toutes les conversations
    const allConversations = await kv.getByPrefix("conversation:") || [];
    for (const conv of allConversations) {
      if (conv && conv.id && !conv.id.includes(":messages")) {
        // Supprimer les messages de cette conversation
        const messagesKey = `conversation:${conv.id}:messages`;
        const messageIds = await kv.get(messagesKey) || [];
        for (const msgId of messageIds) {
          await kv.del(`message:${msgId}`);
          deletedCount++;
        }
        await kv.del(messagesKey);
        
        // Supprimer la conversation
        await kv.del(`conversation:${conv.id}`);
        deletedCount++;
        console.log(`✅ Conversation supprimée: ${conv.id}`);
      }
    }
    
    // 2. Supprimer tous les messages orphelins
    const allMessages = await kv.getByPrefix("message:") || [];
    for (const msg of allMessages) {
      if (msg && msg.id) {
        await kv.del(`message:${msg.id}`);
        deletedCount++;
      }
    }
    
    console.log(`✅ Nettoyage terminé : ${deletedCount} entrées supprimées`);
    
    return c.json({
      success: true,
      message: `Données de démo nettoyées avec succès (${deletedCount} entrées supprimées)`,
      deletedCount,
    });
  } catch (error) {
    console.error("❌ Erreur nettoyage données de démo:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== GESTION UTILISATEURS MESSAGERIE ====================

/**
 * Récupérer tous les utilisateurs de la messagerie
 * GET /make-server-6378cc81/messaging/users
 */
app.get("/make-server-6378cc81/messaging/users", async (c) => {
  try {
    const allUsers = await kv.getByPrefix("messaging_user:") || [];
    const users = allUsers.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active !== false,
      createdAt: user.createdAt,
    }));

    return c.json({ success: true, users });
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Créer un utilisateur de messagerie
 * POST /make-server-6378cc81/messaging/users
 */
app.post("/make-server-6378cc81/messaging/users", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role } = body;

    if (!name || !email || !role) {
      return c.json({ error: "Tous les champs sont requis" }, 400);
    }

    // Vérifier que l'email se termine par @monafrica.net
    if (!email.endsWith("@monafrica.net")) {
      return c.json({ error: "L'email doit se terminer par @monafrica.net" }, 400);
    }

    // Vérifier que l'utilisateur n'existe pas déjà
    const existingUsers = await kv.getByPrefix("messaging_user:") || [];
    const emailExists = existingUsers.some((u: any) => u.email === email);
    
    if (emailExists) {
      return c.json({ error: "Un utilisateur avec cet email existe déjà" }, 400);
    }

    // Créer l'utilisateur
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      name,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`messaging_user:${userId}`, user);

    console.log(`✅ Utilisateur créé: ${email} (${name})`);

    return c.json({ success: true, user });
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Modifier le statut d'un utilisateur
 * PATCH /make-server-6378cc81/messaging/users/:userId
 */
app.patch("/make-server-6378cc81/messaging/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const body = await c.req.json();
    const { active } = body;

    const user = await kv.get(`messaging_user:${userId}`);
    
    if (!user) {
      return c.json({ error: "Utilisateur non trouvé" }, 404);
    }

    user.active = active;
    await kv.set(`messaging_user:${userId}`, user);

    return c.json({ success: true, user });
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Supprimer un utilisateur
 * DELETE /make-server-6378cc81/messaging/users/:userId
 */
app.delete("/make-server-6378cc81/messaging/users/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    await kv.del(`messaging_user:${userId}`);

    console.log(`✅ Utilisateur supprimé: ${userId}`);

    return c.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Alias : Récupérer tous les utilisateurs actifs pour autocomplétion
 * GET /make-server-6378cc81/users/messaging
 */
app.get("/make-server-6378cc81/users/messaging", async (c) => {
  try {
    const allUsers = await kv.getByPrefix("messaging_user:") || [];
    const activeUsers = allUsers
      .filter((user: any) => user.active !== false)
      .map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        active: true,
      }));

    return c.json({ success: true, data: activeUsers });
  } catch (error) {
    console.error("Erreur récupération utilisateurs actifs:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Route de débogage pour vérifier et réparer un profil expert
 * GET /make-server-6378cc81/expert/debug-profile?email=xxx@monafrica.net
 */
app.get("/make-server-6378cc81/expert/debug-profile", async (c) => {
  try {
    const email = c.req.query("email");
    
    if (!email) {
      return c.json({ error: "Email requis dans les paramètres ?email=" }, 400);
    }

    console.log("🔍 DEBUG: Recherche du profil pour", email);

    // Créer un client avec les droits admin
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Lister tous les utilisateurs pour trouver celui avec cet email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      return c.json({ error: "Erreur lors de la liste des utilisateurs", details: listError }, 500);
    }

    const user = users.users.find(u => u.email === email);

    if (!user) {
      return c.json({ 
        error: "Utilisateur non trouvé dans Supabase Auth",
        email,
        suggestion: "Créez d'abord le compte via /expert/signup"
      }, 404);
    }

    console.log("✅ Utilisateur trouvé:", user.id);
    console.log("📋 Métadonnées:", user.user_metadata);

    // Vérifier si le profil existe dans KV
    const profileKey = `expert:${user.id}`;
    const existingProfile = await kv.get(profileKey);

    console.log("🔍 Recherche profil KV avec clé:", profileKey);
    console.log("📦 Profil existant:", existingProfile);

    if (existingProfile) {
      return c.json({
        success: true,
        message: "Profil trouvé",
        userId: user.id,
        email: user.email,
        kvKey: profileKey,
        profile: existingProfile,
        userMetadata: user.user_metadata
      });
    }

    // Le profil n'existe pas, le créer
    console.log("⚠️ Profil KV manquant, création automatique...");

    const newProfile = {
      id: user.id,
      email: user.email,
      firstName: user.user_metadata?.firstName || "",
      lastName: user.user_metadata?.lastName || "",
      specialty: user.user_metadata?.specialty || "",
      licenseNumber: user.user_metadata?.licenseNumber || "",
      phone: user.user_metadata?.phone || "",
      status: "active",
      createdAt: new Date().toISOString(),
      totalConsultations: 0,
      rating: 0,
      languages: ["Français"],
      availability: {},
    };

    await kv.set(profileKey, newProfile);
    console.log("✅ Profil KV créé avec succès");

    return c.json({
      success: true,
      message: "Profil réparé - créé dans KV",
      userId: user.id,
      email: user.email,
      kvKey: profileKey,
      profile: newProfile,
      userMetadata: user.user_metadata
    });

  } catch (error) {
    console.error("❌ Erreur debug-profile:", error);
    return c.json({ 
      error: "Erreur serveur", 
      details: error.message 
    }, 500);
  }
});

// ==================== SUPPORT/TICKETS ROUTES ====================

/**
 * Créer un nouveau ticket de support
 * POST /make-server-6378cc81/support/tickets
 */
app.post("/make-server-6378cc81/support/tickets", async (c) => {
  try {
    const body = await c.req.json();
    const { createdBy, createdByName, createdByRole, category, subject, description, priority } = body;

    if (!createdBy || !createdByName || !createdByRole || !category || !subject || !description) {
      return c.json({ error: "Données manquantes" }, 400);
    }

    const result = await tickets.createTicket(
      createdBy,
      createdByName,
      createdByRole,
      category,
      subject,
      description,
      priority || "medium"
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Ticket créé avec succès",
      ticket: result.ticket,
    });
  } catch (error) {
    console.error("❌ Erreur création ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer tous les tickets (Admin)
 * GET /make-server-6378cc81/admin/support/tickets
 */
app.get("/make-server-6378cc81/admin/support/tickets", async (c) => {
  try {
    const allTickets = await tickets.getAllTickets();
    const stats = await tickets.getTicketStats();

    return c.json({
      success: true,
      tickets: allTickets,
      stats,
    });
  } catch (error) {
    console.error("❌ Erreur récupération tickets:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer un ticket spécifique
 * GET /make-server-6378cc81/support/tickets/:ticketId
 */
app.get("/make-server-6378cc81/support/tickets/:ticketId", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const ticket = await tickets.getTicket(ticketId);

    if (!ticket) {
      return c.json({ error: "Ticket introuvable" }, 404);
    }

    return c.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("❌ Erreur récupération ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Ajouter un message à un ticket
 * POST /make-server-6378cc81/support/tickets/:ticketId/messages
 */
app.post("/make-server-6378cc81/support/tickets/:ticketId/messages", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const body = await c.req.json();
    const { authorId, authorName, authorRole, content, isStaffReply } = body;

    if (!authorId || !authorName || !authorRole || !content) {
      return c.json({ error: "Données manquantes" }, 400);
    }

    const result = await tickets.addTicketMessage(
      ticketId,
      authorId,
      authorName,
      authorRole,
      content,
      isStaffReply || false
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Message ajouté avec succès",
      ticketMessage: result.message,
    });
  } catch (error) {
    console.error("❌ Erreur ajout message ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour le statut d'un ticket (Admin)
 * PUT /make-server-6378cc81/admin/support/tickets/:ticketId/status
 */
app.put("/make-server-6378cc81/admin/support/tickets/:ticketId/status", async (c) => {
  try {
    const ticketId = c.req.param("ticketId");
    const body = await c.req.json();
    const { status, assignedTo } = body;

    if (!status) {
      return c.json({ error: "Statut manquant" }, 400);
    }

    const result = await tickets.updateTicketStatus(ticketId, status, assignedTo);

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Statut mis à jour avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour statut ticket:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les statistiques de support (Admin)
 * GET /make-server-6378cc81/admin/support/stats
 */
app.get("/make-server-6378cc81/admin/support/stats", async (c) => {
  try {
    const stats = await tickets.getTicketStats();
    return c.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("❌ Erreur récupération stats support:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Route de chatbot AI
 * POST /make-server-6378cc81/api/chat
 */
app.post("/make-server-6378cc81/api/chat", handleChat);

/**
 * Route d'envoi de formulaire de contact
 * POST /make-server-6378cc81/contact/send
 */
app.post("/make-server-6378cc81/contact/send", handleContactSend);

// ==================== NOTIFICATION EMAIL ROUTES ====================

/**
 * Envoyer une notification email pour une consultation
 * POST /make-server-6378cc81/notifications/consultation
 */
app.post("/make-server-6378cc81/notifications/consultation", async (c) => {
  try {
    const body = await c.req.json();
    const { recipientEmail, recipientName, notificationType, consultationDetails } = body;

    if (!recipientEmail || !recipientName || !notificationType || !consultationDetails) {
      return c.json({ error: "Données manquantes pour l'envoi de notification" }, 400);
    }

    const result = await sendConsultationNotificationEmail(
      recipientEmail,
      recipientName,
      notificationType,
      consultationDetails
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Notification envoyée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur envoi notification consultation:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Envoyer une notification email pour un message
 * POST /make-server-6378cc81/notifications/message
 */
app.post("/make-server-6378cc81/notifications/message", async (c) => {
  try {
    const body = await c.req.json();
    const { recipientEmail, recipientName, senderName, messagePreview } = body;

    if (!recipientEmail || !recipientName || !senderName || !messagePreview) {
      return c.json({ error: "Données manquantes pour l'envoi de notification" }, 400);
    }

    const result = await sendMessageNotificationEmail(
      recipientEmail,
      recipientName,
      senderName,
      messagePreview
    );

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: "Notification envoyée avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur envoi notification message:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// Enregistrer les routes wallet (balance, transactions, recharge, recommandations)
registerWalletRoutes(app);

// Enregistrer les routes subscription (paiement, abonnement, annulation)
registerSubscriptionRoutes(app);

// Enregistrer les routes de consultation vidéo
app.route("/make-server-6378cc81/consultations", consultationRoutes);

// Enregistrer les routes RH (Ressources Humaines)
app.route("/make-server-6378cc81/rh", rhRoutes);

// Enregistrer les routes Entreprises (B2B)
app.route("/make-server-6378cc81/entreprises", entrepriseRoutes);

// Enregistrer les routes Company Portal (B2B authentifié)
app.route("/make-server-6378cc81/company", companyRoutes);

// Enregistrer les routes Expert (documents, disponibilités, patients, notes)
app.route("/make-server-6378cc81/expert/documents", expertDocuments);
app.route("/make-server-6378cc81/expert/availability", expertAvailability);
app.route("/make-server-6378cc81/expert/patients", expertPatients);

// Enregistrer les routes Chat (conversations, messages)
app.route("/make-server-6378cc81/chat", chatRoutes);

// Enregistrer les routes de paiement réelles
app.route("/make-server-6378cc81/payment/stripe", paymentStripe);
app.route("/make-server-6378cc81/payment/wave", paymentWave);
app.route("/make-server-6378cc81/payment/orange", paymentOrange);
app.route("/make-server-6378cc81/invoices", invoiceGenerator);

// Enregistrer les webhooks Cal.com
app.route("/make-server-6378cc81/webhooks", calWebhook);

// ==================== QUIZ DE MATCHING ROUTES ====================

/**
 * Sauvegarder les réponses du quiz de matching
 * POST /make-server-6378cc81/matching-quiz/:userId
 */
app.post("/make-server-6378cc81/matching-quiz/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");

    // Vérifier que l'utilisateur est authentifié
    if (!userToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }
    
    console.log("🔍 Quiz matching POST - Token reçu:", userToken ? `${userToken.substring(0, 20)}...` : "AUCUN");
    console.log("🔍 Quiz matching POST - Token est JWT?", userToken && userToken.split('.').length === 3);

    // Valider le token et obtenir l'userId
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) {
      console.error("❌ Quiz matching POST - Erreur validation token:", sessionResult.error);
      return c.json({ error: "Token invalide" }, 401);
    }

    const authenticatedUserId = sessionResult.data.user.id;

    // Vérifier que l'utilisateur modifie son propre quiz
    if (authenticatedUserId !== userId) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    const body = await c.req.json();
    const { answers } = body;

    if (!answers || !Array.isArray(answers)) {
      return c.json({ error: "Les réponses du quiz sont requises" }, 400);
    }

    // Sauvegarder les réponses dans le KV store
    const quizKey = `matching_quiz:${userId}`;
    await kv.set(quizKey, {
      userId,
      answers,
      completedAt: new Date().toISOString(),
    });

    console.log(`✅ Quiz de matching sauvegardé pour l'utilisateur ${userId}`);

    return c.json({
      success: true,
      message: "Quiz sauvegardé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur sauvegarde quiz de matching:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les réponses du quiz de matching
 * GET /make-server-6378cc81/matching-quiz/:userId
 */
app.get("/make-server-6378cc81/matching-quiz/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");

    // Vérifier que l'utilisateur est authentifié
    if (!userToken) {
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    // Valider le token et obtenir l'userId
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const authenticatedUserId = sessionResult.data.user.id;

    // Vérifier que l'utilisateur accède à son propre quiz
    if (authenticatedUserId !== userId) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    const quizKey = `matching_quiz:${userId}`;
    const quizData = await kv.get(quizKey);

    if (!quizData) {
      return c.json({
        success: true,
        data: null,
        hasCompleted: false,
      });
    }

    return c.json({
      success: true,
      data: quizData,
      hasCompleted: true,
    });
  } catch (error) {
    console.error("❌ Erreur récupération quiz de matching:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== MONA SCORE ROUTES ====================

/**
 * Récupérer le MONA Score d'un utilisateur
 * GET /make-server-6378cc81/mona-score/:userId
 */
app.get("/make-server-6378cc81/mona-score/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");

    console.log("🔵 GET /mona-score - userId demandé:", userId);
    console.log("🔵 GET /mona-score - Token présent:", !!userToken);

    // Vérifier que l'utilisateur est authentifié
    if (!userToken) {
      console.error("❌ Token manquant");
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    // Valider le token et obtenir l'userId
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) {
      console.error("❌ Erreur validation token:", sessionResult.error);
      return c.json({ error: "Token invalide ou expiré. Veuillez vous reconnecter." }, 401);
    }

    const authenticatedUserId = sessionResult.data.user.id;
    console.log("🔵 GET /mona-score - userId authentifié:", authenticatedUserId);
    console.log("🔵 GET /mona-score - Comparaison:", { demandé: userId, authentifié: authenticatedUserId, correspond: authenticatedUserId === userId });

    // Vérifier que l'utilisateur accède à son propre score
    if (authenticatedUserId !== userId) {
      console.error("❌ Mismatch userId - demandé:", userId, "authentifié:", authenticatedUserId);
      return c.json({ 
        error: "Non autorisé. Vous ne pouvez accéder qu'à votre propre score.",
        details: {
          requestedUserId: userId,
          authenticatedUserId: authenticatedUserId
        }
      }, 403);
    }

    const scoreKey = `mona_score:${userId}`;
    const scoreData = await kv.get(scoreKey);
    console.log("🔵 GET /mona-score - Score trouvé:", !!scoreData);

    // Si aucun score n'existe, créer un score initial
    if (!scoreData) {
      console.log("🟡 Création d'un score initial pour userId:", userId);
      const initialScore = {
        userId,
        currentScore: null,
        previousScore: null,
        trend: "stable",
        lastUpdate: new Date().toISOString(),
        weeklyAssessments: 0,
        expertFeedback: 0,
        history: [],
        isInitial: true,
        hasNeverBeenAssessed: true,
      };

      await kv.set(scoreKey, initialScore);

      return c.json({
        success: true,
        data: initialScore,
      });
    }

    console.log("✅ Score récupéré avec succès");
    return c.json({
      success: true,
      data: scoreData,
    });
  } catch (error) {
    console.error("❌ Erreur récupération MONA Score:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour le MONA Score d'un utilisateur
 * POST /make-server-6378cc81/mona-score/:userId
 * Peut être appelé par le membre (auto-évaluation) ou par un expert (retour clinique)
 */
app.post("/make-server-6378cc81/mona-score/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");

    // Vérifier que l'utilisateur ou un expert est authentifié
    if (!userToken && !expertId) {
      return c.json({ error: "Non autorisé" }, 401);
    }

    let authenticatedUserId = userId;

    // Si un token membre est fourni, le valider
    if (userToken) {
      const sessionResult = await memberAuth.getMemberSession(userToken);
      if (sessionResult.error) {
        return c.json({ error: "Token invalide" }, 401);
      }
      authenticatedUserId = sessionResult.data.user.id;

      // Vérifier que l'utilisateur modifie son propre score
      if (authenticatedUserId !== userId) {
        return c.json({ error: "Non autorisé" }, 403);
      }
    }

    const body = await c.req.json();
    const { assessmentType, scoreValue, notes } = body;

    if (!assessmentType || typeof scoreValue !== "number") {
      return c.json(
        { error: "Type d'évaluation et score requis" },
        400
      );
    }

    if (scoreValue < 0 || scoreValue > 100) {
      return c.json(
        { error: "Le score doit être entre 0 et 100" },
        400
      );
    }

    const scoreKey = `mona_score:${userId}`;
    const existingScore = await kv.get(scoreKey);

    // Récupérer ou initialiser le score
    const currentData = existingScore || {
      userId,
      currentScore: null,
      previousScore: null,
      trend: "stable",
      lastUpdate: new Date().toISOString(),
      weeklyAssessments: 0,
      expertFeedback: 0,
      history: [],
      isInitial: true,
      hasNeverBeenAssessed: true,
    };

    // Calculer le nouveau score
    let previousScore = currentData.currentScore;
    let newScore;
    
    // Si c'est le premier score (onboarding) ou score initial, utiliser directement la valeur
    if (assessmentType === "onboarding" || currentData.hasNeverBeenAssessed || currentData.currentScore === null) {
      newScore = scoreValue;
      previousScore = scoreValue; // Pour le premier score, previous = current
      console.log(`📊 Premier MONA Score pour ${userId}: ${newScore}`);
    } else {
      // Sinon, faire une moyenne pondérée
      newScore = Math.round((currentData.currentScore + scoreValue) / 2);
      console.log(`📊 Mise à jour MONA Score pour ${userId}: ${previousScore} → ${newScore}`);
    }

    // Déterminer la tendance
    let trend = "stable";
    if (currentData.currentScore !== null && currentData.currentScore !== undefined) {
      if (newScore > currentData.currentScore + 5) trend = "up";
      else if (newScore < currentData.currentScore - 5) trend = "down";
    }

    // Incrémenter les compteurs
    const weeklyAssessments = assessmentType === "self" 
      ? currentData.weeklyAssessments + 1 
      : currentData.weeklyAssessments;
    
    const expertFeedback = assessmentType === "expert" 
      ? currentData.expertFeedback + 1 
      : currentData.expertFeedback;

    // Ajouter à l'historique
    const historyEntry = {
      date: new Date().toISOString(),
      score: scoreValue,
      type: assessmentType,
      notes: notes || "",
      addedBy: expertId || userId,
    };

    const updatedScore = {
      ...currentData,
      currentScore: newScore,
      previousScore: previousScore,
      trend,
      lastUpdate: new Date().toISOString(),
      lastAssessmentDate: new Date().toISOString(),
      weeklyAssessments,
      expertFeedback,
      history: [...(currentData.history || []), historyEntry],
      // Marquer comme non initial une fois le premier score sauvegardé
      isInitial: false,
      hasNeverBeenAssessed: false,
    };

    await kv.set(scoreKey, updatedScore);

    console.log(`✅ MONA Score mis à jour pour l'utilisateur ${userId}: ${previousScore} → ${newScore} (${trend})`);

    // Vérifier si une alerte doit être envoyée (score < 50)
    if (newScore < 50 && previousScore >= 50) {
      console.log(`⚠️ ALERTE: Score de l'utilisateur ${userId} est tombé en dessous de 50`);
      // TODO: Envoyer une notification à la coordination
    }

    // Vérifier si une baisse brutale (> 15 points)
    if (previousScore - newScore > 15) {
      console.log(`⚠️ ALERTE: Chute brutale du score pour l'utilisateur ${userId}: ${previousScore} → ${newScore}`);
      // TODO: Envoyer une notification à la coordination
    }

    return c.json({
      success: true,
      data: updatedScore,
    });
  } catch (error) {
    console.error("❌ Erreur mise à jour MONA Score:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer l'historique complet du MONA Score
 * GET /make-server-6378cc81/mona-score/:userId/history
 */
app.get("/make-server-6378cc81/mona-score/:userId/history", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");

    // Vérifier que l'utilisateur ou un expert est authentifié
    if (!userToken && !expertId) {
      return c.json({ error: "Non autorisé" }, 401);
    }

    // Si un token membre est fourni, le valider
    if (userToken) {
      const sessionResult = await memberAuth.getMemberSession(userToken);
      if (sessionResult.error) {
        return c.json({ error: "Token invalide" }, 401);
      }

      const authenticatedUserId = sessionResult.data.user.id;

      // Vérifier que l'utilisateur accède à son propre historique
      if (authenticatedUserId !== userId) {
        return c.json({ error: "Non autorisé" }, 403);
      }
    }

    const scoreKey = `mona_score:${userId}`;
    const scoreData = await kv.get(scoreKey);

    if (!scoreData) {
      return c.json({
        success: true,
        data: {
          history: [],
          totalAssessments: 0,
        },
      });
    }

    return c.json({
      success: true,
      data: {
        history: scoreData.history || [],
        totalAssessments: (scoreData.history || []).length,
        currentScore: scoreData.currentScore,
        trend: scoreData.trend,
      },
    });
  } catch (error) {
    console.error("❌ Erreur récupération historique MONA Score:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Vérifier si l'utilisateur peut refaire le test MONA Score
 * GET /make-server-6378cc81/mona-score/:userId/can-retake
 */
app.get("/make-server-6378cc81/mona-score/:userId/can-retake", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");

    if (!userToken) {
      return c.json({ error: "Non autorisé" }, 401);
    }

    // Valider le token
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const authenticatedUserId = sessionResult.data.user.id;

    if (authenticatedUserId !== userId) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    // Récupérer le score actuel
    const scoreKey = `mona_score:${userId}`;
    const scoreData = await kv.get(scoreKey);

    // Si jamais évalué, peut faire le test
    if (!scoreData || scoreData.hasNeverBeenAssessed || scoreData.currentScore === null) {
      return c.json({
        success: true,
        canRetake: true,
        reason: "first_assessment",
        message: "Vous pouvez faire votre première évaluation",
      });
    }

    // Récupérer les infos d'abonnement depuis le profil membre
    const memberKey = `member:${userId}`;
    const memberData = await kv.get(memberKey);
    
    // Déterminer le type d'abonnement (par défaut: gratuit)
    const subscriptionType = memberData?.subscriptionType || "free";
    
    // Calculer le délai selon le type d'abonnement
    const lastAssessmentDate = new Date(scoreData.lastAssessmentDate || scoreData.lastUpdate);
    const now = new Date();
    const hoursSinceLastTest = (now.getTime() - lastAssessmentDate.getTime()) / (1000 * 60 * 60);
    
    let canRetake = false;
    let nextAvailableDate = null;
    let reason = "";
    let message = "";
    
    if (subscriptionType === "free") {
      // Gratuit : 1 fois par mois (30 jours = 720 heures)
      canRetake = hoursSinceLastTest >= 720;
      if (!canRetake) {
        const hoursRemaining = Math.ceil(720 - hoursSinceLastTest);
        const daysRemaining = Math.ceil(hoursRemaining / 24);
        nextAvailableDate = new Date(lastAssessmentDate.getTime() + 720 * 60 * 60 * 1000).toISOString();
        reason = "monthly_limit_reached";
        message = `Vous pourrez refaire le test dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`;
      } else {
        reason = "monthly_limit_ok";
        message = "Vous pouvez refaire le test";
      }
    } else {
      // Abonnement : 1 fois par 24h
      canRetake = hoursSinceLastTest >= 24;
      if (!canRetake) {
        const hoursRemaining = Math.ceil(24 - hoursSinceLastTest);
        nextAvailableDate = new Date(lastAssessmentDate.getTime() + 24 * 60 * 60 * 1000).toISOString();
        reason = "daily_limit_reached";
        message = `Vous pourrez refaire le test dans ${hoursRemaining} heure${hoursRemaining > 1 ? 's' : ''}`;
      } else {
        reason = "daily_limit_ok";
        message = "Vous pouvez refaire le test";
      }
    }

    return c.json({
      success: true,
      canRetake,
      reason,
      message,
      subscriptionType,
      lastAssessmentDate: scoreData.lastAssessmentDate || scoreData.lastUpdate,
      nextAvailableDate,
    });
  } catch (error) {
    console.error("❌ Erreur vérification éligibilité MONA Score:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Réinitialiser le MONA Score (pour debug/admin)
 * DELETE /make-server-6378cc81/mona-score/:userId/reset
 */
app.delete("/make-server-6378cc81/mona-score/:userId/reset", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");

    if (!userToken) {
      return c.json({ error: "Non autorisé" }, 401);
    }

    // Valider le token
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) {
      return c.json({ error: "Token invalide" }, 401);
    }

    const authenticatedUserId = sessionResult.data.user.id;

    if (authenticatedUserId !== userId) {
      return c.json({ error: "Non autorisé" }, 403);
    }

    const scoreKey = `mona_score:${userId}`;
    
    // Réinitialiser le score
    const initialScore = {
      userId,
      currentScore: null,
      previousScore: null,
      trend: "stable",
      lastUpdate: new Date().toISOString(),
      weeklyAssessments: 0,
      expertFeedback: 0,
      history: [],
      isInitial: true,
      hasNeverBeenAssessed: true,
    };

    await kv.set(scoreKey, initialScore);

    console.log(`🔄 Score réinitialisé pour userId: ${userId}`);

    return c.json({
      success: true,
      message: "Score réinitialisé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur réinitialisation MONA Score:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== TEMPLATES ROUTES ====================

/**
 * Récupérer tous les templates d'un expert
 * GET /make-server-6378cc81/expert/templates
 */
app.get("/make-server-6378cc81/expert/templates", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const templatesData = await templates.getExpertTemplates(expertId);

    return c.json({
      success: true,
      data: templatesData,
    });
  } catch (error) {
    console.error("Erreur récupération templates:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les templates par type
 * GET /make-server-6378cc81/expert/templates/type/:type
 */
app.get("/make-server-6378cc81/expert/templates/type/:type", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const type = c.req.param("type");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const templatesData = await templates.getTemplatesByType(expertId, type);

    return c.json({
      success: true,
      data: templatesData,
    });
  } catch (error) {
    console.error("Erreur récupération templates par type:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer les templates favoris
 * GET /make-server-6378cc81/expert/templates/favorites
 */
app.get("/make-server-6378cc81/expert/templates/favorites", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const templatesData = await templates.getFavoriteTemplates(expertId);

    return c.json({
      success: true,
      data: templatesData,
    });
  } catch (error) {
    console.error("Erreur récupération templates favoris:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Récupérer un template spécifique
 * GET /make-server-6378cc81/expert/templates/:id
 */
app.get("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const templateId = c.req.param("id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const template = await templates.getTemplate(expertId, templateId);

    if (!template) {
      return c.json({ error: "Template introuvable" }, 404);
    }

    return c.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Erreur récupération template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Créer un nouveau template
 * POST /make-server-6378cc81/expert/templates
 */
app.post("/make-server-6378cc81/expert/templates", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const body = await c.req.json();
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const newTemplate = await templates.createTemplate(expertId, body);

    return c.json({
      success: true,
      message: "Template créé avec succès",
      data: newTemplate,
    });
  } catch (error) {
    console.error("Erreur création template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Mettre à jour un template
 * PUT /make-server-6378cc81/expert/templates/:id
 */
app.put("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const templateId = c.req.param("id");
    const body = await c.req.json();
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const updatedTemplate = await templates.updateTemplate(expertId, templateId, body);

    if (!updatedTemplate) {
      return c.json({ error: "Template introuvable" }, 404);
    }

    return c.json({
      success: true,
      message: "Template mis à jour avec succès",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Erreur mise à jour template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Supprimer un template
 * DELETE /make-server-6378cc81/expert/templates/:id
 */
app.delete("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const templateId = c.req.param("id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const deleted = await templates.deleteTemplate(expertId, templateId);

    if (!deleted) {
      return c.json({ error: "Template introuvable ou impossible à supprimer (template par défaut)" }, 400);
    }

    return c.json({
      success: true,
      message: "Template supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Basculer le statut favori d'un template
 * POST /make-server-6378cc81/expert/templates/:id/favorite
 */
app.post("/make-server-6378cc81/expert/templates/:id/favorite", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const templateId = c.req.param("id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    const updatedTemplate = await templates.toggleTemplateFavorite(expertId, templateId);

    if (!updatedTemplate) {
      return c.json({ error: "Template introuvable" }, 404);
    }

    return c.json({
      success: true,
      message: updatedTemplate.isFavorite ? "Template ajouté aux favoris" : "Template retiré des favoris",
      data: updatedTemplate,
    });
  } catch (error) {
    console.error("Erreur toggle favori template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Incrémenter le compteur d'utilisation d'un template
 * POST /make-server-6378cc81/expert/templates/:id/usage
 */
app.post("/make-server-6378cc81/expert/templates/:id/usage", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    const templateId = c.req.param("id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    await templates.incrementTemplateUsage(expertId, templateId);

    return c.json({
      success: true,
      message: "Utilisation enregistrée",
    });
  } catch (error) {
    console.error("Erreur incrémentation usage template:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Initialiser les templates pour un expert
 * POST /make-server-6378cc81/expert/templates/initialize
 */
app.post("/make-server-6378cc81/expert/templates/initialize", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    await templates.initializeExpertTemplates(expertId);

    return c.json({
      success: true,
      message: "Templates initialisés avec succès",
    });
  } catch (error) {
    console.error("Erreur initialisation templates:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

/**
 * Réinitialiser complètement les templates (delete + reinit)
 * POST /make-server-6378cc81/expert/templates/reset
 */
app.post("/make-server-6378cc81/expert/templates/reset", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    
    if (!expertId) {
      return c.json({ error: "Expert ID manquant" }, 401);
    }

    console.log(`🔄 Resetting all templates for expert ${expertId}...`);

    // Supprimer le flag d'initialisation
    await kv.del(`templates_initialized:${expertId}`);
    
    // Récupérer la liste des templates actuels pour les supprimer
    const expertTemplatesKey = `expert_templates:${expertId}`;
    const templateIds = await kv.get(expertTemplatesKey);
    
    if (templateIds && Array.isArray(templateIds)) {
      // Supprimer tous les templates individuellement
      const deletePromises = templateIds.map((id: string) => {
        const templateKey = `template:${expertId}:${id}`;
        return kv.del(templateKey);
      });
      await Promise.all(deletePromises);
      console.log(`🗑️ Deleted ${templateIds.length} templates`);
    }
    
    // Supprimer la liste des IDs
    await kv.del(expertTemplatesKey);

    // Réinitialiser les templates
    await templates.initializeExpertTemplates(expertId);

    console.log(`✅ Templates reset complete for expert ${expertId}`);

    return c.json({
      success: true,
      message: "Templates réinitialisés avec succès",
    });
  } catch (error) {
    console.error("Erreur réinitialisation templates:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);