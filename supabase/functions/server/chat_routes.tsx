import { Hono } from "npm:hono";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Get conversations list
app.get("/conversations", async (c) => {
  try {
    const memberToken = c.req.header("X-User-Token");
    const expertToken = c.req.header("X-Expert-Token");
    const token = memberToken || expertToken;
    const userType = memberToken ? "member" : "expert";

    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    // Get all conversations for this user
    const { data: conversations } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "conversation:%");

    const userConversations = conversations
      ?.filter((c) => {
        const conv = c.value;
        if (userType === "member") {
          return conv.memberId === userId;
        } else {
          return conv.expertId === userId;
        }
      })
      .map((c) => c.value)
      .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()) || [];

    return c.json({ success: true, data: userConversations });
  } catch (error) {
    console.error("Erreur récupération conversations:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get messages for a conversation
app.get("/conversations/:conversationId/messages", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const memberToken = c.req.header("X-User-Token");
    const expertToken = c.req.header("X-Expert-Token");
    const token = memberToken || expertToken;

    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    // Verify user has access to this conversation
    const { data: convData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `conversation:${conversationId}`)
      .single();

    if (!convData?.value) {
      return c.json({ success: false, error: "Conversation non trouvée" }, 404);
    }

    const conversation = convData.value;
    if (conversation.memberId !== userId && conversation.expertId !== userId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Get messages
    const messagesKey = `conversation_messages:${conversationId}`;
    const { data: messagesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", messagesKey)
      .single();

    const messages = messagesData?.value || [];

    return c.json({ success: true, data: messages });
  } catch (error) {
    console.error("Erreur récupération messages:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Send a message
app.post("/conversations/:conversationId/messages", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const memberToken = c.req.header("X-User-Token");
    const expertToken = c.req.header("X-Expert-Token");
    const token = memberToken || expertToken;
    const senderType = memberToken ? "member" : "expert";

    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const senderId = userData.user.id;

    const body = await c.req.json();
    const { text } = body;

    if (!text || text.trim() === "") {
      return c.json({ success: false, error: "Message vide" }, 400);
    }

    // Verify conversation exists and user has access
    const { data: convData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", `conversation:${conversationId}`)
      .single();

    if (!convData?.value) {
      return c.json({ success: false, error: "Conversation non trouvée" }, 404);
    }

    const conversation = convData.value;
    if (conversation.memberId !== senderId && conversation.expertId !== senderId) {
      return c.json({ success: false, error: "Accès non autorisé" }, 403);
    }

    // Create message
    const message = {
      id: crypto.randomUUID(),
      conversationId,
      senderId,
      senderType,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Add message to conversation
    const messagesKey = `conversation_messages:${conversationId}`;
    const { data: messagesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", messagesKey)
      .single();

    const messages = messagesData?.value || [];
    messages.push(message);

    await supabase.from("kv_store_6378cc81").upsert({
      key: messagesKey,
      value: messages,
    });

    // Update conversation last message
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date().toISOString();
    
    await supabase.from("kv_store_6378cc81").upsert({
      key: `conversation:${conversationId}`,
      value: conversation,
    });

    return c.json({ success: true, data: message });
  } catch (error) {
    console.error("Erreur envoi message:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new conversation
app.post("/conversations", async (c) => {
  try {
    const memberToken = c.req.header("X-User-Token");
    const expertToken = c.req.header("X-Expert-Token");
    const token = memberToken || expertToken;

    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    const body = await c.req.json();
    const { expertId, memberId } = body;

    // Validate
    if (memberToken && !expertId) {
      return c.json({ success: false, error: "expertId requis" }, 400);
    }
    if (expertToken && !memberId) {
      return c.json({ success: false, error: "memberId requis" }, 400);
    }

    const finalExpertId = expertId || userId;
    const finalMemberId = memberId || userId;

    // Check if conversation already exists
    const { data: existingConvs } = await supabase
      .from("kv_store_6378cc81")
      .select("key, value")
      .like("key", "conversation:%");

    const existing = existingConvs?.find(
      (c) =>
        c.value.expertId === finalExpertId && c.value.memberId === finalMemberId
    );

    if (existing) {
      return c.json({ success: true, data: existing.value });
    }

    // Create new conversation
    const conversationId = crypto.randomUUID();
    const conversation = {
      id: conversationId,
      expertId: finalExpertId,
      memberId: finalMemberId,
      createdAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      lastMessage: "",
    };

    await supabase.from("kv_store_6378cc81").insert({
      key: `conversation:${conversationId}`,
      value: conversation,
    });

    // Initialize empty messages array
    await supabase.from("kv_store_6378cc81").insert({
      key: `conversation_messages:${conversationId}`,
      value: [],
    });

    return c.json({ success: true, data: conversation });
  } catch (error) {
    console.error("Erreur création conversation:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Mark messages as read
app.post("/conversations/:conversationId/mark-read", async (c) => {
  try {
    const conversationId = c.req.param("conversationId");
    const memberToken = c.req.header("X-User-Token");
    const expertToken = c.req.header("X-Expert-Token");
    const token = memberToken || expertToken;

    if (!token) {
      return c.json({ success: false, error: "Token manquant" }, 401);
    }

    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData?.user?.id) {
      return c.json({ success: false, error: "Non authentifié" }, 401);
    }
    const userId = userData.user.id;

    // Get messages and mark as read
    const messagesKey = `conversation_messages:${conversationId}`;
    const { data: messagesData } = await supabase
      .from("kv_store_6378cc81")
      .select("value")
      .eq("key", messagesKey)
      .single();

    const messages = messagesData?.value || [];
    const updatedMessages = messages.map((msg: any) => {
      if (msg.senderId !== userId) {
        return { ...msg, read: true };
      }
      return msg;
    });

    await supabase.from("kv_store_6378cc81").upsert({
      key: messagesKey,
      value: updatedMessages,
    });

    return c.json({ success: true });
  } catch (error) {
    console.error("Erreur marquer messages lus:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

export default app;
