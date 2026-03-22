# Test avec un Vrai Compte Utilisateur

## 🎯 **ÉTAPES À SUIVRE MAINTENANT**

Vous avez déjà :
- ✅ Pushé le code sur Git
- ✅ Déployé le backend sur Supabase

---

## **ÉTAPE 1 : Créer les tables SQL dans Supabase**

### 📋 **Instructions détaillées :**

1. **Ouvrez Supabase Dashboard**
   - Allez sur https://supabase.com/dashboard
   - Sélectionnez votre projet M.O.N.A

2. **Ouvrez SQL Editor**
   - Menu de gauche → Cliquez sur **"SQL Editor"**
   - En haut à droite → Cliquez sur **"+ New query"**

3. **Copiez le schéma SQL**
   - Ouvrez le fichier `/supabase/migrations/001_initial_schema.sql` dans votre projet
   - **Sélectionnez TOUT** (Ctrl+A ou Cmd+A)
   - **Copiez** (Ctrl+C ou Cmd+C)

4. **Collez et exécutez**
   - Retournez dans Supabase SQL Editor
   - **Collez** le SQL (Ctrl+V ou Cmd+V)
   - En bas à droite → Cliquez sur **"Run"** (bouton vert)
   - ⏳ Attendez 3-5 secondes
   - ✅ Vous devriez voir : **"Success. No rows returned"**

5. **Vérifiez que les tables sont créées**
   - Menu de gauche → Cliquez sur **"Table Editor"**
   - Vous devriez voir **10 tables** :
     - admins
     - admin_activity_logs
     - users ⭐ (IMPORTANT)
     - experts
     - companies
     - consultations
     - transactions
     - subscriptions
     - support_tickets
     - platform_settings

---

## **ÉTAPE 2 : Vérifier le backend**

### A. Vérifier que les Edge Functions sont déployées

1. **Supabase Dashboard → Edge Functions**
2. Vous devriez voir : **make-server-6378cc81**
3. Statut : ✅ **Deployed**

### B. Tester une route API (optionnel)

Ouvrez dans votre navigateur ou Postman :

```
https://{VOTRE_PROJECT_ID}.supabase.co/functions/v1/make-server-6378cc81/health
```

Remplacez `{VOTRE_PROJECT_ID}` par votre vrai project ID.

Vous devriez voir :
```json
{
  "status": "ok",
  "message": "M.O.N.A server running"
}
```

---

## **ÉTAPE 3 : Créer un vrai compte utilisateur**

### A. Ouvrir votre application

Dans votre navigateur, allez sur :

```
http://localhost:5173/signup
```

(ou l'URL de votre environnement de dev)

### B. Remplir le formulaire d'inscription

**Utilisez de VRAIES informations :**

| Champ | Exemple | Votre valeur |
|-------|---------|--------------|
| **Nom complet** | `Aminata Diallo` | _____________ |
| **Email** | `aminata.diallo@gmail.com` | _____________ |
| **Mot de passe** | `MonaTest2025!` | _____________ |
| **Confirmer** | `MonaTest2025!` | _____________ |

**Important :**
- ✅ Cochez "J'accepte les conditions d'utilisation"
- Le mot de passe doit avoir **minimum 8 caractères**

### C. Cliquer sur "Créer mon compte"

**Que va-t-il se passer ?**

1. **Frontend** envoie les données à :
   ```
   POST /make-server-6378cc81/member/signup
   ```

2. **Backend** :
   - ✅ Crée l'utilisateur dans **Supabase Auth**
   - ✅ Insère une ligne dans la **table SQL `users`**
   - ✅ (Temporaire) Sauvegarde aussi dans **KV Store** pour compatibilité
   - ✅ Génère un **token JWT**
   - ✅ Retourne les données au frontend

3. **Frontend** :
   - ✅ Stocke le token dans `localStorage`
   - ✅ Redirige vers `/member/dashboard`

---

## **ÉTAPE 4 : Vérifier que tout a fonctionné**

### A. Vérifier dans Supabase Auth

1. **Supabase Dashboard → Authentication → Users**
2. Vous devriez voir votre utilisateur :
   - ✅ Email : `aminata.diallo@gmail.com`
   - ✅ Confirmed : ✅ (auto-confirmé)
   - ✅ Created : Maintenant (il y a quelques secondes)

### B. Vérifier dans la table SQL `users`

1. **Supabase Dashboard → Table Editor → users**
2. Cliquez sur la table `users`
3. Vous devriez voir **1 ligne** :

| Colonne | Valeur attendue |
|---------|----------------|
| `id` | UUID (ex: `a1b2c3d4-...`) |
| `email` | `aminata.diallo@gmail.com` |
| `name` | `Aminata Diallo` |
| `membership_type` | `free` |
| `status` | `active` |
| `profile_completed` | `false` |
| `created_at` | Maintenant |
| `updated_at` | Maintenant |

### C. Vérifier que vous êtes connecté

Dans votre navigateur :
- ✅ Vous devriez être sur `/member/dashboard`
- ✅ Vous devriez voir votre nom dans le header
- ✅ Vous devriez voir "Bienvenue, Aminata"

---

## **ÉTAPE 5 : Se déconnecter et se reconnecter**

### A. Se déconnecter

1. Cliquez sur votre avatar/nom en haut à droite
2. Cliquez sur "Déconnexion"
3. Vous devriez être redirigé vers `/login`

### B. Se reconnecter

1. Allez sur `/login`
2. Entrez :
   - Email : `aminata.diallo@gmail.com`
   - Password : `MonaTest2025!`
3. Cliquez sur "Se connecter"
4. ✅ Vous devriez revenir sur `/member/dashboard`

---

## **ÉTAPE 6 : Voir l'utilisateur dans le Portail Admin**

### A. Créer un compte admin

1. **Supabase Dashboard → SQL Editor**
2. **Nouvelle requête :**

```sql
-- Créer un admin dans la table SQL
INSERT INTO admins (email, name, role, department) 
VALUES ('admin@monafrica.net', 'Admin M.O.N.A', 'super_admin', 'operations')
ON CONFLICT (email) DO NOTHING;
```

3. **Cliquez "Run"**

4. **Supabase Dashboard → Authentication → Add user**
   - Email : `admin@monafrica.net`
   - Password : `Admin2025!`
   - Auto Confirm Email : ✅ Cochez
   - Cliquez "Create user"

### B. Se connecter au Portail Admin

1. Allez sur `/admin-portal-v2`
2. Connectez-vous avec :
   - Email : `admin@monafrica.net`
   - Password : `Admin2025!`

### C. Voir l'utilisateur créé

1. Dans le menu de gauche → Cliquez sur **"Utilisateurs"**
2. ✅ Vous devriez voir **Aminata Diallo** dans la liste !
3. Cliquez sur la ligne pour voir les détails

---

## **🎉 SUCCÈS ! Vous avez :**

- ✅ Créé les tables SQL dans Postgres
- ✅ Créé un vrai compte utilisateur
- ✅ L'utilisateur est dans **Supabase Auth**
- ✅ L'utilisateur est dans la **table SQL `users`**
- ✅ Vous pouvez vous connecter/déconnecter
- ✅ Vous voyez l'utilisateur dans le **Portail Admin**

---

## **🔧 SI QUELQUE CHOSE NE MARCHE PAS**

### Problème 1 : "Erreur lors de la création du compte"

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet "Console"
3. Vérifiez les logs backend :
   - Supabase Dashboard → Edge Functions → make-server-6378cc81 → Logs

**Erreur commune :** "relation users does not exist"
- Vous avez oublié d'exécuter `001_initial_schema.sql`
- Retournez à l'ÉTAPE 1

### Problème 2 : "Email déjà utilisé"

**Solution :**
1. Supabase Dashboard → Authentication → Users
2. Trouvez l'utilisateur avec cet email
3. Supprimez-le
4. Supabase Dashboard → Table Editor → users
5. Trouvez la ligne avec cet email
6. Supprimez-la
7. Réessayez l'inscription

### Problème 3 : "Token invalide"

**Solution :**
1. Ouvrez la console du navigateur (F12)
2. Exécutez :
   ```javascript
   localStorage.clear();
   ```
3. Rechargez la page
4. Reconnectez-vous

### Problème 4 : "Impossible de se connecter au serveur"

**Solution :**
1. Vérifiez que le backend est déployé :
   - Supabase Dashboard → Edge Functions
   - Statut doit être "Deployed"
2. Vérifiez l'URL dans le code :
   - Ouvrez `/src/app/contexts/MemberAuthContext.tsx`
   - Ligne 105 et 193
   - L'URL doit correspondre à votre project ID

---

## **📊 DONNÉES DE RÉFÉRENCE**

### Compte Utilisateur Test

```
Nom : Aminata Diallo
Email : aminata.diallo@gmail.com
Password : MonaTest2025!
Type : Membre (free)
Dashboard : /member/dashboard
```

### Compte Admin Test

```
Nom : Admin M.O.N.A
Email : admin@monafrica.net
Password : Admin2025!
Role : super_admin
Dashboard : /admin-portal-v2
```

---

## **📞 PRÊT À CONTINUER ?**

Une fois que tout fonctionne, confirmez-moi et je continuerai la migration pour :

1. ✅ **Experts** (approval/rejection avec SQL)
2. ✅ **Entreprises** (gestion abonnements avec SQL)
3. ✅ **Consultations** (calendrier avec SQL)

---

**Bonne chance ! 🚀**

Dites-moi quand vous avez terminé les tests et si tout fonctionne !
