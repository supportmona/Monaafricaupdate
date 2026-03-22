# ⚡ QUICK START - M.O.N.A Production

## 🚀 Démarrage rapide en 5 étapes

### ÉTAPE 1️⃣ : Ajouter les secrets Supabase (5 min)

Allez sur : **Supabase Dashboard → Settings → Edge Functions → Secrets**

Ajoutez ces 5 variables :

```bash
STRIPE_SECRET_KEY=sk_test_... (obtenir sur stripe.com)
STRIPE_WEBHOOK_SECRET=whsec_... (créer webhook Stripe)
WAVE_API_KEY=wave_... (contacter Wave)
ORANGE_MONEY_API_KEY=... (contacter Orange)
ORANGE_MONEY_MERCHANT_ID=... (contacter Orange)
```

---

### ÉTAPE 2️⃣ : Configurer webhooks Stripe (3 min)

1. Allez sur https://dashboard.stripe.com/webhooks
2. Cliquez "Add endpoint"
3. URL : 
```
https://VOTRE-PROJET.supabase.co/functions/v1/make-server-6378cc81/payment/stripe/webhook
```
4. Événements : `checkout.session.completed`
5. Copiez le "Signing secret" → ajoutez comme `STRIPE_WEBHOOK_SECRET`

---

### ÉTAPE 3️⃣ : Test paiement Stripe (2 min)

1. Allez sur `/pricing`
2. Sélectionnez un plan
3. Utilisez la carte test : `4242 4242 4242 4242`
4. Date : n'importe quelle date future
5. CVC : n'importe quel 3 chiffres
6. Validez → vous devez être redirigé vers `/payment/success`

---

### ÉTAPE 4️⃣ : Vérifier l'abonnement (1 min)

1. Allez sur `/member/dashboard`
2. Vérifiez que le badge "MEMBRE" apparaît
3. Allez sur `/member/subscription`
4. Vérifiez les détails de l'abonnement
5. Allez sur `/invoices`
6. Téléchargez votre facture

---

### ÉTAPE 5️⃣ : Tester les autres fonctionnalités (5 min)

**Chat** :
- Expert : `/expert/messages`
- Membre : `/member/messages`

**Calendrier expert** :
- `/expert/calendar`
- Configurez vos disponibilités
- Bloquez un créneau

**Consultation vidéo** :
- Réservez une consultation
- Rejoignez via `/member/consultation-room/:id`

---

## ✅ CHECKLIST RAPIDE

### Backend (déjà fait ✅)
- [x] 104 routes fonctionnelles
- [x] Stripe intégré
- [x] Wave intégré
- [x] Orange Money intégré
- [x] Factures PDF
- [x] Chat temps réel
- [x] Daily.co vidéo

### À faire maintenant
- [ ] Ajouter secrets Supabase (ÉTAPE 1)
- [ ] Configurer webhook Stripe (ÉTAPE 2)
- [ ] Tester paiement (ÉTAPE 3)
- [ ] Vérifier abonnement (ÉTAPE 4)
- [ ] Tester fonctionnalités (ÉTAPE 5)

---

## 🆘 PROBLÈMES COURANTS

### "Stripe non configuré"
➡️ Ajoutez `STRIPE_SECRET_KEY` dans les secrets Supabase

### "Webhook failed"
➡️ Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct

### "Facture vide"
➡️ Attendez 2-3 secondes après le paiement (webhook)

### "Vidéo ne démarre pas"
➡️ Vérifiez que `DAILY_API_KEY` est configuré

---

## 📞 CONTACTS

- **Support** : tech@monafrica.net
- **Documentation complète** : `/PRODUCTION_GUIDE.md`
- **Implémentation** : `/IMPLEMENTATION_COMPLETE.md`

---

## 🎉 C'EST TOUT !

La plateforme est prête. Suivez les 5 étapes ci-dessus et vous êtes en production !

**Temps total : ~15 minutes**

---

*M.O.N.A - Excellence en santé mentale pour l'Afrique* 🌍
