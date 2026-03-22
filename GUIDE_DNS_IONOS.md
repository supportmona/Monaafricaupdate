# 🌐 Configuration DNS IONOS pour monafrica.net

## 📋 Vue d'ensemble

Ce guide explique comment configurer les enregistrements DNS dans IONOS pour faire pointer **monafrica.net** vers Vercel et configurer les emails avec Resend.

---

## 🔗 Étape 1 : Pointer le domaine vers Vercel

### Contexte
Après avoir déployé sur Vercel, vous devez faire pointer votre domaine IONOS vers les serveurs Vercel.

### 1.1 Obtenir les valeurs Vercel

1. Allez dans votre projet Vercel
2. **Settings** → **Domains**
3. Ajoutez `monafrica.net` et `www.monafrica.net`
4. Vercel affichera les enregistrements DNS à configurer

**Exemple typique (vos valeurs seront différentes) :**
```
A Record
Name: @
Value: 76.76.21.21

CNAME Record
Name: www
Value: cname.vercel-dns.com
```

### 1.2 Configuration dans IONOS

1. **Connectez-vous à IONOS** : https://my.ionos.com
2. **Domaines** → Cliquez sur `monafrica.net`
3. **DNS** ou **Gérer les DNS**

#### Configuration actuelle (à modifier) :

```
Type   | Host | Value                              | Action
-------|------|------------------------------------|---------
A      | @    | 74.208.236.216                     | ❌ SUPPRIMER
AAAA   | @    | 2607:f1c0:100f:f000:0:0:0:200     | ❌ SUPPRIMER
TXT    | _dep_ws_mutex | "01480b8b4a4e0ac79cf..."  | ⚠️ GARDER (service IONOS)
CNAME  | _domainconnect | _domainconnect.ionos.com | ⚠️ GARDER (service IONOS)
```

#### Nouvelle configuration (à ajouter) :

**⚠️ IMPORTANT : Remplacez les valeurs ci-dessous par celles fournies par Vercel !**

```
Type   | Host | Value                    | TTL
-------|------|--------------------------|------
A      | @    | 76.76.21.21             | 3600
CNAME  | www  | cname.vercel-dns.com    | 3600
```

### 1.3 Étapes détaillées IONOS

**Pour supprimer les anciens enregistrements :**
1. Cochez la case à gauche de chaque enregistrement A et AAAA
2. Cliquez sur le bouton **"Supprimer"** ou l'icône 🗑️
3. Confirmez la suppression

**Pour ajouter l'enregistrement A (domaine racine) :**
1. Cliquez sur **"Ajouter un enregistrement"** ou **"Add Record"**
2. **Type** : Sélectionnez `A`
3. **Host/Name** : Laissez vide ou tapez `@`
4. **Points to/Value** : Entrez l'adresse IP fournie par Vercel (ex: `76.76.21.21`)
5. **TTL** : `3600` (1 heure)
6. **Enregistrer**

**Pour ajouter l'enregistrement CNAME (sous-domaine www) :**
1. Cliquez sur **"Ajouter un enregistrement"**
2. **Type** : Sélectionnez `CNAME`
3. **Host/Name** : `www`
4. **Points to/Value** : Entrez la valeur fournie par Vercel (ex: `cname.vercel-dns.com`)
5. **TTL** : `3600`
6. **Enregistrer**

### 1.4 Vérification

**Temps de propagation DNS :**
- ⏱️ Minimum : 5 minutes
- ⏱️ Maximum : 48 heures
- ⏱️ Typiquement : 15 minutes - 2 heures

**Tester la propagation :**
1. Allez sur https://dnschecker.org
2. **Type** : Sélectionnez `A`
3. **Domain** : Tapez `monafrica.net`
4. Cliquez sur **"Search"**
5. ✅ Si la majorité des serveurs affichent la nouvelle IP Vercel → C'est bon !

**Autre outil :**
- https://www.whatsmydns.net/#A/monafrica.net

---

## 📧 Étape 2 : Configurer les emails avec Resend

### Contexte
Pour envoyer des emails depuis `noreply@monafrica.net`, `contact@monafrica.net`, etc., vous devez prouver à Resend que vous possédez le domaine.

### 2.1 Obtenir les enregistrements Resend

1. Allez sur https://resend.com/domains
2. Cliquez sur **"Add Domain"**
3. Entrez `monafrica.net`
4. Resend affichera 3-4 enregistrements DNS

**Exemple typique (vos valeurs seront différentes) :**

```
TXT Record (SPF)
Name: @
Value: v=spf1 include:resend.com ~all

CNAME Record (DKIM 1)
Name: resend._domainkey
Value: resend._domainkey.resend.com

CNAME Record (DKIM 2)
Name: resend-dkim
Value: resend-dkim.resend.com

TXT Record (DMARC - optionnel)
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@monafrica.net
```

### 2.2 Ajouter les enregistrements dans IONOS

**Pour l'enregistrement SPF (TXT) :**
1. **Ajouter un enregistrement**
2. **Type** : `TXT`
3. **Host/Name** : `@` (domaine racine)
4. **Value** : `v=spf1 include:resend.com ~all`
5. **TTL** : `3600`
6. **Enregistrer**

**⚠️ Important :** Si un enregistrement TXT existe déjà pour `@`, vous devrez peut-être le modifier ou le fusionner. IONOS peut limiter à un seul TXT par host.

**Pour les enregistrements DKIM (CNAME) :**

*DKIM 1 :*
1. **Ajouter un enregistrement**
2. **Type** : `CNAME`
3. **Host/Name** : `resend._domainkey`
4. **Points to** : `resend._domainkey.resend.com`
5. **TTL** : `3600`
6. **Enregistrer**

*DKIM 2 :*
1. **Ajouter un enregistrement**
2. **Type** : `CNAME`
3. **Host/Name** : `resend-dkim`
4. **Points to** : `resend-dkim.resend.com`
5. **TTL** : `3600`
6. **Enregistrer**

**Pour l'enregistrement DMARC (optionnel mais recommandé) :**
1. **Ajouter un enregistrement**
2. **Type** : `TXT`
3. **Host/Name** : `_dmarc`
4. **Value** : `v=DMARC1; p=none; rua=mailto:dmarc@monafrica.net`
5. **TTL** : `3600`
6. **Enregistrer**

### 2.3 Vérifier la configuration Resend

1. Retournez sur https://resend.com/domains
2. Cliquez sur `monafrica.net`
3. Cliquez sur **"Verify Domain"**
4. ✅ Resend vérifiera les enregistrements DNS
5. Si tout est correct : **"Domain verified ✅"**

**Temps de vérification :**
- ⏱️ Immédiat à 30 minutes après propagation DNS

### 2.4 Tester l'envoi d'emails

Une fois vérifié, testez l'envoi :

```bash
# Exemple de test avec curl (remplacez YOUR_API_KEY)
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "noreply@monafrica.net",
    "to": "votre-email@gmail.com",
    "subject": "Test M.O.N.A",
    "html": "<p>Email de test depuis monafrica.net !</p>"
  }'
```

---

## 📊 Récapitulatif final des DNS

Après configuration complète, vos DNS IONOS devraient ressembler à ceci :

```
Type   | Host                | Value                              | Service
-------|---------------------|------------------------------------|----------
A      | @                   | 76.76.21.21                       | Vercel
CNAME  | www                 | cname.vercel-dns.com              | Vercel
TXT    | @                   | v=spf1 include:resend.com ~all    | Resend (SPF)
CNAME  | resend._domainkey   | resend._domainkey.resend.com      | Resend (DKIM)
CNAME  | resend-dkim         | resend-dkim.resend.com            | Resend (DKIM)
TXT    | _dmarc              | v=DMARC1; p=none; ...             | Resend (DMARC)
TXT    | _dep_ws_mutex       | "01480b8b4a4e0ac79cf..."          | IONOS (garder)
CNAME  | _domainconnect      | _domainconnect.ionos.com          | IONOS (garder)
```

---

## 🔍 Dépannage

### Problème : "DNS not propagated" dans Vercel

**Cause :** Propagation DNS pas encore terminée  
**Solution :** Attendre 15-30 minutes, puis cliquer sur "Refresh" dans Vercel

### Problème : "Domain not verified" dans Resend

**Causes possibles :**
1. Enregistrements TXT/CNAME mal copiés (espace en trop, etc.)
2. TTL trop élevé (essayez 3600 ou moins)
3. Propagation DNS pas terminée

**Solution :**
1. Vérifiez les valeurs caractère par caractère
2. Utilisez https://mxtoolbox.com/SuperTool.aspx pour diagnostiquer
3. Attendez 30 minutes et réessayez

### Problème : "Multiple TXT records not supported" (IONOS)

**Cause :** IONOS ne permet qu'un seul TXT par host  
**Solution :** Fusionnez les valeurs TXT :

```
# Si vous avez déjà un TXT pour @, fusionnez-le avec SPF
Valeur existante : v=spf1 include:mailserver.com ~all
Nouvelle valeur : v=spf1 include:mailserver.com include:resend.com ~all
```

### Problème : Emails tombent en spam

**Cause :** DMARC pas configuré ou SPF incomplet  
**Solution :**
1. Ajoutez l'enregistrement DMARC (voir section 2.2)
2. Vérifiez SPF avec https://mxtoolbox.com/spf.aspx
3. Activez DKIM dans Resend
4. Attendez 24-48h pour la réputation d'envoi

---

## 📞 Support

- **IONOS DNS Support** : https://www.ionos.com/help/domains
- **Vercel DNS Support** : https://vercel.com/docs/concepts/projects/custom-domains
- **Resend Email Support** : https://resend.com/docs/dashboard/domains/introduction

---

## ✅ Checklist finale

Avant de terminer, vérifiez :

- [ ] Enregistrement A pointant vers Vercel (pour @)
- [ ] Enregistrement CNAME pointant vers Vercel (pour www)
- [ ] DNS propagé (test sur dnschecker.org)
- [ ] HTTPS activé automatiquement sur Vercel (cadenas vert)
- [ ] Enregistrement TXT SPF pour Resend
- [ ] Enregistrements CNAME DKIM pour Resend
- [ ] Domaine vérifié dans Resend dashboard
- [ ] Test d'envoi d'email réussi depuis noreply@monafrica.net

---

**Configuration terminée ! 🎉**  
Votre domaine **monafrica.net** est maintenant opérationnel pour le web et les emails.

---

**Dernière mise à jour** : 30 janvier 2026  
**Version** : 1.0 - Configuration DNS initiale
