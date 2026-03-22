import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  User,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ChatPage() {
  const [searchParams] = useSearchParams();
  const initialConvId = searchParams.get("conversation");
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userType, setUserType] = useState<"member" | "expert" | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingInterval = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "connecting">("connecting");

  useEffect(() => {
    // Determine user type
    const memberToken = localStorage.getItem("mona_member_token");
    const expertToken = localStorage.getItem("mona_expert_token");
    
    if (memberToken) {
      setUserType("member");
    } else if (expertToken) {
      setUserType("expert");
    }

    loadConversations();

    // Cleanup polling on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (initialConvId && conversations.length > 0) {
      const conv = conversations.find((c) => c.id === initialConvId);
      if (conv) {
        handleSelectConversation(conv);
      }
    }
  }, [initialConvId, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      
      // Poll for new messages every 3 seconds
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      pollingInterval.current = setInterval(() => {
        loadMessages(true); // Silent reload
      }, 3000);
    }

    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setError(null);
      setConnectionStatus("connecting");

      const memberToken = localStorage.getItem("mona_member_token");
      const expertToken = localStorage.getItem("mona_expert_token");
      const token = memberToken || expertToken;

      if (!token) {
        setConversations([]);
        setConnectionStatus("offline");
        return;
      }

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/chat/conversations`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
            ...(expertToken && { "X-Expert-Token": expertToken }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
        setConnectionStatus("online");
      } else {
        setError("Impossible de charger les conversations. Veuillez réessayer.");
        setConnectionStatus("offline");
      }
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
      setError("Problème de connexion. Vérifiez votre connexion internet.");
      setConnectionStatus("offline");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (silent = false) => {
    if (!selectedConversation) return;

    try {
      if (!silent) setLoading(true);

      const memberToken = localStorage.getItem("mona_member_token");
      const expertToken = localStorage.getItem("mona_expert_token");
      const token = memberToken || expertToken;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/chat/conversations/${selectedConversation.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
            ...(expertToken && { "X-Expert-Token": expertToken }),
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages(data.data || []);
        
        // Mark as read
        await markAsRead();
      }
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const markAsRead = async () => {
    if (!selectedConversation) return;

    try {
      const memberToken = localStorage.getItem("mona_member_token");
      const expertToken = localStorage.getItem("mona_expert_token");
      const token = memberToken || expertToken;

      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/chat/conversations/${selectedConversation.id}/mark-read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
            ...(expertToken && { "X-Expert-Token": expertToken }),
          },
        }
      );
    } catch (error) {
      console.error("Erreur marquer lu:", error);
    }
  };

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedConversation) return;

    try {
      setSending(true);

      const memberToken = localStorage.getItem("mona_member_token");
      const expertToken = localStorage.getItem("mona_expert_token");
      const token = memberToken || expertToken;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/chat/conversations/${selectedConversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token!,
            ...(expertToken && { "X-Expert-Token": expertToken }),
          },
          body: JSON.stringify({ text: messageText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMessages([...messages, data.data]);
        setMessageText("");
      }
    } catch (error) {
      console.error("Erreur envoi message:", error);
      alert("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredConversations = conversations.filter((conv) => {
    // For now, just filter by last message or empty
    if (!searchQuery) return true;
    return conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getUserId = () => {
    return "current-user"; // Placeholder - get from auth
  };

  if (loading && !selectedConversation) {
    return (
      <div className="min-h-screen bg-[#F5F1ED] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#1A1A1A]/60">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F5F1ED] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#D4C5B9]">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              to={userType === "expert" ? "/expert/dashboard" : "/member/dashboard"}
              className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1A1A1A]/60" />
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-serif text-[#1A1A1A]">Messages</h1>
              {connectionStatus === "offline" && (
                <p className="text-sm text-red-600">Hors ligne</p>
              )}
              {connectionStatus === "connecting" && (
                <p className="text-sm text-yellow-600">Connexion...</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={loadConversations}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Réessayer
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-full md:w-96 bg-white border-r border-[#D4C5B9] flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-[#D4C5B9]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-12 h-12 text-[#1A1A1A]/20 mx-auto mb-3" />
                <p className="text-sm text-[#1A1A1A]/60">
                  Aucune conversation
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left p-4 border-b border-[#D4C5B9] hover:bg-[#F5F1ED] transition-colors ${
                    selectedConversation?.id === conv.id ? "bg-[#F5F1ED]" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {userType === "member" ? "E" : "M"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[#1A1A1A] truncate">
                          {userType === "member" ? "Expert" : "Membre"}
                        </span>
                        {conv.lastMessageAt && (
                          <span className="text-xs text-[#1A1A1A]/40">
                            {new Date(conv.lastMessageAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-sm text-[#1A1A1A]/60 truncate">
                          {conv.lastMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
                  Sélectionnez une conversation
                </h3>
                <p className="text-sm text-[#1A1A1A]/60">
                  Choisissez une conversation pour commencer
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#D4C5B9]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white font-semibold">
                      {userType === "member" ? "E" : "M"}
                    </div>
                    <div>
                      <h2 className="font-medium text-[#1A1A1A]">
                        {userType === "member" ? "Expert" : "Membre"}
                      </h2>
                      <p className="text-xs text-green-500">En ligne</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5 text-[#1A1A1A]/60" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-[#1A1A1A]/60">
                      Aucun message pour le moment
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const isOwn = message.senderType === userType;
                    const showDate =
                      index === 0 ||
                      new Date(message.createdAt).toDateString() !==
                        new Date(messages[index - 1].createdAt).toDateString();

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="text-xs text-[#1A1A1A]/40 bg-[#F5F1ED] px-3 py-1 rounded-full">
                              {new Date(message.createdAt).toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                              isOwn
                                ? "bg-[#A68B6F] text-white"
                                : "bg-[#F5F1ED] text-[#1A1A1A]"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {message.text}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? "text-white/70" : "text-[#1A1A1A]/40"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-[#D4C5B9]"
              >
                <div className="flex items-end gap-3">
                  <button
                    type="button"
                    className="p-2 hover:bg-[#F5F1ED] rounded-full transition-colors"
                  >
                    <Paperclip className="w-5 h-5 text-[#1A1A1A]/60" />
                  </button>
                  <div className="flex-1 flex items-end gap-2 bg-[#F5F1ED] rounded-2xl px-4 py-2">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage(e);
                        }
                      }}
                      placeholder="Écrivez votre message..."
                      rows={1}
                      className="flex-1 bg-transparent border-none outline-none resize-none text-sm"
                      style={{ maxHeight: "120px" }}
                    />
                    <button
                      type="button"
                      className="p-1 hover:bg-white/50 rounded-full transition-colors"
                    >
                      <Smile className="w-5 h-5 text-[#1A1A1A]/60" />
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={!messageText.trim() || sending}
                    className="p-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
