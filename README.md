# 🧠 M.O.N.A - Mieux-être, Optimisation & Neuro-Apaisement

> Plateforme de santé mentale premium combinant l'innovation technologique canadienne avec un ancrage stratégique en Afrique francophone (Kinshasa, Dakar, Abidjan).

![M.O.N.A Platform](https://img.shields.io/badge/Status-Production-green)
![Version](https://img.shields.io/badge/Version-1.0-blue)
![License](https://img.shields.io/badge/License-Proprietary-red)

---

## 🌍 À propos

M.O.N.A est une plateforme de santé mentale "Quiet Luxury" qui propose :

- 🧮 **Score Mental Interactif** - Évaluation personnalisée du bien-être
- 🌍 **Smart Matching Culturel** - Jumelage avec des experts adaptés au contexte africain
- 💼 **Solutions B2B** - Dashboard RH anonymisé pour entreprises
- 🏝️ **M.O.N.A Escapes** - Retraites de bien-être (Eforea Spa, Casa del Toro, etc.)
- 💳 **Carte NFC Membre** - Accès premium physique et digital
- 🔐 **Passeport Santé FHIR** - Conformité internationale des données médicales

---

## 🎨 Design System

### Palette "Quiet Luxury"

- **Terracotta** : `#c77a5a` - Couleur principale chaleureuse
- **Beige** : `#d4c4b0` - Fond neutre élégant
- **Or brossé** : `#b8a079` - Accents premium
- **Gris anthracite** : `#333333` - Texte et contraste

### Typographie

- **Titres** : Playfair Display (serif élégant)
- **Corps** : Inter (sans-serif lisible)

---

## 🛠️ Stack Technique

### Frontend
- **React 18.3.1** - Framework UI
- **TypeScript** - Typage statique
- **Vite 6.3.5** - Build tool ultra-rapide
- **Tailwind CSS 4.1** - Framework CSS utilitaire
- **React Router 7.13** - Routing SPA
- **Motion (Framer Motion)** - Animations fluides
- **Lucide React** - Icônes cohérentes

### Backend & Infrastructure
- **Supabase** - Base de données PostgreSQL + Auth + Storage
- **Resend** - Service d'envoi d'emails transactionnels
- **Vercel** - Hébergement edge computing global

### UI Components
- **Radix UI** - Composants accessibles headless
- **shadcn/ui** - Collection de composants réutilisables
- **Recharts** - Graphiques et visualisations

---

## 🚀 Installation locale

### Prérequis

- Node.js 18+ (recommandé : 20 LTS)
- npm ou pnpm
- Compte Supabase (gratuit)
- Compte Resend (gratuit)

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/VOTRE_ORG/mona-africa.git
cd mona-africa

# 2. Installer les dépendances
npm install

# 3. Créer un fichier .env à la racine
touch .env

# 4. Ajouter vos variables d'environnement (voir .env.example)
# SUPABASE_URL=https://votre-projet.supabase.co
# SUPABASE_ANON_KEY=eyJ...
# SUPABASE_SERVICE_ROLE_KEY=eyJ...
# SUPABASE_DB_URL=postgresql://...
# RESEND_API_KEY=re_...

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrez http://localhost:5173 dans votre navigateur.

---

## 📁 Structure du projet

```
mona-africa/
├── src/
│   ├── app/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── ui/             # Composants UI de base (shadcn)
│   │   │   ├── HeroSection.tsx
│   │   │   ├── NavigationBar.tsx
│   │   │   └── ...
│   │   ├── pages/              # Pages de l'application
│   │   │   ├── admin/          # Portail administrateur
│   │   │   ├── b2b/            # Dashboard B2B/RH
│   │   │   ├── portal/         # Portail expert
│   │   │   ├── HomePage.tsx
│   │   │   ├── OnboardingPage.tsx
│   │   │   └── ...
│   │   ├── contexts/           # Contexts React (Auth, etc.)
│   │   ├── hooks/              # Hooks personnalisés
│   │   ├── utils/              # Utilitaires (currency, etc.)
│   │   ├── App.tsx            # Point d'entrée React
│   │   └── routes.tsx         # Configuration React Router
│   ├── styles/                # Styles globaux
│   │   ├── theme.css          # Tokens design system
│   │   ├── fonts.css          # Imports de polices
│   │   └── index.css          # Styles de base
│   └── utils/
│       └── supabase/          # Configuration Supabase
├── supabase/
│   └── functions/
│       └── server/            # Edge Functions Supabase
│           ├── index.tsx      # API routes Hono
│           ├── emailService.tsx
│           └── ...
├── vercel.json                # Configuration Vercel
├── vite.config.ts             # Configuration Vite
└── package.json
```

---

## 🌐 Déploiement

### Production (Vercel)

Consultez le guide complet : **[GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md)**

Résumé rapide :
1. Pusher le code sur GitHub
2. Importer sur Vercel
3. Ajouter les variables d'environnement
4. Configurer le domaine monafrica.net

---

## 🔐 Variables d'environnement

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `SUPABASE_URL` | URL du projet Supabase | ✅ Oui |
| `SUPABASE_ANON_KEY` | Clé publique Supabase | ✅ Oui |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé privée Supabase (backend) | ✅ Oui |
| `SUPABASE_DB_URL` | URL PostgreSQL directe | ✅ Oui |
| `RESEND_API_KEY` | Clé API Resend (emails) | ✅ Oui |

---

## 📧 Configuration des emails

Domaines configurés pour l'envoi :
- `noreply@monafrica.net` - Notifications automatiques
- `contact@monafrica.net` - Formulaire de contact
- `support@monafrica.net` - Support technique
- `experts@monafrica.net` - Communication avec les experts
- `rh@monafrica.net` - Dashboard B2B

Voir le guide Resend dans [GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md#-étape-4--configurer-les-emails-monafricanet-avec-resend)

---

## 🧪 Tests

### Comptes de démonstration

**Portail Expert :**
- Email : `demo.expert@monafrica.net`
- Password : `Expert2025!`

**Dashboard B2B/RH :**
- Email : `demo.rh@monafrica.net`
- Password : `RH2025!`

**Portail Admin :**
- Email : `admin@monafrica.net`
- Password : `Admin2025!`

---

## 📚 Documentation complémentaire

- [DASHBOARD_B2B_ACCESS.md](./DASHBOARD_B2B_ACCESS.md) - Accès Dashboard RH
- [GUIDE_ADMIN_MESSAGERIE_EXPERTS.md](./GUIDE_ADMIN_MESSAGERIE_EXPERTS.md) - Système de messagerie
- [GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md) - Guide de déploiement complet

---

## 🌍 Infrastructure "Africa-Ready"

### Connectivité Offline-First
- Cache local avec Service Workers
- Synchronisation différée des données
- Mode dégradé gracieux

### Paiements Mobile Money
- Intégration Orange Money / MTN / Mpesa
- Support multi-devises (XOF, XAF, CDF, CAD)

### Sécurité & Conformité
- Chiffrement de bout en bout (E2EE)
- Conformité FHIR (Fast Healthcare Interoperability Resources)
- Conformité RGPD + lois africaines sur les données

---

## 🤝 Contribution

Ce projet est **propriétaire** et n'accepte pas de contributions externes pour le moment.

Pour signaler un bug ou suggérer une amélioration :
- 📧 Email : contact@monafrica.net
- 🌐 Site : https://monafrica.net/contact

---

## 📄 License

© 2026 M.O.N.A - Tous droits réservés.  
Usage propriétaire uniquement.

---

## 🙏 Crédits

- **Design** : Philosophie "Quiet Luxury" inspirée des standards Hermès/Loro Piana
- **Icônes** : [Lucide React](https://lucide.dev)
- **UI Components** : [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com)
- **Cartes** : Intégration Google Maps API
- **Analytics** : Vercel Analytics

---

## 📞 Contact

- **Site web** : https://monafrica.net
- **Email support** : support@monafrica.net
- **Email contact** : contact@monafrica.net
- **Carrières** : https://monafrica.net/careers

---

**Fait avec ❤️ pour l'Afrique francophone**  
_Kinshasa • Dakar • Abidjan • Montréal_
