# Guide de Connexion Admin avec 2FA

## Identifiants de Connexion

### Compte Admin Principal
- **Email:** `admin@monafrica.net`
- **Mot de passe:** `MonaAdmin2024!`
- **Code 2FA:** `202601`

## Flux de Connexion

### Étape 1 : Identifiants
1. Allez sur `/admin/login`
2. Entrez l'email : `admin@monafrica.net`
3. Entrez le mot de passe : `MonaAdmin2024!`
4. Cliquez sur "Continuer"

**Résultat attendu :**
- Le système vérifie les identifiants
- Le backend retourne `{ success: false, error: "2FA_REQUIRED" }`
- L'interface passe automatiquement à l'écran 2FA

### Étape 2 : Code 2FA
1. Un formulaire de code 2FA s'affiche automatiquement
2. Entrez le code : `202601`
3. Cliquez sur "Vérifier et se connecter"

**Résultat attendu :**
- Le système vérifie le code 2FA
- Si correct : redirection vers `/admin/dashboard`
- Si incorrect : message d'erreur "Code de vérification incorrect"

## Debug et Logs Console

Ouvrez la console du navigateur pour voir :

### Étape Identifiants
```
🔐 Tentative de connexion admin pour: admin@monafrica.net
📥 Réponse du serveur: { success: false, error: "2FA_REQUIRED" }
🔐 Code 2FA requis
📊 État actuel - error: 2FA_REQUIRED - step: credentials
🔄 Passage à l'étape 2FA
```

### Étape 2FA (Code Correct)
```
🔐 Soumission du code 2FA: 202601
🔐 Tentative de connexion admin pour: admin@monafrica.net
✅ Connexion réussie avec compte admin de test: admin@monafrica.net
📥 Réponse du serveur: { success: true, data: {...} }
✅ Admin connecté avec succès
✅ 2FA validé, redirection...
```

### Étape 2FA (Code Incorrect)
```
🔐 Soumission du code 2FA: 123456
🔐 Tentative de connexion admin pour: admin@monafrica.net
❌ Code 2FA incorrect pour: admin@monafrica.net
📥 Réponse du serveur: { success: false, error: "Code de vérification incorrect" }
❌ Erreur de connexion admin: Code de vérification incorrect
❌ Code 2FA invalide
```

## Résolution de Problèmes

### Problème : L'écran 2FA ne s'affiche pas
**Solution :** 
- Vérifiez la console pour voir si `error: 2FA_REQUIRED` est bien reçu
- Vérifiez que le useEffect se déclenche avec les logs

### Problème : Code 2FA toujours refusé
**Solution :**
- Vérifiez que vous utilisez bien le code `202601`
- Assurez-vous d'entrer exactement 6 chiffres
- Vérifiez les logs backend pour voir quelle erreur est retournée

### Problème : Boucle de connexion
**Solution :**
- Supprimez les données localStorage :
  ```js
  localStorage.removeItem('mona_admin_user')
  localStorage.removeItem('mona_admin_token')
  ```
- Rechargez la page

## Architecture Technique

### Backend (`/supabase/functions/server/admin_auth.tsx`)
- Vérifie email + mot de passe
- Si correct ET 2FA activé → retourne `2FA_REQUIRED`
- Si code2FA fourni → vérifie le code
- Si tout est correct → retourne session + user data

### Frontend (`/src/app/contexts/AdminAuthContext.tsx`)
- Envoie les credentials au backend
- Détecte `error: "2FA_REQUIRED"`
- Stocke l'erreur dans le state

### Interface (`/src/app/pages/admin/AdminLoginPage.tsx`)
- useEffect écoute l'erreur `2FA_REQUIRED`
- Change automatiquement `step` de 'credentials' à '2fa'
- Affiche le formulaire 2FA
- Resubmit avec code2FA inclus

## Flux Complet (Schéma)

```
User → Saisie email/password
   ↓
Frontend → POST /admin/login { email, password }
   ↓
Backend → Vérifie credentials
   ↓
Backend → 2FA activé ? → OUI
   ↓
Backend → Code 2FA fourni ? → NON
   ↓
Backend → Retourne { success: false, error: "2FA_REQUIRED" }
   ↓
Frontend → Détecte error === "2FA_REQUIRED"
   ↓
Frontend → Change step = '2fa'
   ↓
User → Saisie code 2FA
   ↓
Frontend → POST /admin/login { email, password, code2FA }
   ↓
Backend → Vérifie code 2FA
   ↓
Backend → Code correct ? → OUI
   ↓
Backend → Retourne { success: true, data: { user, session } }
   ↓
Frontend → Stocke user + token
   ↓
Frontend → Redirect /admin/dashboard
```

## Tests Recommandés

1. **Test Complet** : Email → Password → 2FA correct → Dashboard
2. **Test 2FA Incorrect** : Email → Password → 2FA incorrect → Message erreur
3. **Test Email Incorrect** : Email incorrect → Message erreur
4. **Test Password Incorrect** : Email correct + Password incorrect → Message erreur
5. **Test Bouton Retour** : Sur écran 2FA → Clic "Retour" → Retour à écran identifiants
