import { jsPDF } from "jspdf";

// Contenu créatif pour chaque guide
export const guideContents: Record<string, any> = {
  "bien-etre-travail": {
    title: "Guide du bien-être au travail",
    subtitle: "Stratégies pratiques pour maintenir votre santé mentale en milieu professionnel",
    sections: [
      {
        title: "Introduction",
        content: [
          "Le bien-être au travail est essentiel pour une vie professionnelle épanouie et productive. Dans un contexte africain en pleine transformation digitale, il est crucial de développer des stratégies adaptées à nos réalités culturelles et professionnelles.",
          "Ce guide vous accompagne dans la construction d'un environnement de travail sain, en harmonie avec vos valeurs et votre bien-être mental."
        ]
      },
      {
        title: "1. Reconnaître les signes de stress professionnel",
        content: [
          "Les signaux d'alerte:",
          "• Fatigue persistante malgré le repos",
          "• Difficultés de concentration",
          "• Irritabilité et changements d'humeur",
          "• Troubles du sommeil",
          "• Sentiment d'épuisement émotionnel",
          "",
          "Il est important de reconnaître ces signes précocement pour agir avant que le stress ne devienne chronique."
        ]
      },
      {
        title: "2. Établir des limites saines",
        content: [
          "Techniques pratiques:",
          "• Définir des horaires de travail clairs",
          "• Apprendre à dire non aux demandes excessives",
          "• Déconnecter après les heures de travail",
          "• Créer des rituels de transition travail-vie personnelle",
          "",
          "Dans nos cultures africaines, la notion de communauté peut parfois rendre difficile l'établissement de limites. Il est important de trouver un équilibre respectueux."
        ]
      },
      {
        title: "3. Cultiver des relations professionnelles positives",
        content: [
          "Stratégies de communication:",
          "• Pratiquer l'écoute active",
          "• Exprimer vos besoins clairement et respectueusement",
          "• Chercher le soutien de collègues bienveillants",
          "• Participer à des activités d'équipe constructives",
          "",
          "Le Ubuntu (je suis parce que nous sommes) peut être une force dans la création d'un environnement de travail solidaire."
        ]
      },
      {
        title: "4. Aménager votre espace de travail",
        content: [
          "Conseils d'aménagement:",
          "• Maximiser la lumière naturelle",
          "• Ajouter des plantes vertes",
          "• Organiser un espace rangé et fonctionnel",
          "• Personnaliser avec des éléments inspirants",
          "• Assurer une ergonomie adaptée",
          "",
          "Votre environnement physique influence directement votre bien-être mental."
        ]
      },
      {
        title: "5. Pratiquer l'auto-soin au quotidien",
        content: [
          "Rituels quotidiens:",
          "• Pauses régulières (15 min toutes les 2h)",
          "• Exercices de respiration (5 minutes)",
          "• Marche ou étirements légers",
          "• Hydratation et nutrition équilibrée",
          "• Moments de gratitude",
          "",
          "Ces petites pratiques, intégrées régulièrement, créent un impact significatif sur votre bien-être."
        ]
      },
      {
        title: "Conclusion",
        content: [
          "Le bien-être au travail est un voyage continu, pas une destination. Soyez patient avec vous-même et célébrez chaque petit progrès.",
          "",
          "M.O.N.A est à vos côtés pour vous accompagner dans ce parcours. N'hésitez pas à consulter nos experts si vous ressentez le besoin d'un soutien personnalisé."
        ]
      }
    ]
  },
  "comprendre-anxiete": {
    title: "Comprendre l'anxiété",
    subtitle: "Un guide complet pour identifier, comprendre et gérer les troubles anxieux",
    sections: [
      {
        title: "Introduction",
        content: [
          "L'anxiété est une réponse naturelle du corps face au stress. Cependant, lorsqu'elle devient excessive ou persistante, elle peut affecter significativement votre qualité de vie.",
          "Ce guide vous aide à comprendre l'anxiété dans toutes ses dimensions et vous propose des stratégies concrètes pour la gérer."
        ]
      },
      {
        title: "1. Qu'est-ce que l'anxiété ?",
        content: [
          "Définition:",
          "L'anxiété est une émotion caractérisée par des sentiments de tension, des pensées inquiétantes et des changements physiques.",
          "",
          "Différence entre anxiété normale et trouble anxieux:",
          "• Anxiété normale: réaction proportionnée, temporaire, aide à la performance",
          "• Trouble anxieux: réaction disproportionnée, persistante, interfère avec la vie quotidienne"
        ]
      },
      {
        title: "2. Les manifestations de l'anxiété",
        content: [
          "Symptômes physiques:",
          "• Battements cardiaques rapides",
          "• Transpiration excessive",
          "• Tensions musculaires",
          "• Maux de tête ou d'estomac",
          "• Difficultés respiratoires",
          "",
          "Symptômes psychologiques:",
          "• Inquiétude excessive",
          "• Ruminations mentales",
          "• Difficultés de concentration",
          "• Irritabilité",
          "• Troubles du sommeil"
        ]
      },
      {
        title: "3. Les types de troubles anxieux",
        content: [
          "Principaux troubles:",
          "• Trouble d'anxiété généralisée (TAG)",
          "• Trouble panique",
          "• Phobies spécifiques",
          "• Anxiété sociale",
          "• Trouble obsessionnel-compulsif (TOC)",
          "",
          "Chaque type nécessite une approche adaptée. Une évaluation professionnelle est recommandée pour un diagnostic précis."
        ]
      },
      {
        title: "4. Techniques de gestion immédiate",
        content: [
          "Respiration profonde (5-5-5):",
          "• Inspirez pendant 5 secondes",
          "• Retenez votre souffle 5 secondes",
          "• Expirez pendant 5 secondes",
          "• Répétez 5 fois",
          "",
          "Ancrage sensoriel (5-4-3-2-1):",
          "• 5 choses que vous voyez",
          "• 4 choses que vous touchez",
          "• 3 choses que vous entendez",
          "• 2 choses que vous sentez",
          "• 1 chose que vous goûtez"
        ]
      },
      {
        title: "5. Stratégies à long terme",
        content: [
          "Changements de mode de vie:",
          "• Exercice physique régulier (30 min/jour)",
          "• Sommeil de qualité (7-9 heures)",
          "• Alimentation équilibrée",
          "• Réduction de la caféine et de l'alcool",
          "• Pratiques de relaxation quotidiennes",
          "",
          "Thérapies recommandées:",
          "• Thérapie cognitivo-comportementale (TCC)",
          "• Thérapie d'acceptation et d'engagement",
          "• Mindfulness et méditation"
        ]
      },
      {
        title: "6. Quand consulter un professionnel ?",
        content: [
          "Consultez si:",
          "• L'anxiété interfère avec vos activités quotidiennes",
          "• Vous évitez des situations importantes",
          "• Vous développez des pensées suicidaires",
          "• Les techniques d'auto-gestion ne suffisent pas",
          "• Vous ressentez des symptômes physiques inquiétants",
          "",
          "N'attendez pas que la situation s'aggrave. Demander de l'aide est un signe de force, pas de faiblesse."
        ]
      },
      {
        title: "Conclusion",
        content: [
          "L'anxiété est gérable avec les bonnes stratégies et le bon soutien. Vous n'êtes pas seul dans ce parcours.",
          "",
          "Les psychologues et psychiatres de M.O.N.A sont disponibles pour vous accompagner avec une approche culturellement adaptée à notre contexte africain."
        ]
      }
    ]
  },
  "journal-gratitude": {
    title: "Journal de gratitude",
    subtitle: "Outil quotidien pour cultiver la reconnaissance et le bien-être",
    sections: [
      {
        title: "Pourquoi un journal de gratitude ?",
        content: [
          "La pratique de la gratitude a des effets scientifiquement prouvés:",
          "• Amélioration de l'humeur et du bien-être",
          "• Réduction du stress et de l'anxiété",
          "• Amélioration de la qualité du sommeil",
          "• Renforcement des relations sociales",
          "• Développement de la résilience"
        ]
      },
      {
        title: "Comment utiliser ce journal",
        content: [
          "Instructions quotidiennes:",
          "1. Choisissez un moment fixe (matin ou soir)",
          "2. Trouvez un endroit calme",
          "3. Notez 3 à 5 choses pour lesquelles vous êtes reconnaissant",
          "4. Soyez spécifique et détaillé",
          "5. Ressentez l'émotion de gratitude",
          "",
          "Astuce: Il n'y a pas de petites gratitudes. Tout compte!"
        ]
      },
      {
        title: "Semaine 1: Gratitudes personnelles",
        content: [
          "Jour 1 - Aujourd'hui je suis reconnaissant pour:",
          "1. _________________________________",
          "2. _________________________________",
          "3. _________________________________",
          "",
          "Jour 2 - Aujourd'hui je suis reconnaissant pour:",
          "1. _________________________________",
          "2. _________________________________",
          "3. _________________________________",
          "",
          "[...]"
        ]
      },
      {
        title: "Réflexions hebdomadaires",
        content: [
          "À la fin de chaque semaine, prenez le temps de:",
          "• Relire vos gratitudes",
          "• Identifier des thèmes récurrents",
          "• Célébrer les moments positifs",
          "• Ajuster votre pratique si nécessaire",
          "",
          "Cette réflexion renforce les bénéfices de la pratique."
        ]
      }
    ]
  },
  "exercices-respiration": {
    title: "Exercices de respiration",
    subtitle: "Techniques de respiration pour la gestion du stress et de l'anxiété",
    sections: [
      {
        title: "Le pouvoir de la respiration",
        content: [
          "La respiration est le seul processus automatique du corps que nous pouvons contrôler consciemment. C'est un outil puissant pour:",
          "• Calmer le système nerveux",
          "• Réduire le stress et l'anxiété",
          "• Améliorer la concentration",
          "• Réguler les émotions",
          "• Améliorer la qualité du sommeil"
        ]
      },
      {
        title: "Exercice 1: Respiration abdominale",
        content: [
          "Technique de base:",
          "1. Asseyez-vous confortablement ou allongez-vous",
          "2. Placez une main sur votre ventre",
          "3. Inspirez lentement par le nez (4 secondes)",
          "4. Sentez votre ventre se gonfler",
          "5. Expirez lentement par la bouche (6 secondes)",
          "6. Répétez pendant 5 minutes",
          "",
          "Moment idéal: Au réveil ou avant de dormir"
        ]
      },
      {
        title: "Exercice 2: Respiration 4-7-8",
        content: [
          "Technique anti-stress:",
          "1. Expirez complètement par la bouche",
          "2. Fermez la bouche, inspirez par le nez (4 secondes)",
          "3. Retenez votre respiration (7 secondes)",
          "4. Expirez complètement par la bouche (8 secondes)",
          "5. Répétez 4 cycles",
          "",
          "Moment idéal: En situation de stress aigu"
        ]
      },
      {
        title: "Exercice 3: Respiration carrée",
        content: [
          "Technique d'équilibre:",
          "1. Inspirez par le nez (4 secondes)",
          "2. Retenez votre respiration (4 secondes)",
          "3. Expirez par la bouche (4 secondes)",
          "4. Retenez à vide (4 secondes)",
          "5. Répétez 5 à 10 cycles",
          "",
          "Moment idéal: Pour retrouver le calme et la clarté"
        ]
      },
      {
        title: "Exercice 4: Respiration alternée",
        content: [
          "Technique d'harmonisation:",
          "1. Bouchez la narine droite avec le pouce",
          "2. Inspirez par la narine gauche (4 secondes)",
          "3. Bouchez la narine gauche avec l'annulaire",
          "4. Expirez par la narine droite (4 secondes)",
          "5. Inspirez par la narine droite",
          "6. Changez et expirez par la gauche",
          "7. Répétez 5 cycles",
          "",
          "Moment idéal: Pour équilibrer l'énergie"
        ]
      },
      {
        title: "Conseils pour une pratique régulière",
        content: [
          "Pour maximiser les bénéfices:",
          "• Pratiquez quotidiennement, même 5 minutes",
          "• Choisissez un endroit calme",
          "• Portez des vêtements confortables",
          "• Soyez patient, les effets s'accumulent",
          "• Adaptez les exercices à votre confort",
          "",
          "La régularité est plus importante que la durée."
        ]
      }
    ]
  },
  "sommeil-sante-mentale": {
    title: "Les bienfaits du sommeil sur la santé mentale",
    subtitle: "Comment un sommeil de qualité transforme votre bien-être mental et émotionnel",
    sections: [
      {
        title: "Introduction",
        content: [
          "Le sommeil joue un rôle crucial dans notre santé mentale et notre bien-être émotionnel. Pendant que nous dormons, notre cerveau effectue des processus essentiels de réparation, de consolidation de la mémoire et de régulation émotionnelle.",
          "Ce guide explore les liens entre sommeil et santé mentale, et vous propose des stratégies pratiques pour améliorer votre sommeil."
        ]
      },
      {
        title: "1. Le sommeil et le cerveau",
        content: [
          "Pendant le sommeil, le cerveau:",
          "• Traite et consolide les souvenirs",
          "• Élimine les toxines accumulées",
          "• Régule les émotions",
          "• Renforce les connexions neuronales",
          "",
          "Un sommeil insuffisant perturbe tous ces processus essentiels."
        ]
      },
      {
        title: "2. Impact du manque de sommeil",
        content: [
          "Conséquences sur la santé mentale:",
          "• Augmentation du risque de dépression",
          "• Accentuation des troubles anxieux",
          "• Diminution de la résilience émotionnelle",
          "• Altération des fonctions cognitives",
          "• Irritabilité et sautes d'humeur",
          "",
          "Le manque de sommeil chronique est un facteur de risque majeur pour la santé mentale."
        ]
      },
      {
        title: "3. Les bienfaits d'un bon sommeil",
        content: [
          "Un sommeil de qualité apporte:",
          "• Meilleure régulation émotionnelle",
          "• Amélioration de la concentration",
          "• Renforcement du système immunitaire",
          "• Réduction du stress et de l'anxiété",
          "• Amélioration de la créativité",
          "",
          "Le sommeil est le meilleur allié de votre santé mentale."
        ]
      },
      {
        title: "4. Stratégies pour améliorer votre sommeil",
        content: [
          "Hygiène du sommeil:",
          "• Couchez-vous et levez-vous à heures régulières",
          "• Créez un environnement propice (sombre, frais, silencieux)",
          "• Évitez les écrans 1h avant le coucher",
          "• Pratiquez une activité relaxante avant de dormir",
          "• Limitez la caféine et les repas lourds en soirée",
          "",
          "Petits changements, grands effets sur votre santé mentale."
        ]
      }
    ]
  },
  "prevenir-burnout": {
    title: "Reconnaître et prévenir le burnout",
    subtitle: "Les signes avant-coureurs du burnout professionnel et les stratégies de prévention efficaces",
    sections: [
      {
        title: "Introduction",
        content: [
          "Le burnout, ou syndrome d'épuisement professionnel, est reconnu par l'OMS comme un phénomène lié au travail. Il résulte d'un stress chronique au travail qui n'a pas été géré avec succès.",
          "Ce guide vous aide à reconnaître les signes du burnout et à mettre en place des stratégies de prévention efficaces."
        ]
      },
      {
        title: "1. Comprendre le burnout",
        content: [
          "Les trois dimensions du burnout:",
          "• Épuisement émotionnel: sentiment d'être vidé de ses ressources",
          "• Dépersonnalisation: attitude cynique envers son travail",
          "• Diminution de l'accomplissement: sentiment d'inefficacité",
          "",
          "Le burnout est un état d'épuisement physique, émotionnel et mental."
        ]
      },
      {
        title: "2. Les signes avant-coureurs",
        content: [
          "Signes physiques:",
          "• Fatigue persistante",
          "• Troubles du sommeil",
          "• Maux de tête fréquents",
          "• Problèmes digestifs",
          "",
          "Signes émotionnels:",
          "• Irritabilité",
          "• Anxiété accrue",
          "• Perte de motivation",
          "• Sentiment d'impuissance",
          "",
          "Signes comportementaux:",
          "• Procrastination",
          "• Isolement social",
          "• Absentéisme"
        ]
      },
      {
        title: "3. Stratégies de prévention",
        content: [
          "Au niveau individuel:",
          "• Établissez des limites claires",
          "• Pratiquez l'auto-soin régulier",
          "• Développez des stratégies de gestion du stress",
          "• Cultivez des relations sociales positives",
          "",
          "Au niveau professionnel:",
          "• Communiquez sur votre charge de travail",
          "• Prenez vos pauses et vos congés",
          "• Cherchez du soutien auprès de collègues",
          "• Définissez des objectifs réalistes"
        ]
      },
      {
        title: "4. Quand demander de l'aide",
        content: [
          "Consultez un professionnel si:",
          "• Les signes persistent malgré vos efforts",
          "• Votre santé mentale est affectée",
          "• Vous ressentez un épuisement profond",
          "• Vous avez des pensées suicidaires",
          "",
          "Le burnout nécessite souvent un accompagnement professionnel pour une récupération complète."
        ]
      }
    ]
  }
};

export function generateGuidePDF(resourceId: string, title: string) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  const guide = guideContents[resourceId];
  
  if (!guide) {
    console.error("Guide content not found for:", resourceId);
    return;
  }

  let yPosition = margin;

  // Fonction pour ajouter le filigrane M.O.N.A sur chaque page
  const addWatermark = () => {
    doc.setFontSize(40);
    doc.setTextColor(220, 220, 220);
    doc.setFont("helvetica", "bold");
    
    // Rotation du texte en diagonale
    const watermarkText = "M.O.N.A";
    const textWidth = doc.getTextWidth(watermarkText);
    
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));
    
    // Plusieurs filigrane sur la page
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const x = 30 + i * 60;
        const y = 40 + j * 70;
        doc.text(watermarkText, x, y, { angle: 45 });
      }
    }
    
    doc.restoreGraphicsState();
  };

  // Fonction pour vérifier si on a besoin d'une nouvelle page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      addWatermark();
      yPosition = margin;
      return true;
    }
    return false;
  };

  // Page de couverture
  addWatermark();
  
  // Logo M.O.N.A (texte stylisé)
  doc.setFontSize(32);
  doc.setTextColor(209, 134, 117); // Terracotta
  doc.setFont("helvetica", "bold");
  doc.text("M.O.N.A", pageWidth / 2, 60, { align: "center" });
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Mieux-être, Optimisation & Neuro-Apaisement", pageWidth / 2, 70, { align: "center" });
  
  // Titre du guide
  yPosition = 100;
  doc.setFontSize(24);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  const titleLines = doc.splitTextToSize(guide.title, maxWidth);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 12;
  });
  
  // Sous-titre
  yPosition += 10;
  doc.setFontSize(12);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "italic");
  const subtitleLines = doc.splitTextToSize(guide.subtitle, maxWidth - 20);
  subtitleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 8;
  });
  
  // Footer de couverture
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("© 2026 M.O.N.A - Tous droits réservés", pageWidth / 2, pageHeight - 30, { align: "center" });
  doc.text("contact@monafrica.net | www.monafrica.net", pageWidth / 2, pageHeight - 22, { align: "center" });
  
  // Nouvelle page pour le contenu
  doc.addPage();
  addWatermark();
  yPosition = margin;
  
  // Contenu des sections
  guide.sections.forEach((section: any, sectionIndex: number) => {
    checkNewPage(20);
    
    // Titre de section
    doc.setFontSize(16);
    doc.setTextColor(209, 134, 117); // Terracotta
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, yPosition);
    yPosition += 10;
    
    // Ligne de séparation
    doc.setDrawColor(209, 134, 117);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin + 40, yPosition);
    yPosition += 8;
    
    // Contenu de la section
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.setFont("helvetica", "normal");
    
    section.content.forEach((paragraph: string) => {
      if (paragraph === "") {
        yPosition += 4;
        return;
      }
      
      checkNewPage(15);
      
      const lines = doc.splitTextToSize(paragraph, maxWidth);
      lines.forEach((line: string) => {
        checkNewPage(6);
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 2;
    });
    
    yPosition += 8;
  });
  
  // Footer sur la dernière page
  yPosition = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  doc.text("Ce document est la propriété de M.O.N.A et est protégé par les droits d'auteur.", pageWidth / 2, yPosition, { align: "center" });
  yPosition += 5;
  doc.text("Pour toute question ou accompagnement personnalisé, contactez-nous à contact@monafrica.net", pageWidth / 2, yPosition, { align: "center" });
  
  // Téléchargement
  const fileName = `MONA_${resourceId}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
}