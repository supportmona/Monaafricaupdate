# Mémo : Amélioration du Portail Expert

## Problème
L'utilisateur dit que "le portail expert n'est pas au point" et demande "où sont les autres pages ?"

## Analyse

### Pages Expert Existantes
Toutes les pages existent déjà dans `/src/app/pages/portal/` :

✅ **ExpertDashboardPage.tsx** - Tableau de bord  
✅ **ExpertAgendaPage.tsx** - Agenda  
✅ **ExpertPatientsPage.tsx** - Liste des patients  
✅ **ExpertMedicalRecordsPage.tsx** - Dossiers médicaux  
✅ **ExpertMedicalRecordDetailPage.tsx** - Détail d'un dossier  
✅ **ExpertConsultationRoomPage.tsx** - Salle de consultation  
✅ **ExpertMessagesPage.tsx** - Messagerie  
✅ **ExpertSettingsPage.tsx** - Paramètres  
✅ **PrescriptionTemplatePage.tsx** - Modèles d'ordonnances  

### Routes Configurées
Toutes les routes sont définies dans `/src/app/routes.tsx` :

```typescript
{ path: "/expert/dashboard", element: <SuspenseWrapper><ExpertDashboardPage /></SuspenseWrapper> },
{ path: "/expert/agenda", element: <SuspenseWrapper><ExpertAgendaPage /></SuspenseWrapper> },
{ path: "/expert/patients", element: <SuspenseWrapper><ExpertPatientsPage /></SuspenseWrapper> },
{ path: "/expert/medical-records", element: <SuspenseWrapper><ExpertMedicalRecordsPage /></SuspenseWrapper> },
{ path: "/expert/medical-records/:id", element: <SuspenseWrapper><ExpertMedicalRecordDetailPage /></SuspenseWrapper> },
{ path: "/expert/consultation-room/:id", element: <SuspenseWrapper><ExpertConsultationRoomPage /></SuspenseWrapper> },
{ path: "/expert/messages", element: <SuspenseWrapper><ExpertMessagesPage /></SuspenseWrapper> },
{ path: "/expert/settings", element: <SuspenseWrapper><ExpertSettingsPage /></SuspenseWrapper> },
{ path: "/expert/prescription-template", element: <SuspenseWrapper><PrescriptionTemplatePage /></SuspenseWrapper> },
```

### Problème Identifié
**Il manque une sidebar de navigation !**

Les pages existent, mais l'utilisateur ne peut pas y accéder facilement car :
- Pas de menu latéral (sidebar) pour naviguer entre les pages
- Juste un header avec le profil utilisateur
- Aucune indication visuelle des pages disponibles

## Solution Implémentée

### 1. Création d'ExpertSidebar
**Fichier** : `/src/app/components/ExpertSidebar.tsx`

Menu latéral avec navigation vers toutes les pages :
- Tableau de bord
- Agenda
- Patients
- Dossiers médicaux
- Messages
- Modèles d'ordonnance
- Paramètres

Caractéristiques :
- Responsive (collapse sur mobile avec overlay)
- Indication visuelle de la page active
- Logo M.O.N.A en haut
- Section d'aide en bas

### 2. Création d'ExpertLayout
**Fichier** : `/src/app/components/ExpertLayout.tsx`

Layout complet qui combine :
- Sidebar (avec bouton menu mobile)
- Header (avec titre, notifications, profil)
- Zone de contenu (children)

### 3. Modification des Pages Expert
Toutes les pages expert doivent être modifiées pour utiliser `ExpertLayout` au lieu de `ExpertHeader`.

**Avant** :
```tsx
export default function ExpertDashboardPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <ExpertHeader title="Tableau de bord" />
      <main>
        {/* Contenu */}
      </main>
    </div>
  );
}
```

**Après** :
```tsx
export default function ExpertDashboardPage() {
  return (
    <ExpertLayout title="Tableau de bord">
      {/* Contenu directement */}
    </ExpertLayout>
  );
}
```

## Prochaines Étapes

### Étape 1 : Modifier ExpertDashboardPage ✅ EN COURS
Utiliser le nouveau layout

### Étape 2 : Modifier les Autres Pages Expert
- ExpertAgendaPage.tsx
- ExpertPatientsPage.tsx
- ExpertMedicalRecordsPage.tsx
- ExpertMedicalRecordDetailPage.tsx
- ExpertConsultationRoomPage.tsx
- ExpertMessagesPage.tsx
- ExpertSettingsPage.tsx
- PrescriptionTemplatePage.tsx

### Étape 3 : Tests
- Vérifier la navigation entre toutes les pages
- Vérifier le responsive (mobile/desktop)
- Vérifier l'indicateur de page active
- Vérifier le fonctionnement du profil et notifications

## Notes Techniques

### Structure du Layout
```
<div className="flex"> (flex horizontal)
  <ExpertSidebar /> (largeur fixe 320px)
  <div className="flex-1"> (prend le reste)
    <header> (sticky top)
    <main> (scroll)
  </div>
</div>
```

### Responsive
- **Desktop (lg+)** : Sidebar toujours visible
- **Mobile (< lg)** : Sidebar cachée, bouton menu pour l'ouvrir

### État de Navigation
Utilise `useLocation()` pour détecter la page active et appliquer le style actif.

## Impact

### Avant
- ❌ Pas de navigation visible
- ❌ Utilisateur perdu, ne sait pas quelles pages existent
- ❌ Doit taper l'URL manuellement

### Après
- ✅ Navigation claire et visible
- ✅ Toutes les pages accessibles en un clic
- ✅ Indicateur visuel de la page active
- ✅ Expérience fluide et professionnelle

## Fichiers Créés
1. `/src/app/components/ExpertSidebar.tsx`
2. `/src/app/components/ExpertLayout.tsx`
3. `/MEMO_PORTAIL_EXPERT.md` (ce fichier)

## Fichiers à Modifier
1. ✅ `/src/app/pages/portal/ExpertDashboardPage.tsx` (EN COURS)
2. ⬜ `/src/app/pages/portal/ExpertAgendaPage.tsx`
3. ⬜ `/src/app/pages/portal/ExpertPatientsPage.tsx`
4. ⬜ `/src/app/pages/portal/ExpertMedicalRecordsPage.tsx`
5. ⬜ `/src/app/pages/portal/ExpertMedicalRecordDetailPage.tsx`
6. ⬜ `/src/app/pages/portal/ExpertConsultationRoomPage.tsx`
7. ⬜ `/src/app/pages/portal/ExpertMessagesPage.tsx`
8. ⬜ `/src/app/pages/portal/ExpertSettingsPage.tsx`
9. ⬜ `/src/app/pages/portal/PrescriptionTemplatePage.tsx`

**Total** : 1/9 pages modifiées
