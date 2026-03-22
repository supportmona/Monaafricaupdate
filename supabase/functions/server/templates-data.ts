// Base de données des templates par défaut pour tous les experts M.O.N.A
// 10 templates essentiels : 5 types × 2 versions (santé mentale + soins primaires)

export const ALL_DEFAULT_TEMPLATES = [
  // ==================== ORDONNANCES ====================
  {
    id: "prescription_mental_health",
    type: "prescription",
    category: "mental_health",
    name: "Ordonnance - Santé mentale",
    subcategory: "Psychopharmacologie",
    description: "Template d'ordonnance pour traitements psychiatriques",
    medications: [
      {
        name: "[Nom du médicament]",
        dosage: "[Dosage]",
        frequency: "[Fréquence]",
        duration: "[Durée]",
        instructions: "[Instructions spécifiques]",
      },
    ],
    instructions: "Instructions générales pour le patient",
    duration: "[Durée du traitement]",
    warnings: "Contre-indications et précautions d'emploi",
    isDefault: true,
    isPublic: true,
  },
  {
    id: "prescription_primary_care",
    type: "prescription",
    category: "primary_care",
    name: "Ordonnance - Soins primaires",
    subcategory: "Médecine générale",
    description: "Template d'ordonnance pour soins médicaux généraux",
    medications: [
      {
        name: "[Nom du médicament]",
        dosage: "[Dosage]",
        frequency: "[Fréquence]",
        duration: "[Durée]",
        instructions: "[Instructions spécifiques]",
      },
    ],
    instructions: "Instructions générales pour le patient",
    duration: "[Durée du traitement]",
    warnings: "Contre-indications et précautions d'emploi",
    isDefault: true,
    isPublic: true,
  },

  // ==================== PLANS DE SOINS ====================
  {
    id: "careplan_mental_health",
    type: "careplan",
    category: "mental_health",
    name: "Plan de soins - Santé mentale",
    condition: "[Diagnostic psychiatrique]",
    description: "Plan de soins structuré pour suivi psychiatrique/psychologique",
    objectives: [
      {
        title: "[Objectif thérapeutique 1]",
        description: "[Description détaillée]",
        priority: "high",
      },
      {
        title: "[Objectif thérapeutique 2]",
        description: "[Description détaillée]",
        priority: "medium",
      },
    ],
    interventions: [
      {
        type: "psychotherapy",
        description: "[Type de psychothérapie et approche]",
        frequency: "[Fréquence des séances]",
        duration: "[Durée du traitement]",
      },
      {
        type: "medication",
        description: "[Traitement pharmacologique si nécessaire]",
        frequency: "[Selon prescription]",
        duration: "[Durée]",
      },
      {
        type: "lifestyle",
        description: "[Modifications du mode de vie, exercices, techniques]",
        frequency: "[Quotidienne/Hebdomadaire]",
        duration: "[Durée]",
      },
      {
        type: "followup",
        description: "[Modalités de suivi et évaluations]",
        frequency: "[Fréquence]",
        duration: "[Durée]",
      },
    ],
    isDefault: true,
    isPublic: true,
  },
  {
    id: "careplan_primary_care",
    type: "careplan",
    category: "primary_care",
    name: "Plan de soins - Soins primaires",
    condition: "[Diagnostic médical]",
    description: "Plan de soins pour pathologie médicale générale",
    objectives: [
      {
        title: "[Objectif thérapeutique 1]",
        description: "[Description détaillée]",
        priority: "high",
      },
      {
        title: "[Objectif thérapeutique 2]",
        description: "[Description détaillée]",
        priority: "medium",
      },
    ],
    interventions: [
      {
        type: "medication",
        description: "[Traitement médicamenteux]",
        frequency: "[Fréquence]",
        duration: "[Durée]",
      },
      {
        type: "lifestyle",
        description: "[Régime, exercice, modifications hygiéno-diététiques]",
        frequency: "[Quotidienne]",
        duration: "[Durée]",
      },
      {
        type: "followup",
        description: "[Consultations de suivi, examens complémentaires]",
        frequency: "[Fréquence]",
        duration: "[Durée]",
      },
    ],
    isDefault: true,
    isPublic: true,
  },

  // ==================== CERTIFICATS MÉDICAUX ====================
  {
    id: "certificate_mental_health",
    type: "certificate",
    category: "mental_health",
    name: "Certificat médical - Santé mentale",
    description: "Certificat pour arrêt de travail ou aptitude psychologique",
    content: `CERTIFICAT MÉDICAL - SANTÉ MENTALE

Je soussigné(e), Dr. [NOM EXPERT], [SPÉCIALITÉ], exerçant à [VILLE], certifie avoir examiné ce jour :

[NOM COMPLET DU PATIENT]
Né(e) le : [DATE DE NAISSANCE]

Suite à cet examen psychiatrique/psychologique, [INDIQUER LA CONCLUSION : repos médical, aptitude, non contre-indication, etc.]

Durée : [DURÉE SI APPLICABLE]
À compter du : [DATE SI APPLICABLE]

Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit, conformément aux règles de confidentialité médicale.

Fait à [VILLE], le [DATE]

Dr. [NOM EXPERT]
Signature et cachet`,
    isDefault: true,
    isPublic: true,
  },
  {
    id: "certificate_primary_care",
    type: "certificate",
    category: "primary_care",
    name: "Certificat médical - Soins primaires",
    description: "Certificat médical standard pour justificatif ou arrêt de travail",
    content: `CERTIFICAT MÉDICAL

Je soussigné(e), Dr. [NOM EXPERT], médecin, exerçant à [VILLE], certifie avoir examiné ce jour :

[NOM COMPLET DU PATIENT]
Né(e) le : [DATE DE NAISSANCE]

Suite à cet examen médical, [INDIQUER LA CONCLUSION : repos médical, aptitude, non contre-indication, etc.]

Durée : [DURÉE SI APPLICABLE]
À compter du : [DATE SI APPLICABLE]

Certificat établi à la demande de l'intéressé(e) et remis en main propre pour faire valoir ce que de droit.

Fait à [VILLE], le [DATE]

Dr. [NOM EXPERT]
Signature et cachet`,
    isDefault: true,
    isPublic: true,
  },

  // ==================== COMPTES-RENDUS DE CONSULTATION ====================
  {
    id: "report_mental_health",
    type: "report",
    category: "mental_health",
    name: "Compte-rendu - Santé mentale",
    description: "Compte-rendu détaillé de consultation psychiatrique/psychologique",
    content: `COMPTE-RENDU DE CONSULTATION PSYCHIATRIQUE/PSYCHOLOGIQUE

INFORMATIONS PATIENT
Nom : [NOM PATIENT]
Date de naissance : [DATE NAISSANCE]
Date de consultation : [DATE]
Type : [Première consultation / Suivi / Urgence]

MOTIF DE CONSULTATION
[Motif exprimé par le patient]

ANAMNÈSE
Antécédents psychiatriques : [Détails]
Antécédents médicaux : [Détails]
Traitements en cours : [Liste]
Contexte psychosocial : [Détails]

HISTOIRE DE LA MALADIE ACTUELLE
[Chronologie, symptômes, facteurs déclenchants, évolution]

EXAMEN CLINIQUE
Présentation : [Apparence, comportement]
État émotionnel : [Humeur, affect]
Cognition : [Orientation, mémoire, attention]
Pensées : [Contenu, processus]
Risque suicidaire : [Évaluation]

DIAGNOSTIC
[Diagnostic principal selon CIM-11]
[Diagnostics associés si applicable]

PLAN THÉRAPEUTIQUE
Traitement pharmacologique : [Si applicable]
Psychothérapie : [Type et fréquence]
Suivi : [Prochaine consultation]

CONCLUSION
[Synthèse et pronostic]

Dr. [NOM EXPERT]
[DATE]`,
    isDefault: true,
    isPublic: true,
  },
  {
    id: "report_primary_care",
    type: "report",
    category: "primary_care",
    name: "Compte-rendu - Soins primaires",
    description: "Compte-rendu de consultation médicale générale",
    content: `COMPTE-RENDU DE CONSULTATION MÉDICALE

INFORMATIONS PATIENT
Nom : [NOM PATIENT]
Date de naissance : [DATE NAISSANCE]
Date de consultation : [DATE]
Type : [Première consultation / Suivi / Urgence]

MOTIF DE CONSULTATION
[Motif principal]

ANAMNÈSE
Antécédents médicaux : [Détails]
Antécédents chirurgicaux : [Détails]
Traitements en cours : [Liste]
Allergies : [Liste]
Contexte familial : [Antécédents familiaux pertinents]

HISTOIRE DE LA MALADIE ACTUELLE
[Chronologie des symptômes, évolution]

EXAMEN PHYSIQUE
Constantes : TA [__/__], FC [__], T° [__], SpO2 [__]
Examen général : [Observations]
Examen par systèmes : [Détails pertinents]

EXAMENS COMPLÉMENTAIRES
[Résultats des examens réalisés ou prescrits]

DIAGNOSTIC
[Diagnostic principal]
[Diagnostics associés]

TRAITEMENT
Prescription : [Détails]
Mesures hygiéno-diététiques : [Recommandations]
Suivi : [Prochaine consultation, examens à prévoir]

CONCLUSION
[Synthèse]

Dr. [NOM EXPERT]
[DATE]`,
    isDefault: true,
    isPublic: true,
  },

  // ==================== LETTRES DE LIAISON ====================
  {
    id: "referral_mental_health",
    type: "referral",
    category: "mental_health",
    name: "Lettre de liaison - Santé mentale",
    description: "Lettre de liaison vers confrère ou structure spécialisée",
    content: `LETTRE DE LIAISON - SANTÉ MENTALE

Dr. [NOM EXPERT]
[SPÉCIALITÉ]
[ADRESSE CABINET]
[TÉLÉPHONE]

À l'attention du Dr. [NOM DESTINATAIRE]
[SPÉCIALITÉ DESTINATAIRE]
[ADRESSE]

Objet : Patient [NOM PATIENT] - [AGE] ans

Cher confrère,

Je vous adresse [Monsieur/Madame] [NOM PATIENT], né(e) le [DATE], que je suis actuellement pour [MOTIF DU SUIVI].

CONTEXTE CLINIQUE
[Historique psychiatrique pertinent]

SITUATION ACTUELLE
[État actuel du patient, symptomatologie]

TRAITEMENT EN COURS
[Liste des traitements]

MOTIF DE L'ADRESSAGE
Je vous adresse ce patient pour [RAISON : avis spécialisé, prise en charge complémentaire, orientation vers structure adaptée, etc.].

Questions spécifiques : [SI APPLICABLE]

Je reste à votre disposition pour tout renseignement complémentaire et vous remercie de la prise en charge de ce patient.

Confraternellement,

Dr. [NOM EXPERT]
[DATE]`,
    isDefault: true,
    isPublic: true,
  },
  {
    id: "referral_primary_care",
    type: "referral",
    category: "primary_care",
    name: "Lettre de liaison - Soins primaires",
    description: "Lettre de liaison médicale vers spécialiste",
    content: `LETTRE DE LIAISON MÉDICALE

Dr. [NOM EXPERT]
[SPÉCIALITÉ]
[ADRESSE CABINET]
[TÉLÉPHONE]

À l'attention du Dr. [NOM DESTINATAIRE]
[SPÉCIALITÉ DESTINATAIRE]
[ADRESSE]

Objet : Patient [NOM PATIENT] - [AGE] ans

Cher confrère,

Je vous adresse [Monsieur/Madame] [NOM PATIENT], né(e) le [DATE], pour [MOTIF DE L'ADRESSAGE].

ANTÉCÉDENTS
[Antécédents médicaux et chirurgicaux pertinents]

SITUATION ACTUELLE
[Tableau clinique actuel, symptômes, évolution]

EXAMENS RÉALISÉS
[Résultats des examens complémentaires]

TRAITEMENT EN COURS
[Liste des traitements actuels]

MOTIF DE L'ADRESSAGE
[Raison précise : avis spécialisé, exploration complémentaire, prise en charge spécifique]

Questions spécifiques : [SI APPLICABLE]

Je reste à votre disposition pour tout renseignement complémentaire et vous remercie de votre prise en charge.

Confraternellement,

Dr. [NOM EXPERT]
[DATE]`,
    isDefault: true,
    isPublic: true,
  },
];
