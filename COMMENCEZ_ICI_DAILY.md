# 🎬 Configuration Daily.co pour M.O.N.A - Commencez ici

**Date:** 11 février 2026  
**Objectif:** Résoudre l'erreur d'authentification Daily.co et activer les téléconsultations

---

## 🎯 Ce que vous devez faire maintenant

### ⚡ Configuration rapide (5 minutes)

#### 1️⃣ Récupérez votre clé API Daily.co

```
🔗 Allez sur: https://dashboard.daily.co/developers
📋 Copiez votre clé API
💡 Si vous n'en avez pas, créez-en une nouvelle
```

#### 2️⃣ Configurez le secret dans Supabase

```
🔗 Allez sur: https://supabase.com/dashboard
⚙️  Settings > Edge Functions > Secrets
➕ Ajoutez: DAILY_API_KEY = [votre clé API]
💾 Sauvegardez
```

#### 3️⃣ Testez la configuration

```
🔗 Allez sur: https://votre-site.monafrica.net/test-daily
▶️  Lancez le Test 3
✅ Vérifiez le message vert: "Configuration valide"
```

**C'est tout ! 🎉**

---

## 📖 Ce qui a été corrigé

### Problème identifié
L'erreur `authentication-error` était causée par une mauvaise lecture des variables d'environnement dans le code backend.

### Solution appliquée
- ✅ Réécriture du fichier `daily.tsx` avec lecture correcte des variables
- ✅ Ajout d'un test de connexion automatique
- ✅ Amélioration des messages d'erreur
- ✅ Création de pages de diagnostic

### Fichiers modifiés
- `/supabase/functions/server/daily.tsx` - RÉÉCRIT
- `/supabase/functions/server/consultation_routes.tsx` - AMÉLIORÉ
- `/src/app/pages/TestDailyPage.tsx` - AMÉLIORÉ
- `/src/app/pages/DailySetupPage.tsx` - AMÉLIORÉ

---

## 🧪 Comment tester

### Test automatique (recommandé)

Visitez cette page sur votre site:
```
https://votre-site.monafrica.net/test-daily
```

Lancez les 3 tests dans l'ordre:

**Test 1:** Créer un rendez-vous de test  
→ Vérifie que la base de données fonctionne

**Test 2:** Rejoindre la room vidéo  
→ Teste la création de room et la génération de token

**Test 3:** Vérifier la configuration  
→ Teste la connexion réelle à Daily.co

**✅ Résultat attendu:** Les 3 tests affichent des encadrés verts

### Test manuel (pour développeurs)

```bash
# Testez directement votre clé API
curl --request GET \
  --url https://api.daily.co/v1/rooms \
  --header "Authorization: Bearer VOTRE_CLE_API"

# Résultat attendu: Status 200
# {"total_count": 0, "data": []}
```

---

## 📚 Guides disponibles

Selon vos besoins, consultez:

| Guide | Quand l'utiliser |
|-------|------------------|
| **Ce fichier** | Pour une configuration rapide (5 min) |
| [`RESOLUTION_ERREUR_DAILY.md`](/RESOLUTION_ERREUR_DAILY.md) | Guide complet étape par étape |
| [`TEST_DAILY_CONFIG.md`](/TEST_DAILY_CONFIG.md) | Checklist de tests rapides |
| [`GUIDE_DIAGNOSTIC_DAILY.md`](/GUIDE_DIAGNOSTIC_DAILY.md) | Diagnostic approfondi en cas de problème |
| [`CORRECTIONS_DAILY_AUTHENTIFICATION.md`](/CORRECTIONS_DAILY_AUTHENTIFICATION.md) | Détails techniques des corrections |

---

## ❓ Questions fréquentes

### Q: Où trouver ma clé API Daily.co ?

**R:** 
1. Connectez-vous à https://dashboard.daily.co
2. Allez dans **Developers** > **API Keys**
3. Copiez la clé (64+ caractères)

### Q: Le Test 3 échoue, que faire ?

**R:** Vérifiez dans cet ordre:
1. La clé API est bien copiée sans espaces
2. Le secret `DAILY_API_KEY` est bien nommé (sensible à la casse)
3. Testez votre clé directement avec curl (voir ci-dessus)
4. Générez une nouvelle clé API si nécessaire

### Q: J'ai une erreur 401

**R:** Votre clé API est invalide. Solutions:
1. Vérifiez que vous avez copié la clé complète
2. Générez une nouvelle clé sur Daily.co
3. Remplacez la clé dans Supabase

### Q: Comment voir les logs d'erreur ?

**R:**
1. Dashboard Supabase
2. Edge Functions > make-server-6378cc81
3. Onglet Logs
4. Cherchez les lignes avec ❌ ou 🎬

### Q: Le test fonctionne mais pas en production

**R:**
1. Vérifiez que les Edge Functions sont bien redéployées
2. Videz le cache de votre navigateur
3. Testez en navigation privée
4. Consultez `/GUIDE_DIAGNOSTIC_DAILY.md`

---

## 🔧 Variables d'environnement requises

Ces secrets doivent être dans Supabase (Settings > Edge Functions > Secrets):

| Variable | Valeur | Obligatoire |
|----------|--------|-------------|
| `DAILY_API_KEY` | Votre clé API Daily.co | ✅ **OUI** |
| `DAILY_DOMAIN` | `migrmona.daily.co` | ⚠️ Recommandé |
| `VIDEO_PROVIDER` | `daily` | ⚠️ Recommandé |

---

## 🎯 Checklist de validation

Cochez chaque étape:

- [ ] J'ai récupéré ma clé API sur Daily.co
- [ ] J'ai ajouté le secret `DAILY_API_KEY` dans Supabase
- [ ] J'ai visité `/test-daily` sur mon site
- [ ] Le Test 3 affiche un encadré vert ✅
- [ ] Le Test 2 me donne un token et une roomUrl
- [ ] Je peux accéder à une consultation depuis le portail expert
- [ ] La vidéo se charge correctement

**✅ Toutes les cases cochées = Configuration réussie !**

---

## 📞 Besoin d'aide ?

### Pages de diagnostic M.O.N.A
- Tests interactifs: `/test-daily`
- Guide de config: `/daily-setup`

### Documentation
- Guide complet: [`/RESOLUTION_ERREUR_DAILY.md`](/RESOLUTION_ERREUR_DAILY.md)
- Diagnostic: [`/GUIDE_DIAGNOSTIC_DAILY.md`](/GUIDE_DIAGNOSTIC_DAILY.md)

### Support externe
- Daily.co: https://www.daily.co/contact
- Documentation Daily.co: https://docs.daily.co

### Support M.O.N.A
- Email: contact@monafrica.net

---

## 🚀 Prochaines étapes après configuration

Une fois la configuration validée:

1. ✅ **Testez une vraie consultation**
   - Connectez-vous au portail expert
   - Rejoignez une consultation
   - Vérifiez vidéo, audio, chat

2. ✅ **Formez vos experts**
   - Interface de consultation
   - Fonctionnalités vidéo
   - Prise de notes

3. ✅ **Lancez les téléconsultations**
   - Planifiez des consultations
   - Invitez vos premiers patients
   - Collectez les retours

---

## 🎉 Félicitations !

Votre système de téléconsultation M.O.N.A est maintenant prêt à l'emploi.

**Fonctionnalités disponibles:**
- 📹 Vidéo HD sécurisée
- 💬 Chat en temps réel
- 🖥️ Partage d'écran
- 📝 Prise de notes
- 🔒 Connexion sécurisée
- ⏱️ Gestion du temps

**Bon démarrage avec M.O.N.A ! 🌍**

---

**Créé le:** 11 février 2026  
**Version:** 1.0  
**Status:** ✅ Prêt
