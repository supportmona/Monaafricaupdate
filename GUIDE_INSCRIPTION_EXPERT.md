# 🔐 Guide d'inscription Expert M.O.N.A

## ✅ Résolution de l'erreur "Invalid login credentials"

Cette erreur signifie que **le compte que vous essayez d'utiliser n'existe pas** dans le système d'authentification Supabase.

### 🎯 Solution en 3 étapes

#### 1. Accéder à la page d'inscription
Rendez-vous sur : **`/expert-signup`**

Ou cliquez sur "Créer un compte expert" depuis la page de connexion.

#### 2. Remplir le formulaire d'inscription

**Informations personnelles :**
- Prénom : `Fatima`
- Nom : `Ba`
- Email : `fatima.ba@monafrica.net` (doit être @monafrica.net)
- Téléphone : `+221 77 123 45 67`

**Informations professionnelles :**
- Spécialité : Sélectionnez parmi la liste (ex: Psychologue)
- Numéro de licence : `PSY-SN-2024-001` (format libre)

**Sécurité :**
- Mot de passe : Minimum 8 caractères
- Confirmation : Retapez le même mot de passe

#### 3. Se connecter avec les nouveaux identifiants

Une fois le compte créé, vous serez automatiquement redirigé vers la page de connexion. 

Utilisez l'email et le mot de passe que vous venez de créer pour vous connecter.

---

## 📍 URLs importantes

- **Page d'accueil portail expert** : `/espace-expert`
- **Inscription** : `/expert-signup`
- **Connexion** : `/expert-login`
- **Dashboard expert** : `/portal-expert/dashboard`

---

## ⚙️ Comment ça fonctionne ?

### Architecture d'authentification

```
Frontend → Server → Supabase Auth → KV Store
```

1. **Inscription** : Le serveur crée un compte dans Supabase Auth avec le rôle "expert"
2. **Profil** : Les données du profil expert sont stockées dans le KV Store
3. **Connexion** : Le serveur valide les identifiants via Supabase Auth
4. **Session** : Un token JWT est retourné au frontend pour maintenir la session

### Validation de l'email

Seuls les emails **@monafrica.net** sont acceptés pour les comptes experts.

Cela garantit que seuls les professionnels autorisés peuvent accéder au portail.

### Rôles dans user_metadata

Chaque utilisateur a un rôle dans ses métadonnées :
- `role: "expert"` → Accès au portail expert
- `role: "admin"` → Accès au portail admin
- `role: "entreprise"` → Accès au dashboard B2B

---

## 🐛 Debugging

### Vérifier si un compte existe

Dans les logs du serveur, vous verrez :
```
🔐 Tentative de connexion expert pour: email@monafrica.net
✅ Authentification réussie pour: email@monafrica.net
👤 ID utilisateur: xxx-xxx-xxx
🔍 Rôle utilisateur: expert
✅ Profil expert trouvé: Prénom Nom
```

### Erreurs communes

**❌ Invalid login credentials**
→ Le compte n'existe pas, créez-en un nouveau

**❌ Email invalide**
→ Utilisez un email @monafrica.net

**❌ Accès refusé**
→ Le compte existe mais n'a pas le rôle "expert"

---

## 💡 Notes importantes

1. **Pas de serveur email** : Les comptes sont automatiquement confirmés (`email_confirm: true`) car aucun serveur SMTP n'est configuré

2. **Données de test** : Utilisez des données réalistes pour les tests (noms africains, numéros de téléphone au format international)

3. **Première connexion** : Après création du compte, vous devez d'abord vous connecter manuellement

4. **Mot de passe** : Minimum 8 caractères, aucune autre contrainte

---

## ✅ Checklist de dépannage

- [ ] J'ai accédé à `/expert-signup`
- [ ] J'ai rempli tous les champs obligatoires
- [ ] J'ai utilisé un email @monafrica.net
- [ ] Mon mot de passe contient au moins 8 caractères
- [ ] J'ai confirmé le mot de passe correctement
- [ ] J'ai attendu le message de succès
- [ ] J'ai été redirigé vers la page de connexion
- [ ] J'ai utilisé les MÊMES identifiants pour me connecter

Si tous ces points sont cochés et que ça ne fonctionne toujours pas, contactez le support.
