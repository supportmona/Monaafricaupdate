# 🧪 GUIDE TESTS E2E - M.O.N.A

**Guide complet pour tester tous les flows critiques de la plateforme**

---

## 🎯 ACCÈS À LA PAGE DE TESTS

**URL** : `https://votre-domaine.com/e2e-test`

Cette page exécute automatiquement 14 tests critiques et affiche les résultats en temps réel.

---

## ✅ TESTS AUTOMATISÉS (via /e2e-test)

### **1. Backend Santé**
- Vérifie que le serveur Supabase répond
- Endpoint : `/make-server-6378cc81/health`
- Temps attendu : < 500ms

### **2. Authentification Membre**
- Crée un compte test
- Vérifie le token JWT
- Vérifie le profil utilisateur

### **3. Authentification Expert**
- Tente un login expert
- Vérifie les permissions

### **4. Création Consultation**
- Crée un rendez-vous test
- Vérifie le stockage

### **5-7. Paiements**
- Stripe : Checkout session
- Wave : Mobile Money
- Orange Money : Paiement mobile

### **8. Daily.co Vidéo**
- Crée une room vidéo
- Vérifie l'URL de la room

### **9. Email Service**
- Vérifie configuration Resend
- Test envoi email

### **10. Cal.com**
- Vérifie accessibilité du calendrier

### **11. KV Store Database**
- Set/Get/Delete
- Vérification intégrité données

### **12. Upload Documents**
- Teste route upload

### **13. Passeport Santé**
- Vérifie route FHIR

### **14. Smart Matching**
- Teste algorithme matching

---

## 🔧 TESTS MANUELS CRITIQUES

### **FLOW 1 : Inscription Membre** 🟢 PRIORITÉ MAX

**Étapes :**
1. Aller sur `/signup`
2. Remplir le formulaire :
   - Email : `test-membre@monafrica.net`
   - Mot de passe : `TestPassword123!`
   - Nom : `Marie Koné`
3. Cliquer "Créer mon compte"
4. Vérifier redirection vers `/member/dashboard`
5. Vérifier que le nom apparaît en haut à droite

**✅ Succès si :**
- Compte créé sans erreur
- Token JWT stocké dans localStorage
- Dashboard affiche "Bienvenue Marie Koné"

**❌ Échec si :**
- Erreur 500 (backend)
- Pas de token dans localStorage
- Redirection vers /login

---

### **FLOW 2 : Réservation Consultation** 🟢 PRIORITÉ MAX

**Pré-requis** : Être connecté en tant que membre

**Étapes :**
1. Aller sur `/member/booking`
2. Choisir "Santé Mentale"
3. Vérifier que l'iframe Cal.com charge
4. URL attendue : `https://cal.com/eunice.monadvisor`

**✅ Succès si :**
- Cal.com charge sans erreur
- Interface de réservation visible
- Peut sélectionner une date

**❌ Échec si :**
- Erreur CORS
- Iframe vide
- Lien Cal.com cassé

---

### **FLOW 3 : Consultation Vidéo** 🟢 PRIORITÉ MAX

**Pré-requis** : Avoir un RDV créé

**Étapes :**
1. Aller sur `/member/consultation-room/test-123`
2. Vérifier création de la room Daily.co
3. Vérifier que la vidéo se charge
4. Tester les contrôles (mute, caméra, partage écran)
5. Terminer l'appel

**✅ Succès si :**
- Room Daily.co créée
- Vidéo visible (self-view)
- Contrôles fonctionnent
- Modal notes apparaît à la fin

**❌ Échec si :**
- Erreur création room
- Vidéo ne charge pas
- Erreur Daily.co API

---

### **FLOW 4 : Paiement Cercle M.O.N.A** 🟡 PRIORITÉ HAUTE

**Pré-requis** : Être connecté

**Étapes :**
1. Aller sur `/member/upgrade`
2. Cliquer "Souscrire au Cercle" (300 000 XOF / 450 USD)
3. Toggle XOF ↔ USD
4. Cliquer "Payer maintenant"
5. Vérifier redirection Stripe Checkout
6. **NE PAS PAYER** (mode test)

**✅ Succès si :**
- Toggle devise fonctionne
- Redirection vers Stripe
- Session ID visible dans URL

**❌ Échec si :**
- Erreur Stripe API
- Pas de session créée
- Erreur 500

---

### **FLOW 5 : Expert Login + Dashboard** 🟡 PRIORITÉ HAUTE

**Étapes :**
1. Aller sur `/expert/login`
2. Login avec compte expert test (si existe)
3. Vérifier redirection `/expert/dashboard`
4. Vérifier stats (consultations, patients)
5. Aller sur `/expert/agenda`
6. Vérifier calendrier Cal.com

**✅ Succès si :**
- Login réussi
- Dashboard charge
- Stats affichées (même si 0)
- Agenda accessible

**❌ Échec si :**
- Erreur 401 (non autorisé)
- Dashboard vide
- Erreur backend

---

### **FLOW 6 : Documents Médicaux (Expert)** 🟡 PRIORITÉ MOYENNE

**Pré-requis** : Connecté en tant qu'expert

**Étapes :**
1. Aller sur `/expert/prescription-template`
2. Remplir formulaire ordonnance
3. Cliquer "Générer PDF"
4. Vérifier téléchargement PDF
5. Tester aussi :
   - `/expert/medical-certificate`
   - `/expert/medical-report`
   - `/expert/referral-letter`

**✅ Succès si :**
- Formulaires chargent
- PDF se génère
- Contenu correct dans PDF

**❌ Échec si :**
- Erreur génération PDF
- PDF vide
- Erreur backend

---

### **FLOW 7 : Passeport Santé FHIR** 🟡 PRIORITÉ MOYENNE

**Pré-requis** : Connecté en tant que membre

**Étapes :**
1. Aller sur `/member/health-passport`
2. Vérifier affichage données santé
3. Tester ajout nouvelle donnée
4. Vérifier export FHIR

**✅ Succès si :**
- Page charge
- Données affichées
- Export FHIR fonctionne

**❌ Échec si :**
- Erreur 404
- Pas de données
- Export échoue

---

### **FLOW 8 : Smart Matching Quiz** 🟢 PRIORITÉ HAUTE

**Étapes :**
1. Aller sur `/matching-quiz`
2. Répondre aux 10 questions
3. Cliquer "Voir mes résultats"
4. Vérifier redirection `/onboarding-results`
5. Vérifier recommandations d'experts

**✅ Succès si :**
- Quiz charge
- Toutes questions visibles
- Résultats s'affichent
- Experts recommandés pertinents

**❌ Échec si :**
- Questions manquantes
- Erreur calcul
- Pas de résultats

---

### **FLOW 9 : Bibliothèque Ressources** 🟡 PRIORITÉ MOYENNE

**Étapes :**
1. Aller sur `/bibliotheque`
2. Filtrer par catégorie (Anxiété, Dépression, etc.)
3. Filtrer par type (Articles, Vidéos, Podcasts)
4. Filtrer par accès (Gratuit, Membres)
5. Cliquer sur une ressource
6. Vérifier page détail

**✅ Succès si :**
- Filtres fonctionnent
- Ressources s'affichent
- Page détail charge
- Contenu accessible selon plan

**❌ Échec si :**
- Filtres cassés
- Ressources vides
- Erreur accès

---

### **FLOW 10 : Messagerie Expert-Membre** 🟡 PRIORITÉ MOYENNE

**Pré-requis** : Membre ET Expert connectés

**Étapes :**
1. Membre : Aller sur `/member/messages`
2. Démarrer conversation avec expert
3. Envoyer message
4. Expert : Aller sur `/expert/messages`
5. Répondre au message
6. Vérifier réception en temps réel

**✅ Succès si :**
- Messages s'envoient
- Notifications temps réel
- Historique sauvegardé

**❌ Échec si :**
- Messages pas envoyés
- Pas de notifications
- Erreur backend

---

### **FLOW 11 : Admin - Approbation Expert** 🔴 PRIORITÉ CRITIQUE

**Pré-requis** : Connecté en tant qu'admin

**Étapes :**
1. Aller sur `/admin/experts`
2. Filtrer "En attente"
3. Cliquer sur un expert
4. Vérifier documents (diplôme, licence)
5. Cliquer "Approuver"
6. Vérifier email envoyé à l'expert
7. Vérifier que l'expert apparaît sur `/experts`

**✅ Succès si :**
- Liste experts charge
- Documents visibles
- Approbation fonctionne
- Email envoyé
- Expert public visible

**❌ Échec si :**
- Liste vide
- Erreur approbation
- Email pas envoyé

---

### **FLOW 12 : Mobile Money (Wave)** 🟡 PRIORITÉ HAUTE

**Étapes :**
1. Aller sur `/tarifs`
2. Choisir un pack consultation
3. Sélectionner "Wave" comme moyen de paiement
4. Vérifier redirection Wave
5. **NE PAS PAYER** (mode test)

**✅ Succès si :**
- Redirection vers Wave
- Montant correct en XOF
- Transaction ID généré

**❌ Échec si :**
- Erreur Wave API
- Montant incorrect
- Pas de redirection

---

### **FLOW 13 : Orange Money** 🟡 PRIORITÉ HAUTE

**Étapes :**
1. Même que Wave mais avec Orange Money
2. Vérifier redirection Orange
3. Vérifier callback

**✅ Succès si :**
- Redirection fonctionne
- Callback OK

**❌ Échec si :**
- Erreur API Orange

---

### **FLOW 14 : B2B Dashboard Entreprise** 🟠 PRIORITÉ BASSE

**Pré-requis** : Compte entreprise créé

**Étapes :**
1. Aller sur `/entreprise/login`
2. Login avec compte test
3. Vérifier `/entreprise/dashboard`
4. Vérifier `/entreprise/employees`
5. Ajouter un employé
6. Vérifier stats consultations

**✅ Succès si :**
- Login fonctionne
- Dashboard charge
- Employés listés
- Stats visibles

**❌ Échec si :**
- Erreur login
- Dashboard vide
- Pas de données

---

## 📊 CHECKLIST FINALE AVANT LANCEMENT

### **Infrastructure**
- [ ] Backend Supabase répond (< 500ms)
- [ ] CORS configuré correctement
- [ ] SSL/HTTPS activé
- [ ] Environment variables définies

### **Authentification**
- [ ] Signup membre fonctionne
- [ ] Login membre fonctionne
- [ ] Login expert fonctionne
- [ ] Login admin fonctionne
- [ ] Tokens JWT valides
- [ ] Expiration tokens gérée
- [ ] Logout fonctionne

### **Paiements**
- [ ] Stripe Checkout fonctionne
- [ ] Wave intégré et testé
- [ ] Orange Money intégré et testé
- [ ] Webhooks Stripe configurés
- [ ] Factures générées

### **Consultations**
- [ ] Réservation Cal.com fonctionne
- [ ] Daily.co vidéo fonctionne
- [ ] Chat en consultation fonctionne
- [ ] Notes sauvegardées
- [ ] Emails de rappel envoyés

### **Expert**
- [ ] Approbation admin fonctionne
- [ ] Documents médicaux générés
- [ ] Agenda synchronisé
- [ ] Profil public visible

### **Contenu**
- [ ] Ressources accessibles
- [ ] Filtres fonctionnent
- [ ] Blog accessible
- [ ] Témoignages affichés

### **Email**
- [ ] Resend configuré
- [ ] Emails confirmation
- [ ] Emails rappel
- [ ] Emails admin
- [ ] Domain @monafrica.net validé

### **Mobile**
- [ ] Design responsive
- [ ] Navigation mobile OK
- [ ] Consultations sur mobile
- [ ] Paiements mobiles

### **Sécurité**
- [ ] Routes protégées
- [ ] Validation tokens
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Rate limiting

### **Performance**
- [ ] Lazy loading actif
- [ ] Images optimisées
- [ ] Cache configuré
- [ ] CDN activé (si applicable)

---

## 🐛 BUGS COMMUNS ET SOLUTIONS

### **Erreur : "Backend indisponible"**
**Solution** : Vérifier que Supabase Edge Functions sont déployées

### **Erreur : "Token expiré"**
**Solution** : Se reconnecter, vérifier expiration JWT (24h par défaut)

### **Erreur : "CORS blocked"**
**Solution** : Vérifier config CORS dans `/supabase/functions/server/index.tsx`

### **Erreur : "Stripe session failed"**
**Solution** : Vérifier clé API Stripe en production (pas test)

### **Erreur : "Daily.co room creation failed"**
**Solution** : Vérifier clé API Daily.co et quota

### **Erreur : "Email not sent"**
**Solution** : Vérifier clé API Resend et domaine vérifié

---

## 📞 SUPPORT

**En cas de problème critique :**
1. Vérifier console navigateur (F12)
2. Vérifier logs Supabase
3. Exécuter `/e2e-test` pour diagnostic
4. Vérifier status services tiers (Stripe, Daily.co, etc.)

**Ordre de debug :**
1. Backend santé OK ?
2. Authentification OK ?
3. Base de données OK ?
4. Services tiers OK ?

---

**Dernière mise à jour** : Mars 2026  
**Version** : 1.0  
**Testé sur** : Chrome, Firefox, Safari, Mobile Safari, Chrome Android
