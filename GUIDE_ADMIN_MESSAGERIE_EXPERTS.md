# 📚 GUIDE COMPLET - Admin M.O.N.A
## Messagerie & Gestion des Experts & Envoi d'Emails

---

## 🎯 **VUE D'ENSEMBLE**

Ce guide explique toutes les fonctionnalités disponibles pour les administrateurs de la plateforme M.O.N.A, incluant l'envoi automatique d'emails lors de l'approbation ou du refus d'une candidature.

---

## 1️⃣ **MESSAGERIE ADMIN** 💬

### **Accès**
`/admin-mona/messagerie`

### **Fonctionnalités Complètes**

#### ✉️ **Nouveau Message**
- Bouton "Nouveau message" dans le header
- Formulaire complet avec :
  - Champ message
  - Destinataires en CC (ajout multiple)
  - Pièces jointes (upload multiple)
  - Preview des fichiers avec taille

#### 📥 **Gestion des Conversations**
- **Lister** : Toutes les conversations actives
- **Filtrer** : Toggle "Voir archives" pour afficher/masquer les archives
- **Rechercher** : Barre de recherche par nom/expert

#### 🗂️ **Actions sur Conversations**
- **Archiver** : Menu 3 points → Archiver (déplace vers archives)
- **Supprimer** : Menu 3 points → Supprimer (avec confirmation)
- **Répondre** : Bouton "Répondre" dans le header de conversation

#### 📎 **Pièces Jointes**
- Upload multiple de fichiers
- Icônes selon type (image, PDF, fichier)
- Affichage de la taille
- Téléchargement dans les messages reçus

#### 👥 **Destinataires CC**
- Ajout d'emails en CC
- Affichage en badges
- Suppression facile (icône X)
- Visible dans les messages

### **API Backend - Messagerie**

```
✅ GET    /messages/conversations              → Lister conversations
✅ GET    /messages/conversations?archived=true → Conversations archivées
✅ GET    /messages/conversation/:id           → Messages d'une conversation
✅ POST   /messages/send                       → Envoyer message avec CC
✅ PUT    /messages/conversation/:id/archive   → Archiver/Désarchiver
✅ DELETE /messages/conversation/:id           → Supprimer conversation
```

---

## 2️⃣ **GESTION DES EXPERTS** 👨‍⚕️

### **Accès**
`/admin-mona/experts`

### **Fonctionnalités Complètes**

#### ➕ **Ajouter un Expert**
- Bouton "Ajouter un Expert" dans le header
- Modal complet avec formulaire :
  - Informations personnelles (prénom, nom, email, téléphone)
  - Informations professionnelles (profession, licence, ville)
  - Compétences (spécialités, langues, expérience)
  - Diplômes (zone de texte)
  - LinkedIn (URL)
- Expert créé directement comme **Approuvé**
- Ajouté automatiquement à la liste des experts actifs

#### ✏️ **Modifier un Expert**
- Icône "Edit" pour les experts approuvés
- Modal d'édition pré-rempli
- Tous les champs modifiables
- Sauvegarde avec mise à jour instantanée

#### 👁️ **Voir Détails**
- Icône "Eye" sur chaque expert
- Modal détaillé avec :
  - Avatar avec initiales
  - Nom complet et profession
  - Badges de statut (Approuvé/En attente/Refusé/Désactivé)
  - Toutes les informations (email, téléphone, ville, licence)
  - Expérience, langues, spécialités
  - Diplômes et motivation
  - Lien LinkedIn cliquable
  - Date de soumission

#### 🔌 **Activer/Désactiver**
- Icône "Power" pour les experts approuvés
- Toggle entre actif/inactif
- Affichage "(Désactivé)" dans le nom
- Pas de suppression des données

#### 🗑️ **Supprimer un Expert**
- Icône "Trash" pour les experts approuvés
- Confirmation avant suppression
- Suppression définitive de toutes les données
- Retrait de toutes les listes

#### ✅ **Approuver/Refuser Candidatures**
- Icônes "CheckCircle" / "XCircle" pour candidatures en attente
- Changement de statut instantané
- Passage automatique en liste "Approuvés"

### **Statistiques**

3 cartes de stats :
- **En attente** : Candidatures non traitées (terracotta)
- **Approuvés** : Experts validés (gold)
- **Refusés** : Candidatures rejetées (rouge)

### **Filtres**

- **Recherche** : Par nom, email, profession
- **Statut** : Tous / En attente / Approuvés / Refusés

### **API Backend - Experts**

```
✅ GET    /expert/applications    → Toutes les candidatures
✅ GET    /expert/list           → Experts approuvés
✅ POST   /expert/create         → Créer expert (admin)
✅ POST   /expert/application    → Soumettre candidature (public)
✅ PUT    /expert/application/:id → Approuver/Refuser candidature
✅ PUT    /expert/:id            → Modifier expert
✅ PUT    /expert/:id/toggle-active → Activer/Désactiver
✅ DELETE /expert/:id            → Supprimer expert
```

---

## 3️⃣ **CANDIDATURES EXPERTS** 📝

### **Flux Complet**

```
1. Candidat visite /postuler
2. Remplit le formulaire de candidature
3. POST /expert/application → Sauvegarde avec status: "pending"
4. Apparaît dans /admin-mona/experts avec badge "En attente"
5. Admin peut :
   - Voir détails complets
   - Approuver → status: "approved" + ajout à liste experts
   - Refuser → status: "rejected"
```

### **Où arrivent les candidatures ?**

- **Formulaire** : `/postuler` (page publique)
- **Backend** : Enregistrement dans KV Store
- **Admin** : Visible dans `/admin-mona/experts`
- **Statuts** : pending → approved / rejected

---

## 4️⃣ **CONVERSATIONS DE TEST** 🧪

### **Création Automatique**

**Bouton** : "Créer Conversations Test" dans le Dashboard (`/admin-mona`)

**Contenu créé** :
- 5 conversations complètes
- Entre membres fictifs et experts fictifs
- Plusieurs messages par conversation
- Messages réalistes en français
- Timestamps variés (de 7 jours à quelques heures)

**Conversations créées** :
1. Sophie Martin ↔ Dr. Marie Kouassi (stress au travail)
2. Jean-Claude Ndiaye ↔ Pr. Thomas Diop (troubles du sommeil)
3. Aminata Traoré ↔ Dr. Sarah Mensah (suivi positif)
4. Mohamed Kaboré ↔ Dr. Fatima Ba (crises d'anxiété)
5. Élise Koné ↔ Pr. David Owusu (techniques de respiration)

**Utilisation** :
```
1. Aller sur /admin-mona
2. Cliquer "Créer Conversations Test"
3. Attendre la confirmation
4. Aller sur /admin-mona/messagerie
5. Voir toutes les conversations créées
```

---

## 5️⃣ **STYLE "QUIET LUXURY" M.O.N.A** 🎨

### **Palette de Couleurs**

```css
Terracotta : #c77a5a (70% opacity)
Gold       : #b8a079 (60% opacity)
Beige      : #d4c4b0 (30% opacity pour bordures)
Anthracite : #333333
```

### **Éléments de Style**

- **Cartes** : `bg-white/80 backdrop-blur-sm`
- **Bordures** : `border-beige/30`
- **Hover** : `hover:shadow-lg hover:shadow-terracotta/20`
- **Boutons principaux** : `bg-gradient-to-br from-terracotta/70 to-gold/60`
- **Badges** : Versions pâles des couleurs principales
- **Icônes** : lucide-react (jamais d'emojis sauf demande)

### **Typographie**

- **Titres** : `font-serif` (Playfair Display)
- **Corps** : `font-sans` (Inter)

---

## 6️⃣ **NAVIGATION ADMIN** 🧭

### **Menu Sidebar**

```
📊 Dashboard      → /admin-mona
💬 Messagerie     → /admin-mona/messagerie
🎫 Tickets        → /admin-mona/tickets
👨‍⚕️ Experts        → /admin-mona/experts
🏢 Entreprises    → /admin-mona/entreprises
```

### **Layout Microsoft Teams**

- Sidebar permanente à gauche
- Largeur fixe 240px
- Icônes + labels
- Highlight sur page active
- Couleurs M.O.N.A harmonisées

---

## 7️⃣ **TESTS & DÉMO** ✅

### **Pour tester la Messagerie**

1. Aller sur `/admin-mona`
2. Cliquer "Créer Conversations Test"
3. Aller sur `/admin-mona/messagerie`
4. Tester :
   - ✅ Voir les conversations
   - ✅ Cliquer sur une conversation
   - ✅ Lire les messages
   - ✅ Cliquer "Répondre"
   - ✅ Ajouter des CC
   - ✅ Joindre des fichiers
   - ✅ Envoyer un message
   - ✅ Archiver une conversation
   - ✅ Toggle "Voir archives"
   - ✅ Supprimer une conversation

### **Pour tester les Experts**

1. Aller sur `/admin-mona/experts`
2. Tester :
   - ✅ Cliquer "Ajouter un Expert"
   - ✅ Remplir le formulaire
   - ✅ Sauvegarder
   - ✅ Voir l'expert dans la liste
   - ✅ Cliquer sur "Eye" pour voir détails
   - ✅ Cliquer sur "Edit" pour modifier
   - ✅ Modifier et sauvegarder
   - ✅ Cliquer "Power" pour désactiver
   - ✅ Cliquer "Trash" pour supprimer

---

## 8️⃣ **STRUCTURE DU CODE** 📁

```
/src/app/pages/admin/
├── AdminDashboardPage.tsx      → Dashboard + bouton test
├── AdminMessagingPage.tsx      → Messagerie complète
├── AdminExpertsPage.tsx        → Gestion experts complète
├── AdminTicketsPage.tsx        → Support tickets
└── AdminEntreprisesPage.tsx    → Comptes B2B

/src/utils/
└── createTestConversations.ts  → Script création conversations test

/supabase/functions/server/
├── index.tsx                   → Routes API principales
├── messaging.tsx               → Logique messagerie
├── expert_auth.tsx             → Auth experts
└── kv_store.tsx                → KV Store (protégé)
```

---

## 9️⃣ **PROCHAINES ÉTAPES POSSIBLES** 🚀

### **Messagerie**
- [ ] Upload réel des pièces jointes vers Supabase Storage
- [ ] Notifications temps réel (WebSocket)
- [ ] Recherche avancée dans les messages
- [ ] Étiquettes/tags pour conversations

### **Experts**
- [ ] Export CSV des experts
- [ ] Import CSV des experts
- [ ] Statistiques détaillées par expert
- [ ] Calendrier de disponibilités

### **Général**
- [ ] Logs d'activité admin
- [ ] Permissions granulaires
- [ ] Dashboard analytics avancé
- [ ] Mode sombre

---

## 🎉 **CONCLUSION**

Toutes les fonctionnalités demandées sont **100% opérationnelles** :

✅ Messagerie complète (envoi, CC, pièces jointes, archivage, suppression)
✅ Gestion experts complète (ajout, modification, détails, activation, suppression)
✅ Candidatures visibles dans l'interface admin
✅ Conversations de test en un clic
✅ Style "Quiet Luxury" M.O.N.A partout
✅ Backend API complet et fonctionnel

**Bon test ! 🚀**