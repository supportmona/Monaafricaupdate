import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Video, VideoOff, Mic, MicOff, Phone, MessageCircle,
  Clock, Settings, ArrowLeft, Send, Calendar, Loader2,
  AlertCircle, CheckCircle, X,
} from "lucide-react";
import DailyVideoRoom from "@/app/components/DailyVideoRoom";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { projectId } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

export default function MemberConsultationRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useMemberAuth();

  const [roomUrl, setRoomUrl] = useState<string>("");
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; time: string }>>([]);
  const [chatInput, setChatInput] = useState("");

  const token = localStorage.getItem("member_access_token") || localStorage.getItem("user_token");

  // ── Charger les infos du booking + room Daily.co ──────────────────────────
  useEffect(() => {
    if (!id || !token) return;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/booking/${id}/room`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 400) {
            setError("Ce rendez-vous n'est pas encore confirmé par votre praticien. Vous recevrez un email dès que la consultation sera validée.");
          } else {
            throw new Error(data.error || "Impossible d'accéder à la consultation");
          }
          return;
        }

        setRoomUrl(data.data?.roomUrl || "");

        // Charger les détails du booking
        const bookingRes = await fetch(`${API_BASE}/booking/member/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          const found = (bookingData.data || []).find((b: any) => b.id === id);
          if (found) setBooking(found);
        }
      } catch (e: any) {
        setError(e.message || "Erreur réseau");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, token]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!consultationStarted) return;
    const interval = setInterval(() => setSessionTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [consultationStarted]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: user?.name || "Vous",
      message: chatInput,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setChatInput("");
  };

  const handleEndConsultation = () => {
    navigate("/member/consultations");
  };

  const expertName = booking?.expert?.name || "Votre praticien";
  const expertSpecialty = booking?.expert?.specialty || "";
  const scheduledAt = booking?.scheduled_at ? new Date(booking.scheduled_at) : null;
  const duration = booking?.duration_minutes || 60;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A68B6F] animate-spin mx-auto mb-4" />
          <p className="text-[#1A1A1A] font-medium">Chargement de la consultation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-500" />
          </div>
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-3">Consultation non disponible</h2>
          <p className="text-[#1A1A1A]/60 mb-6">{error}</p>
          <button onClick={() => navigate("/member/consultations")}
            className="px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
            Mes consultations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col">

      {/* Header */}
      <header className="bg-white border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <button onClick={() => navigate("/member/consultations")}
                className="p-2 hover:bg-black/5 rounded-full transition-colors flex-shrink-0">
                <ArrowLeft className="w-5 h-5 text-[#1A1A1A]" />
              </button>
              <div className="w-px h-8 bg-black/10 flex-shrink-0 hidden sm:block" />
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center flex-shrink-0">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-lg font-serif text-[#1A1A1A] truncate">
                    Consultation avec {expertName}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#1A1A1A]/60 truncate">
                    {expertSpecialty}{consultationStarted ? ` · ${formatTime(sessionTime)}` : scheduledAt ? ` · ${scheduledAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : ""}
                  </p>
                </div>
              </div>
            </div>
            {consultationStarted && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-200 flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-green-700 uppercase tracking-wide">En cours</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* Zone vidéo */}
        <div className="flex-1 flex flex-col bg-[#F5F0EB]">
          <div className="flex-1 relative p-3 sm:p-6">

            {/* Écran d'attente avant de rejoindre */}
            {!consultationStarted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 min-h-[400px]">
                <div className="w-28 h-28 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-4xl text-white font-medium">{expertName[0]}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif text-[#1A1A1A] mb-2 text-center">{expertName}</h2>
                {expertSpecialty && <p className="text-[#1A1A1A]/60 mb-6">{expertSpecialty}</p>}

                {scheduledAt && (
                  <div className="flex flex-col sm:flex-row gap-3 mb-8 w-full max-w-sm">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F5F1ED] rounded-full">
                      <Calendar className="w-4 h-4 text-[#A68B6F]" />
                      <span className="text-sm text-[#1A1A1A]">
                        {scheduledAt.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F5F1ED] rounded-full">
                      <Clock className="w-4 h-4 text-[#A68B6F]" />
                      <span className="text-sm text-[#1A1A1A]">{duration} minutes</span>
                    </div>
                  </div>
                )}

                <button onClick={() => setConsultationStarted(true)}
                  className="bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white px-10 py-4 rounded-full font-medium transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <Video className="w-5 h-5" />
                  Rejoindre la consultation
                </button>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 max-w-sm w-full">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-800">
                      Assurez-vous d'être dans un endroit calme avec une bonne connexion Internet avant de rejoindre.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Vidéo active */
              <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[400px]">
                {roomUrl ? (
                  <DailyVideoRoom
                    roomUrl={roomUrl}
                    displayName={user?.name || "Membre M.O.N.A"}
                    showControls={true}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl text-white font-medium">{expertName[0]}</span>
                      </div>
                      <p className="text-white/60 text-sm">En attente de {expertName}...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Contrôles */}
          {consultationStarted && (
            <div className="bg-white border-t border-black/5 px-4 sm:px-6 py-4">
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                        isMuted ? "bg-red-500 hover:bg-red-600" : "bg-[#F5F1ED] hover:bg-[#D4C5B9]"
                      }`}>
                      {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#1A1A1A]" />}
                    </button>
                    <button onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all ${
                        isVideoOff ? "bg-red-500 hover:bg-red-600" : "bg-[#F5F1ED] hover:bg-[#D4C5B9]"
                      }`}>
                      {isVideoOff ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-[#1A1A1A]" />}
                    </button>
                  </div>

                  <button onClick={() => setShowEndConfirmation(true)}
                    className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all shadow-lg">
                    <Phone className="w-6 h-6 text-white rotate-[135deg]" />
                  </button>

                  <button onClick={() => setShowChat(!showChat)}
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-[#F5F1ED] hover:bg-[#D4C5B9] rounded-full flex items-center justify-center transition-all relative">
                    <MessageCircle className="w-5 h-5 text-[#1A1A1A]" />
                    {chatMessages.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A68B6F] text-white text-xs rounded-full flex items-center justify-center">
                        {chatMessages.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Timer */}
                <div className="mt-3 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F5F1ED] rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#A68B6F]" />
                    <span className="text-sm font-medium text-[#1A1A1A] tabular-nums">{formatTime(sessionTime)}</span>
                    <span className="text-xs text-[#1A1A1A]/50">/ {duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Chat */}
        <AnimatePresence>
          {consultationStarted && showChat && (
            <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="fixed lg:relative inset-0 lg:w-96 bg-white lg:border-l border-black/5 flex flex-col shadow-2xl z-40">
              <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-[#F5F1ED]">
                <h3 className="font-serif text-lg text-[#1A1A1A]">Chat</h3>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors lg:hidden">
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-[#D4C5B9] mx-auto mb-3" />
                    <p className="text-sm text-[#1A1A1A]/60">Aucun message</p>
                    <p className="text-xs text-[#1A1A1A]/40 mt-1">Commencez une conversation avec votre praticien</p>
                  </div>
                ) : chatMessages.map(msg => (
                  <div key={msg.id} className="bg-[#F5F1ED] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-[#A68B6F] uppercase tracking-wide">{msg.sender}</span>
                      <span className="text-xs text-[#1A1A1A]/40">{msg.time}</span>
                    </div>
                    <p className="text-sm text-[#1A1A1A]">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-black/5 bg-[#F5F1ED]">
                <div className="flex gap-2">
                  <input type="text" value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyPress={e => e.key === "Enter" && sendChatMessage()}
                    placeholder="Envoyer un message..."
                    className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-full text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 focus:outline-none focus:border-[#A68B6F] focus:ring-2 focus:ring-[#A68B6F]/20" />
                  <button onClick={sendChatMessage}
                    className="w-12 h-12 bg-[#1A1A1A] hover:bg-[#2A2A2A] rounded-full flex items-center justify-center transition-all">
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal confirmation fin */}
      <AnimatePresence>
        {showEndConfirmation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEndConfirmation(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-red-500 rotate-[135deg]" />
                </div>
                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2">Quitter la consultation</h3>
                <p className="text-[#1A1A1A]/60">Voulez-vous vraiment mettre fin à cette consultation ?</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowEndConfirmation(false)}
                  className="flex-1 px-6 py-3 bg-[#F5F1ED] hover:bg-[#D4C5B9] text-[#1A1A1A] rounded-full font-medium transition-all">
                  Annuler
                </button>
                <button onClick={handleEndConsultation}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium transition-all">
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
