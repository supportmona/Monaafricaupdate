# Test de Connexion Membres M.O.N.A

## Objectif
Vérifier que la connexion des membres fonctionne correctement avec les comptes de test.

## Résultat Attendu

### Backend (Supabase Edge Function)
```
🔐 Tentative connexion membre: amara.diallo@monafrica.net
✅ Connexion réussie avec compte de test: amara.diallo@monafrica.net
```

### Frontend (Console du navigateur)
```
[Frontend] Tentative de connexion pour: amara.diallo@monafrica.net
[Frontend] Réponse du serveur: {
  ok: true,
  status: 200,
  hasError: false,
  hasData: true
}
[Frontend] Token reçu: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Frontend] Token est un JWT? true
[Frontend] Connexion réussie pour: Amara Diallo
✅ Session restaurée pour userId: member-demo-001
```

## Étapes de Test

### Test 1 : Connexion avec compte premium
1. Naviguer vers `/login`
2. Cliquer sur "Remplir automatiquement" dans la bannière de test
3. Vérifier que les champs sont remplis avec :
   - Email : `amara.diallo@monafrica.net`
   - Mot de passe : `Test1234!`
4. Cliquer sur "Se connecter"
5. Vérifier la redirection vers `/member/dashboard`
6. Vérifier que le nom "Amara Diallo" apparaît dans l'interface

### Test 2 : Connexion manuelle
1. Naviguer vers `/login`
2. Saisir manuellement :
   - Email : `test@monafrica.net`
   - Mot de passe : `Test1234!`
3. Cliquer sur "Se connecter"
4. Vérifier la redirection vers `/member/dashboard`
5. Vérifier que le nom "Compte Test" apparaît dans l'interface

### Test 3 : Erreur de connexion
1. Naviguer vers `/login`
2. Saisir des identifiants invalides :
   - Email : `wrong@email.com`
   - Mot de passe : `WrongPassword`
3. Cliquer sur "Se connecter"
4. Vérifier l'affichage du message d'erreur : "Email ou mot de passe incorrect"
5. Vérifier que les logs backend montrent les comptes disponibles

### Test 4 : Persistance de session
1. Se connecter avec un compte de test
2. Rafraîchir la page (F5)
3. Vérifier que la session est maintenue
4. Vérifier les logs : "✅ Session restaurée pour userId: member-demo-001"

### Test 5 : Déconnexion
1. Se connecter avec un compte de test
2. Cliquer sur "Déconnexion"
3. Vérifier la redirection vers la page d'accueil
4. Vérifier que localStorage est nettoyé (pas de mona_member_user ni mona_member_token)

## Vérifications de Sécurité

### JWT Valide
- Le token doit avoir 3 parties séparées par des points (.)
- Le payload doit contenir :
  - `sub` : ID de l'utilisateur
  - `email` : Email de l'utilisateur
  - `user_metadata.name` : Nom de l'utilisateur
  - `exp` : Date d'expiration (24h après création)

### LocalStorage
- `mona_member_user` : Objet JSON avec les données utilisateur
- `mona_member_token` : JWT string valide

### Profil KV Store
Le backend doit créer/mettre à jour le profil dans KV store :
```
Key: member:member-demo-001
Value: {
  id: "member-demo-001",
  email: "amara.diallo@monafrica.net",
  name: "Amara Diallo",
  role: "member",
  plan: "cercle-mona",
  memberSince: "2025-01-15T00:00:00.000Z",
  ...
}
```

## Problèmes Connus et Solutions

### ❌ "Email ou mot de passe incorrect"
**Cause** : Compte de test non trouvé
**Solution** : 
- Vérifier l'orthographe de l'email et du mot de passe
- Consulter `/GUIDE_COMPTES_TEST.md` pour les identifiants exacts
- Vérifier les logs backend pour voir les comptes disponibles

### ❌ "Token invalide"
**Cause** : JWT mal formé
**Solution** :
- Vérifier que `generateTestJWT()` fonctionne correctement
- Vérifier que le token a 3 parties
- Consulter les logs pour voir le token généré

### ❌ Session non restaurée après rafraîchissement
**Cause** : Token expiré ou userId mismatch
**Solution** :
- Vérifier l'expiration du token (24h)
- Vérifier que l'userId dans le token correspond à celui dans localStorage
- Se déconnecter et se reconnecter

## Checklist de Validation

- [ ] Connexion avec compte premium réussie
- [ ] Connexion avec compte gratuit réussie
- [ ] Message d'erreur affiché pour identifiants invalides
- [ ] Session persistante après rafraîchissement
- [ ] Déconnexion nettoie correctement localStorage
- [ ] JWT valide généré (3 parties)
- [ ] Profil stocké dans KV store
- [ ] Redirection vers /member/dashboard après connexion
- [ ] Nom d'utilisateur affiché correctement
- [ ] Aucune erreur dans la console

## Logs Attendus

### Succès
```
Backend:
🔐 Tentative connexion membre: amara.diallo@monafrica.net
✅ Connexion réussie avec compte de test: amara.diallo@monafrica.net

Frontend:
[Frontend] Tentative de connexion pour: amara.diallo@monafrica.net
[Frontend] Token reçu: eyJhbGciOiJIUzI1NiIsInR5cCI6...
[Frontend] Token est un JWT? true
[Frontend] Connexion réussie pour: Amara Diallo
```

### Échec
```
Backend:
🔐 Tentative connexion membre: wrong@email.com
❌ Erreur connexion membre: [AuthApiError...]
📋 Comptes de test disponibles:
   - amara.diallo@monafrica.net / Test1234!
   - test@monafrica.net / Test1234!

Frontend:
[Frontend] Tentative de connexion pour: wrong@email.com
[Frontend] Erreur de connexion: Email ou mot de passe incorrect
```

## Prochaines Étapes

Après validation de ces tests :
1. Tester les autres types de comptes (Expert, Admin, B2B)
2. Tester l'inscription de nouveaux membres
3. Tester le flux de récupération de mot de passe
4. Préparer la migration vers Supabase Auth pour la production

## Date de Test
**À effectuer** : Après déploiement des corrections
**Statut** : En attente de validation
