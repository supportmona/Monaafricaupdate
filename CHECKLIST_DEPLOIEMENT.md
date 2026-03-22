# ✅ Checklist de pré-déploiement M.O.N.A

Utilisez cette checklist pour vous assurer que tout est prêt avant de déployer sur Vercel.

---

## 📋 Avant de commencer

### Comptes nécessaires

- [ ] Compte GitHub créé (https://github.com/signup)
- [ ] Compte Vercel créé (https://vercel.com/signup)
- [ ] Compte Supabase actif avec projet créé
- [ ] Compte Resend actif avec API key
- [ ] Domaine monafrica.net acheté via IONOS

---

## 🔐 Secrets et variables d'environnement

### Collecter ces informations AVANT le déploiement

#### Supabase
- [ ] `SUPABASE_URL` : `https://____________.supabase.co`
- [ ] `SUPABASE_ANON_KEY` : `eyJ____________...`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` : `eyJ____________...` ⚠️ Secret !
- [ ] `SUPABASE_DB_URL` : `postgresql://postgres:[PASSWORD]@____________`

**Où les trouver :**
1. Dashboard Supabase → https://supabase.com/dashboard
2. Sélectionnez votre projet M.O.N.A
3. **Settings** (engrenage) → **API**
4. Copiez les valeurs dans un fichier texte temporaire (sécurisé)

#### Resend
- [ ] `RESEND_API_KEY` : `re_____________...`

**Où le trouver :**
1. Dashboard Resend → https://resend.com/api-keys
2. Cliquez sur **"Create API Key"**
3. Nom : `M.O.N.A Production`
4. Permissions : **Full Access** (ou **Send emails**)
5. Copiez la clé immédiatement (elle ne sera plus visible)

---

## 📦 Préparation du code

### Fichiers de configuration

- [ ] `/package.json` mis à jour avec scripts `dev`, `build`, `preview`
- [ ] `/vercel.json` créé avec configuration de routage
- [ ] `/.vercelignore` créé
- [ ] `/.gitignore` créé
- [ ] `/.env.example` créé (sans valeurs réelles)
- [ ] `/README.md` créé
- [ ] Aucun fichier `.env` avec secrets committé (vérifier avec `git status`)

### Vérification du code

- [ ] Toutes les références domaine utilisent `monafrica.net` (pas `.care`)
- [ ] Emails configurés : `noreply@`, `contact@`, `support@`, etc.
- [ ] Aucun console.log sensible (mots de passe, tokens)
- [ ] Aucun TODO ou FIXME critique restant
- [ ] Routes React Router configurées dans `/src/app/routes.tsx`

### Test local (optionnel mais recommandé)

```bash
# Dans le dossier du projet
npm run build
npm run preview
```

- [ ] Build réussi sans erreurs
- [ ] Preview fonctionne sur http://localhost:4173
- [ ] Toutes les pages principales accessibles

---

## 🌐 Préparation DNS IONOS

### Accès IONOS

- [ ] Connexion à https://my.ionos.com réussie
- [ ] Domaine `monafrica.net` visible dans la liste
- [ ] Accès à la section **DNS** fonctionnel

### Enregistrements actuels (à noter)

Notez les valeurs actuelles avant modification (au cas où) :

```
Type A actuel :
Host: @
Value: _______________

Type AAAA actuel :
Host: @
Value: _______________
```

---

## 🚀 GitHub

### Repository

- [ ] Repository GitHub créé : `https://github.com/VOTRE_ORG/mona-africa`
- [ ] Visibilité : **Private** (recommandé)
- [ ] Code pushé sur la branche `main`

### Vérification des fichiers uploadés

Vérifier que ces fichiers sont présents sur GitHub :
- [ ] `/src/` (tous les fichiers React)
- [ ] `/supabase/functions/server/` (backend)
- [ ] `/package.json`
- [ ] `/vercel.json`
- [ ] `/vite.config.ts`
- [ ] `/README.md`

⚠️ Vérifier que ces fichiers ne sont PAS sur GitHub :
- [ ] `.env` (doit être dans .gitignore)
- [ ] `node_modules/` (doit être dans .gitignore)
- [ ] `.vercel/` (doit être dans .gitignore)

---

## 🎯 Import sur Vercel

### Connexion

- [ ] Compte Vercel connecté avec GitHub
- [ ] Autorisation d'accès au repository `mona-africa` donnée

### Configuration du projet

- [ ] Framework détecté : **Vite**
- [ ] Build Command : `npm run build`
- [ ] Output Directory : `dist`
- [ ] Install Command : `npm install`

### Variables d'environnement ajoutées

Dans Vercel → Settings → Environment Variables :

- [ ] `SUPABASE_URL` ajouté
- [ ] `SUPABASE_ANON_KEY` ajouté
- [ ] `SUPABASE_SERVICE_ROLE_KEY` ajouté ⚠️ Ne pas partager !
- [ ] `SUPABASE_DB_URL` ajouté
- [ ] `RESEND_API_KEY` ajouté

**Environnement appliqué :**
- [ ] Cochez **Production**
- [ ] Cochez **Preview** (optionnel)
- [ ] Cochez **Development** (optionnel)

---

## 🌍 Configuration DNS

### Vercel → IONOS

Une fois le projet déployé sur Vercel :

- [ ] Domaine `monafrica.net` ajouté dans Vercel → Settings → Domains
- [ ] Domaine `www.monafrica.net` ajouté également
- [ ] Enregistrements DNS fournis par Vercel notés :
  - A Record : `____________` (IP)
  - CNAME Record : `____________` (hostname)

### Configuration IONOS effectuée

- [ ] Ancien enregistrement A (74.208.236.216) supprimé
- [ ] Ancien enregistrement AAAA supprimé
- [ ] Nouvel enregistrement A (Vercel) ajouté
- [ ] Enregistrement CNAME pour `www` ajouté
- [ ] Modifications sauvegardées dans IONOS

### Propagation DNS

- [ ] Test sur https://dnschecker.org/#A/monafrica.net
- [ ] Majorité des serveurs affichent la nouvelle IP Vercel
- [ ] Test sur https://www.whatsmydns.net/#A/monafrica.net
- [ ] Accès à https://monafrica.net fonctionne (peut prendre 1-2h)

---

## 📧 Configuration emails Resend

### Domaine ajouté dans Resend

- [ ] Domaine `monafrica.net` ajouté sur https://resend.com/domains
- [ ] Enregistrements DNS fournis par Resend notés :
  - TXT (SPF) : `____________`
  - CNAME (DKIM 1) : `____________`
  - CNAME (DKIM 2) : `____________`

### Configuration DNS IONOS pour emails

- [ ] Enregistrement TXT (SPF) ajouté dans IONOS
- [ ] Enregistrement CNAME (resend._domainkey) ajouté
- [ ] Enregistrement CNAME (resend-dkim) ajouté
- [ ] Enregistrement TXT (_dmarc) ajouté (optionnel)
- [ ] Modifications sauvegardées

### Vérification Resend

- [ ] Domaine vérifié dans Resend → "Domain verified ✅"
- [ ] Test d'envoi depuis `noreply@monafrica.net` réussi
- [ ] Email de test reçu (pas en spam)

---

## 🧪 Tests post-déploiement

### Accès au site

- [ ] https://monafrica.net charge correctement
- [ ] https://www.monafrica.net redirige vers https://monafrica.net
- [ ] HTTPS activé (cadenas vert dans le navigateur)
- [ ] Certificat SSL valide (cliquer sur le cadenas pour vérifier)

### Pages principales

- [ ] Page d'accueil : https://monafrica.net
- [ ] Page onboarding : https://monafrica.net/onboarding
- [ ] Mental Score : Fonctionne sur la page d'accueil
- [ ] Quiz de matching culturel : https://monafrica.net/matching-quiz

### Authentification

#### Portail Expert
- [ ] Page login : https://monafrica.net/portal/login
- [ ] Connexion avec compte démo fonctionne
- [ ] Dashboard expert accessible
- [ ] Déconnexion fonctionne

#### Dashboard B2B/RH
- [ ] Page login : https://monafrica.net/b2b/login
- [ ] Connexion avec compte démo fonctionne
- [ ] Dashboard RH accessible
- [ ] Statistiques anonymisées affichées

#### Portail Admin
- [ ] Page login : https://monafrica.net/admin/login
- [ ] Connexion admin fonctionne
- [ ] Messagerie experts accessible
- [ ] Gestion des candidatures fonctionne

### Backend Supabase

- [ ] Authentification persiste après rafraîchissement
- [ ] Données chargées depuis la base
- [ ] Pas d'erreurs CORS dans la console
- [ ] Pas d'erreurs 401 Unauthorized

### Emails Resend

- [ ] Formulaire de contact envoie un email
- [ ] Email reçu depuis `noreply@monafrica.net`
- [ ] Email bien formaté (pas de HTML cassé)
- [ ] Email pas en spam (vérifier dans Gmail, Outlook)

### Performance

- [ ] Temps de chargement < 3 secondes
- [ ] Images se chargent correctement (pas de 404)
- [ ] Fonts chargées (Playfair Display + Inter)
- [ ] Animations fluides (Motion/Framer Motion)

### Responsive

- [ ] Desktop (1920x1080) : Layout correct
- [ ] Tablet (768x1024) : Layout adapté
- [ ] Mobile (375x667) : Layout adapté
- [ ] Navigation mobile fonctionne

---

## 🔐 Sécurité post-déploiement

### Secrets

- [ ] `.env` local supprimé ou dans .gitignore
- [ ] Aucune clé API visible dans le code source GitHub
- [ ] `SUPABASE_SERVICE_ROLE_KEY` jamais exposée au frontend
- [ ] `RESEND_API_KEY` utilisée uniquement côté serveur

### Comptes

- [ ] 2FA activé sur GitHub
- [ ] 2FA activé sur Vercel
- [ ] 2FA activé sur Supabase
- [ ] Mots de passe forts partout

### Monitoring

- [ ] Vercel Analytics activé (optionnel)
- [ ] Supabase → Reports → Surveiller l'usage
- [ ] Pas de quota dépassé
- [ ] Logs d'erreur vides (Vercel → Logs)

---

## 📚 Documentation

### Guides créés et accessibles

- [ ] `README.md` à jour
- [ ] `GUIDE_DEPLOIEMENT_VERCEL.md` complet
- [ ] `GUIDE_DNS_IONOS.md` avec captures d'écran (optionnel)
- [ ] `DASHBOARD_B2B_ACCESS.md` à jour
- [ ] `GUIDE_ADMIN_MESSAGERIE_EXPERTS.md` à jour

### Comptes de test documentés

- [ ] Identifiants admin notés en lieu sûr
- [ ] Identifiants B2B démo documentés
- [ ] Identifiants expert démo documentés

---

## 🎉 Lancement

### Communication

- [ ] Équipe M.O.N.A informée du déploiement
- [ ] URL de production partagée : `https://monafrica.net`
- [ ] Documentation partagée avec l'équipe technique
- [ ] Support alerté pour surveiller les tickets initiaux

### Monitoring initial (première semaine)

- [ ] Vérifier les logs Vercel quotidiennement
- [ ] Surveiller les erreurs Supabase
- [ ] Surveiller le taux de livraison emails Resend
- [ ] Collecter les retours utilisateurs

---

## 🆘 Contacts de support

En cas de problème :

| Service | Support |
|---------|---------|
| **Vercel** | https://vercel.com/support |
| **Supabase** | https://supabase.com/support |
| **Resend** | support@resend.com |
| **IONOS** | https://www.ionos.com/help |

---

## ✅ Validation finale

Avant de considérer le déploiement terminé :

- [ ] Tous les points ci-dessus sont cochés ✅
- [ ] Aucune erreur critique en production
- [ ] Site accessible depuis plusieurs localisations (VPN test)
- [ ] Performance acceptable depuis l'Afrique francophone
- [ ] Équipe satisfaite du résultat

---

**🎊 Félicitations !**  
M.O.N.A est maintenant déployé en production sur **https://monafrica.net** !

---

**Dernière mise à jour** : 30 janvier 2026  
**Version** : 1.0 - Checklist initiale
