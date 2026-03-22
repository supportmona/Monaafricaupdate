# Correction : Page de Login Expert

## Date
10 février 2026

## Problème Identifié

L'utilisateur signale que la page de login expert affiche aussi une erreur de connexion.

### Analyse du Problème

**Fichier** : `/src/app/pages/PortalExpertPage.tsx`

#### Compte de test affiché (INCORRECT)
```typescript
const fillTestCredentials = () => {
  setEmail('dr.aminata.kone@monafrica.net');
  setPassword('Test1234!');
  setShowTestCredentials(false);
};
```

#### Compte de test dans le backend (CORRECT)
**Fichier** : `/supabase/functions/server/expert_auth.tsx`

```typescript
const TEST_EXPERT_ACCOUNTS = [
  {
    email: "demo.expert@monafrica.net",
    password: "Expert2025!",
    // ... profil expert
  }
];
```

### Cause Racine
**Désynchronisation entre le frontend et le backend** : La page de login affichait un email de test qui n'existe pas dans le système d'authentification backend.

## Solution Implémentée

### 1. Correction du Compte de Test dans PortalExpertPage.tsx

**Avant** :
```typescript
const fillTestCredentials = () => {
  setEmail('dr.aminata.kone@monafrica.net');  // ❌ N'existe pas
  setPassword('Test1234!');                    // ❌ Mauvais mot de passe
  setShowTestCredentials(false);
};
```

**Après** :
```typescript
const fillTestCredentials = () => {
  setEmail('demo.expert@monafrica.net');  // ✅ Correspond au backend
  setPassword('Expert2025!');              // ✅ Mot de passe correct
  setShowTestCredentials(false);
};
```

### 2. Ajout des Identifiants dans la Bannière

**Avant** :
```tsx
<p className="text-xs sm:text-sm text-anthracite/70 mb-2 sm:mb-3 font-sans">
  Utilisez ce compte pour tester le portail expert
</p>
```

**Après** :
```tsx
<p className="text-xs sm:text-sm text-anthracite/70 mb-2 sm:mb-3 font-sans">
  Email : demo.expert@monafrica.net<br/>
  Mot de passe : Expert2025!
</p>
```

## Compte Expert de Test

### Identifiants
```
Email     : demo.expert@monafrica.net
Mot de passe : Expert2025!
```

### Profil Complet
```json
{
  "id": "expert-demo-001",
  "email": "demo.expert@monafrica.net",
  "firstName": "Dr. Expert",
  "lastName": "Démo",
  "specialty": "Psychologie Clinique",
  "licenseNumber": "PSY-DEMO-2025-001",
  "phone": "+243 81 234 56 78",
  "status": "active",
  "totalConsultations": 150,
  "rating": 4.9,
  "languages": ["Français", "Anglais", "Lingala"],
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Flux de Connexion Expert

### 1. Accès à la Page
```
Navigation → Clic sur "Expert" → /portal-expert → PortalExpertPage.tsx
```

### 2. Affichage de la Bannière de Test
```tsx
<div className="bg-gold/10 border border-gold/30 rounded-xl">
  <p className="text-gold uppercase">Compte de Démonstration</p>
  <p className="text-anthracite/70">
    Email : demo.expert@monafrica.net<br/>
    Mot de passe : Expert2025!
  </p>
  <button onClick={fillTestCredentials}>
    Remplir automatiquement
  </button>
</div>
```

### 3. Auto-remplissage des Champs
Clic sur "Remplir automatiquement" :
```typescript
setEmail('demo.expert@monafrica.net');
setPassword('Expert2025!');
```

### 4. Soumission du Formulaire
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    
    await login(cleanEmail, cleanPassword);  // Appel à ExpertAuthContext
    navigate('/expert/dashboard');
  } catch (err) {
    console.error('Erreur de connexion:', err);
  } finally {
    setIsSubmitting(false);
  }
};
```

### 5. Vérification Backend
**Fichier** : `/supabase/functions/server/expert_auth.tsx`

```typescript
export async function loginExpert(email: string, password: string) {
  const cleanEmail = email.trim();
  const cleanPassword = password.trim();
  
  console.log(`🔐 Tentative de connexion expert pour: ${cleanEmail}`);
  
  const testAccount = TEST_EXPERT_ACCOUNTS.find(
    acc => acc.email === cleanEmail && acc.password === cleanPassword
  );

  if (testAccount) {
    console.log("✅ Connexion réussie avec compte de test:", cleanEmail);
    
    // Stocker le profil dans KV
    await kv.set(`expert:${testAccount.user.id}`, testAccount.profile);
    
    return {
      data: {
        user: testAccount.user,
        session: {
          access_token: `test_token_${testAccount.user.id}_${Date.now()}`,
          refresh_token: `test_refresh_${testAccount.user.id}`,
          expires_in: 3600,
          token_type: "bearer"
        },
        profile: testAccount.profile
      },
      error: null
    };
  }

  return { 
    error: "Email ou mot de passe incorrect", 
    data: null 
  };
}
```

### 6. Redirection
```
Connexion réussie → navigate('/expert/dashboard') → ExpertDashboardPage.tsx
```

## Logs Attendus

### Frontend Console
```
[ExpertAuth] Tentative de connexion pour: demo.expert@monafrica.net
[ExpertAuth] Réponse du serveur: { ok: true, status: 200 }
[ExpertAuth] Token reçu: test_token_expert-demo-001_1707587654321
[ExpertAuth] Connexion réussie pour: Dr. Expert Démo
```

### Backend Console
```
🔐 Tentative de connexion expert pour: demo.expert@monafrica.net
📧 Email reçu (longueur: 28): "demo.expert@monafrica.net"
🔑 Mot de passe reçu (longueur: 11): "Expert2025!"
✅ Connexion réussie avec compte de test: demo.expert@monafrica.net
```

## Validation de l'Email Expert

### Règle de Domaine
Les experts doivent utiliser un email **@monafrica.net**.

```typescript
// Dans expert_auth.tsx
const allowedDomains = ["@monafrica.net"];
const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));

if (!isValidDomain) {
  return {
    error: `Email invalide. Seuls les emails ${allowedDomains.join(", ")} sont autorisés pour les experts.`
  };
}
```

### Exemples

✅ **Valides** :
- demo.expert@monafrica.net
- dr.aminata@monafrica.net
- psy.expert@monafrica.net

❌ **Invalides** :
- demo.expert@gmail.com
- expert@yahoo.fr
- dr.expert@monafrica.com (mauvais domaine)

## Différences entre Membres et Experts

### Membres (Patients)
```
Email    : N'importe quel domaine (@gmail.com, @yahoo.fr, etc.)
Route    : /login
Page     : LoginPage.tsx
Context  : MemberAuthContext
Redirect : /member/dashboard
Backend  : member_auth.tsx
```

### Experts (Professionnels)
```
Email    : Uniquement @monafrica.net
Route    : /portal-expert
Page     : PortalExpertPage.tsx
Context  : ExpertAuthContext
Redirect : /expert/dashboard
Backend  : expert_auth.tsx
```

## Fichiers Modifiés

### 1. `/src/app/pages/PortalExpertPage.tsx`
- ✅ Correction de l'email de test : `demo.expert@monafrica.net`
- ✅ Correction du mot de passe : `Expert2025!`
- ✅ Ajout des identifiants dans la bannière de test

### 2. `/GUIDE_COMPTES_TEST.md`
- ✅ Mise à jour de la section Experts
- ✅ Ajout des détails du compte demo.expert

### 3. `/CORRECTION_LOGIN_EXPERT.md` (nouveau)
- ✅ Documentation complète de la correction

## Routes Expert Disponibles

Après connexion, l'expert a accès à :

```
/expert/dashboard               → Tableau de bord
/expert/agenda                  → Agenda et disponibilités
/expert/patients                → Liste des patients
/expert/medical-records         → Dossiers médicaux
/expert/medical-records/:id     → Détail d'un dossier
/expert/consultation-room/:id   → Salle de consultation
/expert/messages                → Messagerie
/expert/settings                → Paramètres
/expert/prescription-template   → Modèles d'ordonnances
```

## Tests de Validation

### Test 1 : Affichage de la Page
```
1. Aller sur /portal-expert
2. Vérifier que la page s'affiche correctement
3. Vérifier la présence de la bannière de test
4. Vérifier les identifiants affichés :
   - Email : demo.expert@monafrica.net
   - Mot de passe : Expert2025!
```

### Test 2 : Auto-remplissage
```
1. Cliquer sur "Remplir automatiquement"
2. Vérifier que l'email est rempli : demo.expert@monafrica.net
3. Vérifier que le mot de passe est rempli : Expert2025!
4. Vérifier que la bannière disparaît
```

### Test 3 : Connexion Manuelle
```
1. Saisir manuellement : demo.expert@monafrica.net
2. Saisir manuellement : Expert2025!
3. Cliquer sur "Se connecter"
4. Vérifier la redirection vers /expert/dashboard
5. Vérifier l'affichage du nom : Dr. Expert Démo
```

### Test 4 : Connexion avec Mauvais Identifiants
```
1. Saisir : wrong@monafrica.net
2. Saisir : WrongPassword123
3. Cliquer sur "Se connecter"
4. Vérifier l'affichage d'une erreur : "Email ou mot de passe incorrect"
```

### Test 5 : Validation du Domaine
```
1. Saisir : expert@gmail.com
2. Saisir : Expert2025!
3. Cliquer sur "Se connecter"
4. Vérifier l'erreur : "Seuls les emails @monafrica.net sont autorisés"
```

## Comparaison Avant/Après

### Avant la Correction

```
❌ Email affiché : dr.aminata.kone@monafrica.net
❌ Mot de passe : Test1234!
❌ Compte inexistant dans le backend
❌ Connexion impossible
❌ Erreur : "Email ou mot de passe incorrect"
```

### Après la Correction

```
✅ Email affiché : demo.expert@monafrica.net
✅ Mot de passe : Expert2025!
✅ Compte existant dans le backend
✅ Connexion fonctionnelle
✅ Redirection vers /expert/dashboard
✅ Affichage du profil expert
```

## Prochaines Étapes Recommandées

### 1. Créer Plus de Comptes de Test
Ajouter plusieurs profils experts avec différentes spécialités :
```typescript
const TEST_EXPERT_ACCOUNTS = [
  {
    email: "demo.expert@monafrica.net",
    specialty: "Psychologie Clinique",
    // ... profil 1
  },
  {
    email: "dr.therapie@monafrica.net",
    specialty: "Thérapie Cognitive",
    // ... profil 2
  },
  {
    email: "dr.familiale@monafrica.net",
    specialty: "Thérapie Familiale",
    // ... profil 3
  }
];
```

### 2. Ajouter une Page de Signup Expert
Créer `/expert/signup` pour permettre l'inscription de nouveaux experts.

### 3. Implémenter la Vérification d'Identité
Ajouter un processus de vérification de la licence professionnelle.

### 4. Créer un Dashboard Admin pour Gérer les Experts
Permettre aux admins d'approuver/rejeter les demandes d'inscription.

## Récapitulatif

| Aspect | Avant | Après |
|--------|-------|-------|
| **Email de test** | dr.aminata.kone@monafrica.net | demo.expert@monafrica.net |
| **Mot de passe** | Test1234! | Expert2025! |
| **Identifiants visibles** | Non | Oui (dans bannière) |
| **Auto-remplissage** | Incorrect | Correct |
| **Connexion** | Échec | Succès |
| **Redirection** | Aucune | /expert/dashboard |

## Conclusion

La page de login expert fonctionne maintenant correctement avec les bons identifiants de test synchronisés entre le frontend et le backend. Les experts peuvent se connecter avec **demo.expert@monafrica.net** / **Expert2025!** et accéder à leur tableau de bord.

La bannière de test affiche clairement les identifiants et permet un auto-remplissage en un clic pour faciliter les tests et démonstrations.
