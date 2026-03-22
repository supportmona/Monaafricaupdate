# 🚀 Guide de Déploiement M.O.N.A sur Vercel

## ✅ Prérequis
- Compte GitHub (gratuit) : https://github.com/signup
- Compte Vercel (gratuit) : https://vercel.com/signup
- Domaine monafrica.net (déjà acheté via IONOS)

---

## 📦 Étape 1 : Préparer votre code sur GitHub

### 1.1 Créer un repository GitHub

1. Allez sur https://github.com/new
2. Nom du repository : `mona-africa`
3. Visibilité : **Private** (recommandé pour un projet commercial)
4. ❌ Ne cochez PAS "Add a README file"
5. Cliquez sur **Create repository**

### 1.2 Télécharger votre code depuis Figma Make

1. Dans Figma Make, cliquez sur le menu ⋮ (trois points)
2. Sélectionnez **"Export Project"** ou **"Download Code"**
3. Téléchargez le fichier ZIP

### 1.3 Uploader le code sur GitHub

**Option A : Via l'interface web GitHub (plus simple)**

1. Sur la page de votre repository GitHub
2. Cliquez sur **"uploading an existing file"**
3. Glissez-déposez TOUS les fichiers de votre projet (sauf node_modules)
4. Message de commit : `Initial commit - M.O.N.A platform`
5. Cliquez sur **Commit changes**

**Option B : Via Git en ligne de commande (si vous êtes technique)**

```bash
# Dans le dossier de votre projet décompressé
git init
git add .
git commit -m "Initial commit - M.O.N.A platform"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/mona-africa.git
git push -u origin main
```

---

## 🌐 Étape 2 : Déployer sur Vercel

### 2.1 Connecter GitHub à Vercel

1. Allez sur https://vercel.com/login
2. Cliquez sur **"Continue with GitHub"**
3. Autorisez Vercel à accéder à votre compte GitHub

### 2.2 Importer votre projet

1. Sur le dashboard Vercel, cliquez sur **"Add New..."** → **"Project"**
2. Trouvez le repository `mona-africa` et cliquez sur **"Import"**
3. Vercel détectera automatiquement Vite

### 2.3 Configurer le build

Vercel devrait détecter automatiquement :
- **Framework Preset** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

✅ Si tout est correct, passez à l'étape suivante

### 2.4 Ajouter les variables d'environnement

⚠️ **CRUCIAL** : Ajoutez vos secrets Supabase et Resend

1. Cliquez sur **"Environment Variables"**
2. Ajoutez les variables suivantes (une par une) :

| Name | Value | Où trouver |
|------|-------|------------|
| `SUPABASE_URL` | `https://VOTRE_PROJECT_ID.supabase.co` | Dashboard Supabase → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJ...` (longue clé) | Dashboard Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (longue clé) | Dashboard Supabase → Settings → API → **⚠️ Secret!** |
| `SUPABASE_DB_URL` | `postgresql://...` | Dashboard Supabase → Settings → Database |
| `RESEND_API_KEY` | `re_...` | Dashboard Resend → API Keys |

3. ⚠️ **Important** : Vérifiez que toutes les variables sont bien ajoutées
4. Cliquez sur **"Deploy"**

### 2.5 Attendre le déploiement

- ⏱️ Temps estimé : 2-5 minutes
- Vous verrez un log en temps réel
- ✅ Succès = "🎉 Your project is live!"
- ❌ Erreur = Lisez les logs pour identifier le problème

---

## 🌍 Étape 3 : Connecter votre domaine monafrica.net

### 3.1 Ajouter le domaine dans Vercel

1. Dans votre projet Vercel, allez dans **Settings** → **Domains**
2. Cliquez sur **"Add"**
3. Entrez `monafrica.net` → Cliquez sur **"Add"**
4. Répétez pour `www.monafrica.net`

### 3.2 Vercel vous donnera des enregistrements DNS

Vercel affichera quelque chose comme :

```
A Record
Name: @
Value: 76.76.21.21

CNAME Record
Name: www
Value: cname.vercel-dns.com
```

*(Les valeurs exactes seront différentes)*

### 3.3 Configurer DNS dans IONOS

1. Allez sur https://my.ionos.com
2. **Domaines** → **monafrica.net** → **Gérer les DNS**

**Pour le domaine racine (@) :**

1. **Supprimez** l'enregistrement A existant (74.208.236.216)
2. **Supprimez** l'enregistrement AAAA existant
3. **Ajoutez** l'enregistrement A fourni par Vercel :
   - Type : `A`
   - Name : `@`
   - Value : `76.76.21.21` *(remplacez par la vraie valeur Vercel)*
   - TTL : `3600`

**Pour le sous-domaine www :**

1. **Ajoutez** l'enregistrement CNAME :
   - Type : `CNAME`
   - Name : `www`
   - Value : `cname.vercel-dns.com` *(remplacez par la vraie valeur Vercel)*
   - TTL : `3600`

4. **Sauvegardez** les modifications

### 3.4 Vérifier la propagation DNS

- ⏱️ Temps de propagation : 5 minutes à 48 heures (généralement < 1 heure)
- Testez sur https://dnschecker.org/#A/monafrica.net
- ✅ Quand c'est vert partout, votre domaine est prêt !

### 3.5 Activer HTTPS (automatique)

Vercel génèrera automatiquement un certificat SSL Let's Encrypt gratuit.
- Temps : 2-10 minutes après la propagation DNS
- Vous verrez "HTTPS Enabled ✅" dans Vercel → Settings → Domains

---

## 📧 Étape 4 : Configurer les emails monafrica.net avec Resend

### 4.1 Ajouter le domaine dans Resend

1. Allez sur https://resend.com/domains
2. Cliquez sur **"Add Domain"**
3. Entrez `monafrica.net`
4. Cliquez sur **"Add"**

### 4.2 Configurer les enregistrements DNS pour emails

Resend vous donnera 3 enregistrements à ajouter dans IONOS :

**Exemple (vos valeurs seront différentes) :**

```
TXT Record
Name: @
Value: v=spf1 include:resend.com ~all

CNAME Record
Name: resend._domainkey
Value: resend._domainkey.resend.com

CNAME Record
Name: resend-dkim
Value: resend-dkim.resend.com
```

### 4.3 Ajouter ces enregistrements dans IONOS

1. Retournez dans **IONOS** → **DNS de monafrica.net**
2. Ajoutez les 3 enregistrements fournis par Resend
3. **Sauvegardez**

### 4.4 Vérifier la configuration

1. Dans Resend, cliquez sur **"Verify Domain"**
2. ✅ Quand c'est validé, vous pouvez envoyer des emails depuis :
   - `noreply@monafrica.net`
   - `contact@monafrica.net`
   - `support@monafrica.net`
   - etc.

---

## ✅ Étape 5 : Vérification finale

### Tests à effectuer :

1. **Site principal** : https://monafrica.net
   - ✅ La page d'accueil s'affiche
   - ✅ Le design "Quiet Luxury" est présent
   - ✅ HTTPS est activé (cadenas vert)

2. **Routes fonctionnelles** :
   - ✅ https://monafrica.net/onboarding → Parcours d'inscription
   - ✅ https://monafrica.net/portal/login → Connexion expert
   - ✅ https://monafrica.net/admin/login → Connexion admin
   - ✅ https://monafrica.net/b2b/login → Connexion B2B

3. **Backend Supabase** :
   - ✅ Authentification fonctionne
   - ✅ Base de données accessible

4. **Emails Resend** :
   - ✅ Test d'envoi depuis le formulaire de contact
   - ✅ Email reçu depuis `noreply@monafrica.net`

---

## 🎉 Félicitations !

Votre plateforme M.O.N.A est maintenant en ligne sur **https://monafrica.net** !

---

## 📊 Monitoring et Analytics (Optionnel)

### Vercel Analytics (gratuit)

1. Dans votre projet Vercel → **Analytics**
2. Activez **Web Analytics**
3. Suivez les visites en temps réel

### Supabase Monitoring

1. Dashboard Supabase → **Reports**
2. Surveillez :
   - Nombre de requêtes API
   - Taille de la base de données
   - Utilisation du stockage

---

## 🆘 Dépannage

### Problème : "502 Bad Gateway"

**Cause** : Variables d'environnement manquantes  
**Solution** : Vérifiez dans Vercel → Settings → Environment Variables

### Problème : "Page non trouvée (404)"

**Cause** : Problème de routage React Router  
**Solution** : Vérifiez que `/vercel.json` contient les rewrites

### Problème : "Emails non reçus"

**Cause** : DNS Resend mal configuré  
**Solution** : Vérifiez les enregistrements TXT/CNAME dans IONOS

### Problème : "SSL Certificate Error"

**Cause** : DNS pas encore propagé  
**Solution** : Attendez 1-2 heures, testez sur https://dnschecker.org

---

## 📞 Support

- **Vercel** : https://vercel.com/support
- **Supabase** : https://supabase.com/support
- **Resend** : https://resend.com/docs
- **IONOS** : https://www.ionos.com/help

---

## 🔐 Sécurité - Points importants

⚠️ **NE JAMAIS** partager :
- `SUPABASE_SERVICE_ROLE_KEY` (accès total à votre base)
- `RESEND_API_KEY` (envoi d'emails illimité)

✅ **Bonnes pratiques** :
- Activez 2FA sur Vercel, GitHub, Supabase
- Utilisez des mots de passe forts
- Surveillez les logs d'accès admin

---

**Dernière mise à jour** : 30 janvier 2026  
**Version** : 1.0 - Déploiement initial M.O.N.A
