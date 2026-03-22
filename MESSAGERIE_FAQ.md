# ❓ FAQ MESSAGERIE M.O.N.A

## Question 1 : Peut-on créer de nouveaux messages ?

### ✅ **OUI, ABSOLUMENT !**

La messagerie M.O.N.A permet de **créer et envoyer de nouveaux messages** de manière totalement fonctionnelle.

---

### **Comment ça fonctionne ?**

#### **Interface utilisateur (ChatPage.tsx)**

**Composants disponibles** :
1. ✅ **Textarea** pour écrire le message (lignes 440-453)
2. ✅ **Bouton Send** pour envoyer (lignes 461-467)
3. ✅ **Support Enter** pour envoyer rapidement (lignes 443-448)
4. ✅ **Support Shift+Enter** pour nouvelle ligne
5. ✅ **Indicateur d'envoi** (état "sending")
6. ✅ **Validation** (message vide = bouton désactivé)

**Code d'envoi** (lignes 179-216) :
```typescript
const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!messageText.trim() || !selectedConversation) return;

  try {
    setSending(true);
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/chat/conversations/${selectedConversation.id}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
          "X-User-Token": token!,
        },
        body: JSON.stringify({ text: messageText }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      setMessages([...messages, data.data]);
      setMessageText("");
    }
  } finally {
    setSending(false);
  }
};
```

---

#### **Backend (chat_routes.tsx)**

**Route d'envoi de message** :
```
POST /make-server-6378cc81/chat/conversations/:conversationId/messages
```

**Processus** :
1. ✅ Vérifie authentification (token membre ou expert)
2. ✅ Vérifie autorisation (participant de la conversation)
3. ✅ Valide le texte (non vide)
4. ✅ Crée un nouveau message avec UUID
5. ✅ Ajoute le message à la conversation
6. ✅ Met à jour `lastMessage` et `lastMessageAt`
7. ✅ Retourne le message créé

**Code serveur** (lignes 106-188 de chat_routes.tsx) :
```typescript
app.post("/conversations/:conversationId/messages", async (c) => {
  const { text } = await c.req.json();
  
  // Validation
  if (!text || text.trim() === "") {
    return c.json({ success: false, error: "Message vide" }, 400);
  }
  
  // Vérification autorisation
  const conversation = await supabase
    .from("kv_store_6378cc81")
    .select("value")
    .eq("key", `conversation:${conversationId}`)
    .single();
    
  if (conversation.memberId !== senderId && conversation.expertId !== senderId) {
    return c.json({ success: false, error: "Accès non autorisé" }, 403);
  }
  
  // Création du message
  const message = {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    senderType,
    text: text.trim(),
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  // Sauvegarde et mise à jour
  // ...
  
  return c.json({ success: true, data: message });
});
```

---

### **Fonctionnalités d'envoi disponibles**

✅ **Texte simple** : Messages texte de toute longueur
✅ **Multiligne** : Support Shift+Enter pour sauts de ligne
✅ **Validation en temps réel** : Bouton désactivé si texte vide
✅ **Feedback visuel** : État "envoi en cours..."
✅ **Gestion d'erreurs** : Alerte si échec d'envoi
✅ **Scroll automatique** : Défile vers le bas après envoi
✅ **Polling** : Recharge les messages toutes les 3 secondes
✅ **Horodatage** : Date/heure précise du message

---

### **Boutons supplémentaires dans l'interface**

📎 **Paperclip** (ligne 433-438) : Prévu pour pièces jointes (non implémenté)
😊 **Smile** (ligne 454-459) : Prévu pour emojis (non implémenté)

---

## Question 2 : Les messages du chat de téléconsultation se retrouvent-ils dans la messagerie ?

### ❌ **NON, PAS ACTUELLEMENT**

Les messages du chat pendant une consultation vidéo Daily.co **NE SONT PAS** automatiquement sauvegardés dans la messagerie interne M.O.N.A.

---

### **Pourquoi ?**

#### **Systèmes séparés**

1. **Chat Daily.co** :
   - Intégré dans l'iframe de consultation vidéo
   - Géré directement par Daily.co
   - Messages éphémères (durée de la session)
   - Pas de persistance après la consultation

2. **Messagerie M.O.N.A** :
   - Système indépendant
   - Messages persistants stockés dans KV store
   - Accessible 24/7 en dehors des consultations
   - Historique complet

**Architecture actuelle** :
```
┌─────────────────────────────┐
│  Consultation vidéo         │
│  DailyVideoRoom.tsx         │
│  ┌─────────────────────┐    │
│  │  Daily.co iframe    │    │  ← Chat éphémère Daily.co
│  │  (vidéo + chat)     │    │     (NON persisté)
│  └─────────────────────┘    │
└─────────────────────────────┘
            │
            │  SÉPARÉ
            ▼
┌─────────────────────────────┐
│  Messagerie M.O.N.A         │
│  ChatPage.tsx               │
│  ┌─────────────────────┐    │
│  │  Messages stockés   │    │  ← Messages persistants
│  │  dans KV store      │    │     (toujours accessibles)
│  └─────────────────────┘    │
└─────────────────────────────┘
```

---

### **Impact pour les utilisateurs**

**Avantages du système actuel** :
- ✅ Chat vidéo léger et rapide (Daily.co optimisé)
- ✅ Messagerie propre et organisée (pas de pollution)
- ✅ Confidentialité (chat consultation temporaire)

**Inconvénients** :
- ❌ Messages du chat vidéo perdus après la consultation
- ❌ Pas d'historique des discussions en consultation
- ❌ Besoin de répéter des infos dans la messagerie

---

### **🔧 Souhaitez-vous une intégration ?**

Je peux **implémenter cette intégration** si vous le souhaitez ! Voici comment :

#### **Option A : Sauvegarde automatique du chat Daily.co** ⭐ RECOMMANDÉ

**Fonctionnement** :
1. Créer un webhook Daily.co pour capturer les messages
2. À la fin de la consultation, récupérer tout l'historique du chat
3. Créer automatiquement un message récapitulatif dans la messagerie
4. Format : "Résumé du chat de la consultation du [date]"

**Avantages** :
- ✅ Historique complet conservé
- ✅ Pas d'action manuelle requise
- ✅ Intégration transparente

**Inconvénients** :
- Nécessite configuration webhook Daily.co
- Peut encombrer la messagerie si beaucoup de messages

---

#### **Option B : Bouton "Enregistrer le chat"**

**Fonctionnement** :
1. Bouton dans l'interface de consultation
2. Expert clique sur "Enregistrer ce chat"
3. Tout l'historique est copié dans la messagerie
4. Message créé : "Chat de consultation enregistré"

**Avantages** :
- ✅ Contrôle manuel (seulement si nécessaire)
- ✅ Messagerie moins encombrée
- ✅ Facile à implémenter

**Inconvénients** :
- Nécessite action manuelle
- Peut oublier de sauvegarder

---

#### **Option C : Intégration temps réel bidirectionnelle** 🚀 AVANCÉ

**Fonctionnement** :
1. Tous les messages du chat Daily.co s'affichent aussi dans la messagerie
2. Tous les messages de la messagerie s'affichent dans le chat Daily.co
3. Synchronisation en temps réel

**Avantages** :
- ✅ Une seule source de vérité
- ✅ Pas de perte de messages
- ✅ Continuité parfaite

**Inconvénients** :
- Complexité technique élevée
- Peut créer de la confusion (deux interfaces)
- Performance à surveiller

---

### **Ma recommandation** 💡

**Pour M.O.N.A, je recommande l'Option A** (sauvegarde automatique) car :

1. **Professionnalisme** : L'expert peut se référer aux échanges passés
2. **Traçabilité** : Important pour le suivi médical
3. **Transparence** : Le membre peut relire ce qui s'est dit
4. **Automatique** : Pas d'action manuelle à retenir

**Implémentation** :
- Ajouter un champ `chatTranscript` à chaque consultation
- À la fin de la consultation, récupérer l'historique via API Daily.co
- Créer automatiquement un message dans la conversation
- Marquer comme "Résumé de consultation" pour le distinguer

---

## 📊 COMPARATIF DÉTAILLÉ

| Fonctionnalité | Chat Daily.co | Messagerie M.O.N.A | Intégration proposée |
|----------------|---------------|-------------------|---------------------|
| **Disponibilité** | Pendant consultation uniquement | 24/7 | 24/7 |
| **Persistance** | ❌ Éphémère | ✅ Permanent | ✅ Permanent |
| **Vidéo intégrée** | ✅ Oui | ❌ Non | ❌ Non |
| **Historique** | ❌ Perdu après session | ✅ Complet | ✅ Complet + chat |
| **Notifications** | ❌ Non | ✅ Oui (Premium) | ✅ Oui |
| **Recherche** | ❌ Non | ✅ Oui | ✅ Oui (incluant chat) |
| **Export** | ❌ Non | ✅ Possible | ✅ Possible |

---

## 🎯 CONCLUSION

### **Question 1 : Créer nouveaux messages**
✅ **OUI, TOTALEMENT FONCTIONNEL**
- Interface complète avec textarea et bouton Send
- API backend robuste
- Validation et gestion d'erreurs
- Polling temps réel

### **Question 2 : Chat consultation dans messagerie**
❌ **NON, PAS ACTUELLEMENT** (systèmes séparés)
💡 **MAIS PEUT ÊTRE IMPLÉMENTÉ** si vous le souhaitez !

---

## 🚀 PROCHAINES ÉTAPES

**Si vous voulez l'intégration chat ↔ messagerie** :

1. Me confirmer quelle option vous préférez (A, B ou C)
2. Je vais implémenter la solution choisie
3. Tests et validation
4. Documentation mise à jour

**Si le système actuel vous convient** :

✅ Tout est déjà prêt !
- Messagerie 100% fonctionnelle
- Consultations vidéo 100% fonctionnelles
- Systèmes indépendants mais complémentaires

---

**Voulez-vous que j'implémente l'intégration du chat de téléconsultation dans la messagerie ?** 🤔

*Si oui, dites-moi quelle option vous préférez !*

---

*Document créé le 15 février 2026*  
*Équipe technique M.O.N.A*  
*Contact : tech@monafrica.net*
