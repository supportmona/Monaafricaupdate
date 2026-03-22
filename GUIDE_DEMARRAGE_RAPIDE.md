# Guide de Démarrage Rapide M.O.N.A

## Connexion aux Différents Portails

### 👤 Portail Membre (Patients)

**URL** : [/login](http://localhost:3000/login)

**Compte Premium**
```
Email         : amara.diallo@gmail.com
Mot de passe  : Test1234!
```

**Compte Gratuit**
```
Email         : test.mona@gmail.com
Mot de passe  : Test1234!
```

**Astuce** : Cliquez sur "Remplir automatiquement" dans la bannière jaune.

---

### 👨‍⚕️ Portail Expert (Professionnels)

**URL** : [/expert/login](http://localhost:3000/expert/login) ou [/portal-expert](http://localhost:3000/portal-expert)

**Compte Expert**
```
Email         : demo.expert@monafrica.net
Mot de passe  : Expert2025!
```

**Note** : Seuls les emails @monafrica.net sont acceptés pour les experts.

---

### 👔 Portail Admin

**URL** : [/admin/login](http://localhost:3000/admin/login)

**Compte Admin**
```
Email         : admin@monafrica.net
Mot de passe  : Admin2025!
Code 2FA      : 123456
```

---

### 🏢 Portail Entreprise (B2B)

**URL** : [/b2b-login](http://localhost:3000/b2b-login)

**TotalEnergies RDC**
```
Email         : rh@totalenergies-rdc.com
Mot de passe  : Total2025!
```

**Bantu Technologies**
```
Email         : hr@bantutech.com
Mot de passe  : Bantu2025!
```

---

## Navigation Rapide

### Depuis le Menu Principal

1. **Clic sur "Membre"** dans la navigation
   - Vous redirige vers `/login`
   - Utilisez les identifiants membres

2. **Clic sur "Expert"** dans la navigation
   - Vous redirige vers `/portal-expert`
   - Utilisez les identifiants expert

3. **Clic sur "Entreprise"** dans la navigation
   - Vous redirige vers `/b2b-login`
   - Utilisez les identifiants entreprise

4. **Clic sur "Admin"** dans la navigation
   - Vous redirige vers `/admin/login`
   - Utilisez les identifiants admin

---

## Après Connexion

### Membre
Vous serez redirigé vers `/member/dashboard` avec accès à :
- 📊 Tableau de bord
- 📅 Mes consultations
- ❤️ Passeport santé
- 📚 Bibliothèque de ressources
- 💬 Messagerie
- 👤 Mon profil

### Expert
Vous serez redirigé vers `/expert/dashboard` avec accès à :
- 📊 Tableau de bord
- 📅 Mon agenda
- 👥 Mes patients
- 📋 Dossiers médicaux
- 🎥 Salles de consultation
- 💬 Messagerie
- ⚙️ Paramètres

### Entreprise
Vous serez redirigé vers `/company/dashboard` avec accès à :
- 📊 Vue d'ensemble
- 👥 Employés
- 📅 Consultations
- 📈 Statistiques
- ⚙️ Paramètres

### Admin
Vous serez redirigé vers `/admin/dashboard` avec accès à :
- 📊 Vue d'ensemble globale
- 👤 Gestion des membres
- 👨‍⚕️ Gestion des experts
- 🏢 Gestion des entreprises
- 📝 Gestion du contenu
- 📈 Statistiques complètes
- 💰 Finances

---

## Résolution de Problèmes

### "Page introuvable" ou 404
- ✅ **Solution** : Les routes ont été corrigées. Actualisez la page.

### "Email ou mot de passe incorrect"
- ✅ **Solution** : Vérifiez que vous utilisez les bons identifiants selon le portail :
  - **Membres** : @gmail.com
  - **Experts** : @monafrica.net
  - **Admin** : @monafrica.net
  - **Entreprises** : Domaine de l'entreprise

### La connexion ne fonctionne pas
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les logs :
   - Frontend : `[Frontend] Tentative de connexion pour: ...`
   - Backend : `🔐 Tentative connexion membre: ...`
3. Consultez `/GUIDE_COMPTES_TEST.md` pour les détails complets

---

## Résumé des URLs

| Type | URL | Email |
|------|-----|-------|
| **Membre** | `/login` | amara.diallo@gmail.com |
| **Expert** | `/portal-expert` | demo.expert@monafrica.net |
| **Admin** | `/admin/login` | admin@monafrica.net |
| **Entreprise** | `/b2b-login` | rh@totalenergies-rdc.com |

---

## Besoin d'Aide ?

Consultez les guides détaillés :
- 📖 `/GUIDE_COMPTES_TEST.md` - Tous les comptes de test
- 📖 `/RESUME_CORRECTIONS_FINALES.md` - Récapitulatif complet
- 📖 `/CORRECTION_ROUTES_PORTAIL.md` - Détails des routes
- 📖 `/CORRECTION_LOGIN_EXPERT.md` - Spécifique aux experts

---

**Bon développement avec M.O.N.A !** 🚀