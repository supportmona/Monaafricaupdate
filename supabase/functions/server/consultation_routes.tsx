import { Hono } from "npm:hono";
import * as daily from "./daily.tsx";
import * as kv from "./kv_store.tsx";
import * as appointments from "./appointments.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

/**
 * GET /make-server-6378cc81/consultations/check-daily-config
 * Vérifier la configuration Daily.co
 */
app.get("/check-daily-config", async (c) => {
  const apiKey = Deno.env.get("DAILY_API_KEY");
  const domain = Deno.env.get("DAILY_DOMAIN");
  const videoProvider = Deno.env.get("VIDEO_PROVIDER");

  // Tester la connexion réelle à Daily.co
  const connectionTest = await daily.testDailyConnection();

  return c.json({
    configured: {
      DAILY_API_KEY: !!apiKey,
      DAILY_DOMAIN: !!domain,
      VIDEO_PROVIDER: !!videoProvider,
    },
    values: {
      DAILY_API_KEY_LENGTH: apiKey?.length || 0,
      DAILY_API_KEY_PREVIEW: apiKey ? `${apiKey.substring(0, 20)}...` : "undefined",
      DAILY_DOMAIN: domain || "migrmona.daily.co",
      VIDEO_PROVIDER: videoProvider || "daily",
    },
    env_keys: Object.keys(Deno.env.toObject()).filter(key => 
      key.includes("DAILY") || key.includes("VIDEO")
    ),
    connectionTest: {
      success: connectionTest.success,
      configured: connectionTest.configured,
      error: connectionTest.error,
      message: connectionTest.success 
        ? "✅ Connexion à Daily.co réussie" 
        : `❌ ${connectionTest.error}`,
    },
  });
});

/**
 * POST /make-server-6378cc81/consultations/create-test-appointment
 * Créer un rendez-vous de test pour les consultations
 */
app.post("/create-test-appointment", async (c) => {
  try {
    const appointmentId = "1"; // ID de test
    const appointmentKey = `appointment_${appointmentId}`;

    // Créer un rendez-vous de test
    const testAppointment = {
      id: appointmentId,
      expertId: "expert_1",
      memberId: "member_1",
      expertName: "Dr. Sarah Koné",
      memberName: "Amara Koné",
      date: new Date().toISOString().split('T')[0],
      time: "14:00",
      duration: 60,
      status: "scheduled",
      type: "video",
      reason: "Consultation de suivi",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await kv.set(appointmentKey, testAppointment);

    console.log("✅ Rendez-vous de test créé:", testAppointment);

    return c.json({
      success: true,
      appointment: testAppointment,
      message: "Rendez-vous de test créé avec succès"
    });
  } catch (error) {
    console.error("❌ Erreur création rendez-vous test:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /make-server-6378cc81/consultations/create-room
 * Créer une room de consultation
 */
app.post("/create-room", async (c) => {
  try {
    const body = await c.req.json();
    const { appointmentId, duration, maxParticipants, enableRecording } = body;

    if (!appointmentId) {
      return c.json({ error: "appointmentId requis" }, 400);
    }

    // Vérifier que le rendez-vous existe
    const appointmentKey = `appointment_${appointmentId}`;
    const appointment = await kv.get(appointmentKey);

    if (!appointment) {
      return c.json({ error: "Rendez-vous introuvable" }, 404);
    }

    // Créer la room Daily.co
    const { data: room, error } = await daily.createConsultationRoom(
      appointmentId,
      {
        duration: duration || 60,
        maxParticipants: maxParticipants || 2,
        enableRecording: enableRecording || false,
      }
    );

    if (error) {
      return c.json({ error }, 500);
    }

    // Stocker les infos de la room dans l'appointment
    const updatedAppointment = {
      ...appointment,
      videoRoom: {
        roomName: room.name,
        roomUrl: room.url,
        roomId: room.id,
        createdAt: room.created_at,
      },
      updatedAt: new Date().toISOString(),
    };

    await kv.set(appointmentKey, updatedAppointment);

    return c.json({
      success: true,
      room: {
        name: room.name,
        url: room.url,
        id: room.id,
      },
    });
  } catch (error) {
    console.error("Erreur création room consultation:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /make-server-6378cc81/consultations/join-room
 * Obtenir un token pour rejoindre une room
 */
app.post("/join-room", async (c) => {
  try {
    const body = await c.req.json();
    const { appointmentId, userName, userId, isExpert } = body;

    console.log("📞 Demande join room:", { appointmentId, userName, userId, isExpert });

    if (!appointmentId || !userName || !userId) {
      return c.json({ error: "appointmentId, userName et userId requis" }, 400);
    }

    // Récupérer le rendez-vous
    const appointmentKey = `appointment_${appointmentId}`;
    const appointment = await kv.get(appointmentKey);

    if (!appointment) {
      console.log("❌ Rendez-vous introuvable:", appointmentId);
      return c.json({ error: "Rendez-vous introuvable" }, 404);
    }

    console.log("✅ Rendez-vous trouvé:", appointment);

    // Vérifier que l'utilisateur est autorisé
    const isAuthorized =
      userId === appointment.expertId || userId === appointment.memberId;

    if (!isAuthorized) {
      console.log("❌ Non autorisé:", { userId, expertId: appointment.expertId, memberId: appointment.memberId });
      return c.json({ error: "Non autorisé" }, 403);
    }

    // Si la room n'existe pas encore, la créer
    let roomName = appointment.videoRoom?.roomName;

    if (!roomName) {
      console.log("🎬 Création de la room pour:", appointmentId);
      const { data: room, error } = await daily.createConsultationRoom(
        appointmentId,
        { duration: appointment.duration || 60 }
      );

      if (error) {
        console.error("❌ Erreur création room:", error);
        return c.json({ error }, 500);
      }

      console.log("✅ Room créée:", room);
      roomName = room.name;

      // Mettre à jour l'appointment avec les infos de la room
      const updatedAppointment = {
        ...appointment,
        videoRoom: {
          roomName: room.name,
          roomUrl: room.url,
          roomId: room.id,
          createdAt: room.created_at,
        },
        updatedAt: new Date().toISOString(),
      };

      await kv.set(appointmentKey, updatedAppointment);
    } else {
      console.log("✅ Room existante:", roomName);
    }

    // Générer un token d'accès
    console.log("🔑 Génération token pour:", { roomName, userName, userId, isExpert });
    const { data: tokenData, error: tokenError } = await daily.createMeetingToken(
      roomName,
      {
        userName,
        userId,
        isOwner: isExpert || false,
        expirationMinutes: 120,
      }
    );

    if (tokenError) {
      console.error("❌ Erreur génération token:", tokenError);
      return c.json({ error: tokenError }, 500);
    }

    console.log("✅ Token généré avec succès");

    // Récupérer l'URL de la room depuis l'appointment ou la construire
    const roomUrl = appointment.videoRoom?.roomUrl || `https://${Deno.env.get("DAILY_DOMAIN") || "migrmona.daily.co"}/${roomName}`;

    return c.json({
      success: true,
      token: tokenData.token,
      roomUrl: roomUrl,
      roomName: tokenData.room_name,
    });
  } catch (error) {
    console.error("❌ Erreur join room consultation:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /make-server-6378cc81/consultations/room-info/:appointmentId
 * Récupérer les informations d'une room
 */
app.get("/room-info/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");

    // Récupérer le rendez-vous
    const appointmentKey = `appointment_${appointmentId}`;
    const appointment = await kv.get(appointmentKey);

    if (!appointment) {
      return c.json({ error: "Rendez-vous introuvable" }, 404);
    }

    if (!appointment.videoRoom?.roomName) {
      return c.json({ error: "Aucune room vidéo associée" }, 404);
    }

    // Récupérer les infos de la room
    const { data: room, error } = await daily.getRoomInfo(
      appointment.videoRoom.roomName
    );

    if (error) {
      return c.json({ error }, 500);
    }

    return c.json({
      success: true,
      room: {
        name: room.name,
        url: room.url,
        id: room.id,
        createdAt: room.created_at,
      },
    });
  } catch (error) {
    console.error("Erreur récupération room info:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * DELETE /make-server-6378cc81/consultations/end-consultation/:appointmentId
 * Terminer une consultation et nettoyer la room
 * 💾 NOUVEAU: Sauvegarde automatique du chat dans la messagerie
 */
app.delete("/end-consultation/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");

    console.log(`🏁 Fin de consultation ${appointmentId} - Début du processus`);

    // Récupérer les notes du body (si fournies)
    let bodyNotes = null;
    try {
      const body = await c.req.json();
      bodyNotes = body.notes || null;
      console.log(`📝 Notes reçues du body:`, bodyNotes ? `${bodyNotes.length} message(s)` : "aucune");
    } catch {
      // Pas de body, c'est OK
      console.log(`ℹ️  Aucunes notes fournies dans le body`);
    }

    // Récupérer le rendez-vous
    const appointmentKey = `appointment_${appointmentId}`;
    const appointment = await kv.get(appointmentKey);

    if (!appointment) {
      return c.json({ error: "Rendez-vous introuvable" }, 404);
    }

    console.log(`✅ Rendez-vous trouvé:`, {
      expertId: appointment.expertId,
      memberId: appointment.memberId,
      expertName: appointment.expertName,
      memberName: appointment.memberName,
    });

    // 💾 ÉTAPE 1: Utiliser bodyNotes si fourni, sinon récupérer chat Daily.co
    let chatMessages = [];
    
    if (bodyNotes && Array.isArray(bodyNotes)) {
      // Utiliser les notes fournies par l'expert
      chatMessages = bodyNotes;
      console.log(`📝 Utilisation des notes de l'expert (${chatMessages.length} messages)`);
    } else if (appointment.videoRoom?.roomName) {
      // Sinon, récupérer le chat Daily.co
      console.log(`📜 Récupération de l'historique du chat pour: ${appointment.videoRoom.roomName}`);
      
      const { data: chatHistory, error: chatError } = await daily.getChatHistory(
        appointment.videoRoom.roomName
      );

      if (chatError) {
        console.error(`⚠️  Erreur récupération chat: ${chatError}`);
      } else {
        chatMessages = chatHistory || [];
        console.log(`✅ ${chatMessages.length} messages récupérés du chat`);
      }
    }

    // 💾 ÉTAPE 2: Créer ou récupérer la conversation entre membre et expert
    console.log(`💬 Création/récupération de la conversation membre-expert`);
    
    const expertId = appointment.expertId;
    const memberId = appointment.memberId;

    // Chercher si une conversation existe déjà
    const { data: existingConvs } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "conversation:%");

    let conversation = existingConvs?.find(
      (c) => c.value.expertId === expertId && c.value.memberId === memberId
    )?.value;

    let conversationId: string;

    if (conversation) {
      conversationId = conversation.id;
      console.log(`✅ Conversation existante trouvée: ${conversationId}`);
    } else {
      // Créer une nouvelle conversation
      conversationId = crypto.randomUUID();
      conversation = {
        id: conversationId,
        expertId,
        memberId,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        lastMessage: "",
      };

      await supabase.from("kv_store_6378cc81").insert({
        key: `conversation:${conversationId}`,
        value: conversation,
      });

      // Initialiser tableau de messages vide
      await supabase.from("kv_store_6378cc81").insert({
        key: `conversation_messages:${conversationId}`,
        value: [],
      });

      console.log(`✅ Nouvelle conversation créée: ${conversationId}`);
    }

    // 💾 ÉTAPE 3: Créer le message récapitulatif du chat
    const consultationDate = new Date(appointment.date || new Date()).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const chatTranscript = daily.formatChatTranscript(
      chatMessages,
      consultationDate,
      appointment.expertName || "Expert",
      appointment.memberName || "Membre"
    );

    // Créer le message récapitulatif
    const summaryMessage = {
      id: crypto.randomUUID(),
      conversationId,
      senderId: expertId, // Envoyé par l'expert
      senderType: "expert",
      text: chatTranscript,
      createdAt: new Date().toISOString(),
      read: false,
      isConsultationSummary: true, // Flag spécial pour identifier les résumés
    };

    console.log(`📝 Création du message récapitulatif dans la conversation ${conversationId}`);

    // Récupérer les messages existants
    const { data: messagesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `conversation_messages:${conversationId}`)
      .single();

    const messages = messagesData?.value || [];
    messages.push(summaryMessage);

    // Sauvegarder les messages mis à jour
    await supabase.from("kv_store_6378cc81").upsert({
      key: `conversation_messages:${conversationId}`,
      value: messages,
    });

    // Mettre à jour la conversation
    conversation.lastMessage = "📋 Résumé de consultation sauvegardé";
    conversation.lastMessageAt = new Date().toISOString();

    await supabase.from("kv_store_6378cc81").upsert({
      key: `conversation:${conversationId}`,
      value: conversation,
    });

    console.log(`✅ Message récapitulatif sauvegardé avec succès`);

    // 🏁 ÉTAPE 4: Mettre à jour le statut de la consultation
    const updatedAppointment = {
      ...appointment,
      status: "completed",
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatSavedToMessaging: true, // Flag pour indiquer que le chat a été sauvegardé
      messagingConversationId: conversationId, // Référence à la conversation
    };

    await kv.set(appointmentKey, updatedAppointment);

    console.log(`✅ Consultation marquée comme terminée`);

    // 🧹 ÉTAPE 5: Nettoyer la room Daily.co
    if (appointment.videoRoom?.roomName) {
      console.log(`🧹 Suppression de la room Daily.co: ${appointment.videoRoom.roomName}`);
      await daily.deleteRoom(appointment.videoRoom.roomName);
    }

    console.log(`🎉 Processus de fin de consultation terminé avec succès`);

    return c.json({
      success: true,
      message: "Consultation terminée",
      chatSaved: true,
      conversationId,
      messageCount: chatMessages.length,
    });
  } catch (error) {
    console.error("❌ Erreur fin consultation:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /make-server-6378cc81/consultations/presence/:appointmentId
 * Vérifier qui est présent dans la room
 */
app.get("/presence/:appointmentId", async (c) => {
  try {
    const appointmentId = c.req.param("appointmentId");

    // Récupérer le rendez-vous
    const appointmentKey = `appointment_${appointmentId}`;
    const appointment = await kv.get(appointmentKey);

    if (!appointment) {
      return c.json({ error: "Rendez-vous introuvable" }, 404);
    }

    if (!appointment.videoRoom?.roomName) {
      return c.json({ error: "Aucune room vidéo associée" }, 404);
    }

    const { data: presence, error } = await daily.getRoomPresence(
      appointment.videoRoom.roomName
    );

    if (error) {
      return c.json({ error }, 500);
    }

    return c.json({
      success: true,
      participants: presence || [],
    });
  } catch (error) {
    console.error("Erreur récupération présence:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * POST /make-server-6378cc81/consultations/store-chat-message
 * Stocker un message du chat Daily.co en temps réel
 * 💬 Capture côté client (alternative aux webhooks)
 */
app.post("/store-chat-message", async (c) => {
  try {
    const body = await c.req.json();
    const { appointmentId, roomName, message } = body;

    if (!appointmentId || !roomName || !message) {
      return c.json({ 
        error: "appointmentId, roomName et message requis" 
      }, 400);
    }

    console.log(`💬 Stockage message chat pour appointment ${appointmentId}:`, {
      sender: message.senderName,
      text: message.text?.substring(0, 50),
    });

    // Récupérer l'historique existant ou créer un nouveau
    const chatHistoryKey = `daily_chat_history:${roomName}`;
    const existingHistory = await kv.get(chatHistoryKey) || [];

    // Ajouter le nouveau message
    const chatMessage = {
      id: crypto.randomUUID(),
      text: message.text,
      senderId: message.senderId,
      senderName: message.senderName,
      senderType: message.senderType, // "expert" ou "member"
      timestamp: message.timestamp || new Date().toISOString(),
      appointmentId,
    };

    existingHistory.push(chatMessage);

    // Sauvegarder dans le KV store
    await kv.set(chatHistoryKey, existingHistory);

    console.log(`✅ Message stocké. Total messages: ${existingHistory.length}`);

    return c.json({
      success: true,
      message: "Message stocké",
      totalMessages: existingHistory.length,
    });
  } catch (error) {
    console.error("❌ Erreur stockage message chat:", error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * GET /make-server-6378cc81/consultations/:consultationId/room
 * Obtenir la salle Daily.co pour une consultation (pour membres et experts)
 */
app.get("/:consultationId/room", async (c) => {
  try {
    const consultationId = c.req.param("consultationId");
    const userToken = c.req.header("X-User-Token");

    if (!userToken) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    // Get consultation details
    const consultationKey = `consultation:${consultationId}`;
    const consultation = await kv.get(consultationKey);

    if (!consultation) {
      return c.json({ success: false, error: "Consultation non trouvée" }, 404);
    }

    // Create or get Daily.co room
    let roomData = await kv.get(`daily_room:${consultationId}`);
    
    if (!roomData) {
      // Create new room
      const createRoomResult = await daily.createRoom({
        properties: {
          exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
          enable_screenshare: true,
          enable_chat: true,
          max_participants: 2,
        },
      });

      if (!createRoomResult.success) {
        return c.json({ success: false, error: "Erreur création salle" }, 500);
      }

      roomData = {
        url: createRoomResult.data.url,
        name: createRoomResult.data.name,
        created: new Date().toISOString(),
      };

      await kv.set(`daily_room:${consultationId}`, roomData);
    }

    // Create meeting token
    const tokenResult = await daily.createMeetingToken({
      roomName: roomData.name,
      properties: {
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    });

    if (!tokenResult.success) {
      return c.json({ success: false, error: "Erreur création token" }, 500);
    }

    return c.json({
      success: true,
      data: {
        url: roomData.url,
        token: tokenResult.data.token,
        consultationId,
      },
    });
  } catch (error) {
    console.error("Erreur obtention salle consultation:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;