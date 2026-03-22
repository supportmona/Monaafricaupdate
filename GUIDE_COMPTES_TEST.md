# Guide des Comptes de Test M.O.N.A

## Vue d'ensemble

Le système M.O.N.A utilise des comptes de test hardcodés pour faciliter le développement et les démonstrations. Ces comptes sont configurés dans le backend et permettent une connexion immédiate sans nécessiter de configuration Supabase Auth.

## Architecture

### Système à 3 niveaux

```
Frontend (React) → Backend (Supabase Edge Function) → Database (KV Store)
```

### Authentification

1. **Comptes de test** : Vérifiés en premier dans le backend
2. **Supabase Auth** : Utilisé en fallback si aucun compte de test ne correspond
3. **JWT Generation** : Les comptes de test génèrent des JWT valides pour maintenir la cohérence

## Comptes de Test Disponibles

### Membres (Members)

#### Compte Premium
- **Email** : `amara.diallo@gmail.com`
- **Mot de passe** : `Test1234!`
- **Plan** : Cercle M.O.N.A (Premium)
- **ID** : `member-demo-001`
- **Caractéristiques** :
  - MONA Score : 78
  - Consultations totales : 8
  - Membre depuis : 15 janvier 2025

#### Compte Gratuit
- **Email** : `test.mona@gmail.com`
- **Mot de passe** : `Test1234!`
- **Plan** : Free
- **ID** : `member-demo-002`
- **Caractéristiques** :
  - MONA Score : 65
  - Consultations totales : 0
  - Membre depuis : 1er février 2025

### Experts

#### Compte Expert de Démonstration
- **Email** : `demo.expert@monafrica.net`
- **Mot de passe** : `Expert2025!`
- **ID** : `expert-demo-001`
- **Caractéristiques** :
  - Nom : Dr. Expert Démo
  - Spécialité : Psychologie Clinique
  - Licence : PSY-DEMO-2025-001
  - Téléphone : +243 81 234 56 78
  - Consultations totales : 150
  - Note : 4.9/5
  - Langues : Français, Anglais, Lingala
  - Statut : Actif

### Administrateurs

#### Super Admin
- **Email** : `admin@monafrica.net`
- **Mot de passe** : `Admin2025!`
- **Code 2FA** : `123456`
- **ID** : `admin-001`
- **Nom** : Admin Principal
- **Rôle** : Super Admin

### Entreprises B2B

#### TotalEnergies RDC
- **Email** : `rh@totalenergies-rdc.com`
- **Mot de passe** : `Total2025!`
- **ID Entreprise** : `total-001`
- **Rôle** : RH Manager
- **Employés** : 250
- **Localisations** : Kinshasa, Lubumbashi

#### Bantu Technologies
- **Email** : `hr@bantutech.com`
- **Mot de passe** : `Bantu2025!`
- **ID Entreprise** : `bantu-002`
- **Rôle** : HR Manager
- **Employés** : 87
- **Localisations** : Kinshasa

## Implémentation Technique

### Backend (member_auth.tsx)

```typescript
// Génération de JWT pour les comptes de test
function generateTestJWT(userId: string, email: string, name: string): string {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: userId,
    email: email,
    user_metadata: { name: name, role: "member" },
    role: "authenticated",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 heures
  };
  // Encoding...
}

// Vérification des comptes de test dans loginMember()
const testAccount = TEST_MEMBER_ACCOUNTS.find(
  acc => acc.email === cleanEmail && acc.password === cleanPassword
);

if (testAccount) {
  // Générer JWT et retourner les données
}
```

### Frontend (MemberAuthContext.tsx)

```typescript
// Validation du JWT reçu
if (!accessToken || accessToken.split('.').length !== 3) {
  console.error('[Frontend] TOKEN INVALIDE');
  return false;
}

// Stockage sécurisé
localStorage.setItem('mona_member_user', JSON.stringify(memberUser));
localStorage.setItem('mona_member_token', accessToken);
```

## Logs de Débogage

### Backend
```
🔐 Tentative connexion membre: amara.diallo@monafrica.net
✅ Connexion réussie avec compte de test: amara.diallo@monafrica.net
```

### Frontend
```
[Frontend] Tentative de connexion pour: amara.diallo@monafrica.net
[Frontend] Réponse du serveur: { ok: true, status: 200, hasError: false, hasData: true }
[Frontend] Token reçu: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[Frontend] Token est un JWT? true
[Frontend] Connexion réussie pour: Amara Diallo
```

## Sécurité

### Avertissements

⚠️ **IMPORTANT** : Ces comptes de test sont destinés uniquement au développement et aux démonstrations.

- **NE PAS** utiliser en production
- **NE PAS** stocker de données sensibles avec ces comptes
- **TOUJOURS** migrer vers Supabase Auth pour la production

### Bonnes Pratiques

1. **JWT Non Sécurisés** : Les JWT de test utilisent une signature fixe ("test_signature")
2. **Mots de passe hardcodés** : Les mots de passe sont en clair dans le code
3. **Aucune vérification** : Pas de rate limiting ou de protection contre les attaques

## Migration vers Production

### Étapes pour désactiver les comptes de test

1. **Supprimer les constantes** `TEST_MEMBER_ACCOUNTS`, `TEST_EXPERT_ACCOUNTS`, etc.
2. **Retirer la vérification** des comptes de test dans les fonctions de login
3. **Utiliser uniquement** Supabase Auth `signInWithPassword()`
4. **Configurer** l'email provider dans Supabase
5. **Tester** avec de vrais comptes créés via signup

### Configuration Supabase Auth

```typescript
// Production uniquement
const { data: authData, error: authError } = 
  await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password: cleanPassword,
  });
```

## Dépannage

### Erreur : "Email ou mot de passe incorrect"

1. Vérifier que l'email et le mot de passe correspondent exactement (sensible à la casse)
2. Consulter les logs backend pour voir les comptes disponibles
3. Vérifier que les espaces ne sont pas ajoutés par erreur

### Erreur : "Token invalide"

1. Vérifier que le JWT a 3 parties (header.payload.signature)
2. Consulter les logs pour voir le token généré
3. Vérifier que `generateTestJWT()` fonctionne correctement

### Session expirée

1. Les tokens de test expirent après 24 heures
2. Se déconnecter et se reconnecter
3. Vérifier la date d'expiration dans le JWT payload

## Support

Pour toute question ou problème :
1. Consulter les logs console (Frontend et Backend)
2. Vérifier les fichiers suivants :
   - `/supabase/functions/server/member_auth.tsx`
   - `/supabase/functions/server/expert_auth.tsx`
   - `/supabase/functions/server/admin_auth.tsx`
   - `/src/app/contexts/MemberAuthContext.tsx`
   - `/src/app/contexts/ExpertAuthContext.tsx`
   - `/src/app/contexts/AdminAuthContext.tsx`
   - `/src/app/contexts/B2BAuthContext.tsx`

## Dernière mise à jour

**Date** : 10 février 2026
**Version** : 1.0.0
**Auteur** : Système M.O.N.A