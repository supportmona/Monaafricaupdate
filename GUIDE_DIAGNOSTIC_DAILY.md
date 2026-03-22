# Guide de diagnostic Daily.co pour M.O.N.A

## Problème rencontré
Erreur d'authentification Daily.co ("authentication-error") lors de la création de rooms vidéo pour les téléconsultations.

## Corrections apportées

### 1. Correction du fichier `/supabase/functions/server/daily.tsx`

**Problème identifié:**
- Les variables `DAILY_API_KEY` et `DAILY_API_BASE` étaient utilisées mais jamais définies
- Cela causait des erreurs d'authentification car la clé API n'était pas lue depuis les variables d'environnement

**Solution appliquée:**
```typescript
// Configuration Daily.co depuis les variables d'environnement
const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
const DAILY_DOMAIN = Deno.env.get("DAILY_DOMAIN") || "migrmona.daily.co";
const DAILY_API_BASE = "https://api.daily.co/v1";
```

**Fonctions ajoutées:**
- ✅ `createConsultationRoom()` - Créer une room vidéo privée
- ✅ `createMeetingToken()` - Générer un token d'accès sécurisé
- ✅ `getRoomInfo()` - Récupérer les informations d'une room
- ✅ `deleteRoom()` - Supprimer une room
- ✅ `getRoomPresence()` - Vérifier qui est présent dans une room
- ✅ `testDailyConnection()` - Tester la connexion à l'API Daily.co

### 2. Amélioration de la route de diagnostic

**Fichier:** `/supabase/functions/server/consultation_routes.tsx`

**Ajout d'un test de connexion réel:**
```typescript
app.get("/check-daily-config", async (c) => {
  // ... vérification des variables d'environnement
  
  // NOUVEAU: Test de connexion réelle à l'API Daily.co
  const connectionTest = await daily.testDailyConnection();
  
  return c.json({
    configured: { /* ... */ },
    values: { /* ... */ },
    connectionTest: {
      success: connectionTest.success,
      error: connectionTest.error,
      message: /* ... */
    }
  });
});
```

### 3. Pages de test améliorées

**Pages créées/mises à jour:**
- `/test-daily` - Page de test interactive avec 3 tests progressifs
- `/daily-setup` - Guide de configuration étape par étape

## Comment diagnostiquer le problème

### Étape 1: Vérifier la configuration des secrets Supabase

1. Allez sur votre tableau de bord Supabase
2. Naviguez vers **Settings** > **Edge Functions** > **Secrets**
3. Vérifiez que ces secrets sont configurés:
   - `DAILY_API_KEY` - Votre clé API Daily.co (commence par un hash long)
   - `DAILY_DOMAIN` - Votre domaine Daily.co (ex: `migrmona.daily.co`)
   - `VIDEO_PROVIDER` - Doit être `daily`

### Étape 2: Récupérer votre clé API Daily.co

1. Connectez-vous à https://dashboard.daily.co
2. Allez dans **Developers** > **API Keys**
3. Copiez votre clé API (elle ressemble à: `a20193f70dd0d7158fc06d4954457e1c...`)
4. Si vous n'avez pas de clé, créez-en une nouvelle

### Étape 3: Tester la configuration

#### Option A: Via la page de test
1. Accédez à `/test-daily` sur votre site
2. Lancez le **Test 3: Vérifier la configuration Daily.co**
3. Vérifiez les résultats:
   - ✅ **Succès**: Configuration valide, connexion OK
   - ❌ **Erreur**: Vérifiez le message d'erreur détaillé

#### Option B: Via curl (commande dans le prompt)
```bash
curl --request GET \
  --url https://api.daily.co/v1/rooms \
  --header "Authorization: Bearer VOTRE_CLE_API"
```

**Résultat attendu:**
- Status 200: Clé API valide
- Status 401: Clé API invalide ou manquante
- Status 403: Permissions insuffisantes

### Étape 4: Logs du serveur

Pour voir les logs détaillés du serveur:

1. Allez sur votre tableau de bord Supabase
2. Naviguez vers **Edge Functions** > **make-server-6378cc81**
3. Cliquez sur **Logs**
4. Cherchez les messages qui commencent par:
   - 🎬 Tentative de création d'une room
   - ❌ Erreur de création de room
   - ✅ Room créée avec succès

## Messages d'erreur courants

### 1. "DAILY_API_KEY non configurée"
**Cause:** La variable d'environnement n'est pas définie
**Solution:** Configurez le secret `DAILY_API_KEY` dans Supabase

### 2. "Erreur d'authentification Daily.co"
**Cause:** La clé API est invalide ou expirée
**Solution:** 
- Vérifiez que vous avez copié la bonne clé depuis Daily.co
- Générez une nouvelle clé API si nécessaire
- Vérifiez que votre compte Daily.co est actif

### 3. "Accès refusé - Vérifiez les permissions"
**Cause:** La clé API n'a pas les permissions nécessaires
**Solution:** Dans Daily.co, vérifiez que votre clé API a les permissions:
- Créer des rooms
- Générer des tokens
- Lire les informations des rooms

## Tests de fonctionnement

### Test complet via `/test-daily`

**Test 1: Créer un rendez-vous de test**
- Crée un rendez-vous dans la base de données
- Vérifie que le système de stockage fonctionne

**Test 2: Rejoindre la room vidéo**
- Crée une room Daily.co automatiquement
- Génère un token d'accès sécurisé
- Teste l'authentification complète

**Test 3: Vérifier la configuration**
- Vérifie les variables d'environnement
- Teste la connexion réelle à l'API Daily.co
- Affiche les informations de diagnostic

## Configuration recommandée

### Variables d'environnement Supabase

```bash
DAILY_API_KEY=<votre-cle-api-daily-co>
DAILY_DOMAIN=migrmona.daily.co
VIDEO_PROVIDER=daily
```

### Vérification de la clé API

La clé API Daily.co doit:
- Être une chaîne de 64+ caractères
- Commencer par un hash hexadécimal
- Être active et non expirée
- Avoir les permissions de création de rooms et tokens

## Support

Si le problème persiste après avoir suivi ce guide:

1. **Vérifiez les logs Supabase** pour identifier l'erreur exacte
2. **Testez votre clé API** directement avec l'API Daily.co (voir commande curl ci-dessus)
3. **Contactez le support Daily.co** pour vérifier l'état de votre compte
4. **Régénérez une nouvelle clé API** si nécessaire

## Ressources

- Documentation Daily.co: https://docs.daily.co/reference/rest-api
- Tableau de bord Daily.co: https://dashboard.daily.co
- Support Daily.co: https://www.daily.co/contact

## Journal des modifications

**11 février 2026**
- ✅ Correction de la lecture des variables d'environnement dans `daily.tsx`
- ✅ Ajout de la fonction `testDailyConnection()` pour diagnostiquer les problèmes
- ✅ Amélioration de la route `/check-daily-config` avec test de connexion réel
- ✅ Mise à jour des pages de test avec messages d'erreur détaillés
- ✅ Création du guide de diagnostic complet
