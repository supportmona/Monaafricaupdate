# 🧪 GUIDE DE TEST - AUTHENTIFICATION B2B

## ⚡ TEST RAPIDE (2 minutes)

### Étape 1 : Connexion
```
1. Allez sur http://localhost:3000/entreprise/login
2. Cliquez sur "Utiliser" à côté de "Entreprise Démo"
3. Cliquez "Se connecter"
```

**Résultat attendu** :
- ✅ Redirection vers `/company/dashboard`
- ✅ Dashboard s'affiche correctement
- ✅ Pas de message d'erreur "Accès non autorisé"

---

### Étape 2 : Vérification localStorage
```
1. Ouvrez DevTools (F12)
2. Onglet "Application" → "Local Storage"
3. Regardez les clés stockées
```

**Résultat attendu** :
- ✅ `mona_company_token` = `"demo-token-b2b"`
- ✅ `mona_company_user` = `{"email":"demo.rh@monafrica.net"}`

---

### Étape 3 : Navigation
```
1. Depuis le dashboard, cliquez "Gérer les employés"
2. Cliquez "Analytics"
3. Cliquez "Paramètres"
```

**Résultat attendu** :
- ✅ Navigation fluide entre les pages
- ✅ Pas de redirection vers login
- ✅ Header toujours visible avec bouton logout

---

### Étape 4 : Déconnexion
```
1. Cliquez sur l'icône "LogOut" en haut à droite
```

**Résultat attendu** :
- ✅ Redirection vers `/entreprise/login`
- ✅ localStorage vidé (vérifier dans DevTools)
- ✅ Impossible d'accéder à `/company/dashboard` sans reconnexion

---

## 🔍 TESTS DÉTAILLÉS

### Test A : Protection des routes

**Sans connexion** :
```bash
1. Assurez-vous d'être déconnecté
2. Tapez directement dans la barre d'adresse :
   - http://localhost:3000/company/dashboard
   - http://localhost:3000/company/employees
   - http://localhost:3000/company/analytics
```

**Résultat attendu** :
- ✅ Redirection automatique vers `/entreprise/login`
- ✅ Message : "Accès non autorisé..."

---

### Test B : Multiples comptes

**Compte 1 : Entreprise Démo**
```
Email: demo.rh@monafrica.net
Pass: RH2025!
Employés: 50
```

**Compte 2 : Ekolo Tech**
```
Email: rh@ekolo-tech.com
Pass: MonaB2B2024!
Employés: 113
```

**Compte 3 : Bantu Finance**
```
Email: hr@bantu-finance.com
Pass: MonaB2B2024!
Employés: 87
```

**Procédure** :
```
1. Connectez-vous avec le compte 1
2. Vérifiez que le nom de l'entreprise s'affiche ("Entreprise Démo")
3. Déconnectez-vous
4. Connectez-vous avec le compte 2
5. Vérifiez que le nom change ("Ekolo Tech")
6. Vérifiez que le nombre d'employés affiché est différent
```

**Résultat attendu** :
- ✅ Chaque compte affiche ses propres données
- ✅ Logo adapté (initiales de l'entreprise)
- ✅ Nombre d'employés correct

---

### Test C : Rafraîchissement de page

**Procédure** :
```
1. Connectez-vous
2. Allez sur /company/dashboard
3. Appuyez sur F5 (rafraîchir)
```

**Résultat attendu** :
- ✅ Vous restez connecté
- ✅ Dashboard se recharge correctement
- ✅ Pas de redirection vers login

---

### Test D : Ouverture dans un nouvel onglet

**Procédure** :
```
1. Connectez-vous
2. Depuis le dashboard, cliquez droit sur "Analytics"
3. Choisissez "Ouvrir dans un nouvel onglet"
```

**Résultat attendu** :
- ✅ Page Analytics s'ouvre dans le nouvel onglet
- ✅ Vous êtes toujours connecté
- ✅ Header visible avec bouton logout

---

### Test E : Credentials incorrects

**Procédure** :
```
1. Allez sur /entreprise/login
2. Entrez un email invalide : test@test.com
3. Entrez un mot de passe : wrongpass123
4. Cliquez "Se connecter"
```

**Résultat attendu** :
- ❌ Erreur affichée : "Email ou mot de passe incorrect"
- ❌ Pas de redirection
- ❌ Pas de token dans localStorage

---

## 🐛 DÉPANNAGE

### Problème : "Accès non autorisé" après connexion

**Solution** :
```bash
1. Ouvrez DevTools (F12)
2. Onglet Console
3. Cherchez les erreurs
4. Vérifiez que localStorage contient :
   - mona_company_token
   - mona_company_user
5. Si absents, le problème est dans EntrepriseLoginPage
6. Si présents, le problème est dans CompanyProtectedRoute
```

---

### Problème : Badge de debug pas visible

**Solution** :
```bash
# Vider le cache et rebuilder
rm -rf node_modules/.vite
npm run dev
# Puis Ctrl+Shift+R dans le navigateur
```

---

### Problème : Déconnexion ne fonctionne pas

**Vérification** :
```javascript
// Ouvrir DevTools → Console
// Exécuter
localStorage.getItem("mona_company_token")
localStorage.getItem("mona_company_user")

// Après déconnexion, devrait retourner null
// Si ça retourne encore des valeurs, le localStorage n'est pas vidé
```

**Solution** :
```bash
# Vider manuellement
localStorage.clear()
# Puis tester à nouveau
```

---

## ✅ CHECKLIST COMPLÈTE

Avant de valider, assurez-vous que :

- [ ] Connexion avec Entreprise Démo fonctionne
- [ ] Connexion avec Ekolo Tech fonctionne
- [ ] Connexion avec Bantu Finance fonctionne
- [ ] localStorage contient `mona_company_token`
- [ ] localStorage contient `mona_company_user`
- [ ] Accès au dashboard autorisé après login
- [ ] Navigation entre pages fonctionne
- [ ] Rafraîchissement conserve la session
- [ ] Bouton LogOut visible dans le header
- [ ] Déconnexion redirige vers login
- [ ] localStorage vidé après déconnexion
- [ ] Routes protégées après déconnexion
- [ ] Credentials incorrects affichent une erreur
- [ ] Badge de debug visible en bas à droite
- [ ] Badge affiche "v2.1-auth-fixed"

---

## 📊 SCÉNARIOS EDGE CASES

### Scénario 1 : Token expiré (simulation)
```javascript
// Dans DevTools Console
localStorage.setItem("mona_company_token", "expired-token");
// Rafraîchir la page
// Devrait : Rester connecté (pas de validation de token en démo)
```

### Scénario 2 : Données corrompues
```javascript
// Dans DevTools Console
localStorage.setItem("mona_company_user", "invalid-json");
// Rafraîchir la page
// Peut causer : Erreur de parsing
```

### Scénario 3 : Bouton "Utiliser" pré-remplit
```
1. Sur /entreprise/login
2. Cliquez "Utiliser" sur Ekolo Tech
3. Vérifiez que email et password sont remplis
4. Changez pour Bantu Finance
5. Vérifiez que les champs sont mis à jour
```

---

## 🎯 MÉTRIQUES DE SUCCÈS

| Métrique | Cible | Comment tester |
|----------|-------|----------------|
| Taux de connexion réussie | 100% | Tester les 3 comptes |
| Persistance session | Oui | Rafraîchir la page |
| Temps de réponse login | < 1s | Chronomètre |
| Protection routes | 100% | Accès sans token |
| Déconnexion propre | Oui | localStorage vide |

---

## 🚀 PROCHAINES ÉTAPES

Une fois tous les tests validés :

1. ✅ Tester en production (build optimisé)
2. ✅ Tester sur différents navigateurs
3. ✅ Tester sur mobile/tablette
4. ✅ Ajouter des tests automatisés (Cypress/Playwright)
5. ✅ Monitoring des erreurs en production

---

**Version de test** : v2.1-auth-fixed  
**Date** : 16 Mars 2026, 15:00  
**Statut** : ✅ PRÊT POUR TESTS
