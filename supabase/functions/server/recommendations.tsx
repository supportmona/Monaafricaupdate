import * as kv from "./kv_store.tsx";
import * as memberAuth from "./member_auth.tsx";
import { Context } from "npm:hono";

/**
 * Récupérer les recommandations personnalisées pour un membre
 */
export async function getMemberRecommendations(c: Context) {
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
    
    // Récupérer le profil du membre
    const profile = await kv.get(`member:${userId}`) || {};
    
    // Récupérer l'historique des consultations
    const consultationsKey = `appointments:user:${userId}`;
    const consultations = await kv.get(consultationsKey) || [];
    
    // Générer des recommandations personnalisées basées sur le profil et l'historique
    const recommendations = generateRecommendations(profile, consultations);

    console.log(`✅ ${recommendations.length} recommandations générées pour membre ${userId}`);

    return c.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("❌ Erreur récupération recommandations:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
}

/**
 * Générer des recommandations personnalisées
 */
function generateRecommendations(profile: any, consultations: any[]) {
  const recommendations = [];
  
  // Base de données de recommandations possibles
  const allRecommendations = [
    {
      id: "breathing-exercise",
      title: "Exercice de respiration guidée",
      description: "10 minutes pour réduire le stress",
      duration: "10 min",
      type: "Gratuit",
      icon: "Heart",
      color: "terracotta",
      category: "relaxation",
      tags: ["stress", "anxiété", "relaxation"],
    },
    {
      id: "nutrition-consultation",
      title: "Consultation avec un nutritionniste",
      description: "Équilibrer votre bien-être physique",
      duration: "30 min",
      type: "Membres",
      icon: "Target",
      color: "gold",
      category: "consultation",
      tags: ["nutrition", "santé physique"],
    },
    {
      id: "evening-meditation",
      title: "Méditation du soir",
      description: "Améliorer la qualité de votre sommeil",
      duration: "15 min",
      type: "Gratuit",
      icon: "Activity",
      color: "terracotta",
      category: "meditation",
      tags: ["sommeil", "relaxation", "méditation"],
    },
    {
      id: "stress-management",
      title: "Gestion du stress au travail",
      description: "Techniques pratiques pour le quotidien",
      duration: "20 min",
      type: "Gratuit",
      icon: "Zap",
      color: "terracotta",
      category: "workshop",
      tags: ["stress", "travail", "productivité"],
    },
    {
      id: "mindfulness-practice",
      title: "Pratique de pleine conscience",
      description: "Développer votre attention au moment présent",
      duration: "25 min",
      type: "Membres",
      icon: "Heart",
      color: "gold",
      category: "meditation",
      tags: ["mindfulness", "méditation", "conscience"],
    },
    {
      id: "sleep-hygiene",
      title: "Guide d'hygiène du sommeil",
      description: "Optimiser vos nuits pour mieux vivre vos journées",
      duration: "12 min",
      type: "Gratuit",
      icon: "BookOpen",
      color: "terracotta",
      category: "education",
      tags: ["sommeil", "santé", "bien-être"],
    },
    {
      id: "anxiety-management",
      title: "Gérer l'anxiété au quotidien",
      description: "Outils concrets pour apaiser votre esprit",
      duration: "18 min",
      type: "Gratuit",
      icon: "Activity",
      color: "terracotta",
      category: "workshop",
      tags: ["anxiété", "stress", "mental"],
    },
    {
      id: "therapist-consultation",
      title: "Consultation avec un psychologue",
      description: "Accompagnement personnalisé par un expert",
      duration: "45 min",
      type: "Membres",
      icon: "MessageCircle",
      color: "gold",
      category: "consultation",
      tags: ["thérapie", "psychologie", "accompagnement"],
    },
    {
      id: "burnout-prevention",
      title: "Prévention du burn-out",
      description: "Reconnaître les signes et agir à temps",
      duration: "22 min",
      type: "Membres",
      icon: "Zap",
      color: "gold",
      category: "education",
      tags: ["burn-out", "travail", "prévention"],
    },
    {
      id: "emotional-intelligence",
      title: "Développer son intelligence émotionnelle",
      description: "Mieux comprendre et gérer vos émotions",
      duration: "30 min",
      type: "Membres",
      icon: "Heart",
      color: "gold",
      category: "education",
      tags: ["émotions", "intelligence", "développement"],
    },
  ];

  // Logique de personnalisation basée sur le profil
  const memberPlan = profile.plan || "free";
  const hasConsultations = consultations.length > 0;
  const recentConsultation = consultations[0];
  
  // Si le membre a des consultations, analyser le type
  let preferredCategories = ["relaxation", "meditation", "education"];
  
  if (hasConsultations) {
    // Ajouter des consultations supplémentaires si déjà engagé
    preferredCategories.push("consultation");
  }
  
  // Prioriser le contenu gratuit pour les membres free
  if (memberPlan === "free") {
    preferredCategories = ["relaxation", "education", "workshop"];
  }
  
  // Filtrer et scorer les recommandations
  const scoredRecommendations = allRecommendations.map(rec => {
    let score = 0;
    
    // Boost si la catégorie correspond aux préférences
    if (preferredCategories.includes(rec.category)) {
      score += 3;
    }
    
    // Boost pour le contenu approprié au plan
    if (memberPlan === "cercle-mona" && rec.type === "Membres") {
      score += 2;
    } else if (memberPlan === "free" && rec.type === "Gratuit") {
      score += 2;
    }
    
    // Boost basé sur les centres d'intérêt du profil
    if (profile.interests && Array.isArray(profile.interests)) {
      const hasMatchingTag = rec.tags.some(tag => 
        profile.interests.some((interest: string) => 
          interest.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (hasMatchingTag) {
        score += 4;
      }
    }
    
    // Ajouter un peu d'aléatoire pour varier
    score += Math.random() * 2;
    
    return { ...rec, score };
  });
  
  // Trier par score et prendre les 6 meilleurs
  const topRecommendations = scoredRecommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map(({ score, ...rec }) => rec); // Retirer le score de la réponse
  
  return topRecommendations;
}
