import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Sparkles, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

console.log('✅ ChatWidget.tsx loaded - Module import successful');

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export default function ChatWidget() {
  console.log('🚀 ChatWidget component is being rendered!');
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug: vérifier que le composant est monté
  useEffect(() => {
    console.log('🤖 ChatWidget monté et visible');
    console.log('Position du bouton: bottom-6 right-6, z-index: 9999');
  }, []);
  
  // Message de bienvenue initial
  const initialMessage: Message = {
    id: "welcome",
    role: "assistant",
    content: "Bonjour ! Je suis l'assistant M.O.N.A. Je peux vous aider à naviguer sur notre plateforme, découvrir nos services ou trouver des ressources adaptées à vos besoins. Comment puis-je vous accompagner aujourd'hui ?",
    timestamp: new Date(),
    suggestions: [
      "Comment fonctionne le Smart Matching ?",
      "Quels sont vos tarifs ?",
      "Comment prendre rendez-vous avec un expert ?",
      "Accéder aux ressources gratuites"
    ]
  };
  
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Réinitialiser la conversation quand on ferme le chat
  const handleClose = () => {
    setIsOpen(false);
    // Réinitialiser les messages après l'animation de fermeture
    setTimeout(() => {
      setMessages([initialMessage]);
      setInputValue("");
    }, 300);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Appel à l'API backend
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-5),
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de communication");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        suggestions: data.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, je rencontre une difficulté technique. Pour une assistance immédiate, contactez-nous à contact@monafrica.net ou explorez nos ressources.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Widget Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              console.log('🔵 Bouton ChatWidget cliqué');
              setIsOpen(true);
            }}
            className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-[#1A1A1A] text-white rounded-full shadow-2xl hover:bg-[#1A1A1A]/90 transition-all duration-200 flex items-center justify-center group"
            style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}
            aria-label="Ouvrir l'assistant M.O.N.A"
          >
            <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B7355] rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[9999] w-full sm:w-[380px] h-[100dvh] sm:h-[600px] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border-0 sm:border border-black/10"
          >
            {/* Header */}
            <div className="bg-anthracite text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-terracotta/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-terracotta" />
                </div>
                <div>
                  <h3 className="font-serif text-lg">Assistant M.O.N.A</h3>
                  <p className="text-xs text-white/60">Toujours à votre écoute</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-beige/5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-anthracite text-white"
                        : "bg-white border border-black/10"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="block w-full text-left text-xs px-3 py-2 bg-beige/30 hover:bg-beige/50 rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-black/10 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-terracotta" />
                    <span className="text-sm text-muted-foreground">Réflexion en cours...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-black/10 bg-white">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputValue);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1 px-4 py-3 border border-black/20 rounded-full focus:outline-none focus:border-anthracite transition-colors text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="w-11 h-11 bg-anthracite text-white rounded-full hover:bg-anthracite/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Cet assistant ne remplace pas nos experts certifiés
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}