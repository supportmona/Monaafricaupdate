# 📥 Comment télécharger le code depuis Figma Make

Guide rapide pour exporter votre projet M.O.N.A depuis Figma Make vers votre ordinateur.

---

## 📦 Méthode recommandée : Export depuis Figma Make

### Option 1 : Export ZIP (Recommandé)

1. **Ouvrez votre projet M.O.N.A dans Figma Make**
   - URL : https://www.figma.com/design/VOTRE_PROJECT_ID

2. **Accédez au menu d'export**
   - Cliquez sur le menu **⋮** (trois points verticaux) en haut à droite
   - OU cliquez sur **File** dans la barre de menu

3. **Exportez le code**
   - Cherchez l'option **"Export Code"** ou **"Download Project"**
   - Sélectionnez **"Download as ZIP"**
   - Cliquez sur **"Download"**

4. **Décompressez le fichier**
   - Localisez le fichier `mona-africa.zip` dans vos Téléchargements
   - Double-cliquez pour décompresser (ou clic droit → Extraire)
   - Vous obtenez un dossier `mona-africa/` avec tout le code

---

## 📂 Vérifier le contenu téléchargé

Après décompression, vérifiez que vous avez bien ces dossiers/fichiers :

```
mona-africa/
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── styles/
│   └── utils/
├── supabase/
│   └── functions/
│       └── server/
├── package.json
├── vite.config.ts
├── vercel.json
├── .gitignore
├── .env.example
├── README.md
├── GUIDE_DEPLOIEMENT_VERCEL.md
└── ... (autres fichiers de documentation)
```

**✅ Si vous voyez ces dossiers, tout est bon !**

---

## ⚠️ Vérifications importantes

### 1. Vérifier que le fichier .env n'existe PAS

Le fichier `.env` contient vos secrets et **NE DOIT JAMAIS** être partagé ou uploadé.

**Vérifiez :**
```bash
# Ouvrez le dossier mona-africa/
# Cherchez un fichier nommé ".env"
# ❌ S'il existe → SUPPRIMEZ-LE immédiatement
# ✅ S'il n'existe pas → Parfait !
```

**À la place, vous devez avoir :**
- ✅ `.env.example` (template sans vraies valeurs)

### 2. Vérifier que node_modules/ n'existe PAS

Le dossier `node_modules/` est très volumineux (plusieurs centaines de MB) et ne doit pas être exporté.

**Vérifiez :**
```bash
# Ouvrez le dossier mona-africa/
# Cherchez un dossier nommé "node_modules"
# ❌ S'il existe → SUPPRIMEZ-LE (il sera régénéré plus tard)
# ✅ S'il n'existe pas → Parfait !
```

---

## 🚀 Prochaines étapes après téléchargement

Une fois le code téléchargé et vérifié :

1. **Uploader sur GitHub**
   - Suivez le guide : [GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md#étape-1--préparer-votre-code-sur-github)

2. **Déployer sur Vercel**
   - Suivez le guide complet : [GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md)

3. **Configurer le domaine IONOS**
   - Suivez le guide DNS : [GUIDE_DNS_IONOS.md](./GUIDE_DNS_IONOS.md)

---

## 🆘 Problèmes fréquents

### Problème 1 : Je ne trouve pas l'option "Export Code"

**Solutions :**
- Vérifiez que vous êtes bien dans Figma **Make** (pas Figma Design)
- Essayez de cliquer sur **File** → **Export** → **Code**
- Si aucune option n'apparaît, contactez le support Figma

### Problème 2 : Le ZIP téléchargé est corrompu

**Solutions :**
- Réessayez le téléchargement
- Essayez avec un autre navigateur (Chrome, Firefox, Safari)
- Videz le cache de votre navigateur
- Vérifiez votre connexion internet

### Problème 3 : Il manque des fichiers dans le ZIP

**Fichiers essentiels qui doivent être présents :**
- `/src/app/App.tsx`
- `/package.json`
- `/vite.config.ts`
- `/vercel.json`

**Si l'un manque :**
- Réessayez l'export depuis Figma Make
- Vérifiez que vous avez bien sauvegardé toutes vos modifications avant l'export

---

## 📋 Checklist avant de continuer

Avant de passer au déploiement, vérifiez :

```
☐ Code téléchargé et décompressé
☐ Dossiers src/, supabase/, etc. présents
☐ Fichier .env n'existe PAS (ou supprimé)
☐ Dossier node_modules/ n'existe PAS (ou supprimé)
☐ Fichiers de documentation présents (README.md, guides, etc.)
☐ Fichier vercel.json présent
☐ Fichier .gitignore présent
```

---

## ✅ Tout est prêt !

Une fois le code téléchargé et vérifié, vous pouvez passer à la suite :

👉 **[GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md)** - Étape 1 : GitHub

---

**Dernière mise à jour** : 30 janvier 2026  
**Version** : 1.0
