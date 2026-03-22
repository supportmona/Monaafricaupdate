/**
 * Service de gestion des rooms Daily.co pour les téléconsultations M.O.N.A
 * 
 * Ce module gère:
 * - Création de rooms vidéo privées
 * - Génération de tokens d'accès sécurisés
 * - Récupération d'informations de rooms
 * - Suppression de rooms
 * - Gestion de la présence
 */

import * as kv from "./kv_store.tsx";

// Configuration Daily.co depuis les variables d'environnement
const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY");
const DAILY_DOMAIN = Deno.env.get("DAILY_DOMAIN") || "migrmona.daily.co";
const DAILY_API_BASE = "https://api.daily.co/v1";

// Types
interface DailyRoom {
  id: string;
  name: string;
  url: string;
  created_at: string;
  config?: any;
}

interface DailyToken {
  token: string;
  room_name: string;
}

/**
 * Créer une room Daily.co pour une consultation
 */
export async function createConsultationRoom(
  consultationId: string,
  config?: {
    duration?: number; // en minutes
    maxParticipants?: number;
    enableRecording?: boolean;
  }
): Promise<{ data?: DailyRoom; error?: string }> {
  try {
    // Vérifier que l'API key est définie
    if (!DAILY_API_KEY) {
      console.error("❌ DAILY_API_KEY non définie dans les variables d'environnement");
      return { error: "DAILY_API_KEY non configurée - Veuillez configurer votre clé API Daily.co dans les secrets Supabase" };
    }

    const roomName = `mona-consult-${consultationId}`;
    const now = Math.floor(Date.now() / 1000);
    const duration = config?.duration || 60; // 60 minutes par défaut
    const expirationTime = now + (duration * 60);

    const roomConfig = {
      name: roomName,
      privacy: "private",
      properties: {
        exp: expirationTime,
        max_participants: config?.maxParticipants || 2,
      },
    };

    console.log("🎬 Tentative de création d'une room Daily.co:", {
      roomName,
      url: `${DAILY_API_BASE}/rooms`,
      domain: DAILY_DOMAIN,
      apiKeyConfigured: !!DAILY_API_KEY,
      apiKeyLength: DAILY_API_KEY?.length || 0,
      apiKeyPreview: DAILY_API_KEY ? `${DAILY_API_KEY.substring(0, 15)}...` : "non définie",
      config: roomConfig,
    });

    const response = await fetch(`${DAILY_API_BASE}/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify(roomConfig),
    });

    console.log("📡 Réponse de l'API Daily.co:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur de création de room Daily.co:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        errorInfo: errorData.info || null,
        requestBody: roomConfig,
        requestHeaders: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DAILY_API_KEY.substring(0, 15)}...`,
        },
      });
      
      // Messages d'erreur plus clairs
      if (response.status === 401) {
        return { error: `Erreur d'authentification Daily.co - Vérifiez que votre clé API est valide. Détails: ${JSON.stringify(errorData)}` };
      } else if (response.status === 403) {
        return { error: `Accès refusé - Vérifiez les permissions de votre clé API Daily.co. Détails: ${JSON.stringify(errorData)}` };
      } else if (response.status === 400) {
        return { error: `Requête invalide - ${errorData.error || errorData.info || JSON.stringify(errorData)}` };
      } else {
        return { error: `${errorData.error || errorData.info || `Erreur création room vidéo (${response.status})`}` };
      }
    }

    const room = await response.json();
    
    console.log("✅ Room Daily.co créée avec succès:", {
      id: room.id,
      name: room.name,
      url: room.url,
    });

    return {
      data: {
        id: room.id,
        name: room.name,
        url: room.url,
        created_at: room.created_at,
        config: room.config,
      },
    };
  } catch (error: any) {
    console.error("❌ Exception lors de la création de la room:", error);
    return { error: `Exception: ${error.message}` };
  }
}

/**
 * Créer un token d'accès pour rejoindre une room
 */
export async function createMeetingToken(
  roomName: string,
  options?: {
    userName?: string;
    userId?: string;
    isOwner?: boolean;
    expirationMinutes?: number;
  }
): Promise<{ data?: DailyToken; error?: string }> {
  try {
    if (!DAILY_API_KEY) {
      console.error("❌ DAILY_API_KEY non définie");
      return { error: "DAILY_API_KEY non configurée" };
    }

    const now = Math.floor(Date.now() / 1000);
    const expirationMinutes = options?.expirationMinutes || 120;
    const expirationTime = now + (expirationMinutes * 60);

    const tokenConfig = {
      properties: {
        room_name: roomName,
        user_name: options?.userName || "Utilisateur",
        user_id: options?.userId,
        is_owner: options?.isOwner || false,
        exp: expirationTime,
        enable_screenshare: true,
      },
    };

    console.log("🔑 Génération d'un token Daily.co:", {
      roomName,
      userName: options?.userName,
      userId: options?.userId,
      isOwner: options?.isOwner,
      tokenConfig,
    });

    const response = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
      body: JSON.stringify(tokenConfig),
    });

    console.log("📡 Réponse génération token:", {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur de génération de token:", {
        status: response.status,
        error: errorData,
        errorInfo: errorData.info || null,
        requestBody: tokenConfig,
      });
      
      if (response.status === 401) {
        return { error: `Erreur d'authentification Daily.co - Vérifiez votre clé API. Détails: ${JSON.stringify(errorData)}` };
      } else if (response.status === 400) {
        return { error: `Requête invalide - ${errorData.error || errorData.info || JSON.stringify(errorData)}` };
      }
      
      return { error: errorData.error || errorData.info || "Erreur génération token d'accès" };
    }

    const tokenData = await response.json();
    
    console.log("✅ Token généré avec succès");

    return {
      data: {
        token: tokenData.token,
        room_name: roomName,
      },
    };
  } catch (error: any) {
    console.error("❌ Exception génération token:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer les informations d'une room
 */
export async function getRoomInfo(
  roomName: string
): Promise<{ data?: DailyRoom; error?: string }> {
  try {
    if (!DAILY_API_KEY) {
      return { error: "DAILY_API_KEY non configurée" };
    }

    const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur récupération room info:", errorData);
      return { error: errorData.error || "Erreur récupération informations room" };
    }

    const room = await response.json();

    return {
      data: {
        id: room.id,
        name: room.name,
        url: room.url,
        created_at: room.created_at,
        config: room.config,
      },
    };
  } catch (error: any) {
    console.error("Exception getRoomInfo:", error);
    return { error: error.message };
  }
}

/**
 * Supprimer une room
 */
export async function deleteRoom(
  roomName: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    if (!DAILY_API_KEY) {
      return { error: "DAILY_API_KEY non configurée" };
    }

    const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur suppression room:", errorData);
      return { error: errorData.error || "Erreur suppression room" };
    }

    console.log(`✅ Room ${roomName} supprimée avec succès`);

    return { success: true };
  } catch (error: any) {
    console.error("Exception deleteRoom:", error);
    return { error: error.message };
  }
}

/**
 * Récupérer la liste des participants présents dans une room
 */
export async function getRoomPresence(
  roomName: string
): Promise<{ data?: any[]; error?: string }> {
  try {
    if (!DAILY_API_KEY) {
      return { error: "DAILY_API_KEY non configurée" };
    }

    const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}/presence`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur récupération présence:", errorData);
      return { error: errorData.error || "Erreur récupération présence" };
    }

    const presenceData = await response.json();

    return {
      data: presenceData.participants || [],
    };
  } catch (error: any) {
    console.error("Exception getRoomPresence:", error);
    return { error: error.message };
  }
}

/**
 * Tester la connexion à l'API Daily.co
 */
export async function testDailyConnection(): Promise<{
  success: boolean;
  configured: boolean;
  error?: string;
}> {
  try {
    if (!DAILY_API_KEY) {
      return {
        success: false,
        configured: false,
        error: "DAILY_API_KEY non configurée dans les variables d'environnement",
      };
    }

    console.log("🧪 Test de connexion à Daily.co...");

    // Tester en récupérant la liste des rooms (limite 1)
    const response = await fetch(`${DAILY_API_BASE}/rooms?limit=1`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${DAILY_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erreur de connexion Daily.co:", errorData);
      
      return {
        success: false,
        configured: true,
        error: `Erreur d'authentification (${response.status}): ${errorData.error || response.statusText}`,
      };
    }

    console.log("✅ Connexion Daily.co réussie");

    return {
      success: true,
      configured: true,
    };
  } catch (error: any) {
    console.error("❌ Exception test connexion:", error);
    return {
      success: false,
      configured: true,
      error: `Exception: ${error.message}`,
    };
  }
}

/**
 * Récupérer l'historique du chat d'une room Daily.co
 * Utilise le KV store pour récupérer les messages capturés côté client
 */
export async function getChatHistory(
  roomName: string
): Promise<{ data?: any[]; error?: string }> {
  try {
    console.log(`📜 Récupération de l'historique du chat pour: ${roomName}`);

    // Récupérer les messages stockés dans le KV store
    // Ces messages sont capturés en temps réel côté client pendant la consultation
    const chatHistoryKey = `daily_chat_history:${roomName}`;
    const chatHistory = await kv.get(chatHistoryKey);

    if (!chatHistory || chatHistory.length === 0) {
      console.log(`ℹ️  Aucun message trouvé pour ${roomName}`);
      return { data: [] };
    }

    console.log(`✅ ${chatHistory.length} messages récupérés du chat`);

    return {
      data: chatHistory,
    };
  } catch (error: any) {
    console.error("❌ Exception récupération historique chat:", error);
    return { error: error.message };
  }
}

/**
 * Créer un résumé du chat de consultation pour la messagerie
 * Génère un message formaté à partir de l'historique du chat
 */
export function formatChatTranscript(
  chatMessages: any[],
  consultationDate: string,
  expertName: string,
  memberName: string
): string {
  if (!chatMessages || chatMessages.length === 0) {
    return `📋 Résumé de la consultation du ${consultationDate}\n\n` +
           `Aucun message n'a été échangé dans le chat pendant cette consultation.\n\n` +
           `💬 Pour toute question supplémentaire, n'hésitez pas à m'envoyer un message ici.`;
  }

  let transcript = `📋 Résumé de la consultation du ${consultationDate}\n\n`;
  transcript += `👥 Participants : ${expertName} et ${memberName}\n`;
  transcript += `💬 Messages échangés pendant la consultation :\n\n`;
  transcript += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  chatMessages.forEach((msg, index) => {
    const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }) : '';
    const sender = msg.senderName || (msg.isExpert ? expertName : memberName);
    transcript += `[${time}] ${sender} :\n`;
    transcript += `${msg.text}\n\n`;
  });

  transcript += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  transcript += `✅ Fin du résumé de consultation\n`;
  transcript += `📅 Conservation automatique pour votre suivi médical`;

  return transcript;
}