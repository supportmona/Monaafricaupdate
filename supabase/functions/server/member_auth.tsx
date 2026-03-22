import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import { supabase as db } from "./db.tsx";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

/**
 * Générer un JWT de test simple (non sécurisé, pour prototype uniquement)
 */
function generateTestJWT(userId: string, email: string, name: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT"
  };
  
  const payload = {
    sub: userId,
    email: email,
    user_metadata: {
      name: name,
      role: "member"
    },
    role: "authenticated",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };
  
  // Encoder en base64url
  const base64UrlEncode = (obj: any) => {
    const str = JSON.stringify(obj);
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };
  
  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = "test_signature";
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Décoder un JWT sans vérification (pour le prototype uniquement)
 */
function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    // Décoder la partie payload (partie 2)
    const payload = parts[1];
    // Ajouter padding si nécessaire
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("❌ Erreur décodage JWT:", error);
    return null;
  }
}

/**
 * Crée un nouveau compte membre
 */
export async function signupMember(
  email: string,
  password: string,
  memberData: {
    name: string;
  }
) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    console.log("📝 Création membre:", { email, name: memberData.name });

    // ✅ ÉTAPE 1 : Vérifier dans Auth ET SQL pour détecter les orphelins
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const authUser = users?.find(u => u.email === email);
    
    const { data: sqlUser } = await db
      .from('users')
      .select('id, email, name')
      .eq('email', email)
      .single();

    // 🧹 NETTOYAGE AUTOMATIQUE si nécessaire
    if (authUser || sqlUser) {
      console.log("⚠️ Utilisateur détecté:", { 
        auth: !!authUser, 
        sql: !!sqlUser,
        authId: authUser?.id,
        sqlId: sqlUser?.id 
      });

      // Cas 1 : Existe dans Auth ET SQL avec le même ID → Vraiment existant
      if (authUser && sqlUser && authUser.id === sqlUser.id) {
        console.log("❌ Compte complet existe déjà");
        return {
          error: "Un compte existe déjà avec cette adresse email",
          code: "email_exists"
        };
      }

      // Cas 2 : Orphelin détecté (Auth sans SQL, ou IDs différents) → Nettoyer
      console.log("🧹 Compte orphelin détecté, nettoyage automatique...");
      
      if (authUser) {
        console.log("🗑️ Suppression de Auth:", authUser.id);
        await supabase.auth.admin.deleteUser(authUser.id);
        await kv.del(`member:${authUser.id}`);
      }
      
      if (sqlUser) {
        console.log("🗑️ Suppression de SQL:", sqlUser.id);
        await db.from('users').delete().eq('id', sqlUser.id);
      }
      
      console.log("✅ Nettoyage terminé, création du nouveau compte...");
    }

    // ✅ ÉTAPE 2 : Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name: memberData.name,
        role: "member",
      },
      email_confirm: true, // Auto-confirm l'email car pas de serveur email configuré
    });

    if (authError) {
      console.error("❌ Erreur création membre dans Auth:", authError);
      return { error: authError.message };
    }

    if (!authData.user) {
      return { error: "Erreur lors de la création du compte" };
    }

    console.log("✅ Utilisateur créé dans Auth:", authData.user.id);

    // ✨ ÉTAPE 3 : Créer le profil membre dans la table SQL users
    const { data: userRecord, error: dbError } = await db
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: memberData.name,
        membership_type: 'free',
        status: 'active',
        profile_completed: false,
        last_activity: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error("❌ Erreur création profil SQL:", dbError);
      // Si la création SQL échoue, on supprime l'utilisateur Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return { error: "Erreur lors de la création du profil utilisateur" };
    }

    console.log("✅ Profil membre créé dans table SQL users");

    // Garder aussi dans KV Store pour compatibilité (temporaire)
    const memberProfile = {
      id: authData.user.id,
      email,
      name: memberData.name,
      role: "member",
      plan: "free",
      memberSince: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`member:${authData.user.id}`, memberProfile);
    console.log("✅ Profil membre créé dans KV store (compatibilité)");

    // ✅ ÉTAPE 4 : Se connecter automatiquement après la création pour obtenir une session
    console.log("🔐 Connexion automatique après création du compte...");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: loginData, error: loginError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData.session) {
      console.error("❌ Erreur connexion automatique:", loginError);
      // L'utilisateur est créé mais pas connecté automatiquement
      // On retourne quand même un succès partiel
      return {
        data: {
          user: authData.user,
          session: null,
          profile: memberProfile,
          sqlRecord: userRecord,
          warning: "Compte créé mais connexion automatique échouée"
        },
      };
    }

    console.log("✅ Connexion automatique réussie");

    return {
      data: {
        user: loginData.user,
        session: loginData.session,
        profile: memberProfile,
        sqlRecord: userRecord,
      },
    };
  } catch (error) {
    console.error("❌ Erreur inattendue signup membre:", error);
    return { error: `Erreur serveur: ${error.message}` };
  }
}

/**
 * Connexion d'un membre
 */
export async function loginMember(email: string, password: string) {
  try {
    console.log("🔐 Tentative connexion membre:", email);
    
    // Nettoyer les espaces
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Comptes de test hardcodés pour le développement
    const TEST_MEMBER_ACCOUNTS = [
      {
        email: "amara.diallo@gmail.com",
        password: "Test1234!",
        user: {
          id: "member-demo-001",
          email: "amara.diallo@gmail.com",
          user_metadata: {
            name: "Amara Diallo",
            role: "member"
          }
        },
        profile: {
          id: "member-demo-001",
          email: "amara.diallo@gmail.com",
          name: "Amara Diallo",
          role: "member",
          plan: "cercle-mona",
          memberSince: new Date("2025-01-15").toISOString(),
          createdAt: new Date("2025-01-15").toISOString(),
          updatedAt: new Date().toISOString(),
          avatar: "",
          monaScore: 78,
          totalConsultations: 8
        }
      },
      {
        email: "test.mona@gmail.com",
        password: "Test1234!",
        user: {
          id: "member-demo-002",
          email: "test.mona@gmail.com",
          user_metadata: {
            name: "Compte Test",
            role: "member"
          }
        },
        profile: {
          id: "member-demo-002",
          email: "test.mona@gmail.com",
          name: "Compte Test",
          role: "member",
          plan: "free",
          memberSince: new Date("2025-02-01").toISOString(),
          createdAt: new Date("2025-02-01").toISOString(),
          updatedAt: new Date().toISOString(),
          avatar: "",
          monaScore: 65,
          totalConsultations: 0
        }
      }
    ];

    // Vérifier les comptes de test d'abord
    const testAccount = TEST_MEMBER_ACCOUNTS.find(
      acc => acc.email === cleanEmail && acc.password === cleanPassword
    );

    if (testAccount) {
      console.log("✅ Connexion réussie avec compte de test:", cleanEmail);
      
      // Stocker le profil dans KV pour cohérence
      await kv.set(`member:${testAccount.user.id}`, testAccount.profile);
      
      // Générer un JWT de test valide
      const testJWT = generateTestJWT(
        testAccount.user.id,
        testAccount.user.email,
        testAccount.profile.name
      );
      
      return {
        data: {
          user: testAccount.user,
          session: {
            access_token: testJWT,
            refresh_token: `test_refresh_${testAccount.user.id}`,
            expires_in: 86400, // 24 heures
            token_type: "bearer"
          },
          profile: testAccount.profile
        },
        error: null
      };
    }

    // Si pas de compte de test, essayer l'authentification Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPassword,
    });

    if (authError) {
      console.error("❌ Erreur connexion membre:", authError);
      console.log("📋 Comptes de test disponibles:");
      TEST_MEMBER_ACCOUNTS.forEach(acc => {
        console.log(`   - ${acc.email} / ${acc.password}`);
      });
      return { error: "Email ou mot de passe incorrect" };
    }

    if (!authData.user || !authData.session) {
      return { error: "Email ou mot de passe incorrect" };
    }

    console.log("✅ Membre connecté:", authData.user.id);
    console.log("🎫 Session access_token:", authData.session.access_token ? `${authData.session.access_token.substring(0, 20)}...` : "AUCUN");
    console.log("🔍 Token est un JWT?", authData.session.access_token && authData.session.access_token.split('.').length === 3);

    // Récupérer le profil membre
    const profile = await kv.get(`member:${authData.user.id}`);

    return {
      data: {
        user: authData.user,
        session: authData.session,
        profile: profile || {
          id: authData.user.id,
          email: authData.user.email,
          name: authData.user.user_metadata?.name || "",
          role: "member",
          plan: "free",
        },
      },
    };
  } catch (error) {
    console.error("❌ Erreur inattendue login membre:", error);
    return { error: `Erreur serveur: ${error.message}` };
  }
}

/**
 * Déconnexion d'un membre
 */
export async function logoutMember(accessToken: string) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Erreur déconnexion membre:", error);
      return { error: error.message };
    }

    console.log("✅ Membre déconnecté");
    return { data: { message: "Déconnexion réussie" } };
  } catch (error) {
    console.error("❌ Erreur inattendue logout membre:", error);
    return { error: `Erreur serveur: ${error.message}` };
  }
}

/**
 * Récupérer la session membre
 */
export async function getMemberSession(accessToken: string) {
  try {
    console.log("🔍 NOUVELLE MÉTHODE: Décodage direct du JWT");
    console.log("🔍 Token longueur:", accessToken?.length);
    
    // Décoder le JWT pour extraire l'userId
    const decoded = decodeJWT(accessToken);
    
    if (!decoded || !decoded.sub) {
      console.error("❌ JWT invalide ou mal formé");
      return { error: "Token invalide" };
    }
    
    const userId = decoded.sub;
    console.log("✅ JWT décodé, userId:", userId);
    console.log("✅ JWT exp:", decoded.exp ? new Date(decoded.exp * 1000).toISOString() : "NON DÉFINI");
    
    // Vérifier l'expiration
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      console.error("❌ Token expiré");
      return { error: "Session expirée" };
    }
    
    // Récupérer le profil depuis le KV store
    const profile = await kv.get(`member:${userId}`);
    console.log("📋 Profil récupéré:", profile ? "OUI" : "NON");
    
    if (!profile) {
      console.log("⚠️ Profil non trouvé dans KV, création profil minimal");
      // Créer un profil minimal
      const minimalProfile = {
        id: userId,
        email: decoded.email || "",
        name: decoded.user_metadata?.name || "",
        role: "member",
        plan: "free",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await kv.set(`member:${userId}`, minimalProfile);
      
      return {
        data: {
          user: {
            id: userId,
            email: decoded.email,
            user_metadata: decoded.user_metadata || {},
          },
          profile: minimalProfile,
        },
      };
    }

    return {
      data: {
        user: {
          id: userId,
          email: decoded.email || profile.email,
          user_metadata: decoded.user_metadata || {},
        },
        profile,
      },
    };
  } catch (error) {
    console.error("❌ Exception dans getMemberSession:", error);
    return { error: `Erreur serveur: ${error.message}` };
  }
}