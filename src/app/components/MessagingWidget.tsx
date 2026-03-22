import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, User } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Conversation {
  id: string;
  participants: {
    id: string;
    name: string;
    role: string;
  }[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: { [userId: string]: number };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessagingWidgetProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "member" | "expert" | "admin";
}

export default function MessagingWidget({
  currentUserId,
  currentUserName,
  currentUserRole,
}: MessagingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    loadUnreadCount();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      loadConversations();
      loadUnreadCount();
      if (selectedConversation) {
        loadMessages(selectedConversation.id);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [currentUserId]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/messaging/conversations/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversations(data.data);
        }
      }
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/messaging/conversation/${conversationId}/messages`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.data);
        }
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/messaging/unread/${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUnreadCount(data.data.count);
        }
      }
    } catch (error) {
      console.error("Erreur chargement non lus:", error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/messaging/conversation/${conversationId}/read`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ userId: currentUserId }),
        }
      );
      loadUnreadCount();
    } catch (error) {
      console.error("Erreur marquage lu:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const recipient = selectedConversation.participants.find(
      (p) => p.id !== currentUserId
    );
    if (!recipient) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/messaging/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            senderId: currentUserId,
            senderName: currentUserName,
            senderRole: currentUserRole,
            recipientId: recipient.id,
            recipientName: recipient.name,
            recipientRole: recipient.role,
            content: newMessage,
          }),
        }
      );

      if (response.ok) {
        setNewMessage("");
        await loadMessages(selectedConversation.id);
        await loadConversations();
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-terracotta text-white rounded-full shadow-lg hover:bg-terracotta/90 transition-all flex items-center justify-center z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageSquare className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Messagerie popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-border z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-serif text-lg text-anthracite">Messages</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 flex">
            {/* Liste conversations */}
            {!selectedConversation ? (
              <div className="w-full overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-sans">
                      Aucune conversation
                    </p>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const other = conv.participants.find(
                      (p) => p.id !== currentUserId
                    );
                    if (!other) return null;

                    return (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className="w-full p-4 border-b border-border hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-terracotta" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="font-medium text-sm text-anthracite truncate font-sans">
                                {other.name}
                              </p>
                              {conv.unreadCount[currentUserId] > 0 && (
                                <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate font-sans">
                              {conv.lastMessage}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              /* Vue conversation */
              <div className="w-full flex flex-col">
                {/* Header conversation */}
                <div className="p-3 border-b border-border flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <div>
                    <p className="font-medium text-sm text-anthracite font-sans">
                      {
                        selectedConversation.participants.find(
                          (p) => p.id !== currentUserId
                        )?.name
                      }
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loading ? (
                    <p className="text-center text-sm text-muted-foreground font-sans">
                      Chargement...
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.senderId === currentUserId
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 ${
                            msg.senderId === currentUserId
                              ? "bg-terracotta text-white"
                              : "bg-gray-100 text-anthracite"
                          }`}
                        >
                          <p className="text-sm font-sans">{msg.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.senderId === currentUserId
                                ? "text-white/70"
                                : "text-muted-foreground"
                            } font-sans`}
                          >
                            {new Date(msg.timestamp).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Écrire un message..."
                    className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-sm font-sans"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
