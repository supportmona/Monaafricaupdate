# 🚀 M.O.N.A - GUIDE DE MISE EN PRODUCTION

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture système](#architecture-système)
3. [Configuration Backend](#configuration-backend)
4. [Intégrations paiement](#intégrations-paiement)
5. [Webhooks](#webhooks)
6. [Variables d'environnement](#variables-denvironnement)
7. [Déploiement](#déploiement)
8. [Tests de production](#tests-de-production)
9. [Monitoring](#monitoring)
10. [Maintenance](#maintenance)

---

## 🎯 VUE D'ENSEMBLE

### Plateforme M.O.N.A
**Mieux-être, Optimisation & Neuro-Apaisement**

Plateforme de santé mentale premium pour l'Afrique francophone avec ancrage stratégique à Kinshasa, Dakar et Abidjan.

### Statistiques du projet
- **104 routes backend** fonctionnelles
- **15 pages portail** (Membre, Expert, Admin, RH, Entreprise)
- **3 méthodes de paiement** (Stripe, Wave, Orange Money)
- **Consultations vidéo** (Daily.co)
- **Chat temps réel** (polling)
- **Génération factures PDF**

---

## 🏗️ ARCHITECTURE SYSTÈME

### Frontend
- **Framework**: React + TypeScript
- **Routing**: React Router (Data mode)
- **Styling**: Tailwind CSS v4
- **Animation**: Motion (Framer Motion)
- **Build**: Vite

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono
- **Database**: Supabase PostgreSQL + KV Store
- **Storage**: Supabase Storage (documents)
- **Auth**: Supabase Auth

### Intégrations externes
- **Paiement CB**: Stripe
- **Mobile Money SN**: Wave
- **Mobile Money Multi**: Orange Money
- **Vidéo**: Daily.co
- **Email**: Resend (déjà configuré)

---

## ⚙️ CONFIGURATION BACKEND

### 1. Variables d'environnement Supabase

Allez dans **Supabase Dashboard → Settings → Edge Functions → Secrets**

Ajoutez les variables suivantes :

```bash
# Supabase (déjà configurées)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
SUPABASE_DB_URL=postgresql://...

# Email (déjà configuré)
RESEND_API_KEY=re_...

# Vidéo (déjà configuré)
DAILY_DOMAIN=votre-domaine.daily.co
DAILY_API_KEY=...
VIDEO_PROVIDER=daily

# PAIEMENTS - À AJOUTER
STRIPE_SECRET_KEY=sk_live_... (ou sk_test_... pour tests)
STRIPE_WEBHOOK_SECRET=whsec_...

WAVE_API_KEY=wave_...

ORANGE_MONEY_API_KEY=...
ORANGE_MONEY_MERCHANT_ID=...
```

### 2. Configuration Stripe

#### Obtenir les clés Stripe
1. Créez un compte sur https://stripe.com
2. Allez dans **Developers → API keys**
3. Copiez :
   - **Secret key** (`sk_test_...` ou `sk_live_...`)
   - Créez un webhook pour obtenir le **Webhook secret**

#### Configuration produits (optionnel)
Stripe créera automatiquement des produits via l'API `price_data` dans nos routes.

### 3. Configuration Wave

1. Créez un compte marchand sur https://www.wave.com/en/business/
2. Contactez Wave pour obtenir l'accès API
3. Récupérez votre `WAVE_API_KEY`

### 4. Configuration Orange Money

1. Contactez Orange Money Business : https://www.orange-business.com
2. Demandez l'activation de l'API Web Payment
3. Récupérez :
   - `ORANGE_MONEY_API_KEY`
   - `ORANGE_MONEY_MERCHANT_ID`

---

## 💳 INTÉGRATIONS PAIEMENT

### Routes Backend créées

#### Stripe (`/payment/stripe`)
- `POST /create-checkout-session` - Créer session de paiement
- `POST /webhook` - Webhook Stripe (confirmation paiements)
- `GET /payment-methods` - Liste cartes enregistrées

#### Wave (`/payment/wave`)
- `POST /initiate` - Initier paiement Wave
- `GET /status/:checkoutId` - Vérifier statut
- `POST /webhook` - Webhook Wave

#### Orange Money (`/payment/orange`)
- `POST /initiate` - Initier paiement Orange Money
- `GET /status/:orderId` - Vérifier statut
- `POST /webhook` - Webhook Orange Money

#### Factures (`/invoices`)
- `GET /:transactionId` - Facture HTML (impression PDF)
- `GET /:transactionId/data` - Données JSON

### Pages Frontend créées

- `/payment/success` - Page de confirmation après paiement
- `/invoices` - Liste des factures utilisateur

---

## 🔔 WEBHOOKS

### Configuration des Webhooks

#### Stripe
1. Allez dans **Stripe Dashboard → Developers → Webhooks**
2. Cliquez sur **Add endpoint**
3. URL : 
```
https://votre-projet.supabase.co/functions/v1/make-server-6378cc81/payment/stripe/webhook
```
4. Événements à écouter :
   - `checkout.session.completed`
5. Copiez le **Signing secret** (`whsec_...`) et ajoutez-le comme `STRIPE_WEBHOOK_SECRET`

#### Wave
URL webhook :
```
https://votre-projet.supabase.co/functions/v1/make-server-6378cc81/payment/wave/webhook
```

#### Orange Money
URL webhook :
```
https://votre-projet.supabase.co/functions/v1/make-server-6378cc81/payment/orange/webhook
```

### Test des Webhooks

Utilisez Stripe CLI pour tester localement :
```bash
stripe listen --forward-to https://votre-projet.supabase.co/functions/v1/make-server-6378cc81/payment/stripe/webhook
```

---

## 📦 DÉPLOIEMENT

### 1. Backend (Supabase Edge Functions)

Le backend est déjà déployé car il utilise Supabase Edge Functions.

**Vérification** :
```bash
curl https://votre-projet.supabase.co/functions/v1/make-server-6378cc81/health
```

### 2. Frontend

Le frontend est déjà sur Figma Make et se déploie automatiquement.

**Build local** (si nécessaire) :
```bash
npm run build
```

---

## 🧪 TESTS DE PRODUCTION

### Test Stripe (Mode Test)

1. Utilisez les cartes de test Stripe :
   - **Succès** : `4242 4242 4242 4242`
   - **Échec** : `4000 0000 0000 0002`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

2. Testez le flux complet :
   - Aller sur `/pricing`
   - Sélectionner un plan
   - Payer avec carte test
   - Vérifier redirection vers `/payment/success`
   - Vérifier abonnement dans `/member/subscription`
   - Télécharger facture depuis `/invoices`

### Test Wave

1. Mode sandbox Wave (si disponible)
2. Utilisez un numéro de test fourni par Wave
3. Vérifiez le QR Code s'affiche
4. Simulez paiement
5. Vérifiez webhook reçu

### Test Orange Money

1. Mode test Orange Money
2. Vérifiez redirection vers page paiement Orange
3. Simulez paiement
4. Vérifiez callback

---

## 📊 MONITORING

### Logs Supabase

Consultez les logs dans :
```
Supabase Dashboard → Edge Functions → make-server-6378cc81 → Logs
```

### Vérifications régulières

#### Paiements
- Vérifier dans Stripe Dashboard les paiements reçus
- Croiser avec les transactions dans la base de données
- Vérifier génération factures

#### Webhooks
- Monitorer les webhooks dans Stripe Dashboard
- Vérifier les réponses (200 OK attendu)
- Alertes si taux d'échec > 5%

#### Performance
- Temps de réponse API < 2s
- Taux d'erreur < 1%
- Uptime > 99.5%

---

## 🔧 MAINTENANCE

### Base de données

#### Nettoyage mensuel
```typescript
// Supprimer sessions expirées (> 7 jours)
// Archiver anciennes transactions (> 1 an)
// Nettoyer logs (> 30 jours)
```

#### Backups
- Backups automatiques Supabase : quotidiens
- Export manuel mensuel recommandé

### Sécurité

#### Rotation clés API
- Rotation tous les 90 jours
- Stripe : créer nouvelle clé → update secret → révoquer ancienne
- Wave : contacter support
- Orange Money : contacter support

#### Audits
- Audit sécurité trimestriel
- Revue accès admin mensuel
- Test pénétration annuel

---

## 🆘 DÉPANNAGE

### Paiement échoué

1. Vérifier logs backend
2. Vérifier webhook reçu (Stripe Dashboard)
3. Vérifier clé API valide
4. Vérifier montant/devise

### Facture non générée

1. Vérifier transaction existe dans KV store
2. Vérifier route `/invoices/:transactionId` accessible
3. Vérifier données transaction complètes

### Consultation vidéo ne démarre pas

1. Vérifier `DAILY_API_KEY` valide
2. Vérifier room créée (logs backend)
3. Vérifier SDK Daily.co chargé (console navigateur)

---

## 📞 SUPPORT

### Contacts

- **Stripe** : https://support.stripe.com
- **Wave** : support@wave.com
- **Orange Money** : support technique régional
- **Daily.co** : https://www.daily.co/contact
- **Supabase** : https://supabase.com/support

### Documentation

- [Stripe API](https://stripe.com/docs/api)
- [Wave API](https://developer.wave.com)
- [Orange Money API](https://developer.orange.com)
- [Daily.co API](https://docs.daily.co)
- [Supabase Docs](https://supabase.com/docs)

---

## ✅ CHECKLIST DE MISE EN PRODUCTION

### Avant lancement

- [ ] Toutes variables d'environnement configurées
- [ ] Webhooks Stripe configurés et testés
- [ ] Comptes Wave/Orange Money marchands activés
- [ ] Tests paiement en mode production réussis
- [ ] Génération factures testée
- [ ] Consultations vidéo testées
- [ ] Chat temps réel testé
- [ ] SSL/HTTPS actif
- [ ] Monitoring configuré
- [ ] Backups automatiques vérifiés
- [ ] Plan de reprise d'activité documenté

### Jour du lancement

- [ ] Basculer Stripe en mode Live
- [ ] Activer paiements Wave production
- [ ] Activer paiements Orange Money production
- [ ] Monitoring actif
- [ ] Équipe support disponible
- [ ] Communication lancée

### Post-lancement (J+7)

- [ ] Analyser premiers paiements
- [ ] Vérifier taux de conversion
- [ ] Collecter feedback utilisateurs
- [ ] Optimiser parcours si nécessaire

---

## 🎉 FÉLICITATIONS !

La plateforme M.O.N.A est maintenant prête pour la production !

**Contact équipe technique** : tech@monafrica.net

---

*Document mis à jour le 15 février 2026*
*Version : 1.0.0*
*Auteur : Équipe technique M.O.N.A*
