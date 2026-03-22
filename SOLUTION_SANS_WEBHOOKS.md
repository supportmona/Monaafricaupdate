# 🔧 SOLUTION ALTERNATIVE SANS WEBHOOKS DAILY.CO

## ❌ PROBLÈME IDENTIFIÉ

Daily.co en mode **iframe** (comme actuellement dans `DailyVideoRoom.tsx`) **ne permet pas d'accéder au chat** par JavaScript. C'est une limitation de sécurité de l'iframe.

## ✅ SOLUTIONS POSSIBLES

### **Option 1 : Bouton Manuel "Enregistrer Notes de Consultation"** ⭐ RECOMMANDÉ

**Concept** : Au lieu de capturer automatiquement le chat Daily.co (impossible sans webhooks), l'expert ajoute manuellement des notes après la consultation.

#### **Avantages**
- ✅ **Fonctionne immédiatement** (aucune dépendance Daily.co)
- ✅ **Plus professionnel** : Notes structurées vs chat brut
- ✅ **Contrôle total** : Expert choisit quoi sauvegarder
- ✅ **Conforme RGPD** : Pas de capture automatique
- ✅ **Flexible** : Notes + prescriptions + recommandations

#### **Interface proposée**

Quand l'expert clique sur "Terminer la consultation" :

```
┌────────────────────────────────────────────────┐
│  📋 Notes de Consultation                      │
├────────────────────────────────────────────────┤
│                                                │
│  [Textarea grande zone]                        │
│  Exemple:                                      │
│  - Patient se sent mieux depuis dernière fois  │
│  - Continue exercices de respiration          │
│  - Prochain RDV dans 2 semaines                │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │ Recommandations:                         │  │
│  │ - Continuer la méditation quotidienne    │  │
│  │ - Limiter temps écrans le soir           │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  [✓] Envoyer résumé au membre                  │
│                                                │
│  [Annuler]  [Terminer et Sauvegarder] ←────────│
└────────────────────────────────────────────────┘
```

#### **Flux complet**

1. **Pendant la consultation** : Expert et membre discutent (vidéo + audio)
2. **Expert clique "Terminer"** : Modale s'ouvre
3. **Expert remplit les notes** : Résumé + recommandations
4. **Expert clique "Terminer et Sauvegarder"** :
   - Notes sauvegardées dans la messagerie
   - Message envoyé au membre automatiquement
   - Room Daily.co supprimée
   - Consultation marquée comme terminée

#### **Format du résumé envoyé**

```
📋 Résumé de votre consultation du samedi 15 février 2026

👨‍⚕️ Expert : Dr. Sarah Koné
👤 Membre : Amara Koné

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 NOTES DE CONSULTATION

Patient se sent mieux depuis notre dernière séance.
Les exercices de respiration l'aident beaucoup.
Pas de troubles du sommeil cette semaine.

💡 RECOMMANDATIONS

✓ Continuer la méditation quotidienne (10 min/jour)
✓ Limiter le temps d'écran le soir (après 20h)
✓ Maintenir un journal de gratitude

📅 SUIVI

Prochain rendez-vous dans 2 semaines
En cas d'urgence, me contacter via la messagerie

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Résumé automatiquement sauvegardé
💬 Pour toute question, répondez à ce message
```

#### **Implémentation technique**

**Frontend** : Modifier la page de consultation pour ajouter la modale

**Backend** : Déjà fait ! La route `/consultations/end-consultation/:id` attend juste qu'on lui passe des `chatMessages`. On peut passer les notes de l'expert comme un seul message :

```typescript
// Quand expert soumet le formulaire
const consultationNotes = {
  text: formData.notes,
  senderId: expertId,
  senderName: expertName,
  senderType: "expert",
  timestamp: new Date().toISOString(),
  isNote: true, // Flag spécial
};

// Appeler la route existante
await fetch(`/consultations/end-consultation/${appointmentId}`, {
  method: "DELETE",
  body: JSON.stringify({
    notes: consultationNotes, // Ajout optionnel
  }),
});

// Le backend utilise déjà formatChatTranscript() pour créer le résumé !
```

---

### **Option 2 : Utiliser le SDK Daily.co (au lieu de l'iframe)** 🔧 AVANCÉ

**Concept** : Remplacer l'iframe par le SDK JavaScript Daily.co qui donne accès programmatique au chat.

#### **Avantages**
- ✅ Accès au chat Daily.co en temps réel
- ✅ Capture automatique des messages
- ✅ Plus de contrôle sur l'UI

#### **Inconvénients**
- ❌ Complexe à implémenter
- ❌ Nécessite réécrire `DailyVideoRoom.tsx`
- ❌ Plus de code à maintenir
- ❌ Dépendance au SDK Daily.co

#### **Code exemple (simplifié)**

```typescript
import DailyIframe from '@daily-co/daily-js';

// Créer instance Daily
const callFrame = DailyIframe.createFrame({
  url: roomUrl,
  showLeaveButton: true,
  showFullscreenButton: true,
});

// Écouter les messages du chat
callFrame.on('app-message', async (event) => {
  if (event.data.type === 'chat-message') {
    // Envoyer au serveur
    await fetch('/consultations/store-chat-message', {
      method: 'POST',
      body: JSON.stringify({
        appointmentId,
        roomName,
        message: {
          text: event.data.text,
          senderId: event.fromId,
          senderName: event.data.senderName,
          senderType: event.data.senderType,
          timestamp: new Date().toISOString(),
        },
      }),
    });
  }
});
```

**Problème** : Daily.co n'expose pas le chat intégré de l'iframe via l'API `app-message`. Il faudrait créer un chat custom.

---

### **Option 3 : Chat Custom M.O.N.A à côté de la vidéo** 💬 HYBRIDE

**Concept** : Garder l'iframe Daily.co pour la vidéo, mais ajouter un chat M.O.N.A à côté qui se sauvegarde automatiquement.

#### **Interface proposée**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   ┌───────────────┐  ┌─────────────────────┐   │
│   │               │  │  💬 Chat M.O.N.A    │   │
│   │   Vidéo       │  │                     │   │
│   │   Daily.co    │  │  [Messages...]      │   │
│   │   (iframe)    │  │                     │   │
│   │               │  │  ──────────────────  │   │
│   │               │  │  > Votre message... │   │
│   └───────────────┘  └─────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

#### **Avantages**
- ✅ Sauvegarde automatique (déjà fait !)
- ✅ Contrôle total sur le chat
- ✅ Design M.O.N.A premium
- ✅ Fonctionne sans webhooks

#### **Inconvénients**
- Les utilisateurs ont 2 endroits pour chatter (confus)
- Prend de l'espace à l'écran

#### **Implémentation**

Réutiliser le système de messagerie existant (`ChatPage.tsx`) mais dans un composant à côté de la vidéo :

```typescript
<div className="flex gap-4 h-screen">
  {/* Vidéo Daily.co */}
  <div className="flex-1">
    <DailyVideoRoom roomUrl={roomUrl} />
  </div>
  
  {/* Chat M.O.N.A */}
  <div className="w-96">
    <ConsultationChat 
      conversationId={conversationId}
      onSendMessage={handleSendMessage} // Sauvegarde auto
    />
  </div>
</div>
```

Les messages sont automatiquement sauvegardés dans la messagerie M.O.N.A pendant la consultation !

---

## 🎯 MA RECOMMANDATION FINALE

### **OPTION 1 : Notes de Consultation Manuelles** ⭐⭐⭐⭐⭐

**Pourquoi ?**

1. **Plus professionnel** : Les experts prennent des notes structurées (pas un dump de chat)
2. **Conforme au médical** : Format standardisé pour suivi patient
3. **Fonctionne immédiatement** : Aucune dépendance technique
4. **Meilleure UX** : Membre reçoit un résumé clair et actionnable
5. **RGPD-friendly** : Expert contrôle ce qui est sauvegardé

**Ce que ça donne en pratique** :

```
AVANT (chat brut) :
[14:30] Expert : salut
[14:31] Membre : bonjour
[14:32] Expert : comment ça va ?
[14:33] Membre : mieux
[14:34] Expert : super
...

APRÈS (notes structurées) :
📋 RÉSUMÉ DE CONSULTATION

État du patient : Amélioration notable
Symptômes : Diminution de l'anxiété
Traitement : Continuer méditation quotidienne
Recommandations : Limiter écrans le soir
Suivi : RDV dans 2 semaines
```

**Beaucoup plus utile pour le suivi médical !** ✅

---

## 📦 CE QUI EST DÉJÀ FAIT (Backend)

✅ Route `POST /consultations/store-chat-message` (pour capture temps réel)  
✅ Route `DELETE /consultations/end-consultation/:id` (sauvegarde auto)  
✅ Fonction `getChatHistory()` (récupère depuis KV store)  
✅ Fonction `formatChatTranscript()` (formate le résumé)  
✅ Création automatique de conversation  
✅ Message récapitulatif dans la messagerie  

**Le backend est 100% prêt pour les 3 options !** 🎉

---

## 🚀 PROCHAINES ÉTAPES

### **Si vous choisissez Option 1 (Recommandé)** :

1. ✅ Créer une modale `ConsultationNotesModal.tsx`
2. ✅ Ajouter un formulaire avec textarea pour les notes
3. ✅ Au submit, appeler `/consultations/end-consultation/:id`
4. ✅ Passer les notes comme paramètre
5. ✅ Backend formate et envoie le résumé automatiquement

**Temps estimé** : 1-2 heures

### **Si vous choisissez Option 2 (SDK Daily.co)** :

1. Installer `@daily-co/daily-js`
2. Réécrire `DailyVideoRoom.tsx` avec le SDK
3. Créer un chat custom
4. Écouter les événements et envoyer au serveur
5. Tester

**Temps estimé** : 1-2 jours

### **Si vous choisissez Option 3 (Chat M.O.N.A à côté)** :

1. Créer `ConsultationChat.tsx` (basé sur `ChatPage.tsx`)
2. Intégrer à côté de la vidéo
3. Les messages sont déjà sauvegardés automatiquement !

**Temps estimé** : 3-4 heures

---

## 💡 BONUS : Combinaison Options 1 + 3

**L'idéal pour M.O.N.A** :

1. **Pendant la consultation** : Chat M.O.N.A à côté de la vidéo (Option 3)
   - Messages sauvegardés automatiquement
   - Continuité avec la messagerie normale

2. **Fin de consultation** : Notes structurées de l'expert (Option 1)
   - Résumé professionnel
   - Recommandations claires
   - Plan de suivi

3. **Résumé final** : Combine les deux
   - Chat complet en annexe
   - Notes de l'expert en premier plan

**Exemple de résumé combiné** :

```
📋 RÉSUMÉ DE CONSULTATION DU 15/02/2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👨‍⚕️ NOTES DE L'EXPERT

État : Amélioration significative
Symptômes : Diminution anxiété
Recommandations :
  ✓ Continuer méditation 10min/jour
  ✓ Limiter écrans après 20h
  ✓ Journal de gratitude quotidien
Suivi : RDV dans 2 semaines

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 ÉCHANGES PENDANT LA CONSULTATION

[14:30] Dr. Koné :
Comment vous sentez-vous depuis notre dernière séance ?

[14:31] Amara Koné :
Beaucoup mieux ! Les exercices m'aident vraiment.

[14:32] Dr. Koné :
Excellent ! Avez-vous des questions ?

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Résumé conservé pour votre suivi médical
```

**C'est la solution la plus complète !** 🏆

---

## 🤔 QUELLE OPTION CHOISIR ?

**Demandez-vous** :

1. **Besoin de simplicité ?** → Option 1 (Notes manuelles)
2. **Besoin d'automatisation totale ?** → Option 2 (SDK Daily.co) + Option 3 (Chat M.O.N.A)
3. **Besoin de professionnalisme médical ?** → Option 1 + 3 (Combiné)

---

**Quelle option voulez-vous que j'implémente ?** 🚀

*Je recommande **Option 1** pour démarrer (1-2h), puis ajouter **Option 3** plus tard si besoin (3-4h).*

---

*Document créé le 15 février 2026*  
*Équipe technique M.O.N.A*  
*Contact : tech@monafrica.net*
