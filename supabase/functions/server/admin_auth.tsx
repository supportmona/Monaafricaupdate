import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

/**
 * Créer un compte admin
 * Uniquement pour contact@monafrica.net et support@monafrica.net
 */
export async function createAdminAccount(
  email: string,
  password: string,
  metadata: { name: string; role: string }
) {
  try {
    // Vérifier que c'est un email @monafrica.net autorisé
    const allowedEmails = ["contact@monafrica.net", "support@monafrica.net"];
    if (!allowedEmails.includes(email)) {
      return {
        error: "Seuls contact@monafrica.net et support@monafrica.net sont autorisés",
        data: null,
      };
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Créer l'utilisateur admin
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirmer l'email
      user_metadata: {
        ...metadata,
        accountType: "admin",
        createdAt: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("❌ Erreur création admin:", error);
      return { error: error.message, data: null };
    }

    console.log("✅ Compte admin créé:", email);
    return { error: null, data };
  } catch (error) {
    console.error("❌ Erreur dans createAdminAccount:", error);
    return { error: error.message, data: null };
  }
}

/**
 * Connexion admin
 */
export async function loginAdmin(email: string, password: string, code2FA?: string) {
  try {
    console.log(`🔐 Tentative de connexion admin pour: ${email}`);
    
    // COMPTES DE TEST POUR DÉVELOPPEMENT
    const TEST_ADMIN_ACCOUNTS = [
      {
        email: "admin@monafrica.net",
        password: "MonaAdmin2024!",
        twoFactorCode: "202601",
        user: {
          id: "admin-001",
          email: "admin@monafrica.net",
          role: "authenticated",
          aud: "authenticated",
          user_metadata: {
            accountType: "admin",
            name: "Administrateur Principal",
            role: "super_admin",
            twoFactorEnabled: true,
            createdAt: new Date("2024-01-01").toISOString()
          }
        },
        session: {
          access_token: `admin_test_token_001_${Date.now()}`,
          refresh_token: "admin_test_refresh_001",
          expires_in: 3600,
          token_type: "bearer"
        }
      }
    ];

    // Vérifier les comptes de test d'abord
    const testAccount = TEST_ADMIN_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (testAccount) {
      // Si le compte a 2FA activé
      if (testAccount.user.user_metadata.twoFactorEnabled) {
        // Si aucun code 2FA fourni, demander le code
        if (!code2FA) {
          console.log("⚠️ Code 2FA requis pour:", email);
          return {
            data: null,
            error: "2FA_REQUIRED"
          };
        }
        
        // Vérifier le code 2FA
        if (code2FA !== testAccount.twoFactorCode) {
          console.error("❌ Code 2FA incorrect pour:", email);
          return {
            data: null,
            error: "Code de vérification incorrect"
          };
        }
      }
      
      console.log("✅ Connexion réussie avec compte admin de test:", email);
      return {
        data: {
          user: testAccount.user,
          session: testAccount.session
        },
        error: null
      };
    }

    // Vérifier que c'est un email @monafrica.net
    if (!email.endsWith("@monafrica.net")) {
      return {
        error: "Seuls les emails @monafrica.net sont autorisés",
        data: null,
      };
    }

    // Si pas de compte de test, retourner une erreur claire
    console.error("❌ Email ou mot de passe incorrect");
    return { 
      error: "Email ou mot de passe incorrect", 
      data: null 
    };
  } catch (error) {
    console.error("❌ Erreur dans loginAdmin:", error);
    return { error: error.message, data: null };
  }
}

/**
 * Déconnexion admin
 */
export async function logoutAdmin(accessToken: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Erreur logout admin:", error);
      return { error: error.message };
    }

    console.log("✅ Admin déconnecté");
    return { error: null };
  } catch (error) {
    console.error("❌ Erreur dans logoutAdmin:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer la session admin
 */
export async function getAdminSession(accessToken: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      console.error("❌ Erreur récupération session admin:", error);
      return { error: error.message, data: null };
    }

    // Vérifier que c'est bien un compte admin
    const accountType = data.user?.user_metadata?.accountType;
    if (accountType !== "admin") {
      return {
        error: "Session invalide : compte non-administrateur",
        data: null,
      };
    }

    return { error: null, data };
  } catch (error) {
    console.error("❌ Erreur dans getAdminSession:", error);
    return { error: error.message, data: null };
  }
}

/**
 * Vérifier si au moins un compte admin existe
 */
export async function hasAdminAccount() {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Lister les utilisateurs (limité aux 1000 premiers)
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("❌ Erreur vérification admin:", error);
      return { exists: false, error: error.message };
    }

    // Chercher un utilisateur avec accountType: admin
    const adminExists = data.users.some(
      (user) => user.user_metadata?.accountType === "admin"
    );

    return { exists: adminExists, error: null };
  } catch (error) {
    console.error("❌ Erreur dans hasAdminAccount:", error);
    return { exists: false, error: error.message };
  }
}