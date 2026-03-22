# 🏢 COMPTES DE TEST PORTAIL ENTREPRISE

## 📋 Vue d'ensemble

Le portail entreprise M.O.N.A dispose de **3 comptes de test** prêts à l'emploi pour démontrer les fonctionnalités B2B.

---

## 🔐 COMPTES DISPONIBLES

### 1️⃣ **Entreprise Démo** (Recommandé pour les tests)

**Informations de connexion**
```
Email     : demo.rh@monafrica.net
Mot de passe : RH2025!
```

**Détails de l'entreprise**
- Nom : Entreprise Démo
- ID : demo-001
- Rôle : Admin (accès complet)
- Employés : 50
- Localisations : Kinshasa, Dakar, Abidjan

**Accès**
- Dashboard complet ✅
- Gestion des employés ✅
- Consultations ✅
- Analytics & graphiques ✅
- Paramètres ✅
- Abonnement ✅

---

### 2️⃣ **Ekolo Tech**

**Informations de connexion**
```
Email     : rh@ekolo-tech.com
Mot de passe : MonaB2B2024!
```

**Détails de l'entreprise**
- Nom : Ekolo Tech
- ID : ekolo-001
- Rôle : Admin (accès complet)
- Employés : 113
- Localisations : Kinshasa, Dakar, Abidjan

**Profil**
Entreprise technologique innovante avec une forte croissance en Afrique francophone.

---

### 3️⃣ **Bantu Finance**

**Informations de connexion**
```
Email     : hr@bantu-finance.com
Mot de passe : MonaB2B2024!
```

**Détails de l'entreprise**
- Nom : Bantu Finance
- ID : bantu-002
- Rôle : HR Manager (gestionnaire RH)
- Employés : 87
- Localisations : Kinshasa

**Profil**
Institution financière spécialisée dans les services bancaires d'entreprise.

---

## 🚀 COMMENT SE CONNECTER

### Méthode 1 : Via la navigation principale

1. Allez sur la page d'accueil M.O.N.A
2. Cliquez sur **"Connexion"** (en haut à droite)
3. Dans le dropdown, cliquez sur **"Entreprise"**
4. Vous arrivez sur `/entreprise/login`
5. Utilisez l'un des comptes ci-dessus
6. Cliquez sur **"Se connecter"**

### Méthode 2 : Accès direct

Allez directement sur :
```
http://localhost:3000/entreprise/login
```

---

## 📊 FONCTIONNALITÉS ACCESSIBLES

Une fois connecté, vous avez accès à :

### **Dashboard** (`/company/dashboard`)
- Vue d'ensemble des statistiques RH
- Graphiques de consultations mensuelles
- Indicateurs de bien-être
- Taux d'utilisation du programme
- Activité récente

### **Gestion Employés** (`/company/employees`)
- Liste complète des employés
- Ajout de nouveaux employés
- Attribution de crédits consultations
- Suivi individuel (anonymisé)
- Filtres et recherche avancée

### **Consultations** (`/company/consultations`)
- Historique des consultations (données anonymisées)
- Filtres par statut, date, type
- Statistiques d'utilisation
- Export de rapports

### **Analytics** (`/company/analytics`)
- Graphiques détaillés (Recharts)
- Évolution dans le temps
- Taux de participation
- Répartition par département
- Insights et recommandations

### **Paramètres** (`/company/settings`)
- Informations entreprise
- Gestion des crédits
- Préférences de notification
- Configuration RH
- Intégrations

### **Abonnement** (`/company/subscription`)
- Plan actuel et détails
- Historique de facturation
- Upgrade/Downgrade
- Méthodes de paiement
- Factures et reçus

---

## 🎨 DESIGN SYSTÈME

### Esthétique "Quiet Luxury"
- ✅ Typographie : Badges UPPERCASE + Lignes noires
- ✅ Titres géants avec italiques
- ✅ Boutons noirs rounded-full
- ✅ Palette : Beige + Blanc + Noir + Terracotta + Gold
- ✅ Aucun emoji (image de marque premium)
- ✅ Email officiel : @monafrica.net

### Devises
- 💰 XOF (Franc CFA)
- 💵 USD (Dollar américain)
- Toggle switch pour basculer entre les deux

---

## 🔒 SÉCURITÉ & ISOLATION

### Isolation des données
Chaque entreprise ne voit QUE ses propres données :
- ✅ Employés de son organisation uniquement
- ✅ Consultations de ses employés uniquement
- ✅ Analytics de sa propre activité
- ✅ Paramètres et facturation isolés

### Protection des routes
Toutes les routes `/company/*` sont protégées par `CompanyProtectedRoute` :
- Vérifie le token d'authentification
- Redirige vers `/entreprise/login` si non authentifié
- Bloque l'accès non autorisé

---

## 🧪 SCÉNARIOS DE TEST

### Test 1 : Connexion basique
1. Allez sur `/entreprise/login`
2. Utilisez `demo.rh@monafrica.net` / `RH2025!`
3. Vérifiez la redirection vers `/company/dashboard`
4. Confirmez que le dashboard s'affiche correctement

### Test 2 : Gestion employés
1. Connectez-vous avec n'importe quel compte
2. Allez sur `/company/employees`
3. Testez l'ajout d'un employé
4. Vérifiez les filtres et la recherche

### Test 3 : Analytics
1. Connectez-vous
2. Allez sur `/company/analytics`
3. Vérifiez que les graphiques Recharts s'affichent
4. Testez les différentes périodes (7j, 30j, 90j)

### Test 4 : Déconnexion
1. Depuis n'importe quelle page du portail
2. Cliquez sur "Déconnexion"
3. Vérifiez la redirection vers `/entreprise/login`
4. Confirmez que l'accès au portail est bloqué

### Test 5 : Routes protégées
1. Sans être connecté, essayez d'accéder à `/company/dashboard`
2. Vous devriez être redirigé vers `/entreprise/login`
3. Connectez-vous, puis accédez au dashboard
4. Déconnectez-vous et réessayez (accès bloqué)

---

## 📝 NOTES IMPORTANTES

### Version actuelle
- **Build** : v2.0-entreprise-routes-fixed
- **Date** : 16 Mars 2026
- **Route login** : `/entreprise/login` (NON PLUS `/b2b-login`)

### Authentification
- Les comptes sont stockés dans `B2BAuthContext.tsx`
- Token stocké dans `localStorage` : `company_auth_token`
- User stocké dans `localStorage` : `company_user`

### Backend
- En production, connecté à Supabase
- Routes backend : `/make-server-6378cc81/b2b/*`
- Auth : Bearer token avec `publicAnonKey`

---

## 🆘 SUPPORT

### Problèmes courants

**1. "Email ou mot de passe incorrect"**
- Vérifiez que vous avez copié le mot de passe EXACTEMENT
- Attention à la casse (majuscules/minuscules)
- Utilisez les comptes listés ci-dessus

**2. "Redirection vers /b2b-login"**
- Videz le cache de votre navigateur (Ctrl+Shift+R)
- Supprimez le cache Vite : `rm -rf node_modules/.vite`
- Redémarrez le serveur dev

**3. "Page blanche après connexion"**
- Ouvrez DevTools (F12) et regardez les erreurs
- Vérifiez que le token est bien dans localStorage
- Essayez de vous reconnecter

### Contact
Email : entreprises@monafrica.net

---

**Dernière mise à jour** : 16 Mars 2026, 14:45
