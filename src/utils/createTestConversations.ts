/**
 * Script utilitaire pour créer des conversations de test
 * À appeler une fois pour initialiser la messagerie avec des données de démo
 */

import { projectId, publicAnonKey } from "/utils/supabase/info";

const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

export async function createTestConversations() {
  console.log("🚀 Création des conversations de test...");

  const conversations = [
    {
      senderId: "member_001",
      senderName: "Sophie Martin",
      senderRole: "member",
      recipientId: "expert_001",
      recipientName: "Dr. Marie Kouassi",
      recipientRole: "expert",
      messages: [
        {
          content: "Bonjour Dr. Kouassi, j'aimerais prendre rendez-vous pour discuter de mes difficultés à gérer le stress au travail.",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "Bonjour Sophie, je serais ravie de vous accompagner. Pouvez-vous me dire depuis quand vous ressentez ce stress ?",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
        },
        {
          content: "Depuis environ 3 mois, depuis que j'ai changé de poste. Les responsabilités sont plus importantes et je me sens souvent dépassée.",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "Je comprends. Nous allons travailler ensemble sur des techniques de gestion du stress adaptées à votre situation. Je vous propose un premier rendez-vous cette semaine.",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      senderId: "member_002",
      senderName: "Jean-Claude Ndiaye",
      senderRole: "member",
      recipientId: "expert_002",
      recipientName: "Pr. Thomas Diop",
      recipientRole: "expert",
      messages: [
        {
          content: "Bonsoir Professeur, je souhaiterais avoir votre avis sur des troubles du sommeil que je rencontre depuis quelques semaines.",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "Bonsoir Jean-Claude, les troubles du sommeil peuvent avoir plusieurs origines. Pouvez-vous me décrire plus précisément ce que vous vivez ?",
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          content: "J'ai du mal à m'endormir, je me réveille plusieurs fois dans la nuit, et je me sens fatigué toute la journée.",
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
        },
      ],
    },
    {
      senderId: "member_003",
      senderName: "Aminata Traoré",
      senderRole: "member",
      recipientId: "expert_003",
      recipientName: "Dr. Sarah Mensah",
      recipientRole: "expert",
      messages: [
        {
          content: "Bonjour Docteur, merci beaucoup pour notre dernière séance. J'ai commencé à appliquer vos conseils et je sens déjà une amélioration.",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "C'est une excellente nouvelle Aminata ! Je suis ravie que vous constatiez des progrès. Continuez ainsi et n'hésitez pas si vous avez des questions.",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          content: "Je voulais aussi vous demander si nous pouvions aborder la gestion de mes relations familiales lors de notre prochain rendez-vous ?",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "Absolument, c'est une excellente idée. Nous consacrerons notre prochaine séance à ce sujet. À bientôt !",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      senderId: "member_004",
      senderName: "Mohamed Kaboré",
      senderRole: "member",
      recipientId: "expert_004",
      recipientName: "Dr. Fatima Ba",
      recipientRole: "expert",
      messages: [
        {
          content: "Madame, j'ai besoin de votre aide concernant des crises d'anxiété que je subis régulièrement.",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          sender: "expert",
          content: "Bonjour Mohamed, je suis là pour vous aider. Les crises d'anxiété sont difficiles à vivre, mais nous pouvons travailler dessus ensemble. Quand ont-elles commencé ?",
          timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
    {
      senderId: "member_005",
      senderName: "Élise Koné",
      senderRole: "member",
      recipientId: "expert_005",
      recipientName: "Pr. David Owusu",
      recipientRole: "expert",
      messages: [
        {
          content: "Professeur, suite à notre dernier échange, j'ai appliqué la technique de respiration que vous m'aviez enseignée. C'est vraiment efficace !",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    },
  ];

  try {
    for (const conv of conversations) {
      console.log(`📨 Création conversation: ${conv.senderName} ↔ ${conv.recipientName}`);
      
      for (const msg of conv.messages) {
        const sender = msg.sender === "expert" 
          ? { id: conv.recipientId, name: conv.recipientName, role: conv.recipientRole }
          : { id: conv.senderId, name: conv.senderName, role: conv.senderRole };
        
        const recipient = msg.sender === "expert"
          ? { id: conv.senderId, name: conv.senderName, role: conv.senderRole }
          : { id: conv.recipientId, name: conv.recipientName, role: conv.recipientRole };

        const response = await fetch(`${serverUrl}/messaging/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            senderId: sender.id,
            senderName: sender.name,
            senderRole: sender.role,
            recipientId: recipient.id,
            recipientName: recipient.name,
            recipientRole: recipient.role,
            content: msg.content,
          }),
        });

        if (response.ok) {
          console.log(`  ✅ Message créé`);
        } else {
          console.error(`  ❌ Erreur création message:`, await response.text());
        }

        // Petit délai pour éviter de surcharger
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    console.log("✅ Toutes les conversations de test ont été créées !");
    return { success: true, count: conversations.length };
  } catch (error) {
    console.error("❌ Erreur lors de la création des conversations:", error);
    return { success: false, error };
  }
}

// Pour appeler depuis la console du navigateur :
// import { createTestConversations } from '@/utils/createTestConversations';
// createTestConversations();
