# Identifiants d'Accès M.O.N.A

## Portail Administrateur Interne
**URL :** `/admin/login`

### Compte Principal
- **Email :** admin@monafrica.net (lié au mail contact)
- **Mot de passe :** MonaAdmin2024!
- **Code 2FA :** 202601
- **Rôle :** Super Administrateur
- **Permissions :** Accès complet à toutes les fonctionnalités

**Note :** Ce portail est strictement réservé à l'usage interne de l'équipe M.O.N.A. Aucun compte de démonstration n'est affiché sur la page de connexion pour renforcer la sécurité.

---

## Portail Expert (Démonstration)
**URL :** `/expert/login`

### Compte Démo Expert
- **Email :** demo.expert@monafrica.net
- **Mot de passe :** Expert2025!
- **Profil :** Dr. Sarah Koné - Psychiatre
- **Spécialités :** Psychiatrie, Thérapie Cognitive et Comportementale
- **Localisation :** Abidjan, Côte d'Ivoire

**Note :** Ce compte est visible publiquement sur la page de login pour permettre aux utilisateurs de tester le portail expert.

---

## Portail Membre (Démonstration)
**URL :** `/login`

### Compte Démo Membre
- **Email :** amara.diallo@gmail.com
- **Mot de passe :** Test1234!
- **Profil :** Amara Diallo
- **Type :** Membre individuel avec abonnement actif au Cercle M.O.N.A

**Note :** Ce compte est visible publiquement sur la page de login pour permettre aux utilisateurs de découvrir l'espace membre.

---

## Sécurité

### Authentification à deux facteurs (2FA)
- Le portail administrateur utilise une authentification 2FA obligatoire
- Le code 2FA est vérifié côté serveur via le backend Supabase
- Les sessions sont sécurisées avec des tokens JWT

### Backend
- Tous les appels d'authentification passent par le serveur Supabase Edge Functions
- Route : `/make-server-6378cc81/admin/login`
- Les mots de passe ne sont jamais stockés en clair
- Les tokens d'accès sont stockés de manière sécurisée dans le localStorage

### Email Officiel
- Domaine : @monafrica.net
- Email de contact principal : contact@monafrica.net
- Email admin : admin@monafrica.net

---

**Dernière mise à jour :** Mars 2026  
**Document strictement confidentiel - Usage interne uniquement**
