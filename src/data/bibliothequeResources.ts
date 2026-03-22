// Données partagées de la bibliothèque M.O.N.A
// Utilisées à la fois sur le site public (/bibliotheque) et dans l'espace membre (/member/resources)

export interface BibliothequeResource {
  id: string;
  category: "articles" | "videos" | "podcasts";
  title: string;
  description: string;
  duration: string;
  image: string;
  tags: string[];
  author: string;
  featured: boolean;
  isFree: boolean;
  downloadable: boolean;
}

export const bibliothequeResources: BibliothequeResource[] = [
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
    downloadable: true
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
    downloadable: false
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
    downloadable: false
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
    downloadable: true
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
    isFree: false,
    downloadable: false
  },
  {
    id: "parentalite-consciente",
    category: "podcasts",
    title: "Parentalité consciente et bien-être",
    description: "Comment élever ses enfants tout en préservant sa santé mentale ? Conseils et témoignages.",
    duration: "42 min",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800",
    tags: ["Parentalité", "Famille", "Bien-être"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false
  },
  {
    id: "prevenir-burnout",
    category: "articles",
    title: "Reconnaître et prévenir le burnout",
    description: "Les signes avant-coureurs du burnout professionnel et les stratégies de prévention efficaces.",
    duration: "12 min de lecture",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
    tags: ["Burnout", "Travail", "Prévention"],
    author: "M.O.N.A",
    featured: false,
    isFree: true,
    downloadable: true
  },
  {
    id: "yoga-apaisement",
    category: "videos",
    title: "Yoga pour l'apaisement mental",
    description: "Séance de yoga douce spécialement conçue pour calmer l'esprit et réduire l'anxiété.",
    duration: "20 min",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    tags: ["Yoga", "Apaisement", "Corps-esprit"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false
  },
  {
    id: "neuroscience-gratitude",
    category: "articles",
    title: "La neuroscience de la gratitude",
    description: "Comment la pratique de la gratitude transforme votre cerveau et améliore votre bien-être.",
    duration: "10 min de lecture",
    image: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800",
    tags: ["Neuroscience", "Gratitude", "Bonheur"],
    author: "M.O.N.A",
    featured: false,
    isFree: false,
    downloadable: false
  }
];

// Fonction helper pour obtenir une ressource par ID
export function getBibliothequeResourceById(id: string): BibliothequeResource | undefined {
  return bibliothequeResources.find(r => r.id === id);
}

// Fonction helper pour filtrer les ressources
export function filterBibliothequeResources(
  category: "all" | "articles" | "videos" | "podcasts",
  accessFilter: "all" | "free" | "members"
): BibliothequeResource[] {
  return bibliothequeResources.filter(r => {
    const categoryMatch = category === "all" || r.category === category;
    const accessMatch = 
      accessFilter === "all" || 
      (accessFilter === "free" && r.isFree) ||
      (accessFilter === "members" && !r.isFree);
    
    return categoryMatch && accessMatch;
  });
}

// Fonction helper pour obtenir les ressources en vedette
export function getFeaturedResources(): BibliothequeResource[] {
  return bibliothequeResources.filter(r => r.featured);
}
