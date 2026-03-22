import { Context } from "npm:hono";

interface ChatMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

interface BotResponse {
  response: string;
  suggestions?: string[];
}

// Base de connaissances STRICTEMENT basée sur les vraies infos du site
const knowledgeBase = {
  // PRIORITÉ MAX: Détection d'urgence
  urgence: {
    keywords: ["suicide", "suicidaire", "me tuer", "mourir", "mettre fin", "danger", "crise", "très mal", "ne peux plus"],
    response: "⚠️ Je perçois une grande détresse dans votre message.\n\nEn tant qu'assistant virtuel, je ne peux pas fournir de soutien thérapeutique d'urgence.\n\n🆘 ACTIONS IMMÉDIATES :\n1. Contactez les services d'urgence de votre pays MAINTENANT\n2. Appelez un proche de confiance\n3. Prenez rendez-vous en urgence avec l'un de nos experts disponibles\n\nVous n'êtes pas seul. Nos psychologues certifiés sont disponibles pour vous accompagner.",
    suggestions: ["Voir les experts disponibles", "Contactez-nous : contact@monafrica.net"]
  },

  // Session d'orientation GRATUITE (c'est ça la vraie offre gratuite)
  sessionOrientation: {
    keywords: ["gratuit", "essai gratuit", "période d'essai", "tester gratuitement", "sans engagement"],
    response: "Plutôt qu'une période d'essai classique, M.O.N.A offre quelque chose de mieux :\n\n🎁 SESSION D'ORIENTATION GRATUITE (15 minutes)\n• 100% gratuite, sans engagement\n• Avec un Spécialiste Dispatch dédié\n• Établissement de votre Plan de Soin personnalisé\n• Orientation vers l'expert qui vous correspond vraiment\n\nVous pouvez la réserver dès maintenant, même avant de choisir un abonnement. C'est votre porte d'entrée pour découvrir comment M.O.N.A peut vous aider, avec des bases solides.",
    suggestions: ["Réserver ma session gratuite", "Voir les formules", "Comment ça fonctionne ?"]
  },

  // Tarifs réels
  tarifs: {
    keywords: ["tarif", "prix", "coût", "combien", "payer", "abonnement", "formule"],
    response: "Nos formules M.O.N.A (disponibles en XOF et USD) :\n\n💎 SÉANCE UNIQUE\n• 35 000 XOF (≈60 USD)\n• 1 téléconsultation de 50 min\n• Smart Matching culturel\n• Accès Passeport Santé (FHIR)\n• Idéal pour une première exploration\n\n📦 ESSENTIEL\n• 35 000 XOF/mois (≈60 USD/mois)\n• 1 téléconsultation par mois\n• Messagerie sécurisée avec votre expert\n• Passeport Santé personnel\n• Ressources digitales\n\n⭐ PREMIUM (Recommandé)\n• 80 000 XOF/mois (≈137 USD/mois)\n• 4 téléconsultations par mois (1 par semaine)\n• Support prioritaire 24/7\n• Accès Cercle M.O.N.A (communauté & events)\n• Réductions sur M.O.N.A Escapes\n• Économie de 60 000 XOF/mois vs 4 séances uniques\n\n🏢 ENTREPRISE\n• Tarification sur mesure\n• Dashboard RH + formations managers",
    suggestions: ["Réserver session d'orientation gratuite", "Comparer les formules", "Voir les offres étudiantes"]
  },

  // Comparaison formules
  comparaisonFormules: {
    keywords: ["comparer", "différence", "quelle formule", "choisir formule", "essentiel ou premium", "séance unique ou abonnement"],
    response: "Comment choisir votre formule M.O.N.A :\n\n💎 SÉANCE UNIQUE → Si :\n• Vous voulez tester une première fois\n• Besoin ponctuel\n• 35 000 XOF par séance\n\n📦 ESSENTIEL → Si :\n• Vous voulez 1 consultation/mois régulière\n• Budget contrôlé\n• 35 000 XOF/mois\n\n⭐ PREMIUM → Si :\n• Vous cherchez un changement réel et durable\n• Besoin de suivi hebdomadaire (4 consultations/mois)\n• Vous voulez le meilleur rapport qualité-prix (économie de 60 000 XOF/mois)\n• Support prioritaire 24/7 + accès Cercle M.O.N.A\n• 80 000 XOF/mois\n\n92% de nos utilisateurs choisissent Premium pour un accompagnement approfondi.",
    suggestions: ["Réserver session d'orientation gratuite", "Voir les prix détaillés", "Offres étudiantes"]
  },

  // Offres étudiantes réelles
  offresEtudiantes: {
    keywords: ["étudiant", "étudiante", "lycéen", "lycée", "terminale", "3ème", "université", "réduction étudiant"],
    response: "M.O.N.A soutient l'avenir avec des OFFRES ÉTUDIANTES :\n\n🎓 ÉTUDIANTS 3ᵉ ET TERMINALE (Focus Examens)\n• Séance Unique : 20 000 XOF (au lieu de 35 000)\n• Pack Essentiel : 25 000 XOF/mois (au lieu de 35 000)\n• Pack Premium : -15%\n\n🎓 AUTRES ÉTUDIANTS\n• Séance Unique : 25 000 XOF (au lieu de 35 000)\n• Pack Essentiel : 30 000 XOF/mois (au lieu de 35 000)\n• Pack Premium : -10%\n\n📋 Sur présentation d'un justificatif étudiant. Contactez-nous pour obtenir votre code.",
    suggestions: ["Demander mon code étudiant", "Voir toutes les formules", "Réserver session gratuite"]
  },

  // Smart Matching
  smartMatching: {
    keywords: ["smart matching", "algorithme", "matching", "trouver thérapeute", "quel expert", "choisir psychologue"],
    response: "Le Smart Matching M.O.N.A est notre technologie propriétaire qui trouve LE thérapeute parfait pour vous.\n\n🎯 Comment ça marche :\n• Analyse de votre profil psychologique\n• Prise en compte de votre contexte culturel africain\n• Matching selon vos préférences linguistiques\n• Correspondance avec vos objectifs thérapeutiques\n• Disponibilité adaptée à votre emploi du temps\n\n✅ Résultat : 95% de satisfaction dès la première consultation\n⚡ Match parfait en moins de 24h\n\nInclus dans toutes les formules.",
    suggestions: ["Réserver session d'orientation gratuite", "Voir nos experts", "Comment ça fonctionne ?"]
  },

  // Passeport Santé
  passeportSante: {
    keywords: ["passeport santé", "dossier médical", "passeport mental", "fhir", "historique", "données santé"],
    response: "Le Passeport Santé Mental M.O.N.A est votre dossier personnel sécurisé et portable.\n\n📋 Fonctionnalités :\n• Historique complet de vos consultations\n• Notes de séances chiffrées de bout en bout\n• Suivi de votre progression\n• Conforme aux standards FHIR internationaux\n• Accessible partout, même hors ligne\n• 100% confidentiel et sous votre contrôle\n\nAdapté au contexte africain avec support multi-appareils et faible consommation de data.\n\nInclus dans toutes les formules.",
    suggestions: ["Comment ça fonctionne ?", "Questions confidentialité", "Voir les formules"]
  },

  // Prise de rendez-vous
  prendreRendezVous: {
    keywords: ["prendre rendez-vous", "réserver", "rdv", "consultation", "voir un expert", "parler à quelqu'un", "commencer"],
    response: "Pour commencer votre parcours M.O.N.A :\n\n1️⃣ RÉSERVEZ VOTRE SESSION D'ORIENTATION GRATUITE (15 min)\n• Avec un Spécialiste Dispatch\n• 100% gratuite, sans engagement\n• Établissement de votre Plan de Soin personnalisé\n\n2️⃣ CHOIX DE VOTRE FORMULE\n• Séance Unique, Essentiel ou Premium\n\n3️⃣ CONSULTATION AVEC VOTRE EXPERT\n• Format : visio, audio ou chat sécurisé\n• Disponibilité 7j/7\n• Créneaux adaptés à votre fuseau horaire\n\nCommencez dès aujourd'hui !",
    suggestions: ["Réserver session d'orientation", "Voir les tarifs", "Voir nos experts"]
  },

  // Ressources
  ressources: {
    keywords: ["ressource", "contenu", "article", "guide", "bibliothèque", "pdf"],
    response: "Notre bibliothèque de ressources adaptées au contexte africain francophone :\n\n📖 RESSOURCES GRATUITES (accessibles à tous)\n• Guides pratiques sur l'anxiété, le stress\n• Articles validés par nos experts certifiés\n• Exercices de bien-être\n• Podcasts et vidéos\n\n👑 RESSOURCES MEMBRES (Cercle M.O.N.A)\n• Ateliers interactifs mensuels\n• Formations approfondies\n• Outils thérapeutiques avancés\n• Programmes structurés\n• Accès avec formule Premium\n\nTous nos contenus sont créés ou validés par nos psychologues certifiés.",
    suggestions: ["Voir ressources gratuites", "Découvrir Premium", "Réserver session gratuite"]
  },

  // Experts
  experts: {
    keywords: ["expert", "psychologue", "thérapeute", "psychiatre", "professionnel", "certifié", "équipe"],
    response: "Nos experts M.O.N.A sont soigneusement sélectionnés pour leur excellence :\n\n✓ Psychologues & psychiatres certifiés\n✓ Spécialistes de la culture africaine francophone\n✓ Formés aux approches modernes (TCC, ACT, EMDR...)\n✓ Multilingues (Français + langues locales)\n✓ Disponibilité 7j/7\n\nChaque profil affiche :\n• Qualifications et diplômes\n• Années d'expérience\n• Spécialités (anxiété, dépression, trauma...)\n• Langues parlées\n• Note et avis clients\n\n⭐ Taux de satisfaction : 4.8/5",
    suggestions: ["Voir nos experts", "Smart Matching", "Réserver session gratuite"]
  },

  // Confidentialité
  confidentialite: {
    keywords: ["confidentiel", "sécurité", "privé", "protection", "données", "rgpd", "chiffrement"],
    response: "Votre confidentialité est notre priorité ABSOLUE :\n\n🔒 Sécurité maximale :\n• Chiffrement de bout en bout (E2E)\n• Serveurs sécurisés certifiés\n• Conformité RGPD et standards internationaux\n• Aucune donnée partagée sans votre consentement\n• Support offline pour zones à connectivité limitée\n• Passeport Santé conforme norme FHIR\n\n🛡️ Vos droits :\n• Accès à toutes vos données\n• Suppression complète à tout moment\n• Portabilité de votre dossier\n• Contrôle total sur vos informations\n\nVos conversations avec nos experts restent strictement confidentielles sous secret professionnel.",
    suggestions: ["Lire politique complète", "Comment sont stockées mes données ?", "Réserver session gratuite"]
  },

  // Paiement
  paiement: {
    keywords: ["paiement", "payer", "mobile money", "orange money", "mtn", "carte bancaire", "cinetpay"],
    response: "Modes de paiement M.O.N.A (infrastructure Africa-Ready) :\n\n💳 MÉTHODES ACCEPTÉES :\n• Mobile Money (Orange Money, MTN MoMo, Moov Money)\n• Cartes bancaires internationales\n• Virements bancaires\n• Via CinetPay (plateforme sécurisée)\n\n💱 DEVISES :\n• XOF (Franc CFA)\n• USD (Dollar américain)\n• Sélecteur de devise intégré\n\n✅ Paiements 100% sécurisés\n✅ Annulation possible à tout moment\n✅ Aucun frais caché",
    suggestions: ["Voir les tarifs", "Réserver session gratuite", "Questions fréquentes"]
  },

  // Fonctionnement
  fonctionnement: {
    keywords: ["comment ça marche", "fonctionne", "utiliser", "débuter"],
    response: "M.O.N.A fonctionne en 3 étapes simples :\n\n1️⃣ SESSION D'ORIENTATION GRATUITE (15 min)\n• Avec un Spécialiste Dispatch\n• Écoute de vos besoins\n• Établissement de votre Plan de Soin\n• Orientation vers l'expert idéal\n\n2️⃣ CHOIX DE VOTRE FORMULE\n• Séance Unique, Essentiel ou Premium\n• Tarifs transparents en XOF ou USD\n\n3️⃣ ACCOMPAGNEMENT PERSONNALISÉ\n• Consultations en visio, audio ou chat\n• Suivi via Passeport Santé (FHIR)\n• Accès aux ressources adaptées\n\nVous gardez le contrôle total de votre parcours bien-être.",
    suggestions: ["Réserver session gratuite", "Voir les tarifs", "Voir les experts"]
  },

  // Contact
  contact: {
    keywords: ["contacter", "contact", "aide", "support", "assistance", "email"],
    response: "Pour toute question ou assistance M.O.N.A :\n\n📧 Email : contact@monafrica.net\n• Réponse sous 24h maximum\n• Équipe francophone dédiée\n\n⚡ SUPPORT PRIORITAIRE 24/7\n• Réservé aux membres Premium\n• Chat direct avec un conseiller\n\n🆘 Urgence de santé mentale ?\n• Contactez les services d'urgence de votre pays\n• Nos experts ne remplacent pas les soins d'urgence\n\nNous sommes là pour vous accompagner.",
    suggestions: ["Réserver session gratuite", "Questions fréquentes", "Devenir membre Premium"]
  }
};

// Détection intelligente avec priorisation
function detectIntent(message: string): BotResponse {
  const lowerMessage = message.toLowerCase().trim();
  
  // VÉRIFICATION 1: Urgences (priorité absolue)
  if (knowledgeBase.urgence.keywords.some(kw => lowerMessage.includes(kw))) {
    return { response: knowledgeBase.urgence.response, suggestions: knowledgeBase.urgence.suggestions };
  }

  // VÉRIFICATION 2: Correspondance par catégorie
  for (const [key, data] of Object.entries(knowledgeBase)) {
    if (key !== 'urgence' && data.keywords.some(kw => lowerMessage.includes(kw))) {
      return { response: data.response, suggestions: data.suggestions };
    }
  }

  // Réponse par défaut
  return {
    response: "Bienvenue chez M.O.N.A ! Je peux vous renseigner sur :\n\n🎁 Session d'Orientation gratuite (15 min)\n💰 Tarifs et formules (Séance Unique, Essentiel, Premium)\n🎓 Offres étudiantes\n🎯 Smart Matching culturel\n📋 Passeport Santé (FHIR)\n👨‍⚕️ Nos experts certifiés\n📚 Ressources disponibles\n🔒 Confidentialité et sécurité\n\nQue souhaitez-vous savoir ?",
    suggestions: [
      "Réserver session d'orientation gratuite",
      "Voir les tarifs",
      "Comment fonctionne le Smart Matching ?",
      "Offres étudiantes"
    ]
  };
}

export async function handleChat(c: Context) {
  try {
    const body: ChatRequest = await c.req.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== "string") {
      return c.json({ error: "Message invalide" }, 400);
    }

    // Générer la réponse basée sur l'intention détectée
    const botResponse = detectIntent(message.trim());

    return c.json(botResponse);

  } catch (error) {
    console.error("Erreur lors du traitement du chat:", error);
    return c.json({
      response: "Je rencontre une difficulté technique. Pour une assistance immédiate, contactez-nous à contact@monafrica.net",
      suggestions: ["Réessayer", "Contacter le support"]
    }, 500);
  }
}
