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
import bookingRoutes from "./booking_routes.tsx";
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
    allowHeaders: ["Content-Type", "Authorization", "X-User-Token", "X-Expert-Id", "X-Expert-Token"],
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

app.get("/make-server-6378cc81/admin/check", async (c) => {
  try {
    const result = await adminAuth.hasAdminAccount();
    return c.json({ success: true, hasAdmin: result.exists });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/admin/setup", async (c) => {
  try {
    const checkResult = await adminAuth.hasAdminAccount();
    if (checkResult.exists) return c.json({ error: "Un compte administrateur existe déjà." }, 403);
    const body = await c.req.json();
    const { email, password, name } = body;
    if (!email || !password || !name) return c.json({ error: "Email, mot de passe et nom requis" }, 400);
    if (password.length < 8) return c.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, 400);
    const result = await adminAuth.createAdminAccount(email, password, { name, role: "admin" });
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Compte administrateur créé avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, code2FA } = body;
    if (!email || !password) return c.json({ error: "Email et mot de passe requis" }, 400);
    const result = await adminAuth.loginAdmin(email, password, code2FA);
    if (result.error) {
      if (result.error === "2FA_REQUIRED") return c.json({ success: false, error: "2FA_REQUIRED", message: "Code 2FA requis" }, 200);
      return c.json({ error: result.error }, 401);
    }
    return c.json({ success: true, message: "Connexion réussie", data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/admin/logout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await adminAuth.logoutAdmin(accessToken);
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/admin/session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await adminAuth.getAdminSession(accessToken);
    if (result.error) return c.json({ error: result.error }, 401);
    return c.json({ success: true, data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== MEMBER AUTHENTICATION ROUTES ====================

app.post("/make-server-6378cc81/member/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;
    if (!email || !password || !name) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    if (password.length < 8) return c.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, 400);
    const result = await memberAuth.signupMember(email, password, { name });
    if (result.error) {
      if (result.code === "email_exists") return c.json({ error: result.error }, 409);
      return c.json({ error: result.error }, 400);
    }
    return c.json({ success: true, message: "Compte membre créé avec succès", data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de l'inscription: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/member/cleanup-test/:email", async (c) => {
  try {
    const email = c.req.param("email");
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: sqlUser } = await supabase.from('users').select('id').eq('email', email).single();
    if (sqlUser) await supabase.from('users').delete().eq('id', sqlUser.id);
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const authUser = users?.find(u => u.email === email);
    if (authUser) {
      await supabase.auth.admin.deleteUser(authUser.id);
      await kv.del(`member:${authUser.id}`);
    }
    return c.json({ success: true, message: `Utilisateur ${email} supprimé`, cleaned: { sql: !!sqlUser, auth: !!authUser } });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

app.post("/make-server-6378cc81/member/login", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;
    if (!email || !password) return c.json({ error: "Email et mot de passe requis" }, 400);
    const result = await memberAuth.loginMember(email, password);
    if (result.error) return c.json({ error: result.error }, 401);
    return c.json({ success: true, message: "Connexion réussie", data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/member/logout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await memberAuth.logoutMember(accessToken);
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/member/session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await memberAuth.getMemberSession(accessToken);
    if (result.error) return c.json({ error: result.error }, 401);
    return c.json({ success: true, data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/member/profile", async (c) => {
  try {
    let accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) return c.json({ error: sessionResult.error }, 401);
    const profile = await kv.get(`member:${sessionResult.data.user.id}`);
    if (!profile) return c.json({ error: "Profil introuvable" }, 404);
    return c.json({ success: true, data: profile });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/member/profile", async (c) => {
  try {
    let accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) return c.json({ error: sessionResult.error, details: "La session a expiré ou le token est invalide." }, 401);
    const userId = sessionResult.data.user.id;
    const body = await c.req.json();
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
    return c.json({ success: true, message: "Profil mis à jour avec succès", data: updatedProfile });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/member/consultations", async (c) => {
  try {
    let accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) return c.json({ error: sessionResult.error }, 401);
    const userAppointments = await appointments.getUserAppointments(sessionResult.data.user.id);
    if (userAppointments.error) return c.json({ error: userAppointments.error }, 500);
    return c.json({ success: true, data: userAppointments.data || [] });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/member/bookings", async (c) => {
  try {
    let accessToken = c.req.header("X-User-Token") || c.req.header("Authorization")?.split(" ")[1];
    let userId = null, userName = "", userEmail = "";
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
    const { expertId, date, time, consultationType, name, email, phone, reason } = body;
    const finalName = userName || name;
    const finalEmail = userEmail || email;
    if (!expertId || !date || !time || !finalName || !finalEmail) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    const appointment = await appointments.createAppointment({
      userId: userId || `guest_${Date.now()}`,
      expertId, date, time,
      consultationType: consultationType || "online",
      memberName: finalName, memberEmail: finalEmail, memberPhone: phone,
      reason: reason || "", status: "scheduled",
    });
    return c.json({ success: true, message: "Rendez-vous créé avec succès", data: appointment });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== EXPERT AUTHENTICATION ROUTES ====================

app.post("/make-server-6378cc81/expert/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, firstName, lastName, specialty, licenseNumber, phone } = body;
    if (!email || !password || !firstName || !lastName || !specialty || !licenseNumber) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    if (password.length < 8) return c.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, 400);
    const result = await expertAuth.signupExpert(email, password, { firstName, lastName, specialty, licenseNumber, phone });
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Compte expert créé avec succès", data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de l'inscription: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    if (!email || !password) return c.json({ error: "Email et mot de passe requis" }, 400);
    const result = await expertAuth.loginExpert(email, password);
    if (result.error) return c.json({ error: result.error }, 401);
    return c.json({ success: true, message: "Connexion réussie", data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la connexion: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/init-demo", async (c) => {
  try {
    const demoData = { email: "demo.expert@monafrica.net", password: "Expert2025!", firstName: "Dr. Sarah", lastName: "Koné", specialty: "Psychiatre", licenseNumber: "PSY-2024-001", phone: "+225 07 00 00 00" };
    const result = await expertAuth.signupExpert(demoData.email, demoData.password, { firstName: demoData.firstName, lastName: demoData.lastName, specialty: demoData.specialty, licenseNumber: demoData.licenseNumber, phone: demoData.phone });
    if (result.error && (result.error.includes("already") || result.error.includes("existe"))) {
      return c.json({ success: true, message: "Compte démo existe déjà", credentials: { email: demoData.email, password: demoData.password } });
    }
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Compte démo créé avec succès", credentials: { email: demoData.email, password: demoData.password } });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/logout", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await expertAuth.logoutExpert(accessToken);
    if (result.error) return c.json({ error: result.error }, 400);
    return c.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la déconnexion: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/session", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const result = await expertAuth.getExpertSession(accessToken);
    if (result.error) return c.json({ error: result.error }, 401);
    return c.json({ success: true, data: result.data });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la récupération de la session: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await expertAuth.getExpertSession(accessToken);
    if (sessionResult.error) return c.json({ error: sessionResult.error }, 401);
    const { id: userId, email: userEmail, user_metadata: userMetadata = {} } = sessionResult.data.user;
    const profileData = await kv.get(`expert:${userId}`);
    const profile = profileData || {
      id: userId, email: userEmail,
      firstName: userMetadata.firstName || "", lastName: userMetadata.lastName || "",
      specialty: userMetadata.specialty || "", licenseNumber: userMetadata.licenseNumber || "",
      phone: userMetadata.phone || "", status: "active", createdAt: new Date().toISOString(),
      totalConsultations: 0, rating: 0, languages: ["Français"], availability: {}, bio: "",
    };
    return c.json({ success: true, profile });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la récupération du profil: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/expert/profile", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    if (!accessToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await expertAuth.getExpertSession(accessToken);
    if (sessionResult.error) return c.json({ error: sessionResult.error }, 401);
    const userId = sessionResult.data.user.id;
    const body = await c.req.json();
    const { phone, bio, languages, availability, specialty, firstName, lastName } = body;
    const currentProfile = await kv.get(`expert:${userId}`) || {};
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
    await kv.set(`expert:${userId}`, updatedProfile);
    return c.json({ success: true, message: "Profil mis à jour avec succès", profile: updatedProfile });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la mise à jour du profil: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/application", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, phone, city, profession, experience, diplomas, specialties, languages, availability, linkedin, motivation, licenseNumber, status, submittedAt, files } = body;
    if (!firstName || !lastName || !email || !phone || !profession || !licenseNumber) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    const applicationId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const application = { id: applicationId, firstName, lastName, email, phone, city, profession, experience, diplomas, specialties, languages, availability, linkedin, motivation, licenseNumber, files, status: status || "pending", submittedAt: submittedAt || new Date().toISOString() };
    await kv.set(`application:${applicationId}`, application);
    const pendingApplications = await kv.get("applications:pending") || [];
    pendingApplications.push(applicationId);
    await kv.set("applications:pending", pendingApplications);
    return c.json({ success: true, message: "Candidature enregistrée avec succès", data: { applicationId } });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de l'enregistrement: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/applications", async (c) => {
  try {
    const allApps = await kv.getByPrefix("application:") || [];
    return c.json({ success: true, data: allApps.filter((app: any) => app && app.id) });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la récupération: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/list", async (c) => {
  try {
    const approvedIds = await kv.get("applications:approved") || [];
    const experts = [];
    for (const id of approvedIds) {
      const expert = await kv.get(`application:${id}`);
      if (expert) experts.push(expert);
    }
    return c.json({ success: true, data: experts });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/create", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, phone, city, profession, experience, specialties, languages, licenseNumber } = body;
    if (!firstName || !lastName || !email || !profession || !licenseNumber) return c.json({ error: "Champs obligatoires manquants" }, 400);
    let existingApplication = null, expertId = null;
    const allApplicationKeys = await kv.getByPrefix("application:");
    for (const key of allApplicationKeys) {
      const app = await kv.get(key);
      if (app && app.email === email) { existingApplication = app; expertId = app.id; break; }
    }
    let expert, isFromExistingApplication = false;
    if (existingApplication) {
      isFromExistingApplication = true;
      expert = { ...existingApplication, firstName: firstName || existingApplication.firstName, lastName: lastName || existingApplication.lastName, phone: phone || existingApplication.phone, city: city || existingApplication.city, profession: profession || existingApplication.profession, experience: experience || existingApplication.experience, specialties: specialties || existingApplication.specialties, languages: languages || existingApplication.languages, licenseNumber: licenseNumber || existingApplication.licenseNumber, status: "approved", updatedAt: new Date().toISOString(), approvedBy: "admin", approvedAt: new Date().toISOString() };
    } else {
      expertId = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      expert = { id: expertId, firstName, lastName, email, phone, city, profession, experience, specialties, languages, licenseNumber, status: "approved", createdAt: new Date().toISOString(), createdBy: "admin" };
    }
    await kv.set(`application:${expertId}`, expert);
    const approvedIds = await kv.get("applications:approved") || [];
    if (!approvedIds.includes(expertId)) { approvedIds.push(expertId); await kv.set("applications:approved", approvedIds); }
    const emailResult = await sendExpertInvitationEmail(email, firstName, lastName);
    return c.json({ success: true, message: `Expert ${isFromExistingApplication ? "mis à jour" : "créé"} avec succès`, data: expert, fromExistingApplication: isFromExistingApplication, emailSent: emailResult.success });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/expert/:id", async (c) => {
  try {
    const expertId = c.req.param("id");
    const body = await c.req.json();
    const existingExpert = await kv.get(`application:${expertId}`);
    if (!existingExpert) return c.json({ error: "Expert introuvable" }, 404);
    const updatedExpert = { ...existingExpert, ...body, updatedAt: new Date().toISOString() };
    await kv.set(`application:${expertId}`, updatedExpert);
    return c.json({ success: true, message: "Expert mis à jour avec succès", data: updatedExpert });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/expert/:id", async (c) => {
  try {
    const expertId = c.req.param("id");
    const expert = await kv.get(`application:${expertId}`);
    if (!expert) return c.json({ error: "Expert introuvable" }, 404);
    const approvedIds = (await kv.get("applications:approved") || []).filter((id: string) => id !== expertId);
    await kv.set("applications:approved", approvedIds);
    const pendingIds = (await kv.get("applications:pending") || []).filter((id: string) => id !== expertId);
    await kv.set("applications:pending", pendingIds);
    await kv.del(`application:${expertId}`);
    return c.json({ success: true, message: "Expert supprimé avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/expert/:id/toggle-active", async (c) => {
  try {
    const expertId = c.req.param("id");
    const expert = await kv.get(`application:${expertId}`);
    if (!expert) return c.json({ error: "Expert introuvable" }, 404);
    expert.active = !expert.active;
    expert.updatedAt = new Date().toISOString();
    await kv.set(`application:${expertId}`, expert);
    return c.json({ success: true, message: expert.active ? "Expert activé" : "Expert désactivé", data: expert });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/expert/application/:id", async (c) => {
  try {
    const applicationId = c.req.param("id");
    const body = await c.req.json();
    const existingApp = await kv.get(`application:${applicationId}`);
    if (!existingApp) return c.json({ error: "Candidature introuvable" }, 404);
    const updatedApp = { ...existingApp, ...body, updatedAt: new Date().toISOString() };
    await kv.set(`application:${applicationId}`, updatedApp);
    if (body.status === "approved") {
      const pendingIds = (await kv.get("applications:pending") || []).filter((id: string) => id !== applicationId);
      await kv.set("applications:pending", pendingIds);
      const approvedIds = await kv.get("applications:approved") || [];
      approvedIds.push(applicationId);
      await kv.set("applications:approved", approvedIds);
      await sendApprovalEmail(updatedApp.email, updatedApp.firstName, updatedApp.lastName);
    } else if (body.status === "rejected") {
      await sendRejectionEmail(updatedApp.email, updatedApp.firstName, updatedApp.lastName);
    }
    return c.json({ success: true, message: "Candidature mise à jour avec succès", data: updatedApp });
  } catch (error) {
    return c.json({ error: `Erreur serveur lors de la mise à jour: ${error.message}` }, 500);
  }
});

// ==================== MESSAGERIE INTERNE ROUTES ====================

app.get("/make-server-6378cc81/messages/conversations", async (c) => {
  try {
    const archived = c.req.query("archived") === "true";
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
    conversations.sort((a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    return c.json({ success: true, data: conversations });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/messages/conversation/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messages = await messaging.getConversationMessages(conversationId);
    return c.json({ success: true, data: messages.map((msg: any) => ({ id: msg.id, conversationId: msg.conversationId, senderId: msg.senderId, senderName: msg.senderName, senderRole: msg.senderRole, message: msg.content, sentAt: msg.timestamp, read: msg.read, cc: msg.cc || [], attachments: msg.attachments || [] })) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/messages/create", async (c) => {
  try {
    const body = await c.req.json();
    const { senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content, cc } = body;
    if (!senderId || !senderName || !senderRole || !recipientId || !recipientName || !recipientRole || !content) return c.json({ error: "Tous les champs sont requis" }, 400);
    const result = await messaging.sendMessage(senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content, false, cc || []);
    if (result.success) return c.json({ success: true, message: result.message });
    return c.json({ error: result.error }, 500);
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/messages/send", async (c) => {
  try {
    const body = await c.req.json();
    const { conversationId, message, cc, attachments } = body;
    if (!conversationId || !message) return c.json({ error: "conversationId et message requis" }, 400);
    const conversation = await kv.get(`conversation:${conversationId}`);
    if (!conversation) return c.json({ error: "Conversation introuvable" }, 404);
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    const newMessage = { id: messageId, conversationId, senderId: "admin", senderName: "Administrateur M.O.N.A", senderRole: "admin", recipientId: conversation.participants[0].id, recipientName: conversation.participants[0].name, recipientRole: conversation.participants[0].role, content: message, timestamp, read: false, cc: cc || [], attachments: attachments || [] };
    await kv.set(`message:${messageId}`, newMessage);
    const conversationMessagesKey = `conversation:${conversationId}:messages`;
    const existingMessages = await kv.get(conversationMessagesKey) || [];
    existingMessages.push(messageId);
    await kv.set(conversationMessagesKey, existingMessages);
    conversation.lastMessage = message.substring(0, 100);
    conversation.lastMessageTime = timestamp;
    await kv.set(`conversation:${conversationId}`, conversation);
    const expertParticipant = conversation.participants.find((p: any) => p.role === "expert");
    if (expertParticipant?.email) {
      const fromAdmin = newMessage.senderName.includes("Support") ? "support@monafrica.net" : "contact@monafrica.net";
      await sendAdminToExpertEmail(fromAdmin, expertParticipant.email, expertParticipant.name, `Nouveau message de l'équipe M.O.N.A`, message, cc).catch(console.error);
    }
    return c.json({ success: true, message: "Message envoyé avec succès", data: newMessage });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/messages/conversation/:conversationId/archive", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const conversation = await kv.get(`conversation:${conversationId}`);
    if (!conversation) return c.json({ error: "Conversation introuvable" }, 404);
    conversation.archived = !conversation.archived;
    await kv.set(`conversation:${conversationId}`, conversation);
    return c.json({ success: true, message: conversation.archived ? "Conversation archivée" : "Conversation désarchivée" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/messages/conversation/:conversationId", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const messageIds = await kv.get(`conversation:${conversationId}:messages`) || [];
    for (const msgId of messageIds) await kv.del(`message:${msgId}`);
    await kv.del(`conversation:${conversationId}:messages`);
    await kv.del(`conversation:${conversationId}`);
    return c.json({ success: true, message: "Conversation supprimée avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/messaging/send", async (c) => {
  try {
    const body = await c.req.json();
    const { senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content } = body;
    if (!senderId || !senderName || !senderRole || !recipientId || !recipientName || !recipientRole || !content) return c.json({ error: "Tous les champs sont requis" }, 400);
    const result = await messaging.sendMessage(senderId, senderName, senderRole, recipientId, recipientName, recipientRole, content);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Message envoyé avec succès", data: result.message });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/messaging/conversations/:userId", async (c) => {
  try {
    const conversations = await messaging.getUserConversations(c.req.param("userId"));
    return c.json({ success: true, data: conversations });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/messaging/conversation/:conversationId/messages", async (c) => {
  try {
    const messages = await messaging.getConversationMessages(c.req.param("conversationId"));
    return c.json({ success: true, data: messages });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/messaging/conversation/:conversationId/read", async (c) => {
  try {
    const { userId } = await c.req.json();
    if (!userId) return c.json({ error: "userId requis" }, 400);
    const result = await messaging.markConversationAsRead(c.req.param("conversationId"), userId);
    if (!result.success) return c.json({ error: "Erreur lors de la mise à jour" }, 500);
    return c.json({ success: true, message: "Conversation marquée comme lue" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/messaging/unread/:userId", async (c) => {
  try {
    const count = await messaging.getUnreadCount(c.req.param("userId"));
    return c.json({ success: true, data: { count } });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== TICKETS ROUTES ====================

app.post("/make-server-6378cc81/tickets/create", async (c) => {
  try {
    const { createdBy, createdByName, createdByRole, category, subject, description, priority } = await c.req.json();
    if (!createdBy || !createdByName || !createdByRole || !category || !subject || !description) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    const result = await tickets.createTicket(createdBy, createdByName, createdByRole, category, subject, description, priority || 'medium');
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Ticket créé avec succès", data: result.ticket });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/tickets/:ticketId/message", async (c) => {
  try {
    const { authorId, authorName, authorRole, content, isStaffReply } = await c.req.json();
    if (!authorId || !authorName || !authorRole || !content) return c.json({ error: "Tous les champs sont requis" }, 400);
    const result = await tickets.addTicketMessage(c.req.param("ticketId"), authorId, authorName, authorRole, content, isStaffReply || false);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Message ajouté au ticket", data: result.message });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/tickets/:ticketId/status", async (c) => {
  try {
    const { status, assignedTo } = await c.req.json();
    if (!status) return c.json({ error: "Le statut est requis" }, 400);
    const result = await tickets.updateTicketStatus(c.req.param("ticketId"), status, assignedTo);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Statut du ticket mis à jour" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/tickets/all", async (c) => {
  try {
    return c.json({ success: true, data: await tickets.getAllTickets() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/tickets/user/:userId", async (c) => {
  try {
    return c.json({ success: true, data: await tickets.getUserTickets(c.req.param("userId")) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/tickets/stats", async (c) => {
  try {
    return c.json({ success: true, data: await tickets.getTicketStats() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/tickets/:ticketId", async (c) => {
  try {
    const ticket = await tickets.getTicket(c.req.param("ticketId"));
    if (!ticket) return c.json({ error: "Ticket non trouvé" }, 404);
    return c.json({ success: true, data: ticket });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== APPOINTMENTS ROUTES ====================

app.post("/make-server-6378cc81/appointments/create", async (c) => {
  try {
    const body = await c.req.json();
    const { expertId, memberId, date, time, duration, location, type, status } = body;
    if (!expertId || !memberId || !date || !time || !duration || !location || !type) return c.json({ error: "Tous les champs obligatoires doivent être remplis" }, 400);
    const result = await appointments.createAppointment(expertId, memberId, date, time, duration, location, type, status || 'scheduled');
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Rendez-vous créé avec succès", data: result.appointment });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/appointments/:appointmentId/message", async (c) => {
  try {
    const { authorId, authorName, authorRole, content, isStaffReply } = await c.req.json();
    if (!authorId || !authorName || !authorRole || !content) return c.json({ error: "Tous les champs sont requis" }, 400);
    const result = await appointments.addAppointmentMessage(c.req.param("appointmentId"), authorId, authorName, authorRole, content, isStaffReply || false);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Message ajouté au rendez-vous", data: result.message });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/appointments/:appointmentId/status", async (c) => {
  try {
    const { status, assignedTo } = await c.req.json();
    if (!status) return c.json({ error: "Le statut est requis" }, 400);
    const result = await appointments.updateAppointmentStatus(c.req.param("appointmentId"), status, assignedTo);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Statut du rendez-vous mis à jour" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/appointments/all", async (c) => {
  try {
    return c.json({ success: true, data: await appointments.getAllAppointments() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/appointments/user/:userId", async (c) => {
  try {
    const userAppointments = await appointments.getUserAppointments(c.req.param("userId"));
    if (userAppointments.error) return c.json({ error: userAppointments.error }, 500);
    return c.json({ success: true, data: userAppointments.data || [] });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/appointments/stats", async (c) => {
  try {
    return c.json({ success: true, data: await appointments.getAppointmentStats() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/appointments/:appointmentId", async (c) => {
  try {
    const appointment = await appointments.getAppointment(c.req.param("appointmentId"));
    if (!appointment) return c.json({ error: "Rendez-vous non trouvé" }, 404);
    return c.json({ success: true, data: appointment });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== HEALTH PASSPORT ROUTES ====================

app.get("/make-server-6378cc81/health-passport/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const isOwner = c.req.header("X-User-Token") === userId;
    const isExpert = !!c.req.header("X-Expert-Id");
    if (!isOwner && !isExpert) return c.json({ error: "Non autorisé" }, 403);
    return c.json({ success: true, vitals: await kv.get(`health_passport:${userId}:vitals`) || { bloodType: "", height: "", weight: "", bloodPressure: "", lastCheckup: "" }, allergies: await kv.get(`health_passport:${userId}:allergies`) || [], conditions: await kv.get(`health_passport:${userId}:conditions`) || [], vaccinations: await kv.get(`health_passport:${userId}:vaccinations`) || [], documents: await kv.get(`health_passport:${userId}:documents`) || [] });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/health-passport/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const isOwner = c.req.header("X-User-Token") === userId;
    const isExpert = !!c.req.header("X-Expert-Id");
    if (!isOwner && !isExpert) return c.json({ error: "Non autorisé" }, 403);
    const { type, data } = await c.req.json();
    if (!type || !data) return c.json({ error: "Type et données requis" }, 400);
    await kv.set(`health_passport:${userId}:${type}`, data);
    return c.json({ success: true, message: "Données sauvegardées avec succès" });
  } catch (error) {
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
    const now = new Date();
    const consultationsMoisEnCours = consultations.filter((c: any) => { const date = new Date(c.date); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).length;
    const entreprise = await kv.get(`entreprise:${entrepriseId}`);
    return c.json({ totalEmployes, employesActifs, tauxEngagement: totalEmployes > 0 ? Math.round((employesActifs / totalEmployes) * 100) : 0, totalConsultations: consultations.length, consultationsMoisEnCours, creditsRestants: entreprise?.credits || 0, derniereMiseAJour: new Date().toISOString() });
  } catch (error) {
    return c.json({ error: 'Erreur récupération stats' }, 500);
  }
});

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes', async (c) => {
  try {
    return c.json({ employes: await kv.getByPrefix(`entreprise:${c.req.param('entrepriseId')}:employe:`) || [] });
  } catch (error) {
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
    return c.json({ error: 'Erreur ajout employé' }, 500);
  }
});

app.put('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/employes/:employeId', async (c) => {
  try {
    const { entrepriseId, employeId } = c.req.param();
    const employe = await kv.get(`entreprise:${entrepriseId}:employe:${employeId}`);
    if (!employe) return c.json({ error: 'Employé non trouvé' }, 404);
    const employeMisAJour = { ...employe, ...await c.req.json() };
    await kv.set(`entreprise:${entrepriseId}:employe:${employeId}`, employeMisAJour);
    return c.json({ employe: employeMisAJour });
  } catch (error) {
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
      consultationsParMois.push({ mois: date.toLocaleDateString('fr-FR', { month: 'short' }), total: consultations.filter((c: any) => { const d = new Date(c.date); return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); }).length });
    }
    const consultationsParService: { [key: string]: number } = {};
    consultations.forEach((c: any) => { const s = c.service || 'Autre'; consultationsParService[s] = (consultationsParService[s] || 0) + 1; });
    return c.json({ consultationsParMois, consultationsParService: Object.entries(consultationsParService).map(([service, total]) => ({ service, total })) });
  } catch (error) {
    return c.json({ error: 'Erreur analytics' }, 500);
  }
});

app.get('/make-server-6378cc81/dashboard-entreprise/:entrepriseId/sante-globale', async (c) => {
  try {
    const scores = await kv.getByPrefix(`entreprise:${c.req.param('entrepriseId')}:score:`);
    const scoreMoyen = scores.length > 0 ? Math.round(scores.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / scores.length) : 0;
    const now = new Date();
    const tendance = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const scoresduMois = scores.filter((s: any) => { const d = new Date(s.date); return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(); });
      tendance.push({ mois: date.toLocaleDateString('fr-FR', { month: 'short' }), score: scoresduMois.length > 0 ? Math.round(scoresduMois.reduce((sum: number, s: any) => sum + (s.score || 0), 0) / scoresduMois.length) : 0 });
    }
    return c.json({ scoreMoyen, distribution: { excellent: scores.filter((s: any) => s.score >= 80).length, bon: scores.filter((s: any) => s.score >= 60 && s.score < 80).length, moyen: scores.filter((s: any) => s.score >= 40 && s.score < 60).length, faible: scores.filter((s: any) => s.score < 40).length }, tendance, totalEvaluations: scores.length });
  } catch (error) {
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
    const now = new Date();
    const consultationsMoisEnCours = consultations.filter((c: any) => { const date = new Date(c.date); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).length;
    return c.json({ totalMembres: membres.length, membresActifs: membres.filter((m: any) => m.statut === 'actif').length, totalExperts: experts.length, expertsActifs: experts.filter((e: any) => e.statut === 'actif').length, totalEntreprises: entreprises.filter((e: any) => e.statut === 'active' && !e.id?.includes(':')).length, entreprisesActives: entreprises.filter((e: any) => e.statut === 'active' && !e.id?.includes(':')).length, totalConsultations: consultations.length, consultationsMoisEnCours, revenuMensuel: consultations.filter((c: any) => { const date = new Date(c.date); return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); }).reduce((sum: number, c: any) => sum + (c.montant || 0), 0), derniereMiseAJour: new Date().toISOString() });
  } catch (error) {
    return c.json({ error: 'Erreur stats admin' }, 500);
  }
});

app.get('/make-server-6378cc81/admin/analytics', async (c) => {
  try {
    return c.json(await getAdminAnalytics());
  } catch (error) {
    return c.json({ success: false, error: `Erreur récupération analytics: ${error.message}` }, 500);
  }
});

// ==================== ADMIN USERS SQL ROUTES ====================

app.get('/make-server-6378cc81/admin/users-sql', async (c) => {
  try {
    return c.json(await adminUsersSQL.getUsers({ search: c.req.query('search'), status: c.req.query('status'), membershipType: c.req.query('membershipType'), country: c.req.query('country'), limit: parseInt(c.req.query('limit') || '50'), offset: parseInt(c.req.query('offset') || '0') }));
  } catch (error) {
    return c.json({ success: false, error: `Erreur récupération utilisateurs: ${error.message}` }, 500);
  }
});

app.get('/make-server-6378cc81/admin/users-sql/stats', async (c) => {
  try {
    return c.json(await adminUsersSQL.getUserStats());
  } catch (error) {
    return c.json({ success: false, error: `Erreur récupération stats: ${error.message}` }, 500);
  }
});

app.get('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    return c.json(await adminUsersSQL.getUserById(c.req.param('userId')));
  } catch (error) {
    return c.json({ success: false, error: `Erreur récupération utilisateur: ${error.message}` }, 500);
  }
});

app.put('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    return c.json(await adminUsersSQL.updateUser(c.req.param('userId'), await c.req.json(), c.req.header('X-Admin-Id') || 'unknown'));
  } catch (error) {
    return c.json({ success: false, error: `Erreur mise à jour: ${error.message}` }, 500);
  }
});

app.post('/make-server-6378cc81/admin/users-sql/:userId/suspend', async (c) => {
  try {
    const { reason } = await c.req.json();
    return c.json(await adminUsersSQL.suspendUser(c.req.param('userId'), c.req.header('X-Admin-Id') || 'unknown', reason));
  } catch (error) {
    return c.json({ success: false, error: `Erreur suspension: ${error.message}` }, 500);
  }
});

app.post('/make-server-6378cc81/admin/users-sql/:userId/reactivate', async (c) => {
  try {
    return c.json(await adminUsersSQL.reactivateUser(c.req.param('userId'), c.req.header('X-Admin-Id') || 'unknown'));
  } catch (error) {
    return c.json({ success: false, error: `Erreur réactivation: ${error.message}` }, 500);
  }
});

app.delete('/make-server-6378cc81/admin/users-sql/:userId', async (c) => {
  try {
    return c.json(await adminUsersSQL.deleteUser(c.req.param('userId'), c.req.header('X-Admin-Id') || 'unknown'));
  } catch (error) {
    return c.json({ success: false, error: `Erreur suppression: ${error.message}` }, 500);
  }
});

app.get('/make-server-6378cc81/admin/entreprises', async (c) => {
  try {
    const entreprises = await kv.getByPrefix('entreprise:');
    return c.json({ entreprises: entreprises.filter((e: any) => e.id && !e.id.includes(':employe:') && !e.id.includes(':consultation:') && !e.id.includes(':score:')) || [] });
  } catch (error) {
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
    return c.json({ error: 'Erreur détails entreprise' }, 500);
  }
});

app.put('/make-server-6378cc81/admin/entreprises/:entrepriseId', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    const entreprise = await kv.get(`entreprise:${entrepriseId}`);
    if (!entreprise) return c.json({ error: 'Entreprise non trouvée' }, 404);
    const entrepriseMisAJour = { ...entreprise, ...await c.req.json() };
    await kv.set(`entreprise:${entrepriseId}`, entrepriseMisAJour);
    return c.json({ entreprise: entrepriseMisAJour });
  } catch (error) {
    return c.json({ error: 'Erreur maj entreprise' }, 500);
  }
});

app.delete('/make-server-6378cc81/admin/entreprises/:entrepriseId', async (c) => {
  try {
    const entrepriseId = c.req.param('entrepriseId');
    await kv.del(`entreprise:${entrepriseId}`);
    const employes = await kv.getByPrefix(`entreprise:${entrepriseId}:employe:`);
    for (const employe of employes) await kv.del(`entreprise:${entrepriseId}:employe:${employe.id}`);
    return c.json({ message: 'Entreprise supprimée avec succès' });
  } catch (error) {
    return c.json({ error: 'Erreur suppression entreprise' }, 500);
  }
});

// ==================== EMAIL ROUTES ====================

app.post('/make-server-6378cc81/contact/send', async (c) => {
  try {
    const { name, email, phone, subject, message, category } = await c.req.json();
    if (!name || !email || !subject || !message) return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
    const result = await sendContactEmail(name, email, phone || '', subject, message, category || 'général');
    if (result.success) return c.json({ success: true, message: 'Message envoyé avec succès' });
    return c.json({ error: result.error }, 500);
  } catch (error) {
    return c.json({ error: 'Erreur lors de l\'envoi du message' }, 500);
  }
});

app.post('/make-server-6378cc81/support/send', async (c) => {
  try {
    const { name, email, phone, subject, message, priority, userType } = await c.req.json();
    if (!name || !email || !subject || !message) return c.json({ error: 'Tous les champs obligatoires doivent être remplis' }, 400);
    const result = await sendSupportEmail(name, email, phone || '', subject, message, priority || 'normale', userType || 'membre');
    if (result.success) return c.json({ success: true, message: 'Demande de support enregistrée avec succès' });
    return c.json({ error: result.error }, 500);
  } catch (error) {
    return c.json({ error: 'Erreur lors de l\'envoi de la demande de support' }, 500);
  }
});

app.delete("/make-server-6378cc81/admin/cleanup-demo-data", async (c) => {
  try {
    let deletedCount = 0;
    const allConversations = await kv.getByPrefix("conversation:") || [];
    for (const conv of allConversations) {
      if (conv?.id && !conv.id.includes(":messages")) {
        const messageIds = await kv.get(`conversation:${conv.id}:messages`) || [];
        for (const msgId of messageIds) { await kv.del(`message:${msgId}`); deletedCount++; }
        await kv.del(`conversation:${conv.id}:messages`);
        await kv.del(`conversation:${conv.id}`);
        deletedCount++;
      }
    }
    const allMessages = await kv.getByPrefix("message:") || [];
    for (const msg of allMessages) { if (msg?.id) { await kv.del(`message:${msg.id}`); deletedCount++; } }
    return c.json({ success: true, message: `Données de démo nettoyées avec succès (${deletedCount} entrées supprimées)`, deletedCount });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== MESSAGING USERS ROUTES ====================

app.get("/make-server-6378cc81/messaging/users", async (c) => {
  try {
    const allUsers = await kv.getByPrefix("messaging_user:") || [];
    return c.json({ success: true, users: allUsers.map((user: any) => ({ id: user.id, email: user.email, name: user.name, role: user.role, active: user.active !== false, createdAt: user.createdAt })) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/messaging/users", async (c) => {
  try {
    const { name, email, role } = await c.req.json();
    if (!name || !email || !role) return c.json({ error: "Tous les champs sont requis" }, 400);
    if (!email.endsWith("@monafrica.net")) return c.json({ error: "L'email doit se terminer par @monafrica.net" }, 400);
    const existingUsers = await kv.getByPrefix("messaging_user:") || [];
    if (existingUsers.some((u: any) => u.email === email)) return c.json({ error: "Un utilisateur avec cet email existe déjà" }, 400);
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = { id: userId, email, name, role, active: true, createdAt: new Date().toISOString() };
    await kv.set(`messaging_user:${userId}`, user);
    return c.json({ success: true, user });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.patch("/make-server-6378cc81/messaging/users/:userId", async (c) => {
  try {
    const user = await kv.get(`messaging_user:${c.req.param("userId")}`);
    if (!user) return c.json({ error: "Utilisateur non trouvé" }, 404);
    const { active } = await c.req.json();
    user.active = active;
    await kv.set(`messaging_user:${c.req.param("userId")}`, user);
    return c.json({ success: true, user });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/messaging/users/:userId", async (c) => {
  try {
    await kv.del(`messaging_user:${c.req.param("userId")}`);
    return c.json({ success: true, message: "Utilisateur supprimé" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/users/messaging", async (c) => {
  try {
    const allUsers = await kv.getByPrefix("messaging_user:") || [];
    return c.json({ success: true, data: allUsers.filter((u: any) => u.active !== false).map((u: any) => ({ id: u.id, email: u.email, name: u.name, role: u.role, active: true })) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/debug-profile", async (c) => {
  try {
    const email = c.req.query("email");
    if (!email) return c.json({ error: "Email requis dans les paramètres ?email=" }, 400);
    const { createClient } = await import("jsr:@supabase/supabase-js@2");
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return c.json({ error: "Erreur lors de la liste des utilisateurs", details: listError }, 500);
    const user = users.users.find(u => u.email === email);
    if (!user) return c.json({ error: "Utilisateur non trouvé dans Supabase Auth", email, suggestion: "Créez d'abord le compte via /expert/signup" }, 404);
    const profileKey = `expert:${user.id}`;
    const existingProfile = await kv.get(profileKey);
    if (existingProfile) return c.json({ success: true, message: "Profil trouvé", userId: user.id, email: user.email, kvKey: profileKey, profile: existingProfile, userMetadata: user.user_metadata });
    const newProfile = { id: user.id, email: user.email, firstName: user.user_metadata?.firstName || "", lastName: user.user_metadata?.lastName || "", specialty: user.user_metadata?.specialty || "", licenseNumber: user.user_metadata?.licenseNumber || "", phone: user.user_metadata?.phone || "", status: "active", createdAt: new Date().toISOString(), totalConsultations: 0, rating: 0, languages: ["Français"], availability: {} };
    await kv.set(profileKey, newProfile);
    return c.json({ success: true, message: "Profil réparé - créé dans KV", userId: user.id, email: user.email, kvKey: profileKey, profile: newProfile, userMetadata: user.user_metadata });
  } catch (error) {
    return c.json({ error: "Erreur serveur", details: error.message }, 500);
  }
});

// ==================== SUPPORT/TICKETS ROUTES ====================

app.post("/make-server-6378cc81/support/tickets", async (c) => {
  try {
    const { createdBy, createdByName, createdByRole, category, subject, description, priority } = await c.req.json();
    if (!createdBy || !createdByName || !createdByRole || !category || !subject || !description) return c.json({ error: "Données manquantes" }, 400);
    const result = await tickets.createTicket(createdBy, createdByName, createdByRole, category, subject, description, priority || "medium");
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Ticket créé avec succès", ticket: result.ticket });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/admin/support/tickets", async (c) => {
  try {
    return c.json({ success: true, tickets: await tickets.getAllTickets(), stats: await tickets.getTicketStats() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/support/tickets/:ticketId", async (c) => {
  try {
    const ticket = await tickets.getTicket(c.req.param("ticketId"));
    if (!ticket) return c.json({ error: "Ticket introuvable" }, 404);
    return c.json({ success: true, ticket });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/support/tickets/:ticketId/messages", async (c) => {
  try {
    const { authorId, authorName, authorRole, content, isStaffReply } = await c.req.json();
    if (!authorId || !authorName || !authorRole || !content) return c.json({ error: "Données manquantes" }, 400);
    const result = await tickets.addTicketMessage(c.req.param("ticketId"), authorId, authorName, authorRole, content, isStaffReply || false);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Message ajouté avec succès", ticketMessage: result.message });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/admin/support/tickets/:ticketId/status", async (c) => {
  try {
    const { status, assignedTo } = await c.req.json();
    if (!status) return c.json({ error: "Statut manquant" }, 400);
    const result = await tickets.updateTicketStatus(c.req.param("ticketId"), status, assignedTo);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Statut mis à jour avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/admin/support/stats", async (c) => {
  try {
    return c.json({ success: true, stats: await tickets.getTicketStats() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/api/chat", handleChat);
app.post("/make-server-6378cc81/contact/send", handleContactSend);

// ==================== NOTIFICATIONS ====================

app.post("/make-server-6378cc81/notifications/consultation", async (c) => {
  try {
    const { recipientEmail, recipientName, notificationType, consultationDetails } = await c.req.json();
    if (!recipientEmail || !recipientName || !notificationType || !consultationDetails) return c.json({ error: "Données manquantes pour l'envoi de notification" }, 400);
    const result = await sendConsultationNotificationEmail(recipientEmail, recipientName, notificationType, consultationDetails);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Notification envoyée avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/notifications/message", async (c) => {
  try {
    const { recipientEmail, recipientName, senderName, messagePreview } = await c.req.json();
    if (!recipientEmail || !recipientName || !senderName || !messagePreview) return c.json({ error: "Données manquantes pour l'envoi de notification" }, 400);
    const result = await sendMessageNotificationEmail(recipientEmail, recipientName, senderName, messagePreview);
    if (!result.success) return c.json({ error: result.error }, 500);
    return c.json({ success: true, message: "Notification envoyée avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== QUIZ DE MATCHING ROUTES ====================

app.post("/make-server-6378cc81/matching-quiz/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    if (!userToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
    if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    const { answers } = await c.req.json();
    if (!answers || !Array.isArray(answers)) return c.json({ error: "Les réponses du quiz sont requises" }, 400);
    await kv.set(`matching_quiz:${userId}`, { userId, answers, completedAt: new Date().toISOString() });
    return c.json({ success: true, message: "Quiz sauvegardé avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/matching-quiz/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    if (!userToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
    if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    const quizData = await kv.get(`matching_quiz:${userId}`);
    return c.json({ success: true, data: quizData || null, hasCompleted: !!quizData });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== MONA SCORE ROUTES ====================

app.get("/make-server-6378cc81/mona-score/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    if (!userToken) return c.json({ error: "Token d'authentification manquant" }, 401);
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) return c.json({ error: "Token invalide ou expiré. Veuillez vous reconnecter." }, 401);
    if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé." }, 403);
    const scoreData = await kv.get(`mona_score:${userId}`);
    if (!scoreData) {
      const initialScore = { userId, currentScore: null, previousScore: null, trend: "stable", lastUpdate: new Date().toISOString(), weeklyAssessments: 0, expertFeedback: 0, history: [], isInitial: true, hasNeverBeenAssessed: true };
      await kv.set(`mona_score:${userId}`, initialScore);
      return c.json({ success: true, data: initialScore });
    }
    return c.json({ success: true, data: scoreData });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/mona-score/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");
    if (!userToken && !expertId) return c.json({ error: "Non autorisé" }, 401);
    if (userToken) {
      const sessionResult = await memberAuth.getMemberSession(userToken);
      if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
      if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    }
    const { assessmentType, scoreValue, notes } = await c.req.json();
    if (!assessmentType || typeof scoreValue !== "number") return c.json({ error: "Type d'évaluation et score requis" }, 400);
    if (scoreValue < 0 || scoreValue > 100) return c.json({ error: "Le score doit être entre 0 et 100" }, 400);
    const currentData = await kv.get(`mona_score:${userId}`) || { userId, currentScore: null, previousScore: null, trend: "stable", lastUpdate: new Date().toISOString(), weeklyAssessments: 0, expertFeedback: 0, history: [], isInitial: true, hasNeverBeenAssessed: true };
    let previousScore = currentData.currentScore;
    let newScore;
    if (assessmentType === "onboarding" || currentData.hasNeverBeenAssessed || currentData.currentScore === null) { newScore = scoreValue; previousScore = scoreValue; }
    else { newScore = Math.round((currentData.currentScore + scoreValue) / 2); }
    let trend = "stable";
    if (currentData.currentScore !== null) {
      if (newScore > currentData.currentScore + 5) trend = "up";
      else if (newScore < currentData.currentScore - 5) trend = "down";
    }
    const updatedScore = { ...currentData, currentScore: newScore, previousScore, trend, lastUpdate: new Date().toISOString(), lastAssessmentDate: new Date().toISOString(), weeklyAssessments: assessmentType === "self" ? currentData.weeklyAssessments + 1 : currentData.weeklyAssessments, expertFeedback: assessmentType === "expert" ? currentData.expertFeedback + 1 : currentData.expertFeedback, history: [...(currentData.history || []), { date: new Date().toISOString(), score: scoreValue, type: assessmentType, notes: notes || "", addedBy: expertId || userId }], isInitial: false, hasNeverBeenAssessed: false };
    await kv.set(`mona_score:${userId}`, updatedScore);
    return c.json({ success: true, data: updatedScore });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/mona-score/:userId/history", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    const expertId = c.req.header("X-Expert-Id");
    if (!userToken && !expertId) return c.json({ error: "Non autorisé" }, 401);
    if (userToken) {
      const sessionResult = await memberAuth.getMemberSession(userToken);
      if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
      if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    }
    const scoreData = await kv.get(`mona_score:${userId}`);
    if (!scoreData) return c.json({ success: true, data: { history: [], totalAssessments: 0 } });
    return c.json({ success: true, data: { history: scoreData.history || [], totalAssessments: (scoreData.history || []).length, currentScore: scoreData.currentScore, trend: scoreData.trend } });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/mona-score/:userId/can-retake", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    if (!userToken) return c.json({ error: "Non autorisé" }, 401);
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
    if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    const scoreData = await kv.get(`mona_score:${userId}`);
    if (!scoreData || scoreData.hasNeverBeenAssessed || scoreData.currentScore === null) return c.json({ success: true, canRetake: true, reason: "first_assessment", message: "Vous pouvez faire votre première évaluation" });
    const memberData = await kv.get(`member:${userId}`);
    const subscriptionType = memberData?.subscriptionType || "free";
    const lastAssessmentDate = new Date(scoreData.lastAssessmentDate || scoreData.lastUpdate);
    const hoursSinceLastTest = (new Date().getTime() - lastAssessmentDate.getTime()) / (1000 * 60 * 60);
    const limit = subscriptionType === "free" ? 720 : 24;
    const canRetake = hoursSinceLastTest >= limit;
    const hoursRemaining = Math.ceil(limit - hoursSinceLastTest);
    return c.json({ success: true, canRetake, reason: canRetake ? `${subscriptionType}_limit_ok` : `${subscriptionType === "free" ? "monthly" : "daily"}_limit_reached`, message: canRetake ? "Vous pouvez refaire le test" : `Vous pourrez refaire le test dans ${subscriptionType === "free" ? Math.ceil(hoursRemaining / 24) + " jour(s)" : hoursRemaining + " heure(s)"}`, subscriptionType, lastAssessmentDate: scoreData.lastAssessmentDate || scoreData.lastUpdate, nextAvailableDate: canRetake ? null : new Date(lastAssessmentDate.getTime() + limit * 60 * 60 * 1000).toISOString() });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/mona-score/:userId/reset", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userToken = c.req.header("X-User-Token");
    if (!userToken) return c.json({ error: "Non autorisé" }, 401);
    const sessionResult = await memberAuth.getMemberSession(userToken);
    if (sessionResult.error) return c.json({ error: "Token invalide" }, 401);
    if (sessionResult.data.user.id !== userId) return c.json({ error: "Non autorisé" }, 403);
    await kv.set(`mona_score:${userId}`, { userId, currentScore: null, previousScore: null, trend: "stable", lastUpdate: new Date().toISOString(), weeklyAssessments: 0, expertFeedback: 0, history: [], isInitial: true, hasNeverBeenAssessed: true });
    return c.json({ success: true, message: "Score réinitialisé avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== TEMPLATES ROUTES ====================

app.get("/make-server-6378cc81/expert/templates", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    return c.json({ success: true, data: await templates.getExpertTemplates(expertId) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/templates/type/:type", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    return c.json({ success: true, data: await templates.getTemplatesByType(expertId, c.req.param("type")) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/templates/favorites", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    return c.json({ success: true, data: await templates.getFavoriteTemplates(expertId) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.get("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    const template = await templates.getTemplate(expertId, c.req.param("id"));
    if (!template) return c.json({ error: "Template introuvable" }, 404);
    return c.json({ success: true, data: template });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/templates", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    return c.json({ success: true, message: "Template créé avec succès", data: await templates.createTemplate(expertId, await c.req.json()) });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.put("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    const updated = await templates.updateTemplate(expertId, c.req.param("id"), await c.req.json());
    if (!updated) return c.json({ error: "Template introuvable" }, 404);
    return c.json({ success: true, message: "Template mis à jour avec succès", data: updated });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.delete("/make-server-6378cc81/expert/templates/:id", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    const deleted = await templates.deleteTemplate(expertId, c.req.param("id"));
    if (!deleted) return c.json({ error: "Template introuvable ou impossible à supprimer" }, 400);
    return c.json({ success: true, message: "Template supprimé avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/templates/:id/favorite", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    const updated = await templates.toggleTemplateFavorite(expertId, c.req.param("id"));
    if (!updated) return c.json({ error: "Template introuvable" }, 404);
    return c.json({ success: true, message: updated.isFavorite ? "Template ajouté aux favoris" : "Template retiré des favoris", data: updated });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/templates/:id/usage", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    await templates.incrementTemplateUsage(expertId, c.req.param("id"));
    return c.json({ success: true, message: "Utilisation enregistrée" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/templates/initialize", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    await templates.initializeExpertTemplates(expertId);
    return c.json({ success: true, message: "Templates initialisés avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

app.post("/make-server-6378cc81/expert/templates/reset", async (c) => {
  try {
    const expertId = c.req.header("X-Expert-Id");
    if (!expertId) return c.json({ error: "Expert ID manquant" }, 401);
    await kv.del(`templates_initialized:${expertId}`);
    const templateIds = await kv.get(`expert_templates:${expertId}`);
    if (templateIds && Array.isArray(templateIds)) {
      await Promise.all(templateIds.map((id: string) => kv.del(`template:${expertId}:${id}`)));
    }
    await kv.del(`expert_templates:${expertId}`);
    await templates.initializeExpertTemplates(expertId);
    return c.json({ success: true, message: "Templates réinitialisés avec succès" });
  } catch (error) {
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
});

// ==================== REGISTER ROUTES ====================

registerWalletRoutes(app);
registerSubscriptionRoutes(app);

app.route("/make-server-6378cc81/consultations", consultationRoutes);
app.route("/make-server-6378cc81/rh", rhRoutes);
app.route("/make-server-6378cc81/entreprises", entrepriseRoutes);
app.route("/make-server-6378cc81/company", companyRoutes);
app.route("/make-server-6378cc81/expert/documents", expertDocuments);
app.route("/make-server-6378cc81/expert/availability", expertAvailability);
app.route("/make-server-6378cc81/expert/patients", expertPatients);
app.route("/make-server-6378cc81/chat", chatRoutes);
app.route("/make-server-6378cc81/payment/stripe", paymentStripe);
app.route("/make-server-6378cc81/payment/wave", paymentWave);
app.route("/make-server-6378cc81/payment/orange", paymentOrange);
app.route("/make-server-6378cc81/invoices", invoiceGenerator);
app.route("/make-server-6378cc81/webhooks", calWebhook);

// ✅ Routes de booking (disponibilités + réservations + Daily.co)
app.route("/make-server-6378cc81/booking", bookingRoutes);

Deno.serve(app.fetch);
