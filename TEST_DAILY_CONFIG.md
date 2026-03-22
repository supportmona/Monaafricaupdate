# Test rapide de la configuration Daily.co

## Test 1: Vérifier que la clé API est définie dans Supabase

### Via l'interface Supabase
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet M.O.N.A
3. Allez dans **Settings** > **Edge Functions** > **Secrets**
4. Vérifiez la présence de: `DAILY_API_KEY`

### Via la page de test M.O.N.A
1. Accédez à: `https://votre-site.com/test-daily`
2. Cliquez sur **"3. Vérifier la configuration Daily.co"**
3. Vérifiez le résultat dans `configured.DAILY_API_KEY`

**Résultat attendu:**
```json
{
  "configured": {
    "DAILY_API_KEY": true,  // ✅ Doit être true
    "DAILY_DOMAIN": true,
    "VIDEO_PROVIDER": true
  }
}
```

## Test 2: Vérifier que la clé API est valide

### Via curl (ligne de commande)
Remplacez `VOTRE_CLE_API` par votre vraie clé API Daily.co:

```bash
curl --request GET \
  --url https://api.daily.co/v1/rooms \
  --header "Authorization: Bearer VOTRE_CLE_API"
```

**Résultat attendu (Status 200):**
```json
{
  "total_count": 0,
  "data": []
}
```

**Si erreur 401:**
```json
{
  "error": "authentication-error",
  "info": "invalid api key"
}
```
→ Votre clé API est invalide, régénérez-en une nouvelle sur Daily.co

## Test 3: Tester la création d'une room via M.O.N.A

### Via la page de test
1. Accédez à: `https://votre-site.com/test-daily`
2. Lancez d'abord le **Test 1** (créer un rendez-vous)
3. Puis lancez le **Test 2** (rejoindre la room)

**Résultat attendu:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roomUrl": "https://migrmona.daily.co/mona-consult-1",
  "roomName": "mona-consult-1"
}
```

**Si erreur:**
```json
{
  "error": "Erreur d'authentification Daily.co - Vérifiez votre clé API"
}
```
→ Suivez le guide de diagnostic complet dans `/GUIDE_DIAGNOSTIC_DAILY.md`

## Test 4: Vérifier la connexion réelle à Daily.co

### Via la route de diagnostic
```bash
curl --request GET \
  --url https://VOTRE_PROJET_ID.supabase.co/functions/v1/make-server-6378cc81/consultations/check-daily-config \
  --header "Authorization: Bearer VOTRE_ANON_KEY"
```

**Résultat attendu:**
```json
{
  "configured": {
    "DAILY_API_KEY": true,
    "DAILY_DOMAIN": true,
    "VIDEO_PROVIDER": true
  },
  "connectionTest": {
    "success": true,  // ✅ Doit être true
    "configured": true,
    "message": "✅ Connexion à Daily.co réussie"
  }
}
```

## Checklist de diagnostic

Cochez chaque élément une fois vérifié:

- [ ] La clé API `DAILY_API_KEY` est configurée dans les secrets Supabase
- [ ] Le domaine `DAILY_DOMAIN` est configuré (valeur: `migrmona.daily.co`)
- [ ] Le provider `VIDEO_PROVIDER` est configuré (valeur: `daily`)
- [ ] La clé API est valide (test curl Status 200)
- [ ] La connexion à Daily.co fonctionne (connectionTest.success = true)
- [ ] La création de room fonctionne (Test 2 sur /test-daily)
- [ ] La génération de token fonctionne (token présent dans la réponse)

## Solutions rapides

### Problème: DAILY_API_KEY non configurée
**Solution:**
1. Allez sur https://dashboard.daily.co/developers
2. Copiez votre clé API
3. Ajoutez-la dans Supabase: Settings > Edge Functions > Secrets
4. Nom du secret: `DAILY_API_KEY`
5. Valeur: votre clé API complète

### Problème: Clé API invalide (401)
**Solution:**
1. Connectez-vous à https://dashboard.daily.co
2. Allez dans Developers > API Keys
3. Générez une nouvelle clé API
4. Remplacez l'ancienne clé dans Supabase

### Problème: Permissions insuffisantes (403)
**Solution:**
1. Vérifiez que votre compte Daily.co est actif
2. Vérifiez que vous n'avez pas dépassé les limites du plan gratuit
3. Contactez le support Daily.co si nécessaire

## Pages de test disponibles

### 1. `/test-daily` - Tests interactifs
Tests progressifs avec interface visuelle:
- Test 1: Création de rendez-vous
- Test 2: Création de room et génération de token
- Test 3: Vérification de la configuration

### 2. `/daily-setup` - Guide de configuration
Guide étape par étape avec instructions détaillées pour:
- Créer un compte Daily.co
- Récupérer la clé API
- Configurer les secrets Supabase
- Tester la configuration

## Prochaines étapes

Une fois tous les tests passés (✅):
1. Testez une vraie consultation via le portail expert
2. Vérifiez que le composant vidéo s'affiche correctement
3. Testez la fonctionnalité de chat et de partage d'écran
4. Vérifiez les logs de consultation

Si un test échoue (❌):
1. Consultez le guide complet: `/GUIDE_DIAGNOSTIC_DAILY.md`
2. Vérifiez les logs Supabase Edge Functions
3. Testez directement avec l'API Daily.co (curl)
4. Contactez le support si nécessaire

## Support

**Logs Supabase:**
Dashboard > Edge Functions > make-server-6378cc81 > Logs

**Documentation:**
- Daily.co: https://docs.daily.co/reference/rest-api
- Guide diagnostic: `/GUIDE_DIAGNOSTIC_DAILY.md`

**Contact:**
- Email: contact@monafrica.net
