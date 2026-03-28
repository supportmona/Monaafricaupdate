import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Video, VideoOff, Mic, MicOff, Phone, MonitorUp,
  MessageSquare, FileText, Settings, Clock, X, Send,
  CheckCircle, Maximize, Minimize, AlertCircle, Loader2,
} from "lucide-react";
import DailyVideoRoom from "@/app/components/DailyVideoRoom";
import ConsultationNotesModal from "@/app/components/ConsultationNotesModal";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import { projectId } from "/utils/supabase/info";

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

export default function ExpertConsultationRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile, accessToken } = useExpertAuth();

  const [roomUrl, setRoomUrl] = useState<string>("");
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; time: string }>>([]);
  const [messageInput, setMessageInput] = useState("");
  const [notes, setNotes] = useState("");

  const token = accessToken || localStorage.getItem("expert_access_token");

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
          // Pas encore confirmé ou pas de room — essayer quand même
          if (res.status === 400) {
            setError("Ce rendez-vous n'est pas encore confirmé. La salle vidéo sera disponible après confirmation.");
          } else {
            throw new Error(data.error || "Impossible d'accéder à la salle");
          }
          setConnectionStatus("disconnected");
          return;
        }

        setRoomUrl(data.data?.roomUrl || "");
        setConnectionStatus("connected");

        // Charger les détails du booking séparément
        const bookingRes = await fetch(`${API_BASE}/booking/expert/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (bookingRes.ok) {
          const bookingData = await bookingRes.json();
          const found = (bookingData.data || []).find((b: any) => b.id === id);
          if (found) setBooking(found);
        }
      } catch (e: any) {
        setError(e.message || "Erreur réseau");
        setConnectionStatus("disconnected");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, token]);

  // ── Timer ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (connectionStatus !== "connected") return;
    const interval = setInterval(() => setElapsedTime(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleEndCall = () => setShowNotesModal(true);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: "Vous",
      message: messageInput,
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setMessageInput("");
  };

  const handleSubmitNotes = async (consultationNotes: string, recommendations: string) => {
    try {
      await fetch(`${API_BASE}/booking/expert/bookings/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "completed" }),
      });
      navigate("/expert/dashboard");
    } catch (e) {
      console.error("Erreur fin consultation:", e);
      navigate("/expert/dashboard");
    }
  };

  const patientName = booking?.member?.name || "Patient";
  const scheduledAt = booking?.scheduled_at
    ? new Date(booking.scheduled_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#A68B6F] animate-spin mx-auto mb-4" />
          <p className="text-white/60">Connexion à la salle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-serif text-white mb-3">Salle indisponible</h2>
          <p className="text-white/60 mb-6">{error}</p>
          <button onClick={() => navigate("/expert/agenda")}
            className="px-6 py-3 bg-[#A68B6F] text-white rounded-full hover:bg-[#8A7159] transition-colors">
            Retour à l'agenda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col">

      {/* Header */}
      <header className="bg-[#2A2A2A] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
              {patientName[0]}
            </div>
            <div>
              <h2 className="text-white font-medium">{patientName}</h2>
              <p className="text-white/60 text-sm">
                {booking?.reason || "Consultation"} {scheduledAt && `· ${scheduledAt}`}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected" ? "bg-green-500" :
                connectionStatus === "connecting" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
              }`} />
              <span className="text-white/80 text-xs">
                {connectionStatus === "connected" ? "Connecté" :
                 connectionStatus === "connecting" ? "Connexion..." : "Déconnecté"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono text-white/80">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex relative overflow-hidden">

        {/* Zone vidéo */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {connectionStatus === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] z-10">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#A68B6F] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Connexion en cours...</h3>
                <p className="text-white/60">Établissement de la connexion vidéo sécurisée</p>
              </div>
            </div>
          )}

          {connectionStatus === "connected" && (
            <>
              {/* Vidéo principale */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`relative ${isFullscreen ? "w-full h-full" : "w-full max-w-5xl"} bg-[#2A2A2A] rounded-3xl overflow-hidden`}>
                {roomUrl ? (
                  <DailyVideoRoom roomUrl={roomUrl}
                    displayName={`Dr. ${profile?.firstName || ""} ${profile?.lastName || ""}`.trim() || "Expert"}
                    showControls={false} className="w-full aspect-video" />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-5xl text-white font-medium">{patientName[0]}</span>
                      </div>
                      <p className="text-white/60 text-sm">En attente du patient...</p>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
                  <p className="text-white text-sm font-medium">{patientName}</p>
                </div>
                <button onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                  {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
                </button>
              </motion.div>

              {/* Self view */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute bottom-6 right-6 w-56 aspect-video bg-[#2A2A2A] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl text-white font-medium">
                        {(profile?.firstName?.[0] || "") + (profile?.lastName?.[0] || "")}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs">Vous</p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Sidebar Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-80 bg-[#2A2A2A] border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">Chat</h3>
                <button onClick={() => setShowChat(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40 text-sm">Aucun message</p>
                  </div>
                ) : chatMessages.map(msg => (
                  <div key={msg.id} className="bg-white/5 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#A68B6F] text-xs font-medium">{msg.sender}</span>
                      <span className="text-white/30 text-xs">{msg.time}</span>
                    </div>
                    <p className="text-white text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-white/10 flex gap-2">
                <input type="text" value={messageInput}
                  onChange={e => setMessageInput(e.target.value)}
                  onKeyPress={e => e.key === "Enter" && handleSendMessage()}
                  placeholder="Message..."
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                <button onClick={handleSendMessage} className="p-2 bg-[#A68B6F] rounded-full hover:bg-[#8A7159] transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Notes */}
        <AnimatePresence>
          {showNotes && (
            <motion.div initial={{ x: 400, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 400, opacity: 0 }}
              className="w-80 bg-[#2A2A2A] border-l border-white/10 flex flex-col">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">Notes</h3>
                <button onClick={() => setShowNotes(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1 p-4">
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Prendre des notes pendant la consultation..."
                  className="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none text-sm" />
              </div>
              <div className="p-4 border-t border-white/10">
                <button className="w-full py-3 bg-[#A68B6F] hover:bg-[#8A7159] rounded-full text-white text-sm font-medium transition-colors">
                  Enregistrer
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <footer className="bg-[#2A2A2A] border-t border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-4 rounded-full transition-all ${isVideoEnabled ? "bg-white/10 hover:bg-white/20" : "bg-red-500 hover:bg-red-600"}`}>
              {isVideoEnabled ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
            </button>
            <button onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-4 rounded-full transition-all ${isAudioEnabled ? "bg-white/10 hover:bg-white/20" : "bg-red-500 hover:bg-red-600"}`}>
              {isAudioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
            </button>
          </div>

          <button onClick={handleEndCall}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center gap-2 transition-colors">
            <Phone className="w-5 h-5 text-white rotate-[135deg]" />
            <span className="text-white font-medium">Terminer</span>
          </button>

          <div className="flex items-center gap-3">
            <button onClick={() => { setShowChat(!showChat); setShowNotes(false); }}
              className={`p-4 rounded-full transition-all ${showChat ? "bg-[#A68B6F]" : "bg-white/10 hover:bg-white/20"}`}>
              <MessageSquare className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => { setShowNotes(!showNotes); setShowChat(false); }}
              className={`p-4 rounded-full transition-all ${showNotes ? "bg-[#A68B6F]" : "bg-white/10 hover:bg-white/20"}`}>
              <FileText className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </footer>

      {/* Banner connecté */}
      {connectionStatus === "connected" && (
        <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Connexion sécurisée établie</span>
        </motion.div>
      )}

      {/* Modal notes fin de consultation */}
      <ConsultationNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSubmit={handleSubmitNotes}
        expertName={`Dr. ${profile?.firstName || ""} ${profile?.lastName || ""}`.trim()}
        memberName={patientName}
        consultationDate={new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      />
    </div>
  );
}
