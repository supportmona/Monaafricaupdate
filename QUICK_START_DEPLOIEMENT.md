# ⚡ Quick Start - Déploiement en 5 minutes

## 🎯 Ce qu'il faut faire

Les modifications que j'ai faites sont dans le **backend Supabase**, pas dans Vercel.

Vous devez déployer **UN SEUL FICHIER** :
- `/supabase/functions/server/messaging.tsx`

---

## 🚀 MÉTHODE RAPIDE (Recommandée)

### **1. Installer Supabase CLI**

```bash
npm install -g supabase
```

### **2. Se connecter**

```bash
supabase login
```
*(Un navigateur va s'ouvrir)*

### **3. Aller dans votre projet**

```bash
cd /chemin/vers/votre/projet/mona
```

### **4. Lier le projet**

```bash
supabase link --project-ref VOTRE_PROJECT_ID
```

**Trouver votre PROJECT_ID :**
- Allez sur https://supabase.com/dashboard
- Cliquez sur votre projet M.O.N.A
- Dans l'URL : `https://supabase.com/dashboard/project/XXXXX`
- `XXXXX` = votre PROJECT_ID

### **5. Copier le nouveau fichier**

**Option A : Si vous avez le code source localement**

1. Ouvrez `/supabase/functions/server/messaging.tsx`
2. Remplacez TOUT le contenu par le code que j'ai généré (voir ci-dessous)
3. Sauvegardez

**Option B : Si vous n'avez pas le code source**

Vous devez d'abord récupérer votre code depuis :
- GitHub (si votre projet y est)
- Figma Make (export)
- Vercel (clone du repo)

### **6. Déployer**

```bash
supabase functions deploy server
```

### **7. Vérifier**

```bash
# Voir les logs en temps réel
supabase functions logs server --tail
```

### **8. Tester**

Allez sur votre site et testez l'envoi d'un email de contact !

---

## 📝 **CODE À COPIER DANS messaging.tsx**

<details>
<summary>👉 Cliquez pour voir le code complet (503 lignes)</summary>

```typescript
import * as kv from './kv_store.tsx';
import { Resend } from "npm:resend@6.9.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

/**
 * Types pour la messagerie interne
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'member' | 'expert' | 'admin';
  recipientId: string;
  recipientName: string;
  recipientRole: 'member' | 'expert' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
  urgent?: boolean; // Pour les membres premium
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'member' | 'expert' | 'admin';
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: { [userId: string]: number };
}

/**
 * Envoie un message dans une conversation
 */
export async function sendMessage(
  senderId: string,
  senderName: string,
  senderRole: 'member' | 'expert' | 'admin',
  recipientId: string,
  recipientName: string,
  recipientRole: 'member' | 'expert' | 'admin',
  content: string,
  urgent?: boolean
): Promise<{ success: boolean; message?: Message; error?: string }> {
  try {
    // Créer l'ID de conversation (toujours dans le même ordre pour cohérence)
    const conversationId = [senderId, recipientId].sort().join('_');
    
    // Créer le message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const message: Message = {
      id: messageId,
      conversationId,
      senderId,
      senderName,
      senderRole,
      recipientId,
      recipientName,
      recipientRole,
      content,
      timestamp,
      read: false,
      urgent,
    };

    // Sauvegarder le message
    await kv.set(`message:${messageId}`, message);
    
    // Ajouter à la liste des messages de la conversation
    const conversationMessagesKey = `conversation:${conversationId}:messages`;
    const existingMessages = await kv.get(conversationMessagesKey) || [];
    existingMessages.push(messageId);
    await kv.set(conversationMessagesKey, existingMessages);
    
    // Mettre à jour la conversation
    const conversationKey = `conversation:${conversationId}`;
    let conversation = await kv.get(conversationKey) as Conversation | null;
    
    if (!conversation) {
      // Créer nouvelle conversation
      conversation = {
        id: conversationId,
        participants: [
          { id: senderId, name: senderName, role: senderRole },
          { id: recipientId, name: recipientName, role: recipientRole },
        ],
        lastMessage: content.substring(0, 100),
        lastMessageTime: timestamp,
        unreadCount: { [senderId]: 0, [recipientId]: 1 },
      };
    } else {
      // Mettre à jour conversation existante
      conversation.lastMessage = content.substring(0, 100);
      conversation.lastMessageTime = timestamp;
      conversation.unreadCount[recipientId] = (conversation.unreadCount[recipientId] || 0) + 1;
    }
    
    await kv.set(conversationKey, conversation);
    
    // Ajouter la conversation aux listes de conversations des participants
    await addConversationToUser(senderId, conversationId);
    await addConversationToUser(recipientId, conversationId);
    
    // Planifier une notification email pour les membres Premium
    if (urgent) {
      await scheduleMessageNotification(messageId, recipientId, senderId);
    }
    
    return { success: true, message };
  } catch (error) {
    console.error('Erreur sendMessage:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Récupère les conversations d'un utilisateur
 */
export async function getUserConversations(
  userId: string
): Promise<Conversation[]> {
  try {
    const userConversationsKey = `user:${userId}:conversations`;
    const conversationIds = await kv.get(userConversationsKey) || [];
    
    const conversations: Conversation[] = [];
    for (const convId of conversationIds) {
      const conv = await kv.get(`conversation:${convId}`) as Conversation | null;
      if (conv) {
        conversations.push(conv);
      }
    }
    
    // Trier par dernière activité
    conversations.sort((a, b) => 
      new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    );
    
    return conversations;
  } catch (error) {
    console.error('Erreur getUserConversations:', error);
    return [];
  }
}

/**
 * Récupère les messages d'une conversation
 */
export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  try {
    const conversationMessagesKey = `conversation:${conversationId}:messages`;
    const messageIds = await kv.get(conversationMessagesKey) || [];
    
    const messages: Message[] = [];
    for (const msgId of messageIds) {
      const msg = await kv.get(`message:${msgId}`) as Message | null;
      if (msg) {
        messages.push(msg);
      }
    }
    
    // Trier par timestamp
    messages.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    return messages;
  } catch (error) {
    console.error('Erreur getConversationMessages:', error);
    return [];
  }
}

/**
 * Marque les messages d'une conversation comme lus
 */
export async function markConversationAsRead(
  conversationId: string,
  userId: string
): Promise<{ success: boolean }> {
  try {
    // Mettre à jour le compteur non-lus dans la conversation
    const conversationKey = `conversation:${conversationId}`;
    const conversation = await kv.get(conversationKey) as Conversation | null;
    
    if (conversation) {
      conversation.unreadCount[userId] = 0;
      await kv.set(conversationKey, conversation);
    }
    
    // Marquer tous les messages comme lus
    const messages = await getConversationMessages(conversationId);
    for (const message of messages) {
      if (message.recipientId === userId && !message.read) {
        message.read = true;
        await kv.set(`message:${message.id}`, message);
      }
    }
    
    // Annuler les notifications planifiées pour ce message
    for (const message of messages) {
      await cancelPendingNotification(message.id);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Erreur markConversationAsRead:', error);
    return { success: false };
  }
}

/**
 * Ajoute une conversation à la liste d'un utilisateur
 */
async function addConversationToUser(userId: string, conversationId: string) {
  const userConversationsKey = `user:${userId}:conversations`;
  const conversations = await kv.get(userConversationsKey) || [];
  
  if (!conversations.includes(conversationId)) {
    conversations.push(conversationId);
    await kv.set(userConversationsKey, conversations);
  }
}

/**
 * Récupère le nombre total de messages non lus pour un utilisateur
 */
export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const conversations = await getUserConversations(userId);
    let total = 0;
    
    for (const conv of conversations) {
      total += conv.unreadCount[userId] || 0;
    }
    
    return total;
  } catch (error) {
    console.error('Erreur getUnreadCount:', error);
    return 0;
  }
}

/**
 * Vérifie si un utilisateur est Premium et a activé les notifications email
 */
export async function getUserNotificationSettings(userId: string): Promise<{
  isPremium: boolean;
  emailNotifications: boolean;
  notificationDelay: number; // en millisecondes
  email?: string;
}> {
  try {
    // Récupérer les préférences utilisateur
    const userPrefs = await kv.get(`user:${userId}:preferences`) || {};
    const userProfile = await kv.get(`user:${userId}:profile`) || {};
    
    return {
      isPremium: userProfile.isPremium || false,
      emailNotifications: userPrefs.emailNotifications !== false, // Activé par défaut pour Premium
      notificationDelay: userPrefs.notificationDelay || 15 * 60 * 1000, // 15 min par défaut
      email: userProfile.email,
    };
  } catch (error) {
    console.error('Erreur getUserNotificationSettings:', error);
    return {
      isPremium: false,
      emailNotifications: false,
      notificationDelay: 15 * 60 * 1000,
    };
  }
}

/**
 * Planifie une notification email pour un message non lu (Premium)
 */
export async function scheduleMessageNotification(
  messageId: string,
  recipientId: string,
  senderId: string
): Promise<void> {
  try {
    // Vérifier si le destinataire est Premium et a activé les notifications
    const settings = await getUserNotificationSettings(recipientId);
    
    if (!settings.isPremium || !settings.emailNotifications || !settings.email) {
      console.log(`⏭️ Notification email ignorée pour ${recipientId} (non-Premium ou désactivé)`);
      return;
    }

    // Créer un délai pour vérifier si le message est toujours non lu
    const notificationKey = `notification:pending:${messageId}`;
    await kv.set(notificationKey, {
      messageId,
      recipientId,
      scheduledAt: Date.now(),
      willSendAt: Date.now() + settings.notificationDelay,
    });

    // Note: Dans un environnement de production, utilisez un système de queue/worker
    // Pour l'instant, on utilise setTimeout (qui ne persiste pas après redémarrage)
    setTimeout(async () => {
      await sendDelayedNotification(messageId, recipientId, senderId, settings.email!);
    }, settings.notificationDelay);

    console.log(`📧 Notification email planifiée pour ${recipientId} dans ${settings.notificationDelay / 1000 / 60} min`);
  } catch (error) {
    console.error('Erreur scheduleMessageNotification:', error);
  }
}

/**
 * Envoie une notification email différée si le message est toujours non lu
 */
async function sendDelayedNotification(
  messageId: string,
  recipientId: string,
  senderId: string,
  recipientEmail: string
): Promise<void> {
  try {
    // Vérifier si le message existe et est toujours non lu
    const message = await kv.get(`message:${messageId}`) as Message | null;
    
    if (!message) {
      console.log(`⚠️ Message ${messageId} introuvable, notification annulée`);
      return;
    }

    if (message.read) {
      console.log(`✅ Message ${messageId} déjà lu, notification annulée`);
      return;
    }

    // Récupérer les infos de l'expéditeur
    const senderProfile = await kv.get(`user:${senderId}:profile`) || {};
    const senderName = senderProfile.name || message.senderName || 'Un membre M.O.N.A';

    // Envoyer l'email de notification
    await resend.emails.send({
      from: 'M.O.N.A <noreply@monafrica.net>',
      to: recipientEmail,
      subject: message.urgent 
        ? '🔴 Message urgent sur M.O.N.A' 
        : '💬 Nouveau message sur M.O.N.A',
      html: renderMessageNotificationEmail(senderName, message, recipientId),
    });

    // Supprimer la notification planifiée
    await kv.del(`notification:pending:${messageId}`);

    console.log(`✅ Notification email envoyée à ${recipientEmail} pour le message ${messageId}`);
  } catch (error) {
    console.error('Erreur sendDelayedNotification:', error);
  }
}

/**
 * Template HTML pour les notifications de message
 */
function renderMessageNotificationEmail(
  senderName: string,
  message: Message,
  recipientId: string
): string {
  const isUrgent = message.urgent;
  const urgentStyles = isUrgent ? 'background: #EF4444; color: white;' : '';
  
  return \`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #F9F7F4;
          }
          .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 12px rgba(199, 122, 90, 0.08);
          }
          .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #D4C4B0;
          }
          .logo {
            font-size: 32px;
            font-weight: 600;
            color: #C77A5A;
            margin-bottom: 8px;
          }
          .tagline {
            font-size: 14px;
            color: #B8A079;
            font-style: italic;
          }
          .urgent-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 8px;
            \${urgentStyles}
            font-weight: 600;
            margin-bottom: 16px;
          }
          .message-preview {
            background: linear-gradient(120deg, #F3E8DC 0%, transparent 100%);
            padding: 20px;
            border-left: 4px solid #C77A5A;
            margin: 24px 0;
            border-radius: 4px;
            font-style: italic;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #C77A5A 0%, #B8A079 100%);
            color: white !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            margin: 24px 0;
            font-weight: 600;
          }
          .footer {
            margin-top: 40px;
            padding-top: 24px;
            border-top: 1px solid #D4C4B0;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">M.O.N.A</div>
            <div class="tagline">Mieux-être • Optimisation • Neuro-Apaisement</div>
          </div>
          
          \${isUrgent ? '<div class="urgent-badge">🔴 MESSAGE URGENT</div>' : ''}
          
          <h2 style="color: #C77A5A;">Vous avez un nouveau message</h2>
          
          <p><strong>\${senderName}</strong> vous a envoyé un message sur M.O.N.A :</p>
          
          <div class="message-preview">
            \${message.content.length > 150 
              ? message.content.substring(0, 150) + '...' 
              : message.content}
          </div>
          
          <p style="text-align: center;">
            <a href="https://www.monafrica.net/messages?conversation=\${message.conversationId}" class="cta-button">
              Lire et répondre
            </a>
          </p>
          
          <div class="footer">
            <p>💎 Fonctionnalité réservée aux membres Premium M.O.N.A</p>
            <p>Pour désactiver ces notifications, rendez-vous dans vos paramètres.</p>
            <p style="margin-top: 12px;">M.O.N.A - Plateforme de santé mentale premium<br>
            Kinshasa • Dakar • Abidjan</p>
          </div>
        </div>
      </body>
    </html>
  \`;
}

/**
 * Annule une notification planifiée si le message est lu avant le délai
 */
export async function cancelPendingNotification(messageId: string): Promise<void> {
  try {
    const notificationKey = `notification:pending:${messageId}`;
    const pending = await kv.get(notificationKey);
    
    if (pending) {
      await kv.del(notificationKey);
      console.log(`🚫 Notification annulée pour le message ${messageId} (message lu)`);
    }
  } catch (error) {
    console.error('Erreur cancelPendingNotification:', error);
  }
}
```

</details>

---

## ⚡ **Alternative si vous n'avez pas le CLI**

### **Via GitHub (si votre projet est sur GitHub)**

1. Allez sur votre repo GitHub
2. Naviguez jusqu'à `/supabase/functions/server/messaging.tsx`
3. Cliquez "Edit" (icône crayon)
4. Remplacez tout le contenu par le code ci-dessus
5. Commit avec message : "feat: Notifications email Premium"
6. Push

Si Supabase est connecté à GitHub, il déploiera automatiquement.

---

## 🎯 **C'est tout !**

Une fois déployé, les fonctionnalités suivantes seront actives :

✅ Messagerie interne pour TOUS les membres  
✅ **Notifications email pour membres Premium** (nouveau !)  
✅ Délai configurable de 15 minutes  
✅ Annulation si message lu avant le délai  
✅ Support des messages urgents  

---

## 🧪 **Test rapide**

```bash
# Tester l'envoi d'email
curl -X POST https://VOTRE_PROJECT_ID.supabase.co/functions/v1/make-server-6378cc81/contact/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_ANON_KEY" \
  -d '{"name":"Test","email":"test@test.com","subject":"Test","message":"Test"}'
```

**Résultat attendu :** `{"success": true, "message": "Message envoyé avec succès"}`

---

## 📚 **Documentation complète**

Pour plus de détails, consultez :
- `/DEPLOIEMENT_VERCEL_SUPABASE.md` - Guide complet
- `/RESEND_SETUP_COMPLETE.md` - Documentation technique
- `/NEXT_STEPS.md` - Tests et prochaines étapes

---

**Des questions ? Besoin d'aide ? Dites-moi où vous êtes bloqué ! 🚀**
