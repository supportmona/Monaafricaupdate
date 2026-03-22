# 🚀 Guide de déploiement - Vercel + Supabase

## ⚠️ IMPORTANT : Deux systèmes séparés

Votre application M.O.N.A est composée de **2 parties hébergées séparément** :

```
┌─────────────────────────────────────────────┐
│         FRONTEND (React/Next.js)            │
│         Hébergé sur: VERCEL                 │
│         Domaine: www.monafrica.net          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│    BACKEND (Edge Functions Supabase)        │
│    Hébergé sur: SUPABASE                    │
│    Endpoint: PROJECT_ID.supabase.co         │
└─────────────────────────────────────────────┘
```

---

## 🔧 **Modifications que j'ai faites**

### **Backend Supabase uniquement :**
- ✅ `/supabase/functions/server/messaging.tsx` (notifications Premium ajoutées)

### **Pas de modification frontend :**
- Le reste de votre code frontend sur Vercel n'a pas changé

---

## 📋 **MÉTHODE 1 : Déploiement via Supabase CLI (Recommandé)**

### **Étape 1 : Installation du CLI**

```bash
# Si Node.js est installé
npm install -g supabase

# OU via Homebrew (Mac/Linux)
brew install supabase/tap/supabase

# OU téléchargement direct
# https://github.com/supabase/cli/releases
```

### **Étape 2 : Connexion à Supabase**

```bash
# Se connecter
supabase login

# Un navigateur va s'ouvrir pour vous authentifier
```

### **Étape 3 : Lier votre projet**

```bash
# Aller dans le dossier racine de votre projet M.O.N.A
cd /chemin/vers/votre/projet/mona

# Lier le projet Supabase
supabase link --project-ref VOTRE_PROJECT_ID
```

**Pour trouver votre PROJECT_ID :**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet M.O.N.A
3. Dans l'URL : `https://supabase.com/dashboard/project/XXXXX` → `XXXXX` = PROJECT_ID

### **Étape 4 : Déployer le fichier modifié**

```bash
# Déployer TOUTES les fonctions du dossier /supabase/functions/server/
supabase functions deploy server

# OU déployer juste la fonction serveur
supabase functions deploy server --project-ref VOTRE_PROJECT_ID
```

### **Étape 5 : Vérifier les variables d'environnement**

```bash
# Lister les secrets existants
supabase secrets list

# Vérifier que RESEND_API_KEY existe
# Si elle n'existe pas, l'ajouter :
supabase secrets set RESEND_API_KEY=re_VOTRE_CLE_RESEND
```

### **Étape 6 : Tester**

```bash
# Les logs en temps réel
supabase functions logs server --tail
```

---

## 📋 **MÉTHODE 2 : Déploiement manuel (Plus simple mais moins pratique)**

Si vous n'arrivez pas à installer le CLI, voici une solution manuelle :

### **Étape 1 : Trouver votre code source local**

Votre projet doit être quelque part :
- Sur votre ordinateur (dossier local)
- Sur GitHub/GitLab (repository)

### **Étape 2 : Remplacer le fichier**

1. **Ouvrez** le fichier `/supabase/functions/server/messaging.tsx`
2. **REMPLACEZ tout le contenu** par le code ci-dessous
3. **Sauvegardez**

### **Étape 3 : Le code complet à copier-coller**

Copiez TOUT le code depuis la ligne 1 jusqu'à la ligne 503 du fichier que j'ai généré.

**Voir le fichier complet ici :** 
👉 Je vous l'ai déjà affiché juste au-dessus (503 lignes)

### **Étape 4 : Redéployer via GitHub (si vous utilisez GitHub)**

Si votre projet est connecté à GitHub et que Vercel/Supabase déploie automatiquement :

```bash
# Dans votre terminal
git add supabase/functions/server/messaging.tsx
git commit -m "feat: Ajout notifications email Premium via Resend"
git push origin main
```

Si Supabase est configuré avec GitHub Actions, le déploiement se fera automatiquement.

---

## 📋 **MÉTHODE 3 : Via Figma Make (Si possible)**

Si votre projet est directement connecté à Figma Make :

1. **Exportez le code** depuis Figma Make
2. **Importez-le** dans votre projet local
3. **Déployez** via CLI ou GitHub

---

## 🧪 **Vérifier que le déploiement a fonctionné**

### **Test 1 : Vérifier les logs Supabase**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet M.O.N.A
3. Menu : **Edge Functions** → **server**
4. Cliquez sur **Logs**
5. Vous devriez voir les logs de déploiement

### **Test 2 : Tester l'envoi d'email**

```bash
curl -X POST https://VOTRE_PROJECT_ID.supabase.co/functions/v1/make-server-6378cc81/contact/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -d '{
    "name": "Test Déploiement",
    "email": "votre@email.com",
    "phone": "+243 81 234 5678",
    "subject": "Test après déploiement",
    "message": "Vérification que les modifications sont déployées",
    "category": "test"
  }'
```

**Résultat attendu :**
```json
{"success": true, "message": "Message envoyé avec succès"}
```

---

## ❓ **FAQ - Problèmes courants**

### **Q1 : "supabase: command not found"**

**Réponse :** Le CLI Supabase n'est pas installé.

**Solution :**
```bash
npm install -g supabase
# OU
brew install supabase/tap/supabase
```

---

### **Q2 : "Project not linked"**

**Réponse :** Vous n'avez pas lié le projet local au projet Supabase.

**Solution :**
```bash
supabase link --project-ref VOTRE_PROJECT_ID
```

---

### **Q3 : "Function deployment failed"**

**Réponse :** Il y a une erreur dans le code ou une dépendance manquante.

**Solution :**
1. Vérifiez les logs : `supabase functions logs server`
2. Vérifiez que le code est correct (pas de fautes de frappe)
3. Vérifiez que `RESEND_API_KEY` est définie

---

### **Q4 : "RESEND_API_KEY not found"**

**Réponse :** La variable d'environnement n'est pas définie dans Supabase.

**Solution :**
```bash
# Via CLI
supabase secrets set RESEND_API_KEY=re_VOTRE_CLE

# OU via Dashboard Supabase
# Settings → Edge Functions → Environment Variables
```

---

### **Q5 : "Je n'ai pas accès au code source local"**

**Réponse :** Si votre projet est uniquement sur Figma Make, vous devez exporter le code.

**Solution :**
1. Dans Figma Make, cherchez une option "Export" ou "Download"
2. Téléchargez le projet complet
3. Déployez via Supabase CLI

---

## 🎯 **Checklist de déploiement**

Avant de considérer le déploiement comme terminé :

- [ ] Supabase CLI installé (`supabase --version`)
- [ ] Authentifié à Supabase (`supabase login`)
- [ ] Projet lié (`supabase link`)
- [ ] Fichier `messaging.tsx` mis à jour
- [ ] Fonction déployée (`supabase functions deploy server`)
- [ ] Variable `RESEND_API_KEY` définie
- [ ] Test d'envoi d'email réussi
- [ ] Logs Supabase vérifiés (pas d'erreur)

---

## 📞 **Architecture de déploiement**

```
┌──────────────────────┐
│   DÉVELOPPEMENT      │
│   (Figma Make)       │
└──────────┬───────────┘
           │
           │ Export / Git push
           ▼
┌──────────────────────┐
│   CODE SOURCE        │
│   (GitHub/Local)     │
└──────────┬───────────┘
           │
           ├───────────────────────┐
           │                       │
           ▼                       ▼
┌──────────────────┐   ┌──────────────────────┐
│   VERCEL         │   │   SUPABASE           │
│   (Frontend)     │   │   (Backend)          │
│   React/Next.js  │   │   Edge Functions     │
└──────────────────┘   └──────────────────────┘
           │                       │
           │                       │
           ▼                       ▼
    www.monafrica.net     .supabase.co/functions
```

---

## 🚀 **Workflow recommandé**

### **Développement local :**
1. Modifier le code dans Figma Make ou IDE
2. Tester localement si possible
3. Commit dans Git

### **Déploiement :**
1. **Frontend (Vercel)** : Git push → Déploiement automatique
2. **Backend (Supabase)** : `supabase functions deploy server`

### **Vérification :**
1. Vérifier les logs Supabase
2. Tester les endpoints
3. Vérifier les emails dans Resend Dashboard

---

## ✅ **Prochaines étapes après déploiement**

1. ✅ **Tester l'envoi d'email** depuis votre site
2. ✅ **Vérifier la réception** dans IONOS
3. ✅ **Créer un compte Premium** de test
4. ✅ **Tester les notifications** Premium
5. ✅ **Surveiller les logs** pour les erreurs

---

## 🆘 **Besoin d'aide ?**

Si vous êtes bloqué :

1. **Vérifiez les logs** :
   - Supabase Dashboard → Functions → Logs
   - Resend Dashboard → Emails

2. **Testez étape par étape** :
   - CLI installé ? → `supabase --version`
   - Authentifié ? → `supabase projects list`
   - Projet lié ? → `supabase status`

3. **Partagez l'erreur exacte** que vous obtenez

---

**Bonne chance avec le déploiement ! 🚀**
