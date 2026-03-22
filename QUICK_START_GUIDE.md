# Guide de Démarrage Rapide M.O.N.A

## 🎯 Objectif

Créer un vrai compte utilisateur et vérifier que tout fonctionne avec la base SQL Postgres.

---

## ✅ ÉTAPE 1 : Vérifier que les tables SQL existent

### Option A : Via Supabase Dashboard (RECOMMANDÉ)

1. **Allez sur Supabase Dashboard**
   - 🔗 https://supabase.com/dashboard
   - Sélectionnez votre projet M.O.N.A

2. **Ouvrez Table Editor**
   - Menu latéral → **Table Editor**
   
3. **Vérifiez ces tables**
   - ✅ `users` (doit exister)
   - ✅ `admins` (doit exister)
   - ✅ `experts` (doit exister)
   - ✅ `companies` (doit exister)

4. **Si les tables n'existent PAS :**
   - Menu latéral → **SQL Editor**
   - Cliquez **"+ New query"**
   - Copiez TOUT le contenu de `/supabase/migrations/001_initial_schema.sql`
   - Collez dans l'éditeur
   - Cliquez **"Run"** ✅

---

## 🎨 ÉTAPE 2 : Ouvrir votre app M.O.N.A

1. **Dans votre navigateur :**
   ```
   http://localhost:5173
   ```
   (ou votre URL de dev)

2. **Aller sur la page d'inscription :**
   ```
   http://localhost:5173/signup
   ```

---

## 📝 ÉTAPE 3 : Créer un compte

### Formulaire d'inscription

Remplissez avec de **vraies informations** :

**Exemple :**
- **Nom complet :** `Kofi Mensah`
- **Email :** `kofi.mensah@gmail.com`
- **Mot de passe :** `MonaTest2025!`
- **Confirmer mot de passe :** `MonaTest2025!`
- ✅ Accepter les conditions

**Cliquez sur "Créer mon compte"**

---

## 🔍 ÉTAPE 4 : Vérifier dans Supabase

### A. Vérifier Supabase Auth

1. Supabase Dashboard → **Authentication** → **Users**
2. Vous devriez voir votre utilisateur :
   - Email : `kofi.mensah@gmail.com`
   - Confirmed : ✅ (auto-confirmé)
   - Created : Juste maintenant

### B. Vérifier la table SQL `users`

1. Supabase Dashboard → **Table Editor** → **users**
2. Vous devriez voir une ligne :
   - `id` : UUID (même que dans Auth)
   - `email` : `kofi.mensah@gmail.com`
   - `name` : `Kofi Mensah`
   - `membership_type` : `free`
   - `status` : `active`
   - `created_at` : Maintenant

---

## 🎉 ÉTAPE 5 : Se connecter avec le compte

1. **Déconnectez-vous** (si besoin)
2. **Allez sur :**
   ```
   http://localhost:5173/login
   ```

3. **Connectez-vous avec :**
   - Email : `kofi.mensah@gmail.com`
   - Mot de passe : `MonaTest2025!`

4. **Vous devriez arriver sur :**
   ```
   http://localhost:5173/member/dashboard
   ```

---

## 🧪 ÉTAPE 6 : Vérifier dans le Portail Admin

### A. Créer un compte admin (optionnel)

Si vous voulez voir votre utilisateur dans le portail admin :

1. **Supabase Dashboard → SQL Editor**

2. **Exécutez cette requête :**
   ```sql
   INSERT INTO admins (email, name, role, department) 
   VALUES ('admin@monafrica.net', 'Admin Test', 'super_admin', 'operations')
   ON CONFLICT (email) DO NOTHING;
   ```

3. **Créez le compte Auth pour cet admin :**
   - Supabase Dashboard → **Authentication** → **Users**
   - Cliquez **"Add user"**
   - Email : `admin@monafrica.net`
   - Password : `Admin2025!`
   - Auto Confirm Email : ✅

### B. Se connecter au portail Admin

1. **Allez sur :**
   ```
   http://localhost:5173/admin-portal-v2
   ```

2. **Connectez-vous avec :**
   - Email : `admin@monafrica.net`
   - Password : `Admin2025!`

3. **Allez sur "Utilisateurs"**
   - Vous devriez voir `Kofi Mensah` dans la liste !

---

## 📊 RÉSUMÉ DES COMPTES DE TEST

### Utilisateur Membre

| Champ | Valeur |
|-------|--------|
| Nom | Kofi Mensah |
| Email | kofi.mensah@gmail.com |
| Password | MonaTest2025! |
| Type | Membre (free) |
| Dashboard | /member/dashboard |

### Admin

| Champ | Valeur |
|-------|--------|
| Nom | Admin Test |
| Email | admin@monafrica.net |
| Password | Admin2025! |
| Role | super_admin |
| Dashboard | /admin-portal-v2 |

---

## 🔧 DÉBOGAGE : Si ça ne marche pas

### Erreur : "Les tables n'existent pas"

**Solution :**
1. Supabase Dashboard → SQL Editor
2. Exécutez `/supabase/migrations/001_initial_schema.sql`

### Erreur : "Email déjà utilisé"

**Solution :**
1. Supabase Dashboard → Authentication → Users
2. Supprimez l'utilisateur existant
3. Supabase Dashboard → Table Editor → users
4. Supprimez la ligne correspondante
5. Réessayez l'inscription

### Erreur : "Erreur serveur"

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Regardez les logs dans l'onglet "Console"
3. Vérifiez que le backend est déployé :
   ```
   https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/member/signup
   ```

### Erreur : "Token invalide"

**Solution :**
1. Supprimez les données localStorage :
   ```javascript
   localStorage.removeItem('mona_member_user');
   localStorage.removeItem('mona_member_token');
   ```
2. Rechargez la page
3. Reconnectez-vous

---

## 📋 CHECKLIST FINALE

Après avoir créé votre compte, vérifiez :

- [ ] Je vois mon utilisateur dans **Supabase Auth**
- [ ] Je vois mon utilisateur dans la **table SQL `users`**
- [ ] Je peux me **connecter** avec mes identifiants
- [ ] J'arrive sur **`/member/dashboard`**
- [ ] Mon nom s'affiche dans le header du dashboard
- [ ] (Optionnel) Je vois mon utilisateur dans **Admin Portal → Utilisateurs**

---

## 🚀 PROCHAINES ÉTAPES

Une fois que tout fonctionne :

1. **Tester les autres fonctionnalités :**
   - Réserver une consultation
   - Passer le quiz de matching
   - Mettre à jour le profil

2. **Créer un compte Expert :**
   ```
   http://localhost:5173/expert/signup
   ```

3. **Tester le workflow complet :**
   - Membre s'inscrit
   - Membre réserve une consultation
   - Expert approuve
   - Consultation se déroule

---

## 📞 SUPPORT

Si vous rencontrez des problèmes :

1. **Vérifiez les logs backend :**
   - Supabase Dashboard → **Edge Functions** → **make-server-6378cc81** → **Logs**

2. **Vérifiez les logs frontend :**
   - Console du navigateur (F12)

3. **Vérifiez que le déploiement est OK :**
   - Supabase Dashboard → **Edge Functions**
   - Statut : ✅ Deployed

---

**Bonne chance ! 🎉**
