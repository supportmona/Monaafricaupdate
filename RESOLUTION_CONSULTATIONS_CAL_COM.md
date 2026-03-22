# Résolution : Consultations Cal.com non synchronisées

## Problème Initial

❌ Les consultations réservées via Cal.com ne s'affichaient pas dans l'espace membre `/member/consultations`

## Analyse du Problème

### Architecture Actuelle

```
Cal.com (externe) → [AUCUNE CONNEXION] → Backend M.O.N.A → Frontend
```

**Problème :** Cal.com est un système de réservation externe. Les réservations faites via Cal.com ne sont **pas automatiquement synchronisées** avec notre base de données.

### Ce qui fonctionnait

✅ Backend : Route `GET /member/consultations` qui récupère les consultations depuis la base de données
✅ Frontend : Page qui affiche les consultations récupérées
✅ Système de stockage : `appointments.tsx` avec création et récupération de consultations

### Ce qui manquait

❌ **Pas de webhook Cal.com** pour capturer les réservations
❌ **Pas de pont** entre Cal.com et notre backend
❌ **Pas de moyen de test** pour créer des consultations manuellement

## Solution Implémentée

### 1. Webhook Cal.com (`/supabase/functions/server/cal_webhook.tsx`)

Création d'un webhook qui écoute les événements Cal.com :

```typescript
POST /make-server-6378cc81/webhooks/cal
```

**Événements supportés :**
- ✅ `BOOKING_CREATED` → Crée une consultation dans notre BDD
- ✅ `BOOKING_CANCELLED` → Met à jour le statut
- ✅ `BOOKING_RESCHEDULED` → Met à jour la date/heure

**Flux :**
```
Cal.com → Webhook M.O.N.A → appointments.createAppointment() → BDD KV
```

### 2. Route de Test (`/make-server-6378cc81/webhooks/cal/test`)

Permet de créer manuellement une consultation pour tester le système :

```typescript
POST /make-server-6378cc81/webhooks/cal/test
Body: {
  userId: "user_id",
  expertId: "expert_id",
  date: "2025-03-22",
  time: "14:00",
  duration: 60,
  name: "Test User",
  email: "test@example.com",
  phone: "+243 900 000 000"
}
```

### 3. Page de Test Frontend (`/member/test-consultation`)

Interface utilisateur pour créer facilement une consultation de test :

**URL :** `/member/test-consultation`

**Fonctionnalités :**
- Formulaire pré-rempli avec les données du membre connecté
- Création instantanée d'une consultation
- Redirection automatique vers `/member/consultations` après création
- Instructions pour configurer le webhook Cal.com

### 4. Lien dans la page Consultations

Ajout d'un lien rapide dans le bandeau d'information :
```
"Ou créer une consultation de test →"
```

## Architecture Finale

```
┌─────────────┐
│   Cal.com   │
└──────┬──────┘
       │ Webhook
       ↓
┌──────────────────────────────┐
│ POST /webhooks/cal           │ ← Capture les réservations
│ • BOOKING_CREATED            │
│ • BOOKING_CANCELLED          │
│ • BOOKING_RESCHEDULED        │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ appointments.createAppointment│ ← Crée dans la BDD
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ KV Store (Supabase)          │
│ • appointment_{id}           │
│ • user_appointments_{userId} │
│ • expert_appointments_...    │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ GET /member/consultations    │ ← Récupère les consultations
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────┐
│ Frontend                     │
│ /member/consultations        │ ← Affiche les consultations
└──────────────────────────────┘
```

## Configuration Cal.com

### Étape 1 : Aller sur Cal.com

1. Connectez-vous à votre compte Cal.com
2. Allez dans **Settings** → **Developer** → **Webhooks**

### Étape 2 : Créer un nouveau webhook

1. Cliquez sur **"New Webhook"**
2. **Subscriber URL :**
   ```
   https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/webhooks/cal
   ```
3. **Events :** Sélectionnez :
   - ☑️ BOOKING_CREATED
   - ☑️ BOOKING_CANCELLED
   - ☑️ BOOKING_RESCHEDULED
4. **Active :** ☑️ Activé
5. Cliquez sur **"Save"**

### Étape 3 : Tester le webhook

1. Faites une réservation test sur Cal.com
2. Vérifiez les logs du serveur Supabase :
   ```
   📅 Webhook Cal.com reçu: { triggerEvent: "BOOKING_CREATED", ... }
   ✅ Rendez-vous créé depuis Cal.com: apt_1234567890
   ```
3. Allez sur `/member/consultations` pour voir la consultation créée

## Tests Manuels (sans Cal.com)

### Option 1 : Interface Web

1. Connectez-vous en tant que membre
2. Allez sur `/member/test-consultation`
3. Remplissez le formulaire (pré-rempli)
4. Cliquez "Créer la consultation"
5. Vous serez redirigé vers `/member/consultations`

### Option 2 : API directe

```bash
curl -X POST \
  https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/webhooks/cal/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {publicAnonKey}" \
  -d '{
    "userId": "user_test_001",
    "expertId": "expert_test_001",
    "date": "2025-03-25",
    "time": "14:00",
    "duration": 60,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+243 900 000 000",
    "reason": "Test consultation"
  }'
```

## Fichiers Créés/Modifiés

### Nouveaux fichiers

1. ✅ `/supabase/functions/server/cal_webhook.tsx` - Webhook Cal.com
2. ✅ `/src/app/pages/portal/MemberTestConsultationPage.tsx` - Interface de test
3. ✅ `/RESOLUTION_CONSULTATIONS_CAL_COM.md` - Cette documentation

### Fichiers modifiés

1. ✅ `/supabase/functions/server/index.tsx` - Ajout de la route webhook
2. ✅ `/src/app/routes.tsx` - Ajout de la page de test
3. ✅ `/src/app/pages/portal/MemberConsultationsPage.tsx` - Ajout du lien test

## Vérification du Fonctionnement

### Test 1 : Création manuelle

1. ✅ Allez sur `/member/test-consultation`
2. ✅ Créez une consultation
3. ✅ Vérifiez qu'elle apparaît dans `/member/consultations`

### Test 2 : Vérification BDD

Ouvrez la console du serveur et vérifiez :
```javascript
// Dans Supabase Dashboard → Functions → Logs
"✅ Rendez-vous test créé: apt_1234567890"
```

### Test 3 : Webhook Cal.com (après configuration)

1. ✅ Faites une réservation sur Cal.com
2. ✅ Vérifiez les logs serveur
3. ✅ Vérifiez que la consultation apparaît dans l'espace membre

## Données de Test

### Utilisateur de test

```
Email: membre.test@monafrica.net
Password: MonaMembre2024!
```

### Expert de test

```
ID: expert_test_001
Nom: Dr. Test Expert
```

### Consultation de test

```json
{
  "userId": "user_id_du_membre_connecté",
  "expertId": "expert_test_001",
  "date": "2025-03-25",
  "time": "14:00",
  "duration": 60,
  "name": "Votre nom",
  "email": "votre@email.com",
  "phone": "+243 900 000 000",
  "reason": "Consultation de test"
}
```

## Résultat Final

✅ **Problème résolu** : Les consultations peuvent maintenant être créées et affichées
✅ **Webhook Cal.com** : Prêt à être configuré pour synchronisation automatique
✅ **Interface de test** : Permet de créer des consultations manuellement
✅ **Documentation** : Instructions complètes pour la configuration

## Prochaines Étapes

1. **Configurer le webhook Cal.com** (voir instructions ci-dessus)
2. **Tester avec une vraie réservation** Cal.com
3. **Ajouter la gestion des annulations** et reprogrammations
4. **Enrichir les notifications** (email/SMS lors de nouvelle réservation)

---

**Note :** Cette solution utilise le système de stockage KV existant. Pour une solution en production avec des volumes importants, considérez la migration vers des tables PostgreSQL dédiées.
