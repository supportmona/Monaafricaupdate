import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeX,
  Maximize2,
  Minimize2,
  AlertTriangle,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface DailyVideoRoomProps {
  roomUrl: string;
  displayName?: string;
  onLeave?: () => void;
  className?: string;
  showControls?: boolean;
}

type ConnectionQuality = "excellent" | "good" | "poor" | "offline";

export default function DailyVideoRoom({
  roomUrl,
  displayName = "Utilisateur M.O.N.A",
  onLeave,
  className = "",
  showControls = true
}: DailyVideoRoomProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>("excellent");
  const [isMuted, setIsMuted] = useState(false);
  const [showQualityInfo, setShowQualityInfo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkConnection = () => {
      if (navigator.onLine) {
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          const downlink = connection.downlink;
          if (downlink >= 5) {
            setConnectionQuality("excellent");
          } else if (downlink >= 2) {
            setConnectionQuality("good");
          } else {
            setConnectionQuality("poor");
          }
        } else {
          setConnectionQuality("excellent");
        }
      } else {
        setConnectionQuality("offline");
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      iframeRef.current?.parentElement?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const getQualityColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "bg-green-500";
      case "good":
        return "bg-yellow-500";
      case "poor":
        return "bg-orange-500";
      case "offline":
        return "bg-red-500";
    }
  };

  const getQualityText = () => {
    switch (connectionQuality) {
      case "excellent":
        return "Connexion excellente";
      case "good":
        return "Connexion stable";
      case "poor":
        return "Connexion faible";
      case "offline":
        return "Hors ligne";
    }
  };

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case "excellent":
      case "good":
        return <CheckCircle2 className="w-4 h-4" />;
      case "poor":
        return <AlertTriangle className="w-4 h-4" />;
      case "offline":
        return <WifiOff className="w-4 h-4" />;
    }
  };

  const constructDailyUrl = () => {
    const url = new URL(roomUrl);
    url.searchParams.set("userName", displayName);
    url.searchParams.set("embed", "true");
    return url.toString();
  };

  return (
    <div className={`relative w-full h-full bg-[#1A1A1A] rounded-xl overflow-hidden ${className}`}>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#1A1A1A] flex flex-col items-center justify-center"
          >
            <div className="mb-6">
              <Loader2 className="w-12 h-12 text-[#A68B6F] animate-spin" />
            </div>
            <p className="text-white text-lg font-medium mb-2">Connexion en cours</p>
            <p className="text-white/60 text-sm">Préparation de la salle de consultation</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Daily.co iframe */}
      <iframe
        ref={iframeRef}
        src={constructDailyUrl()}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="w-full h-full border-0"
        title="M.O.N.A Consultation Vidéo"
      />

      {/* Connection Quality Indicator */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 z-40"
        >
          <button
            onClick={() => setShowQualityInfo(!showQualityInfo)}
            className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${getQualityColor()} ${connectionQuality !== "offline" ? "animate-pulse" : ""}`}></div>
            <span className="text-white text-xs font-medium">{getQualityText()}</span>
          </button>

          {/* Quality Details Popup */}
          <AnimatePresence>
            {showQualityInfo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl p-4 border border-black/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  {getQualityIcon()}
                  <h4 className="font-semibold text-sm text-[#1A1A1A]">Qualité de connexion</h4>
                </div>
                <div className="space-y-2 text-xs text-[#1A1A1A]/70">
                  <div className="flex justify-between">
                    <span>État</span>
                    <span className="font-medium text-[#1A1A1A]">{getQualityText()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Type</span>
                    <span className="font-medium text-[#1A1A1A]">
                      {navigator.onLine ? "En ligne" : "Hors ligne"}
                    </span>
                  </div>
                  {connectionQuality === "poor" && (
                    <div className="mt-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
                      <p className="text-orange-800 text-xs">
                        Connexion faible détectée. La qualité vidéo peut être réduite.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Fullscreen Toggle */}
      {showControls && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-40 p-2.5 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/70 transition-colors"
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Maximize2 className="w-5 h-5 text-white" />
          )}
        </motion.button>
      )}

      {/* M.O.N.A Branding Watermark */}
      <div className="absolute bottom-4 right-4 z-40 opacity-30 hover:opacity-60 transition-opacity pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full">
          <div className="w-1.5 h-1.5 bg-[#A68B6F] rounded-full"></div>
          <span className="text-white text-xs font-medium tracking-wider">M.O.N.A</span>
        </div>
      </div>
    </div>
  );
}
