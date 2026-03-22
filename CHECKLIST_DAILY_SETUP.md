# ✓ Checklist de configuration Daily.co

**Plateforme:** M.O.N.A (Mieux-être, Optimisation & Neuro-Apaisement)  
**Date:** 11 février 2026  
**Objectif:** Activer les téléconsultations vidéo

---

## 📋 Phase 1: Préparation (5 minutes)

### Compte Daily.co

- [ ] J'ai un compte Daily.co actif
- [ ] Je peux me connecter à https://dashboard.daily.co
- [ ] J'ai accès à la section "Developers"

**❌ Pas de compte ?**  
→ Créez-en un sur: https://www.daily.co/signup

---

## 🔑 Phase 2: Récupération de la clé API (2 minutes)

### Accès à la clé API

- [ ] Je suis connecté à Daily.co Dashboard
- [ ] J'ai navigué vers "Developers" > "API Keys"
- [ ] Je vois ma clé API (ou j'en ai créé une nouvelle)
- [ ] J'ai copié la clé complète dans mon presse-papier

**💡 Info:** La clé ressemble à `a20193f70dd0d7158fc06d4954457e1c...`

**🔗 Lien direct:** https://dashboard.daily.co/developers

---

## ⚙️ Phase 3: Configuration Supabase (3 minutes)

### Accès aux secrets

- [ ] Je suis connecté à Supabase Dashboard
- [ ] J'ai sélectionné mon projet M.O.N.A
- [ ] Je suis dans Settings > Edge Functions > Secrets

### Ajout du secret DAILY_API_KEY

- [ ] J'ai cliqué sur "Add secret"
- [ ] J'ai entré le nom: `DAILY_API_KEY` (exactement)
- [ ] J'ai collé ma clé API Daily.co complète
- [ ] J'ai sauvegardé le secret

### Secrets optionnels (recommandés)

- [ ] J'ai ajouté `DAILY_DOMAIN` avec la valeur `migrmona.daily.co`
- [ ] J'ai ajouté `VIDEO_PROVIDER` avec la valeur `daily`

**🔗 Lien direct:** https://supabase.com/dashboard

---

## 🧪 Phase 4: Tests de configuration (5 minutes)

### Test 1: Vérification visuelle

- [ ] J'ai ouvert `/test-daily` sur mon site M.O.N.A
- [ ] La page se charge correctement
- [ ] Je vois 3 sections de test

### Test 2: Configuration des variables

- [ ] J'ai cliqué sur "Lancer le test" du Test 3
- [ ] J'ai attendu le résultat (quelques secondes)
- [ ] Je vois un encadré vert ✅
- [ ] Le message dit "Configuration valide et connexion réussie"

**❌ Encadré rouge ?**
→ Vérifiez:
- La clé API est bien copiée sans espaces
- Le nom du secret est exactement `DAILY_API_KEY`
- Consultez [`RESOLUTION_ERREUR_DAILY.md`](/RESOLUTION_ERREUR_DAILY.md)

### Test 3: Création de rendez-vous

- [ ] J'ai cliqué sur "Lancer le test" du Test 1
- [ ] Le résultat est vert ✅
- [ ] Je vois les détails du rendez-vous créé

### Test 4: Création de room vidéo

- [ ] J'ai cliqué sur "Lancer le test" du Test 2
- [ ] Le résultat est vert ✅
- [ ] Je vois un `token` dans la réponse
- [ ] Je vois une `roomUrl` dans la réponse

**✅ Tous les tests verts = Configuration réussie !**

---

## 🔍 Phase 5: Test manuel (optionnel, pour développeurs)

### Test curl de la clé API

- [ ] J'ai ouvert un terminal
- [ ] J'ai exécuté la commande curl avec ma clé
- [ ] Le résultat est Status 200
- [ ] Je vois `{"total_count": 0, "data": []}`

**Commande:**
```bash
curl --request GET \
  --url https://api.daily.co/v1/rooms \
  --header "Authorization: Bearer VOTRE_CLE_API"
```

---

## 🎯 Phase 6: Test en conditions réelles (10 minutes)

### Portail Expert

- [ ] Je peux me connecter au portail expert (`/expert/login`)
- [ ] Je vois le tableau de bord expert
- [ ] Je vois la liste des consultations

### Consultation vidéo

- [ ] J'ai créé ou sélectionné une consultation
- [ ] J'ai cliqué sur "Rejoindre la consultation"
- [ ] La page de consultation se charge
- [ ] Le composant vidéo apparaît
- [ ] Je vois ma caméra (après autorisation)
- [ ] J'entends mon microphone

### Fonctionnalités

- [ ] Le chat fonctionne
- [ ] Le partage d'écran fonctionne (si activé)
- [ ] Les notes de consultation sont accessibles
- [ ] Le timer de consultation fonctionne

---

## 📊 Phase 7: Vérification des logs (5 minutes)

### Logs Supabase

- [ ] J'ai ouvert Supabase Dashboard
- [ ] Je suis dans Edge Functions > make-server-6378cc81
- [ ] J'ai cliqué sur l'onglet "Logs"
- [ ] Je vois des messages de log récents

### Logs de succès à chercher

- [ ] Je vois des messages avec ✅
- [ ] Je vois "Room créée avec succès"
- [ ] Je vois "Token généré avec succès"
- [ ] Je vois "Connexion à Daily.co réussie"

### Absence d'erreurs

- [ ] Je ne vois pas de messages avec ❌
- [ ] Je ne vois pas "authentication-error"
- [ ] Je ne vois pas "DAILY_API_KEY non définie"

**❌ Des erreurs dans les logs ?**
→ Consultez [`GUIDE_DIAGNOSTIC_DAILY.md`](/GUIDE_DIAGNOSTIC_DAILY.md)

---

## 🚀 Phase 8: Mise en production (optionnel)

### Documentation

- [ ] J'ai lu [`RESOLUTION_ERREUR_DAILY.md`](/RESOLUTION_ERREUR_DAILY.md)
- [ ] Je comprends le système de téléconsultation
- [ ] J'ai les ressources de support

### Formation

- [ ] J'ai testé toutes les fonctionnalités
- [ ] Je sais comment rejoindre une consultation
- [ ] Je sais comment utiliser le chat
- [ ] Je sais comment prendre des notes

### Lancement

- [ ] J'ai formé mes experts à la plateforme
- [ ] J'ai planifié mes premières consultations
- [ ] J'ai communiqué aux patients comment rejoindre
- [ ] Je suis prêt à lancer les téléconsultations

---

## 📈 Résumé de la progression

### ✅ Configuration minimale (obligatoire)

Vous êtes prêt si vous avez:
- [x] Clé API Daily.co récupérée
- [x] Secret `DAILY_API_KEY` configuré dans Supabase
- [x] Test 3 de `/test-daily` réussi (encadré vert)
- [x] Test 2 de `/test-daily` réussi (token reçu)

### ⚠️ Configuration recommandée (optionnelle)

Pour une expérience optimale:
- [ ] Secret `DAILY_DOMAIN` configuré
- [ ] Secret `VIDEO_PROVIDER` configuré
- [ ] Test en conditions réelles effectué
- [ ] Logs vérifiés sans erreur

### 🎯 Production ready (idéal)

Pour un lancement professionnel:
- [ ] Toutes les phases complétées
- [ ] Formation des experts effectuée
- [ ] Tests de bout en bout validés
- [ ] Documentation lue et comprise

---

## 🎓 Ressources de support

### Guides M.O.N.A

| Guide | Usage |
|-------|-------|
| [`COMMENCEZ_ICI_DAILY.md`](/COMMENCEZ_ICI_DAILY.md) | Configuration rapide (5 min) |
| [`RESOLUTION_ERREUR_DAILY.md`](/RESOLUTION_ERREUR_DAILY.md) | Guide complet étape par étape |
| [`TEST_DAILY_CONFIG.md`](/TEST_DAILY_CONFIG.md) | Tests de validation |
| [`GUIDE_DIAGNOSTIC_DAILY.md`](/GUIDE_DIAGNOSTIC_DAILY.md) | Résolution de problèmes |

### Pages de test

- `/test-daily` - Tests interactifs
- `/daily-setup` - Guide de configuration visuel

### Documentation externe

- Daily.co API: https://docs.daily.co/reference/rest-api
- Daily.co Dashboard: https://dashboard.daily.co
- Support Daily.co: https://www.daily.co/contact

### Support M.O.N.A

- Email: contact@monafrica.net

---

## 🎯 Objectifs atteints

Une fois toutes les cases cochées:

✅ **Technique:**
- Configuration Daily.co validée
- Intégration backend fonctionnelle
- Tests de connexion réussis
- Logs propres sans erreur

✅ **Fonctionnel:**
- Création de rooms automatique
- Génération de tokens sécurisés
- Vidéo HD fonctionnelle
- Chat et partage d'écran opérationnels

✅ **Utilisateur:**
- Interface intuitive
- Expérience fluide
- Sécurité garantie
- Support disponible

---

## 🎉 Félicitations !

Votre système de téléconsultation M.O.N.A est maintenant:

- ✅ Configuré correctement
- ✅ Testé et validé
- ✅ Prêt pour vos patients
- ✅ Sécurisé et fiable

**Vous pouvez maintenant offrir des consultations vidéo de qualité professionnelle à vos patients à travers l'Afrique francophone ! 🌍**

---

**Version:** 1.0  
**Créé le:** 11 février 2026  
**Status:** ✅ Validé

**Prochaine étape:** Lancez votre première téléconsultation ! 🚀
