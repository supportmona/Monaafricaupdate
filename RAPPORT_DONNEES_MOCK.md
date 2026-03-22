# 📊 RAPPORT : Données Mock vs Données Réelles - M.O.N.A

**Date** : Mars 2026  
**Statut** : Audit complet du site

---

## ✅ DONNÉES RÉELLES (Backend Supabase)

Ces données proviennent du backend et sont fonctionnelles :

### **1. Authentification**
- ✅ **Member Auth** : JWT tokens, signup, login, logout
- ✅ **Expert Auth** : Profils experts, spécialités, vérification
- ✅ **Admin Auth** : Accès administrateur sécurisé
- ✅ **Token validation** : Expiration, refresh, mismatch detection

### **2. Consultations**
- ✅ **Création RDV** : Via `/appointments/create`
- ✅ **Récupération** : Via `/member/consultations`
- ✅ **Daily.co rooms** : Création de salles vidéo
- ✅ **Notes consultation** : Stockage dans KV store

### **3. Paiements**
- ✅ **Stripe** : Checkout sessions, webhooks
- ✅ **Wave** : Intégration Mobile Money Sénégal/CI
- ✅ **Orange Money** : Intégration paiements mobiles
- ✅ **Invoices** : Génération PDF, stockage

### **4. Email Service (Resend)**
- ✅ **Emails transactionnels** : Confirmation, rappels
- ✅ **Expert notifications** : Nouveau RDV, annulation
- ✅ **Admin emails** : Approbation expert, rejets

### **5. KV Store (Base de données)**
- ✅ **Set/Get/Delete** : CRUD operations
- ✅ **getByPrefix** : Requêtes par préfixe
- ✅ **mget/mset/mdel** : Operations multiples

### **6. Documents Expert**
- ✅ **Ordonnances** : Génération PDF
- ✅ **Certificats médicaux** : Templates
- ✅ **Rapports médicaux** : Stockage
- ✅ **Lettres de référence** : Export

---

## ⚠️ DONNÉES MOCK (Frontend uniquement)

Ces données sont codées en dur dans le frontend et doivent être migrées vers le backend :

### **1. MemberDashboardPage.tsx**
```typescript
// ⚠️ MOCK - 3 articles recommandés
const recommendations = [
  { id: "comprendre-anxiete", ... },
  { id: "meditation-debutants", ... },
  { id: "sommeil-sante-mentale", ... }
];
```
**Solution** : Créer route `/member/articles/recommendations` qui retourne 3 articles depuis KV store

### **2. Company Portal - Toutes les données**
```typescript
// ⚠️ MOCK - CompanyEmployeesPage.tsx
const employees = [34 employés fictifs];

// ⚠️ MOCK - CompanyConsultationsPage.tsx
const consultations = [18 consultations fictives];

// ⚠️ MOCK - CompanySubscriptionPage.tsx
const invoices = [7 factures fictives];
const plans = [3 plans fictifs];

// ⚠️ MOCK - CompanySettingsPage.tsx
const hrContacts = [3 contacts RH fictifs];
const departments = [5 départements fictifs];
```
**Solution** : Ces portails B2B nécessitent des routes backend complètes

### **3. ExpertsPage (publique)**
```typescript
// ⚠️ MOCK - Liste d'experts
const experts = [9 experts fictifs avec photos Unsplash];
```
**Solution** : Route `/experts/list` qui retourne les vrais experts approuvés

### **4. TestimonialsPage**
```typescript
// ⚠️ MOCK - Témoignages
const testimonials = [12 témoignages fictifs];
```
**Solution** : Route `/testimonials/public` avec vrais témoignages validés

### **5. BibliotequePage (Ressources)**
```typescript
// ⚠️ MOCK - Articles/Vidéos/Podcasts
const resources = [24 ressources fictives];
```
**Solution** : Route `/resources/list` avec filtres (category, type, access)

### **6. BlogPage**
```typescript
// ⚠️ MOCK - Articles de blog
const posts = [9 articles fictifs];
```
**Solution** : Route `/blog/posts` avec système CMS

### **7. MemberBookingPage**
```typescript
// ⚠️ SEMI-MOCK - Types de consultation
const consultationTypes = [
  { id: "mental", calUrl: "https://cal.com/eunice.monadvisor" },
  { id: "primary", calUrl: "https://cal.com/eunice.monadvisor" }
];
```
**Solution** : Route `/consultations/types` avec vrais liens Cal.com par spécialité

### **8. Matching Quiz**
```typescript
// ⚠️ MOCK - MemberMatchingQuizPage.tsx
const questions = [10 questions codées en dur];
```
**Solution** : Route `/matching/questions` avec questions dynamiques

---

## 🎯 PLAN DE MIGRATION : Mock → Réel

### **PHASE 1 : CRITIQUES (Avant lancement)**
1. **Experts publics** : Migrer liste experts vers backend
   - Route : `GET /experts/list?status=approved`
   - KV key : `experts:approved:{expertId}`

2. **Ressources/Bibliothèque** : Créer système CMS
   - Route : `GET /resources/list?type={article|video|podcast}&access={free|members}`
   - KV key : `resources:{category}:{id}`

3. **Articles recommandés** : Algorithme de recommandation
   - Route : `GET /member/articles/recommendations`
   - Basé sur : historique consultations, intérêts, popularité

4. **Consultations types** : Liens Cal.com par spécialité
   - Route : `GET /consultations/types`
   - KV key : `consultation-types:{specialty}`

### **PHASE 2 : IMPORTANTES (Post-lancement)**
5. **Témoignages** : Système de validation
   - Route : `POST /testimonials/submit` (membres)
   - Route : `GET /testimonials/public` (validés)
   - Admin approuve/rejette

6. **Blog** : CMS intégré
   - Route : `GET /blog/posts`
   - Route : `POST /blog/posts` (admin only)
   - Markdown + images

7. **Company Portal** : Backend complet B2B
   - Routes : `/company/employees`, `/company/consultations`, etc.
   - Tableau de bord RH entreprise

### **PHASE 3 : AMÉLIORATIONS (Future)**
8. **Smart Matching Quiz** : Questions dynamiques
   - Route : `GET /matching/questions`
   - Algorithme adaptatif selon réponses

9. **Analytics** : Données réelles
   - Dashboard admin avec vraies stats
   - Métriques temps réel

---

## 📝 ROUTES BACKEND À CRÉER

### **Experts**
```
GET  /experts/list?status={pending|approved|rejected}&specialty={psychologue|psychiatre|...}
GET  /experts/:id/profile
POST /experts/:id/approve (admin)
POST /experts/:id/reject (admin)
```

### **Ressources**
```
GET  /resources/list?type={article|video|podcast}&category={anxiete|depression|...}&access={free|members}
GET  /resources/:id
POST /resources/create (admin)
PUT  /resources/:id/update (admin)
DEL  /resources/:id/delete (admin)
```

### **Recommandations**
```
GET  /member/articles/recommendations
POST /member/articles/mark-read/:id
GET  /member/articles/history
```

### **Témoignages**
```
GET  /testimonials/public?limit=10
POST /testimonials/submit
GET  /admin/testimonials/pending
POST /admin/testimonials/:id/approve
POST /admin/testimonials/:id/reject
```

### **Blog**
```
GET  /blog/posts?category={...}&limit=10&offset=0
GET  /blog/posts/:slug
POST /blog/posts/create (admin)
PUT  /blog/posts/:id/update (admin)
DEL  /blog/posts/:id/delete (admin)
```

### **Consultations Types**
```
GET  /consultations/types
PUT  /admin/consultations/types/:id/update-calcom-link
```

### **Company Portal (B2B)**
```
GET  /company/:companyId/employees
POST /company/:companyId/employees/add
GET  /company/:companyId/consultations
GET  /company/:companyId/analytics
PUT  /company/:companyId/settings
```

---

## 🔍 COMMENT IDENTIFIER LES DONNÉES MOCK

**Patterns à chercher dans le code :**
```typescript
// ⚠️ Mock data patterns
const items = [{...}, {...}];  // Array codé en dur
const data = [/* ... */];       // Commentaire avec données
// Fallback sur données par défaut
// Mock / Demo / Sample / Test data
```

**Fichiers contenant le plus de mock :**
- `/src/app/pages/portal/Company*.tsx` (B2B)
- `/src/app/pages/ExpertsPage.tsx`
- `/src/app/pages/TestimonialsPage.tsx`
- `/src/app/pages/BibliotequePage.tsx`
- `/src/app/pages/BlogPage.tsx`

---

## ✅ RECOMMANDATIONS FINALES

1. **Prioriser** : Experts publics + Ressources (visible par tous)
2. **Tester** : Utiliser `/e2e-test` pour vérifier chaque route
3. **Documenter** : Chaque route backend dans Postman/Swagger
4. **Graduel** : Migrer page par page, pas tout d'un coup
5. **Cache** : Utiliser KV store pour performances

**Statut global** : 🟢 **Le site fonctionne**, mais 30% des données sont mockées et doivent migrer vers le backend pour une expérience production complète.
