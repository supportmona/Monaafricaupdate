# ⚡ START HERE - Déploiement M.O.N.A en 1 page

**🎯 Objectif :** Déployer monafrica.net sur Vercel en 2 heures

---

## 📋 Prérequis (5 min)

```bash
✓ Compte GitHub     → https://github.com/signup
✓ Compte Vercel     → https://vercel.com/signup (connecter avec GitHub)
✓ Domaine IONOS     → monafrica.net (déjà acheté ✓)
✓ Secrets Supabase  → Voir dashboard Supabase
✓ API Key Resend    → Créer sur https://resend.com/api-keys
```

---

## 🚀 Déploiement en 5 étapes

### 1️⃣ GitHub (10 min)

```bash
1. https://github.com/new
2. Nom : mona-africa (Private)
3. Télécharger code depuis Figma Make → Export ZIP
4. Uploader tous les fichiers SAUF node_modules/ et .env
5. Commit → "Initial M.O.N.A deployment"
```

---

### 2️⃣ Vercel (15 min)

```bash
1. https://vercel.com/new
2. Import → Sélectionner mona-africa
3. Framework : Vite (auto-détecté)
4. Environment Variables → Ajouter 5 secrets :
   
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   SUPABASE_DB_URL=postgresql://...
   RESEND_API_KEY=re_...

5. Deploy → Attendre 2-3 min
6. ✓ Tester URL Vercel temporaire
```

**Où trouver les secrets ?**
- **Supabase** : Dashboard → Settings → API
- **Resend** : Dashboard → API Keys → Create

---

### 3️⃣ DNS IONOS → Vercel (20 min)

```bash
DANS VERCEL :
1. Settings → Domains → Add monafrica.net
2. Noter les valeurs fournies :
   - A Record : 76.76.21.21 (exemple)
   - CNAME : cname.vercel-dns.com

DANS IONOS (https://my.ionos.com) :
3. Domaines → monafrica.net → DNS
4. SUPPRIMER :
   ❌ A     @ → 74.208.236.216
   ❌ AAAA  @ → 2607:...
   
5. AJOUTER :
   ✅ A     @ → 76.76.21.21 (valeur Vercel)
   ✅ CNAME www → cname.vercel-dns.com

6. Sauvegarder → Attendre 15-60 min
7. Tester : https://dnschecker.org/#A/monafrica.net
```

---

### 4️⃣ Emails Resend (20 min)

```bash
DANS RESEND (https://resend.com/domains) :
1. Add Domain → monafrica.net
2. Noter les 3 records DNS :
   - TXT   @ → v=spf1 include:resend.com ~all
   - CNAME resend._domainkey → resend._domainkey.resend.com
   - CNAME resend-dkim → resend-dkim.resend.com

DANS IONOS DNS :
3. AJOUTER les 3 records ci-dessus
4. Sauvegarder

DANS RESEND :
5. Verify Domain → Attendre validation (5-30 min)
6. ✓ Test envoi email
```

---

### 5️⃣ Tests finaux (10 min)

```bash
✓ https://monafrica.net → Page d'accueil OK
✓ HTTPS activé (cadenas vert)
✓ https://monafrica.net/portal/login → Connexion OK
✓ https://monafrica.net/b2b/login → Dashboard RH OK
✓ Formulaire contact → Email reçu depuis noreply@monafrica.net
```

---

## 🎉 C'est terminé !

```
╔═══════════════════════════════════════════════════╗
║  ✅ M.O.N.A EST EN LIGNE !                        ║
║  🌍 https://monafrica.net                         ║
╚═══════════════════════════════════════════════════╝
```

---

## 📚 Documentation complète

- **Guide complet** : [GUIDE_DEPLOIEMENT_VERCEL.md](./GUIDE_DEPLOIEMENT_VERCEL.md)
- **Guide DNS** : [GUIDE_DNS_IONOS.md](./GUIDE_DNS_IONOS.md)
- **Checklist** : [CHECKLIST_DEPLOIEMENT.md](./CHECKLIST_DEPLOIEMENT.md)
- **Index** : [INDEX_DEPLOIEMENT.md](./INDEX_DEPLOIEMENT.md)

---

## 🆘 Problèmes fréquents

| Problème | Solution |
|----------|----------|
| **502 Bad Gateway** | Vérifier variables d'env dans Vercel |
| **DNS not found** | Attendre propagation (max 2h) |
| **Emails en spam** | Ajouter DMARC : TXT `_dmarc` → `v=DMARC1; p=none` |
| **404 sur routes** | Vérifier `/vercel.json` existe |

---

## 🎓 Comptes de test

```
Expert    : demo.expert@monafrica.net / Expert2025!
B2B/RH    : demo.rh@monafrica.net / RH2025!
Admin     : admin@monafrica.net / Admin2025! ⚠️ Changer en production
```

---

**Version** : 1.0 | **Date** : 30 janvier 2026 | **Temps total** : ~2h
