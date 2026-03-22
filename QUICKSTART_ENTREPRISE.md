# 🚀 DÉMARRAGE RAPIDE - PORTAIL ENTREPRISE

## ⚡ Connexion en 30 secondes

### Étape 1 : Accédez à la page de login
```
http://localhost:3000/entreprise/login
```

### Étape 2 : Choisissez un compte de test

**Option A : Entreprise Démo** (Recommandé)
```
Email     : demo.rh@monafrica.net
Mot de passe : RH2025!
```

**Option B : Ekolo Tech**
```
Email     : rh@ekolo-tech.com
Mot de passe : MonaB2B2024!
```

**Option C : Bantu Finance**
```
Email     : hr@bantu-finance.com
Mot de passe : MonaB2B2024!
```

### Étape 3 : Explorez le portail

Après connexion, vous êtes sur `/company/dashboard` avec accès à :

- 📊 **Dashboard** - Vue d'ensemble RH
- 👥 **Employés** - Gestion des collaborateurs
- 💬 **Consultations** - Suivi anonymisé
- 📈 **Analytics** - Graphiques détaillés
- ⚙️ **Paramètres** - Configuration
- 💳 **Abonnement** - Facturation

---

## 🎯 TEST RAPIDE

### 1. Connexion
```bash
# Allez sur
http://localhost:3000/entreprise/login

# Utilisez
demo.rh@monafrica.net / RH2025!

# Résultat attendu
→ Redirection vers /company/dashboard ✅
```

### 2. Ajout employé
```bash
# Sur le dashboard, cliquez sur
"Gestion des employés"

# Cliquez sur
"+ Ajouter un employé"

# Remplissez le formulaire
Nom: Jean Dupont
Email: jean.dupont@demo-entreprise.com
Poste: Développeur
Département: Tech

# Résultat attendu
→ Employé ajouté à la liste ✅
```

### 3. Voir les analytics
```bash
# Cliquez sur "Analytics" dans le menu

# Résultat attendu
→ Graphiques Recharts s'affichent ✅
→ Évolution des consultations visible ✅
→ Taux de participation calculé ✅
```

---

## 🔧 DÉPANNAGE EXPRESS

### Problème : "Email ou mot de passe incorrect"
**Solution** : Copiez-collez EXACTEMENT le mot de passe depuis ce document

### Problème : Toujours sur `/b2b-login`
**Solution** :
```bash
# 1. Arrêter le serveur (Ctrl+C)

# 2. Supprimer le cache
rm -rf node_modules/.vite
rm -rf .vite

# 3. Redémarrer
npm run dev

# 4. Vider le cache navigateur
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Problème : Page blanche après login
**Solution** :
```bash
# 1. Ouvrir DevTools (F12)
# 2. Onglet Console
# 3. Regarder les erreurs
# 4. Vérifier que le token existe
localStorage.getItem('company_auth_token')
```

---

## 📱 NAVIGATION DEPUIS L'ACCUEIL

### Méthode 1 : Via le menu "Connexion"
```
1. Page d'accueil
2. Cliquez "Connexion" (en haut à droite)
3. Dropdown apparaît
4. Cliquez "Entreprise"
5. → /entreprise/login ✅
```

### Méthode 2 : Via la page B2B
```
1. Page d'accueil
2. Cliquez "Entreprises" dans le menu
3. → /b2b (page présentation)
4. Cliquez "Accéder au Dashboard B2B"
5. → /entreprise/login ✅
```

---

## 💡 ASTUCES

### Badge de debug
En bas à droite, vous voyez :
```
🟢 v2.0-entreprise-login-ready
   2026-03-16 14:45
   ✓ /entreprise/login
   ✓ 3 comptes test B2B
```

Si vous voyez ce badge → Code à jour ✅
Si vous ne le voyez pas → Videz le cache

### Comptes pré-remplis
Sur la page de login, les 3 comptes sont affichés directement dans un encadré doré. Vous n'avez qu'à copier-coller !

### Déconnexion rapide
Sur n'importe quelle page du portail, cliquez "Déconnexion" en haut à droite.

---

## 📚 DOCUMENTATION COMPLÈTE

Pour plus de détails, consultez :
- **`COMPTES_TEST_ENTREPRISE.md`** - Tous les comptes de test
- **`INSTRUCTIONS_UTILISATEUR.md`** - Guide de dépannage
- **`DEBUG_NAVIGATION.md`** - Architecture des routes

---

## ✅ CHECKLIST DE VÉRIFICATION

Avant de tester, assurez-vous que :

- [ ] Le serveur dev est lancé (`npm run dev`)
- [ ] Vous êtes sur `http://localhost:3000`
- [ ] Le badge debug est visible en bas à droite
- [ ] Vous avez vidé le cache navigateur
- [ ] Vous utilisez un compte de test valide

---

**Besoin d'aide ?** Email : entreprises@monafrica.net

**Version actuelle** : v2.0-entreprise-login-ready | 16 Mars 2026
