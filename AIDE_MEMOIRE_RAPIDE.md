# ⚡ Aide-Mémoire Rapide - Déploiement M.O.N.A

Guide ultra-condensé pour déployer rapidement monafrica.net sur Vercel.

---

## 🚀 En 5 étapes

### 1️⃣ Préparer GitHub (5 min)

```bash
# Créer un repo sur https://github.com/new
# Nom : mona-africa (Private)

# Uploader le code via interface web ou :
git init
git add .
git commit -m "M.O.N.A v1.0"
git remote add origin https://github.com/VOTRE_USERNAME/mona-africa.git
git push -u origin main
```

---

### 2️⃣ Déployer sur Vercel (3 min)

1. **Login** : https://vercel.com/login (avec GitHub)
2. **Import** : New Project → Sélectionner `mona-africa`
3. **Variables** : Environment Variables → Ajouter 5 secrets :
   ```
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   SUPABASE_DB_URL=postgresql://...
   RESEND_API_KEY=re_...
   ```
4. **Deploy** : Cliquer sur Deploy → Attendre 2-3 min

---

### 3️⃣ Configurer DNS IONOS (10 min)

**Étape A : Obtenir valeurs Vercel**
- Vercel → Settings → Domains → Add `monafrica.net`
- Noter : IP (ex: `76.76.21.21`) et CNAME (ex: `cname.vercel-dns.com`)

**Étape B : Modifier DNS IONOS**
- https://my.ionos.com → Domaines → monafrica.net → DNS

| Action | Type | Host | Value |
|--------|------|------|-------|
| ❌ SUPPRIMER | A | @ | 74.208.236.216 |
| ❌ SUPPRIMER | AAAA | @ | 2607:... |
| ✅ AJOUTER | A | @ | `IP_VERCEL` |
| ✅ AJOUTER | CNAME | www | `cname.vercel-dns.com` |

**Attendre 15-60 min** → Tester sur https://dnschecker.org

---

### 4️⃣ Configurer Emails Resend (10 min)

**Étape A : Ajouter domaine**
- https://resend.com/domains → Add Domain → `monafrica.net`

**Étape B : Copier enregistrements DNS**
- Noter les 3 records : TXT (SPF), 2x CNAME (DKIM)

**Étape C : Ajouter dans IONOS DNS**

| Type | Host | Value (exemple) |
|------|------|-----------------|
| TXT | @ | `v=spf1 include:resend.com ~all` |
| CNAME | resend._domainkey | `resend._domainkey.resend.com` |
| CNAME | resend-dkim | `resend-dkim.resend.com` |

**Attendre 15-30 min** → Resend → Verify Domain

---

### 5️⃣ Tests finaux (5 min)

```bash
✅ https://monafrica.net → Page d'accueil OK
✅ https://monafrica.net/portal/login → Login expert OK
✅ https://monafrica.net/b2b/login → Dashboard RH OK
✅ Formulaire contact → Email reçu depuis noreply@monafrica.net
```

---

## 📊 Récap DNS final IONOS

Après config complète :

```
A      | @                   | 76.76.21.21 (IP Vercel)
CNAME  | www                 | cname.vercel-dns.com
TXT    | @                   | v=spf1 include:resend.com ~all
CNAME  | resend._domainkey   | resend._domainkey.resend.com
CNAME  | resend-dkim         | resend-dkim.resend.com
```

---

## 🆘 Dépannage express

| Problème | Solution rapide |
|----------|-----------------|
| **502 Bad Gateway** | Variables d'env manquantes → Vérifier Vercel Settings |
| **DNS not found** | Attendre propagation → Max 2h, tester dnschecker.org |
| **SSL error** | Attendre SSL auto → 10-30 min après DNS OK |
| **Emails en spam** | Ajouter DMARC TXT → `_dmarc` = `v=DMARC1; p=none` |
| **404 sur routes** | Vérifier `/vercel.json` existe avec rewrites |

---

## 🔗 Liens essentiels

| Service | URL |
|---------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **GitHub Repos** | https://github.com/VOTRE_USERNAME/mona-africa |
| **IONOS DNS** | https://my.ionos.com |
| **Supabase** | https://supabase.com/dashboard |
| **Resend** | https://resend.com/domains |
| **DNS Checker** | https://dnschecker.org |

---

## 📞 Comptes de test

**Expert :**
```
Email: demo.expert@monafrica.net
Password: Expert2025!
```

**B2B/RH :**
```
Email: demo.rh@monafrica.net
Password: RH2025!
```

**Admin :**
```
Email: admin@monafrica.net
Password: Admin2025!
```

---

## ⏱️ Temps total estimé

- **Configuration initiale** : 30-45 minutes
- **Propagation DNS** : 15 min - 2 heures
- **Total** : ~1-3 heures max

---

## ✅ Checklist ultra-rapide

```
[ ] Code sur GitHub
[ ] Projet créé sur Vercel
[ ] 5 variables d'env ajoutées
[ ] Deploy Vercel réussi
[ ] DNS A+CNAME modifiés dans IONOS
[ ] Domaine ajouté dans Resend
[ ] 3 records DNS emails ajoutés
[ ] Tests OK (site + auth + emails)
```

---

**🎉 C'est tout !**  
Site live sur https://monafrica.net en moins de 2 heures.

---

**Version** : 1.0 - Aide-mémoire rapide  
**Date** : 30 janvier 2026
