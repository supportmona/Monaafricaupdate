# 📋 Actions Post-Déploiement M.O.N.A

Guide des actions à effectuer après le déploiement réussi sur Vercel.

---

## ✅ Déploiement terminé

Avant de continuer, vérifiez que :
- ✅ Site accessible sur https://monafrica.net
- ✅ HTTPS activé (cadenas vert)
- ✅ DNS propagé globalement
- ✅ Emails fonctionnels depuis monafrica.net

---

## 🔐 1. Sécuriser les accès

### 1.1 Changer les mots de passe par défaut

**Portail Admin :**
```
Compte actuel : admin@monafrica.net / Admin2025!
→ À changer en production immédiatement
```

1. Connectez-vous sur https://monafrica.net/admin/login
2. Allez dans **Settings** ou **Profil**
3. Changez le mot de passe pour un mot de passe fort
4. **Activez 2FA** si disponible

**Comptes de test (garder ou supprimer) :**
- `demo.expert@monafrica.net` → Peut rester pour démo
- `demo.rh@monafrica.net` → Peut rester pour démo

### 1.2 Activer 2FA partout

- [ ] **GitHub** : Settings → Security → Two-factor authentication
- [ ] **Vercel** : Settings → Security → Two-Factor Authentication
- [ ] **Supabase** : Account → Security → 2FA
- [ ] **IONOS** : Einstellungen → Sicherheit → Zwei-Faktor-Authentifizierung
- [ ] **Resend** : Settings → Security (si disponible)

### 1.3 Rotation des clés API (optionnel mais recommandé)

Pour plus de sécurité après le premier déploiement :

**Resend API Key :**
1. https://resend.com/api-keys
2. Créez une nouvelle clé : `M.O.N.A Production v2`
3. Mettez à jour dans Vercel → Environment Variables
4. Révoqué l'ancienne clé

---

## 📧 2. Configurer les emails professionnels

### 2.1 Créer les adresses email essentielles

Vous envoyez DEPUIS ces adresses, mais pour RECEVOIR les emails, configurez-les :

**Option A : Redirection vers une boîte existante (plus simple)**

Dans IONOS → Email & Office → Email Forwarding :
- `contact@monafrica.net` → Redirige vers votre email perso
- `support@monafrica.net` → Redirige vers équipe support
- `rh@monafrica.net` → Redirige vers département RH

**Option B : Créer de vraies boîtes email (professionnel)**

IONOS → Email & Office → Create Email Account :
- `contact@monafrica.net` (5€-10€/mois)
- `support@monafrica.net`
- Accès via webmail ou Outlook/Gmail

### 2.2 Tester l'envoi ET la réception

```bash
# Test envoi (depuis le site)
1. https://monafrica.net/contact
2. Remplir le formulaire
3. Envoyer
4. ✅ Email reçu depuis noreply@monafrica.net

# Test réponse
5. Répondre à l'email noreply
6. ✅ Email reçu sur contact@monafrica.net (si configuré)
```

---

## 📊 3. Configurer le monitoring

### 3.1 Vercel Analytics (gratuit)

1. Dashboard Vercel → Projet M.O.N.A
2. **Analytics** → Enable Web Analytics
3. Acceptez les conditions
4. ✅ Suivez en temps réel :
   - Nombre de visiteurs
   - Pages les plus consultées
   - Temps de chargement
   - Géolocalisation des visiteurs

### 3.2 Supabase Monitoring

1. Dashboard Supabase → Reports
2. Surveillez :
   - **API Requests** : Nombre de requêtes/jour
   - **Database Size** : Espace utilisé (limite gratuite : 500 MB)
   - **Storage** : Fichiers uploadés (limite gratuite : 1 GB)
   - **Auth Users** : Nombre d'utilisateurs inscrits

**Alertes recommandées :**
- [ ] Alerte à 80% de quota API
- [ ] Alerte à 80% de stockage database

### 3.3 Resend Monitoring

1. Dashboard Resend → Analytics
2. Surveillez :
   - **Delivered** : Emails bien livrés
   - **Bounced** : Emails rejetés (adresses invalides)
   - **Complained** : Marqués comme spam
   - **Opens** : Taux d'ouverture (si tracking activé)

**Seuil d'alerte :**
- Si **Bounce Rate > 5%** → Vérifier liste de contacts
- Si **Complaint Rate > 0.1%** → Revoir contenu des emails

---

## 🔍 4. SEO et indexation

### 4.1 Soumettre à Google

**Google Search Console :**
1. https://search.google.com/search-console
2. Ajoutez la propriété `https://monafrica.net`
3. Vérifiez via méthode DNS (ajoutez TXT record dans IONOS)
4. Soumettez le sitemap : `https://monafrica.net/sitemap.xml` (si créé)

### 4.2 Balises meta et OG (Open Graph)

Vérifiez que ces balises sont présentes dans `/src/app/App.tsx` ou pages :

```html
<meta name="description" content="M.O.N.A - Plateforme de santé mentale premium en Afrique francophone">
<meta property="og:title" content="M.O.N.A - Mieux-être & Neuro-Apaisement">
<meta property="og:description" content="Soin culturellement adapté avec Smart Matching">
<meta property="og:image" content="https://monafrica.net/og-image.jpg">
<meta property="og:url" content="https://monafrica.net">
```

**Test :**
- https://www.opengraph.xyz → Testez l'aperçu Facebook/LinkedIn

### 4.3 Performance (Lighthouse)

1. Ouvrez https://monafrica.net
2. Ouvrez DevTools (F12) → **Lighthouse**
3. Lancez un audit **Performance + SEO**
4. Objectifs :
   - **Performance** : > 90/100
   - **SEO** : > 90/100
   - **Accessibility** : > 90/100

---

## 🌍 5. Tests depuis l'Afrique

### 5.1 Tests de connectivité

**Test VPN (simuler accès africain) :**
1. Utilisez un VPN avec serveurs en :
   - 🇨🇩 Kinshasa (RDC)
   - 🇸🇳 Dakar (Sénégal)
   - 🇨🇮 Abidjan (Côte d'Ivoire)

2. Vérifiez :
   - [ ] Temps de chargement < 5 secondes
   - [ ] Images se chargent correctement
   - [ ] Backend Supabase répond rapidement
   - [ ] Pas de timeout

**Outils de test :**
- https://www.webpagetest.org (testez depuis Johannesburg, Lagos)
- https://tools.pingdom.com (testez depuis plusieurs localisations)

### 5.2 Tests Mobile Money (à venir)

Une fois les paiements implémentés :
- [ ] Orange Money (XOF - Sénégal, Côte d'Ivoire)
- [ ] MTN Mobile Money (XAF - Cameroun, RDC)
- [ ] M-Pesa (Afrique de l'Est)

---

## 💼 6. Configuration B2B

### 6.1 Préparer le dashboard pour les premières entreprises

**Onboarding B2B :**
1. Document les étapes d'inscription entreprise
2. Préparez un PDF guide pour RH
3. Créez un deck de présentation commercial

**Pricing :**
- Vérifiez les prix affichés sur https://monafrica.net/pricing
- Confirmez la conversion CAD → XOF/XAF/CDF

### 6.2 Tests avec entreprise pilote

Identifiez 1-2 entreprises pour beta test :
- [ ] Créer compte B2B démo
- [ ] Former les RH au dashboard
- [ ] Collecter feedback
- [ ] Ajuster interface si nécessaire

---

## 📚 7. Documentation interne

### 7.1 Créer un wiki interne (notion, confluence, etc.)

**Pages essentielles :**
- Accès et identifiants (sécurisé)
- Procédure de déploiement (lien vers guides)
- Runbook incidents (que faire si le site tombe)
- FAQ support client
- Roadmap produit

### 7.2 Former l'équipe

**Support client :**
- [ ] Comment accéder au portail admin
- [ ] Comment répondre aux candidatures experts
- [ ] Comment gérer les tickets support

**Équipe RH/Commercial :**
- [ ] Démo du dashboard B2B
- [ ] Explication des métriques anonymisées
- [ ] Pitch commercial entreprises

---

## 🚨 8. Plan de continuité

### 8.1 Backup de la base de données

**Automatique (Supabase) :**
- Supabase sauvegarde automatiquement (rétention 7 jours en gratuit)
- Pour backup manuel : Dashboard → Database → Backups

**Recommandé (export mensuel) :**
```bash
# Tous les 1er du mois, exporter la base
pg_dump $SUPABASE_DB_URL > backup-$(date +%Y-%m-%d).sql
```

### 8.2 Monitoring d'uptime

**Service gratuit : UptimeRobot**
1. https://uptimerobot.com (gratuit jusqu'à 50 monitors)
2. Ajoutez `https://monafrica.net`
3. Alertes email/SMS si site down
4. Intervalle de vérification : 5 minutes

**Endpoints à surveiller :**
- [ ] `https://monafrica.net` (homepage)
- [ ] `https://monafrica.net/api/health` (si vous créez un endpoint health check)

### 8.3 Incidents : Qui contacter ?

| Problème | Contact |
|----------|---------|
| **Site down (Vercel)** | Dashboard Vercel → Support |
| **Database down (Supabase)** | Dashboard Supabase → Support |
| **Emails non envoyés (Resend)** | support@resend.com |
| **DNS incorrect (IONOS)** | https://www.ionos.com/help |
| **Code bug** | Équipe dev interne |

---

## 🎉 9. Lancement officiel

### 9.1 Communication externe

**Réseaux sociaux :**
- [ ] Post LinkedIn : "M.O.N.A est en ligne !"
- [ ] Post Twitter/X avec lien
- [ ] Story Instagram montrant le site

**Press release (optionnel) :**
- [ ] Communiqué de presse en français
- [ ] Envoi aux médias tech africains (Jeune Afrique, etc.)

### 9.2 Campagne de lancement

**Email aux inscrits beta :**
```
Objet : M.O.N.A est officiellement lancé ! 🎉

Bonjour [Prénom],

Nous sommes heureux de vous annoncer que M.O.N.A est maintenant accessible sur https://monafrica.net

[...]
```

**Offre de lancement (optionnel) :**
- 1er mois gratuit pour entreprises
- Réduction -20% pour les 100 premiers membres

---

## 📅 10. Calendrier de maintenance

### 10.1 Tâches hebdomadaires

**Chaque lundi :**
- [ ] Vérifier logs d'erreur Vercel
- [ ] Vérifier métriques Supabase (quota)
- [ ] Vérifier taux de livraison emails Resend
- [ ] Répondre aux tickets support admin

### 10.2 Tâches mensuelles

**Chaque 1er du mois :**
- [ ] Backup manuel base de données
- [ ] Review des analytics (pages les plus vues)
- [ ] Mise à jour dépendances npm (si updates de sécurité)
- [ ] Rotation clés API (si politique de sécurité stricte)

### 10.3 Tâches trimestrielles

**Tous les 3 mois :**
- [ ] Audit sécurité complet (scan vulnérabilités)
- [ ] Review contrats Supabase/Resend (limite gratuite)
- [ ] Optimisation base de données (nettoyage données inutiles)
- [ ] Mise à jour majeure de React/dépendances

---

## ✅ Checklist finale post-déploiement

```
[ ] Mots de passe admin changés
[ ] 2FA activé partout
[ ] Emails de redirection configurés
[ ] Analytics Vercel activé
[ ] Monitoring Supabase configuré
[ ] Google Search Console soumis
[ ] Tests depuis Afrique OK
[ ] Documentation interne créée
[ ] Plan de backup en place
[ ] Uptime monitoring actif
[ ] Équipe formée aux outils
[ ] Communication de lancement faite
[ ] Calendrier de maintenance défini
```

---

## 🎊 Félicitations !

Vous avez terminé le déploiement ET la configuration post-déploiement de M.O.N.A !

**Prochaines étapes (roadmap produit) :**
- Implémenter paiements Mobile Money
- Ajouter mode offline-first (Service Workers)
- Optimiser SEO local (Kinshasa, Dakar, Abidjan)
- Développer app mobile (React Native)

---

**Dernière mise à jour** : 30 janvier 2026  
**Version** : 1.0 - Actions post-déploiement
