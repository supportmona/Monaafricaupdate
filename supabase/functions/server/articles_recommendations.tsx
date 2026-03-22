import * as kv from "./kv_store.tsx";
import * as memberAuth from "./member_auth.tsx";
import { Context } from "npm:hono";

/**
 * Base de données des articles de la bibliothèque M.O.N.A
 */
const bibliothequeArticles = [
  {
    id: "comprendre-anxiete",
    category: "articles",
    title: "Comprendre l'anxiété : guide complet",
    description: "Un guide approfondi pour comprendre les mécanismes de l'anxiété et les stratégies pour la gérer au quotidien.",
    duration: "15 min de lecture",
    image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
    tags: ["Anxiété", "Gestion du stress", "Bien-être"],
    author: "M.O.N.A",
    featured: true,
    isFree: true,
    downloadable: true,
    type: "Gratuit"
  },
  {
    id: "meditation-debutants",
    category: "videos",
    title: "Méditation guidée pour débutants",
    description: "Initiez-vous à la méditation avec cette session guidée de 10 minutes, parfaite pour les débutants.",
    duration: "10 min",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
    tags: ["Méditation", "Relaxation", "Mindfulness"],
    author: "M.O.N.A",
    featured: true,
    isFree: true,
    downloadable: false,
    type: "Gratuit"
  },
  {
    id: "equilibre-vie-pro-perso",
    category: "podcasts",
    title: "Équilibre vie pro/perso : trouver son harmonie",
    description: "Discussion avec des experts sur les stratégies pour maintenir un équilibre sain entre travail et vie personnelle.",
    duration: "35 min",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
    tags: ["Work-life balance", "Burnout", "Productivité"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false,
    type: "Membres"
  },
  {
    id: "sommeil-sante-mentale",
    category: "articles",
    title: "Les bienfaits du sommeil sur la santé mentale",
    description: "Découvrez comment un sommeil de qualité peut transformer votre bien-être mental et émotionnel.",
    duration: "8 min de lecture",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
    tags: ["Sommeil", "Santé mentale", "Routines"],
    author: "M.O.N.A",
    featured: false,
    isFree: true,
    downloadable: true,
    type: "Gratuit"
  },
  {
    id: "respiration-anti-stress",
    category: "videos",
    title: "Exercices de respiration anti-stress",
    description: "Apprenez 5 techniques de respiration simples et efficaces pour réduire le stress instantanément.",
    duration: "7 min",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800",
    tags: ["Respiration", "Stress", "Techniques"],
    author: "M.O.N.A",
    featured: false,
    isFree: true,
    downloadable: false,
    type: "Gratuit"
  },
  {
    id: "gestion-emotions",
    category: "articles",
    title: "Gérer ses émotions au quotidien",
    description: "Techniques pratiques pour identifier, comprendre et gérer vos émotions de manière saine.",
    duration: "12 min de lecture",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    tags: ["Émotions", "Intelligence émotionnelle", "Psychologie"],
    author: "M.O.N.A",
    featured: true,
    isFree: false,
    downloadable: true,
    type: "Membres"
  },
  {
    id: "burnout-prevention",
    category: "articles",
    title: "Prévenir le burn-out : signaux et solutions",
    description: "Reconnaissez les signes avant-coureurs du burn-out et découvrez des stratégies de prévention efficaces.",
    duration: "10 min de lecture",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800",
    tags: ["Burn-out", "Travail", "Prévention", "Stress"],
    author: "M.O.N.A",
    featured: false,
    isFree: true,
    downloadable: true,
    type: "Gratuit"
  },
  {
    id: "pleine-conscience",
    category: "videos",
    title: "Introduction à la pleine conscience",
    description: "Découvrez les principes de la mindfulness et comment l'intégrer dans votre vie quotidienne.",
    duration: "15 min",
    image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800",
    tags: ["Mindfulness", "Méditation", "Conscience"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false,
    type: "Membres"
  },
  {
    id: "alimentation-mental",
    category: "articles",
    title: "L'impact de l'alimentation sur la santé mentale",
    description: "Explorez le lien entre nutrition et bien-être psychologique, avec des conseils pratiques.",
    duration: "11 min de lecture",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
    tags: ["Nutrition", "Santé mentale", "Bien-être"],
    author: "M.O.N.A",
    featured: false,
    isFree: true,
    downloadable: true,
    type: "Gratuit"
  },
  {
    id: "confiance-en-soi",
    category: "podcasts",
    title: "Cultiver la confiance en soi",
    description: "Entretien avec des psychologues sur les techniques pour développer une confiance durable.",
    duration: "28 min",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    tags: ["Confiance", "Estime de soi", "Développement personnel"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false,
    type: "Membres"
  }
];

/**
 * Récupérer les articles recommandés pour un membre
 */
export async function getArticleRecommendations(c: Context) {
  try {
    console.log("🎯 Route /member/articles/recommendations appelée");
    
    // Essayer d'abord le header personnalisé X-User-Token (nouveau)
    let accessToken = c.req.header("X-User-Token");
    
    // Fallback sur Authorization header (ancien) pour compatibilité
    if (!accessToken) {
      const authHeader = c.req.header("Authorization");
      accessToken = authHeader?.split(" ")[1];
    }

    if (!accessToken) {
      console.log("❌ Token manquant");
      return c.json({ error: "Token d'authentification manquant" }, 401);
    }

    const sessionResult = await memberAuth.getMemberSession(accessToken);
    if (sessionResult.error) {
      console.log("❌ Session invalide:", sessionResult.error);
      return c.json({ error: sessionResult.error }, 401);
    }

    const userId = sessionResult.data.user.id;
    console.log("✅ Utilisateur authentifié:", userId);
    
    // Récupérer le profil du membre
    const profile = await kv.get(`member:${userId}`) || {};
    console.log("📋 Profil chargé:", profile);
    
    // Récupérer l'historique des consultations
    const consultationsKey = `appointments:user:${userId}`;
    const consultations = await kv.get(consultationsKey) || [];
    console.log("📅 Consultations:", consultations.length);
    
    // Générer 2-3 recommandations d'articles personnalisées
    const recommendations = generateArticleRecommendations(profile, consultations);

    console.log(`✅ ${recommendations.length} articles recommandés pour membre ${userId}`);

    return c.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("❌ Erreur récupération recommandations articles:", error);
    return c.json({ error: `Erreur serveur: ${error.message}` }, 500);
  }
}

/**
 * Générer des recommandations d'articles personnalisées
 */
function generateArticleRecommendations(profile: any, consultations: any[]) {
  const memberPlan = profile.plan || "free";
  const hasConsultations = consultations.length > 0;
  
  // Scorer chaque article
  const scoredArticles = bibliothequeArticles.map(article => {
    let score = 0;
    
    // Boost pour les articles gratuits si membre free
    if (memberPlan === "free" && article.isFree) {
      score += 3;
    }
    
    // Boost pour les articles membres si cercle-mona
    if (memberPlan === "cercle-mona" && !article.isFree) {
      score += 3;
    }
    
    // Boost pour les articles à la une
    if (article.featured) {
      score += 2;
    }
    
    // Boost basé sur les centres d'intérêt du profil
    if (profile.interests && Array.isArray(profile.interests)) {
      const hasMatchingTag = article.tags.some(tag => 
        profile.interests.some((interest: string) => 
          interest.toLowerCase().includes(tag.toLowerCase()) ||
          tag.toLowerCase().includes(interest.toLowerCase())
        )
      );
      if (hasMatchingTag) {
        score += 5;
      }
    }
    
    // Si le membre a des consultations, privilégier les contenus pratiques
    if (hasConsultations) {
      const practicalTags = ["Techniques", "Exercices", "Guide", "Pratique"];
      const isPractical = article.tags.some(tag => 
        practicalTags.some(pt => tag.toLowerCase().includes(pt.toLowerCase()))
      );
      if (isPractical) {
        score += 2;
      }
    }
    
    // Privilégier les articles courts pour un premier engagement
    if (consultations.length === 0 && article.duration.includes("min de lecture")) {
      const minutes = parseInt(article.duration);
      if (minutes <= 10) {
        score += 2;
      }
    }
    
    // Ajouter un peu d'aléatoire pour varier
    score += Math.random() * 1.5;
    
    return { ...article, score };
  });
  
  // Trier par score et prendre les 3 meilleurs
  const topArticles = scoredArticles
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, ...article }) => article); // Retirer le score de la réponse
  
  return topArticles;
}