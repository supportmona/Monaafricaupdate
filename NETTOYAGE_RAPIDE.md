# 🧹 GUIDE DE NETTOYAGE RAPIDE

## 🎯 RÉSUMÉ EXÉCUTIF

Votre plateforme M.O.N.A **fonctionne** mais contient :
- ❌ **1 route en doublon** (consultation membre)
- ❌ **4 fichiers inutilisés** (~1100 lignes de code mort)
- ⚠️ **Organisation incohérente** (pages Expert dispersées)

**Temps de nettoyage estimé** : 15 minutes ⏱️

---

## ⚡ NETTOYAGE EXPRESS (5 MINUTES)

### **Étape 1 : Supprimer la route doublon** ✂️

Ouvrir `/src/app/routes.tsx` et **SUPPRIMER la ligne 296** :

```typescript
// ❌ SUPPRIMER cette ligne :
{ path: "/member/consultation-room/:consultationId", element: <ConsultationRoomPage /> },
```

**Résultat** :
```typescript
// AVANT (lignes 292-297)
{ path: "/expert/messages", element: <ChatPage /> },
{ path: "/member/messages", element: <ChatPage /> },
{ path: "/expert/consultation-room/:id", element: <ExpertConsultationRoomPage /> },
{ path: "/expert/settings", element: <ExpertSettingsPage /> },
{ path: "/member/consultation-room/:consultationId", element: <ConsultationRoomPage /> }, // ❌ À SUPPRIMER
{ path: "/expert/prescription-template", element: <PrescriptionPage /> },

// APRÈS (lignes 292-296)
{ path: "/expert/messages", element: <ChatPage /> },
{ path: "/member/messages", element: <ChatPage /> },
{ path: "/expert/consultation-room/:id", element: <ExpertConsultationRoomPage /> },
{ path: "/expert/settings", element: <ExpertSettingsPage /> },
{ path: "/expert/prescription-template", element: <PrescriptionPage /> },
```

### **Étape 2 : Supprimer l'import ConsultationRoomPage** ✂️

Dans `/src/app/routes.tsx`, **SUPPRIMER la ligne 120** :

```typescript
// ❌ SUPPRIMER cette ligne :
const ConsultationRoomPage = lazy(() => import("@/app/pages/portal/ConsultationRoomPage"));
```

**DONE** ! ✅ Le conflit de routes est résolu.

---

## 🧹 NETTOYAGE COMPLET (15 MINUTES)

### **Fichiers à supprimer**

Exécuter ces commandes ou supprimer manuellement les fichiers :

```bash
# 1. Doublon de consultation membre (inutilisé)
rm /src/app/pages/portal/ConsultationRoomPage.tsx

# 2. Pages de messagerie inutilisées
rm /src/app/pages/expert/ExpertMessagesPage.tsx
rm /src/app/pages/portal/MemberMessagesPage.tsx

# 3. Doublon ExpertDashboardPage (garder celui dans portal/)
rm /src/app/pages/expert/ExpertDashboardPage.tsx
```

**Vérification** :
- ✅ Aucun import ne référence ces fichiers dans `routes.tsx`
- ✅ Suppression sans danger

---

## 📦 RÉORGANISATION (OPTIONNEL - 30 MINUTES)

### **Déplacer les pages Expert au bon endroit**

#### **Étape 1 : Déplacer les fichiers**

```bash
# Déplacer depuis /portal/ vers /expert/
mv /src/app/pages/portal/ExpertCalendarPage.tsx /src/app/pages/expert/
mv /src/app/pages/portal/ExpertDocumentsPage.tsx /src/app/pages/expert/
mv /src/app/pages/portal/ExpertPatientDetailPage.tsx /src/app/pages/expert/
mv /src/app/pages/portal/ExpertPatientsPage.tsx /src/app/pages/expert/
```

#### **Étape 2 : Mettre à jour les imports dans routes.tsx**

Ouvrir `/src/app/routes.tsx` et modifier les lignes suivantes :

```typescript
// AVANT (lignes 104-106, 114-115)
const ExpertPatientsPage = lazy(() => import("@/app/pages/portal/ExpertPatientsPage"));
const ExpertDashboardPage = lazy(() => import("@/app/pages/portal/ExpertDashboardPage"));
const ExpertPatientDetailPage = lazy(() => import("@/app/pages/portal/ExpertPatientDetailPage"));
const ExpertDocumentsPage = lazy(() => import("@/app/pages/portal/ExpertDocumentsPage"));
const ExpertCalendarPage = lazy(() => import("@/app/pages/portal/ExpertCalendarPage"));

// APRÈS
const ExpertPatientsPage = lazy(() => import("@/app/pages/expert/ExpertPatientsPage"));
const ExpertDashboardPage = lazy(() => import("@/app/pages/portal/ExpertDashboardPage")); // ⚠️ Reste dans portal
const ExpertPatientDetailPage = lazy(() => import("@/app/pages/expert/ExpertPatientDetailPage"));
const ExpertDocumentsPage = lazy(() => import("@/app/pages/expert/ExpertDocumentsPage"));
const ExpertCalendarPage = lazy(() => import("@/app/pages/expert/ExpertCalendarPage"));
```

**Note** : `ExpertDashboardPage` reste dans `/portal/` car c'est la version utilisée.

---

## ✅ CHECKLIST DE VÉRIFICATION

Après le nettoyage, vérifier que tout fonctionne :

### **1. Routes de consultation** ✓
- [ ] `/expert/consultation-room/1` → Ouvre ExpertConsultationRoomPage
- [ ] `/member/consultation-room/1` → Ouvre MemberConsultationRoomPage
- [ ] Aucune erreur dans la console

### **2. Routes de messagerie** ✓
- [ ] `/expert/messages` → Ouvre ChatPage (mode expert)
- [ ] `/member/messages` → Ouvre ChatPage (mode member)
- [ ] Conversations se chargent correctement

### **3. Dashboard Expert** ✓
- [ ] `/expert/dashboard` → Ouvre ExpertDashboardPage
- [ ] Liens vers patients/agenda/documents fonctionnent

### **4. Pas d'erreurs** ✓
- [ ] `npm run dev` démarre sans erreur
- [ ] Aucun warning "Cannot find module"
- [ ] Build réussit : `npm run build`

---

## 🐛 TROUBLESHOOTING

### **Erreur : Cannot find module ConsultationRoomPage**

**Cause** : L'import existe toujours dans `routes.tsx`  
**Solution** : Supprimer la ligne 120 :
```typescript
const ConsultationRoomPage = lazy(() => import("@/app/pages/portal/ConsultationRoomPage"));
```

### **Erreur : Page Expert ne charge pas**

**Cause** : Fichier déplacé mais import pas mis à jour  
**Solution** : Vérifier l'import dans `routes.tsx` et corriger le chemin

### **Erreur 404 sur /member/consultation-room/:id**

**Cause** : Route supprimée par erreur  
**Solution** : Vérifier que la ligne 267 existe bien :
```typescript
{ path: "/member/consultation-room/:id", element: <MemberConsultationRoomPage /> }
```

---

## 📊 AVANT / APRÈS

### **AVANT le nettoyage**
```
/src/app/pages/
├── portal/
│   ├── ConsultationRoomPage.tsx ⚠️ DOUBLON
│   ├── MemberMessagesPage.tsx ⚠️ NON UTILISÉ
│   ├── ExpertCalendarPage.tsx ⚠️ MAUVAIS ENDROIT
│   ├── ExpertDocumentsPage.tsx ⚠️ MAUVAIS ENDROIT
│   └── ... (88 fichiers)
└── expert/
    ├── ExpertMessagesPage.tsx ⚠️ NON UTILISÉ
    ├── ExpertDashboardPage.tsx ⚠️ DOUBLON
    └── ... (15 fichiers)

Total: 103 fichiers, ~1100 lignes de code mort
```

### **APRÈS le nettoyage**
```
/src/app/pages/
├── portal/
│   ├── ChatPage.tsx ✅
│   ├── MemberConsultationRoomPage.tsx ✅
│   ├── ExpertDashboardPage.tsx ✅
│   └── ... (84 fichiers)
└── expert/
    ├── ExpertConsultationRoomPage.tsx ✅
    ├── ExpertCalendarPage.tsx ✅
    ├── ExpertDocumentsPage.tsx ✅
    ├── ExpertPatientsPage.tsx ✅
    ├── ExpertPatientDetailPage.tsx ✅
    └── ... (18 fichiers)

Total: 99 fichiers, code propre ✨
```

**Gain** :
- ✅ 4 fichiers supprimés
- ✅ ~1100 lignes de code en moins
- ✅ Organisation cohérente
- ✅ Maintenance simplifiée

---

## 🎯 RÉSUMÉ FINAL

### **Nettoyage EXPRESS (obligatoire)** ⚡
1. ✂️ Supprimer ligne 296 dans `routes.tsx`
2. ✂️ Supprimer ligne 120 dans `routes.tsx`

**Temps** : 2 minutes  
**Impact** : Résout le conflit de routes

### **Nettoyage COMPLET (recommandé)** 🧹
1. ✂️ Supprimer 4 fichiers inutilisés
2. 📦 Déplacer 4 pages Expert
3. 🔧 Mettre à jour imports

**Temps** : 15 minutes  
**Impact** : Code propre et bien organisé

### **Résultat** ✅
- ✅ Téléconsultation : **OPÉRATIONNELLE**
- ✅ Messagerie : **OPÉRATIONNELLE**
- ✅ Organisation : **COHÉRENTE**
- ✅ Code : **PROPRE**

---

**Bon nettoyage !** 🧹✨

---

*Guide créé le 16 février 2026*  
*Équipe technique M.O.N.A*  
*Contact : tech@monafrica.net*
