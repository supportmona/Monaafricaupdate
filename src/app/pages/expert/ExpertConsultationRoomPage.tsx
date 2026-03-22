import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  MonitorUp,
  MessageSquare,
  FileText,
  Settings,
  Users,
  Clock,
  X,
  Send,
  Paperclip,
  Calendar,
  AlertCircle,
  CheckCircle,
  Maximize,
  Minimize,
} from "lucide-react";
import DailyVideoRoom from "@/app/components/DailyVideoRoom";
import ConsultationNotesModal from "@/app/components/ConsultationNotesModal";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function ExpertConsultationRoomPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useExpertAuth();
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: string; message: string; time: string }>>([]);
  const [messageInput, setMessageInput] = useState("");
  const [notes, setNotes] = useState("");
  const [roomUrl, setRoomUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [appointmentData, setAppointmentData] = useState<any>(null);

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
              appointmentId: id,
              userName: profile?.name || "Dr. Sarah Koné",
              userId: user?.id || "expert_1",
              isExpert: true,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la création de la room");
        }

        if (data.success && data.roomUrl) {
          setRoomUrl(data.roomUrl);
          setConnectionStatus("connected");
        }
      } catch (err: any) {
        console.error("Erreur join room:", err);
        setError(err.message || "Impossible de rejoindre la consultation");
        setConnectionStatus("disconnected");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      joinConsultationRoom();
    }
  }, [id, user, profile]);

  // Récupérer les données du rendez-vous
  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        console.log("📅 Récupération des données du rendez-vous:", id);

        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/appointments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Données rendez-vous récupérées:", data);
          setAppointmentData(data.appointment || {
            patientName: "Amara Koné",
            patientAge: 41,
            sessionNumber: 4,
            reason: "Suivi thérapie anxiété",
          });
        } else {
          console.warn("⚠️ Impossible de récupérer le rendez-vous, utilisation de données par défaut");
          // Fallback sur données par défaut
          setAppointmentData({
            patientName: "Amara Koné",
            patientAge: 41,
            sessionNumber: 4,
            reason: "Suivi thérapie anxiété",
          });
        }
      } catch (error) {
        console.error("❌ Erreur récupération rendez-vous:", error);
        // Fallback sur données par défaut
        setAppointmentData({
          patientName: "Amara Koné",
          patientAge: 41,
          sessionNumber: 4,
          reason: "Suivi thérapie anxiété",
        });
      }
    };

    if (id) {
      fetchAppointmentData();
    }
  }, [id]);

  // Timer
  useEffect(() => {
    if (connectionStatus === "connected") {
      const interval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [connectionStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    // Ouvrir la modale de notes de consultation
    setShowNotesModal(true);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now().toString(),
          sender: "Vous",
          message: messageInput,
          time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setMessageInput("");
    }
  };

  const handleSubmitConsultationNotes = async (consultationNotes: string, recommendations: string) => {
    try {
      console.log("📝 Soumission des notes de consultation pour:", id);

      // Formater les notes
      const formattedNotes = `📝 NOTES DE CONSULTATION\n\n${consultationNotes}`;
      const formattedRecommendations = recommendations
        ? `\n\nRECOMMANDATIONS ET SUIVI\n\n${recommendations}`
        : "";

      const fullNotes = formattedNotes + formattedRecommendations;

      // Créer le message de notes
      const notesMessage = {
        text: fullNotes,
        senderId: user?.id || "expert_1", // TODO: Récupérer le vrai ID de l'expert
        senderName: profile?.name || "Dr. Sarah Koné", // TODO: Récupérer le vrai nom
        senderType: "expert",
        timestamp: new Date().toISOString(),
        isExpertNote: true,
      };

      // Appeler l'API pour terminer la consultation
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/consultations/end-consultation/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            notes: [notesMessage], // Passer les notes comme array de messages
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la fin de consultation");
      }

      console.log("✅ Consultation terminée avec succès:", data);

      // Rediriger vers le dashboard
      navigate("/expert/dashboard");
    } catch (error: any) {
      console.error("❌ Erreur fin consultation:", error);
      alert(`Erreur: ${error.message}`);
      throw error; // Rethrow pour que la modale gère l'état de chargement
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col">
      {/* Header */}
      <header className="bg-[#2A2A2A] border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center text-white font-medium">
                {appointmentData?.patientName[0]}
              </div>
              <div>
                <h2 className="text-white font-medium">{appointmentData?.patientName}</h2>
                <p className="text-white/60 text-sm">
                  {appointmentData?.patientAge} ans • Séance #{appointmentData?.sessionNumber}
                </p>
              </div>
            </div>

            {/* Connection status */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
              <div
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                }`}
              />
              <span className="text-white/80 text-xs">
                {connectionStatus === "connected"
                  ? "Connecté"
                  : connectionStatus === "connecting"
                    ? "Connexion..."
                    : "Déconnecté"}
              </span>
            </div>
          </div>

          {/* Timer & reason */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <FileText className="w-4 h-4" />
              <span className="text-sm">{appointmentData?.reason}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex relative">
        {/* Video area */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {connectionStatus === "connecting" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-[#1A1A1A] z-10"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-[#A68B6F] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-serif text-white mb-2">Connexion en cours...</h3>
                <p className="text-white/60">Établissement de la connexion vidéo sécurisée</p>
              </div>
            </motion.div>
          )}

          {connectionStatus === "connected" && (
            <>
              {/* Patient video (main) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative ${isFullscreen ? "w-full h-full" : "w-full max-w-5xl"} bg-[#2A2A2A] rounded-3xl overflow-hidden`}
              >
                {/* Placeholder pour vidéo patient */}
                <div className="aspect-video bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl text-white font-medium">{appointmentData?.patientName[0]}</span>
                    </div>
                    <p className="text-white/60 text-sm">Vidéo patient</p>
                  </div>
                </div>

                {/* Patient name overlay */}
                <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full">
                  <p className="text-white text-sm font-medium">{appointmentData?.patientName}</p>
                </div>

                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="absolute bottom-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5 text-white" />
                  ) : (
                    <Maximize className="w-5 h-5 text-white" />
                  )}
                </button>
              </motion.div>

              {/* Expert video (self view) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-6 right-6 w-64 aspect-video bg-[#2A2A2A] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
              >
                <div className="w-full h-full bg-gradient-to-br from-[#3A3A3A] to-[#2A2A2A] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#A68B6F] to-[#D4C5B9] rounded-full flex items-center justify-center mx-auto mb-2">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white/60 text-xs">Vous</p>
                  </div>
                </div>

                {/* Video status indicators */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  {!isVideoEnabled && (
                    <div className="p-1.5 bg-red-500 rounded-full">
                      <VideoOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!isAudioEnabled && (
                    <div className="p-1.5 bg-red-500 rounded-full">
                      <MicOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Sidebar - Chat */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-[#2A2A2A] border-l border-white/10 flex flex-col"
            >
              {/* Chat header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">Chat</h3>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">Aucun message</p>
                  </div>
                ) : (
                  chatMessages.map((msg) => (
                    <div key={msg.id} className="bg-white/5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[#A68B6F] text-sm font-medium">{msg.sender}</span>
                        <span className="text-white/40 text-xs">{msg.time}</span>
                      </div>
                      <p className="text-white text-sm">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Votre message..."
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-[#A68B6F] hover:bg-[#8A7159] rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar - Notes */}
        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-[#2A2A2A] border-l border-white/10 flex flex-col"
            >
              {/* Notes header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-medium">Notes de consultation</h3>
                <button onClick={() => setShowNotes(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Notes editor */}
              <div className="flex-1 p-4">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Prendre des notes pendant la consultation..."
                  className="w-full h-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none"
                />
              </div>

              {/* Save button */}
              <div className="p-4 border-t border-white/10">
                <button className="w-full py-3 bg-[#A68B6F] hover:bg-[#8A7159] rounded-full text-white font-medium transition-colors">
                  Enregistrer les notes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <footer className="bg-[#2A2A2A] border-t border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`p-4 rounded-full transition-all ${
                isVideoEnabled ? "bg-white/10 hover:bg-white/20" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isVideoEnabled ? (
                <Video className="w-5 h-5 text-white" />
              ) : (
                <VideoOff className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-4 rounded-full transition-all ${
                isAudioEnabled ? "bg-white/10 hover:bg-white/20" : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {isAudioEnabled ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
            </button>

            <button
              onClick={() => setIsScreenSharing(!isScreenSharing)}
              className={`p-4 rounded-full transition-all ${
                isScreenSharing ? "bg-[#A68B6F] hover:bg-[#8A7159]" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <MonitorUp className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Center - End call */}
          <button
            onClick={handleEndCall}
            className="px-8 py-4 bg-red-500 hover:bg-red-600 rounded-full flex items-center gap-2 transition-colors"
          >
            <Phone className="w-5 h-5 text-white rotate-[135deg]" />
            <span className="text-white font-medium">Terminer</span>
          </button>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowChat(!showChat);
                setShowNotes(false);
              }}
              className={`p-4 rounded-full transition-all ${
                showChat ? "bg-[#A68B6F] hover:bg-[#8A7159]" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => {
                setShowNotes(!showNotes);
                setShowChat(false);
              }}
              className={`p-4 rounded-full transition-all ${
                showNotes ? "bg-[#A68B6F] hover:bg-[#8A7159]" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <FileText className="w-5 h-5 text-white" />
            </button>

            <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </footer>

      {/* Info banner */}
      {connectionStatus === "connected" && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50"
        >
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">Connexion sécurisée établie</span>
        </motion.div>
      )}

      {/* Consultation Notes Modal */}
      <ConsultationNotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        onSubmit={handleSubmitConsultationNotes}
        expertName={profile?.name || "Dr. Sarah Koné"}
        memberName={appointmentData?.patientName || "Patient"}
        consultationDate={new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />
    </div>
  );
}