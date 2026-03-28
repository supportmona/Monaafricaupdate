import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video,
  Mic,
  MicOff,
  VideoOff,
  Phone,
  MessageCircle,
  Clock,
  Settings,
  Monitor,
  ArrowLeft,
  Send,
  User,
  Calendar,
  FileText,
  Loader2
} from "lucide-react";
import DailyVideoRoom from "@/app/components/DailyVideoRoom";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ConsultationRoomPage() {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const { user } = useMemberAuth();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consultationData, setConsultationData] = useState<any>(null);
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const expertInfo = {
    name: "Dr. Kouassi Mensah",
    avatar: "KM",
    specialty: "Psychiatre",
    experience: "15 ans d'expérience"
  };

  const sessionInfo = {
    type: "Consultation en ligne",
    scheduledTime: "14:30",
    duration: 45,
    date: "5 Février 2026"
  };

  // Rejoindre la room Daily.co
  useEffect(() => {
    const joinConsultationRoom = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/consultations/join-room`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify({
              appointmentId: consultationId,
              userName: user?.name || "Membre M.O.N.A",
              userId: user?.id || "member_1",
              isExpert: false,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de l'accès à la consultation");
        }

        if (data.success && data.roomUrl) {
          setRoomUrl(data.roomUrl);
          setConsultationStarted(true);
        }
      } catch (err: any) {
        console.error("Erreur join room:", err);
        setError(err.message || "Impossible de rejoindre la consultation");
      } finally {
        setIsLoading(false);
      }
    };

    if (consultationId) {
      joinConsultationRoom();
    }
  }, [consultationId, user]);

  useEffect(() => {
    if (!consultationStarted) return;

    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [consultationStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: user?.name || "Vous",
      message: chatInput,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput("");
  };

  const handleEndConsultation = () => {
    setConsultationStarted(false);
    setShowEndConfirmation(false);
    navigate("/member/consultations");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A68B6F] animate-spin mx-auto mb-4" />
          <p className="text-[#1A1A1A] font-medium">Chargement de la consultation</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
      {/* Premium Header */}
      <header className="bg-white border-b border-black/5 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
              <button
                onClick={() => navigate("/member/consultations")}
                className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div className="hidden sm:block w-px h-8 bg-black/10 flex-shrink-0"></div>
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg font-serif italic text-[#1A1A1A] truncate">{sessionInfo.type}</h1>
                  <p className="text-xs sm:text-sm text-[#1A1A1A]/60 truncate">
                    {expertInfo.name} • {consultationStarted ? formatTime(sessionTime) : sessionInfo.scheduledTime}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {consultationStarted && (
                <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 rounded-full border border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700 tracking-wide uppercase">En cours</span>
                </div>
              )}
              <button className="p-2 sm:p-2.5 hover:bg-black/5 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col bg-[#F5F0EB]">
          {/* Video Container */}
          <div className="flex-1 relative p-3 sm:p-6">
            {!consultationStarted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-white rounded-xl sm:rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 sm:p-8"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
                  <span className="text-4xl sm:text-5xl text-white font-medium">{expertInfo.avatar}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1A1A1A] mb-2 sm:mb-3 text-center">{expertInfo.name}</h2>
                <p className="text-sm sm:text-base text-[#1A1A1A]/60 mb-1 sm:mb-2">{expertInfo.specialty}</p>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/60 mb-6 sm:mb-8">{expertInfo.experience}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 mb-6 w-full max-w-md">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F5F0EB] rounded-full">
                    <Calendar className="w-4 h-4 text-[#A68B6F]" />
                    <span className="text-sm text-[#1A1A1A]">{sessionInfo.date}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F5F0EB] rounded-full">
                    <Clock className="w-4 h-4 text-[#A68B6F]" />
                    <span className="text-sm text-[#1A1A1A]">{sessionInfo.duration} minutes</span>
                  </div>
                </div>

                <button
                  onClick={() => setConsultationStarted(true)}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-medium transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                >
                  <Video className="w-5 h-5" />
                  Rejoindre la consultation
                </button>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-md w-full">
                  <p className="text-xs text-blue-900 text-center">
                    Assurez-vous d'être dans un endroit calme avec une bonne connexion Internet
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="w-full h-full bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
                <DailyVideoRoom
                  roomUrl={roomUrl}
                  displayName={user?.name || "Membre M.O.N.A"}
                  showControls={true}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

          {/* Enhanced Controls */}
          {consultationStarted && (
            <div className="bg-white border-t border-black/5 px-3 sm:px-6 py-3 sm:py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  {/* Primary Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                        isMuted 
                          ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                          : "bg-[#F5F0EB] hover:bg-[#D4C5B9]"
                      }`}
                    >
                      {isMuted ? (
                        <MicOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <Mic className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1A1A]" />
                      )}
                    </button>

                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                        isVideoOff 
                          ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30" 
                          : "bg-[#F5F0EB] hover:bg-[#D4C5B9]"
                      }`}
                    >
                      {isVideoOff ? (
                        <VideoOff className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      ) : (
                        <Video className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1A1A]" />
                      )}
                    </button>
                  </div>

                  {/* End Call */}
                  <button 
                    onClick={() => setShowEndConfirmation(true)}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-500/30 transform hover:scale-105"
                  >
                    <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-white rotate-[135deg]" />
                  </button>

                  {/* Secondary Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5F0EB] hover:bg-[#D4C5B9] rounded-full flex items-center justify-center transition-all transform hover:scale-105 relative"
                    >
                      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#1A1A1A]" />
                      {chatMessages.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C86F56] text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {chatMessages.length}
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Timer Display */}
                <div className="mt-3 sm:mt-4 text-center">
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F5F0EB] rounded-full">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#A68B6F]" />
                    <span className="text-xs sm:text-sm font-medium text-[#1A1A1A] tabular-nums">{formatTime(sessionTime)}</span>
                    <span className="text-xs text-[#1A1A1A]/60">/ {sessionInfo.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Sidebar - Desktop & Mobile */}
        {consultationStarted && showChat && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed lg:relative inset-0 lg:w-[380px] bg-white lg:border-l border-black/5 flex flex-col shadow-2xl z-40"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-black/5 bg-[#F5F0EB]">
              <h3 className="font-serif italic text-lg text-[#1A1A1A]">Chat</h3>
              <button
                onClick={() => setShowChat(false)}
                className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-[#D4C5B9] mx-auto mb-3" />
                  <p className="text-sm text-[#1A1A1A]/60">Aucun message pour le moment</p>
                  <p className="text-xs text-[#1A1A1A]/40 mt-2">Commencez une conversation avec votre praticien</p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div key={msg.id} className="bg-[#F5F0EB] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#A68B6F] tracking-wide uppercase">{msg.sender}</span>
                      <span className="text-xs text-[#1A1A1A]/60">{msg.time}</span>
                    </div>
                    <p className="text-sm text-[#1A1A1A]">{msg.message}</p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 sm:p-6 border-t border-black/5 bg-[#F5F0EB]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Envoyer un message..."
                  className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-full text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20 transition-all"
                />
                <button
                  onClick={sendChatMessage}
                  className="w-12 h-12 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-full flex items-center justify-center transition-all shadow-lg transform hover:scale-105"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* End Consultation Confirmation Modal */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEndConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-500 rotate-[135deg]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif italic text-[#1A1A1A] mb-2">Quitter la consultation</h3>
                <p className="text-sm sm:text-base text-[#1A1A1A]/60">Voulez-vous vraiment quitter cette consultation ?</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowEndConfirmation(false)}
                  className="flex-1 px-6 py-3 bg-[#F5F0EB] hover:bg-[#D4C5B9] text-[#1A1A1A] rounded-full font-medium transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEndConsultation}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all shadow-lg shadow-red-500/30"
                >
                  Quitter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
