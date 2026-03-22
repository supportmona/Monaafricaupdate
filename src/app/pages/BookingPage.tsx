import { useState, useEffect } from "react";
import { Calendar, Clock, Video, MapPin, User, Check, X, Loader2, ChevronRight, ArrowLeft } from "lucide-react";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { useMemberAuth } from "@/app/contexts/MemberAuthContext";
import { useNavigate } from "react-router";

interface Expert {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  experience?: number;
  languages?: string[];
  consultationFee?: number;
  teleconsultationFee?: number;
  avatarUrl?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

export default function BookingPage() {
  const { user } = useMemberAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"online" | "in-person">("online");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  
  // Informations du membre - pré-remplies si connecté
  const [memberInfo, setMemberInfo] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  // Disponibilités des 7 prochains jours
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    loadExperts();
    generateAvailableDates();
    
    // Pré-remplir les informations si l'utilisateur est connecté
    if (user) {
      setMemberInfo(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const loadExperts = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/list`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setExperts(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement experts:", error);
    }
  };

  const generateAvailableDates = () => {
    const dates: Date[] = [];
    for (let i = 1; i <= 14; i++) {
      const date = addDays(new Date(), i);
      // Exclure les dimanches
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    setAvailableDates(dates);
  };

  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:00`,
        available: Math.random() > 0.3, // Simulation de disponibilité
      });
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:30`,
        available: Math.random() > 0.3,
      });
    }

    setTimeSlots(slots);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    generateTimeSlots(date);
  };

  const handleBooking = async () => {
    if (!selectedExpert || !selectedDate || !selectedTime || !memberInfo.name || !memberInfo.email) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setBooking(true);

    try {
      const token = localStorage.getItem("mona_member_token");
      
      const appointmentData = {
        expertId: selectedExpert.id,
        date: format(selectedDate, "yyyy-MM-dd"),
        time: selectedTime,
        consultationType: consultationType,
        name: memberInfo.name,
        email: memberInfo.email,
        phone: memberInfo.phone,
        reason: memberInfo.reason,
      };

      // Utiliser la nouvelle route member/bookings si connecté
      const endpoint = token 
        ? `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/member/bookings`
        : `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/appointments`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      };
      
      if (token) {
        headers["X-User-Token"] = token;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        setStep(4); // Page de confirmation
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la réservation");
      }
    } catch (error) {
      console.error("Erreur réservation:", error);
      alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-anthracite hover:text-terracotta transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour</span>
        </button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-serif ${
                    step >= s
                      ? "bg-terracotta text-white"
                      : "bg-beige/30 text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-full h-1 mx-2 ${
                      step > s ? "bg-terracotta" : "bg-beige/30"
                    }`}
                    style={{ minWidth: "100px" }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Choisir un expert</span>
            <span>Date & heure</span>
            <span>Vos informations</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl border border-beige/30 p-6 md:p-8">
          {/* Étape 1 : Sélection de l'expert */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-serif text-anthracite mb-6">
                Choisissez votre expert
              </h2>

              {experts.length === 0 ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-terracotta mx-auto mb-4" />
                  <p className="text-muted-foreground">Chargement des experts...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {experts.map((expert) => (
                    <button
                      key={expert.id}
                      onClick={() => {
                        setSelectedExpert(expert);
                        setStep(2);
                      }}
                      className="w-full p-6 border border-beige/30 rounded-lg hover:border-terracotta transition-colors text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta font-serif text-xl border border-terracotta/20 flex-shrink-0">
                          {expert.firstName?.[0]}{expert.lastName?.[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-anthracite text-lg">
                            Dr. {expert.firstName} {expert.lastName}
                          </h3>
                          <p className="text-muted-foreground mb-2">{expert.specialty}</p>
                          {expert.experience && (
                            <p className="text-sm text-muted-foreground">
                              {expert.experience} ans d'expérience
                            </p>
                          )}
                          {expert.languages && Array.isArray(expert.languages) && expert.languages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {expert.languages.map((lang, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-beige/30 text-anthracite rounded text-xs"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Étape 2 : Sélection date et heure */}
          {step === 2 && selectedExpert && (
            <div>
              <button
                onClick={() => setStep(1)}
                className="text-terracotta hover:underline mb-4 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>

              <h2 className="text-2xl font-serif text-anthracite mb-2">
                Choisissez une date et une heure
              </h2>
              <p className="text-muted-foreground mb-6">
                Avec Dr. {selectedExpert.firstName} {selectedExpert.lastName}
              </p>

              {/* Type de consultation */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-anthracite mb-3">
                  Type de consultation
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setConsultationType("online")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      consultationType === "online"
                        ? "border-terracotta bg-terracotta/5"
                        : "border-beige/30 hover:border-beige"
                    }`}
                  >
                    <Video className="w-6 h-6 text-terracotta mx-auto mb-2" />
                    <p className="font-medium text-anthracite">Téléconsultation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedExpert.teleconsultationFee
                        ? `${selectedExpert.teleconsultationFee} FCFA`
                        : "20,000 FCFA"}
                    </p>
                  </button>

                  <button
                    onClick={() => setConsultationType("in-person")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      consultationType === "in-person"
                        ? "border-terracotta bg-terracotta/5"
                        : "border-beige/30 hover:border-beige"
                    }`}
                  >
                    <MapPin className="w-6 h-6 text-terracotta mx-auto mb-2" />
                    <p className="font-medium text-anthracite">Présentiel</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedExpert.consultationFee
                        ? `${selectedExpert.consultationFee} FCFA`
                        : "25,000 FCFA"}
                    </p>
                  </button>
                </div>
              </div>

              {/* Sélection de la date */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-anthracite mb-3">
                  Choisissez une date
                </label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                  {availableDates.slice(0, 14).map((date, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleDateSelect(date)}
                      className={`p-3 border-2 rounded-lg transition-colors ${
                        selectedDate && isSameDay(selectedDate, date)
                          ? "border-terracotta bg-terracotta/5"
                          : "border-beige/30 hover:border-beige"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground">
                        {format(date, "EEE", { locale: fr })}
                      </p>
                      <p className="text-lg font-serif text-anthracite">
                        {format(date, "d")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(date, "MMM", { locale: fr })}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection de l'heure */}
              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-anthracite mb-3">
                    Choisissez une heure
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 border-2 rounded-lg transition-colors ${
                          selectedTime === slot.time
                            ? "border-terracotta bg-terracotta text-white"
                            : slot.available
                            ? "border-beige/30 hover:border-beige"
                            : "border-beige/30 bg-beige/10 text-muted-foreground cursor-not-allowed"
                        }`}
                      >
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <p className="text-sm">{slot.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedDate && selectedTime && (
                <button
                  onClick={() => setStep(3)}
                  className="w-full px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
                >
                  Continuer
                </button>
              )}
            </div>
          )}

          {/* Étape 3 : Informations du membre */}
          {step === 3 && (
            <div>
              <button
                onClick={() => setStep(2)}
                className="text-terracotta hover:underline mb-4 flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>

              <h2 className="text-2xl font-serif text-anthracite mb-6">
                Vos informations
              </h2>

              {/* Récapitulatif */}
              <div className="bg-beige/20 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-anthracite mb-3">Récapitulatif</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-terracotta" />
                    <span>
                      Dr. {selectedExpert?.firstName} {selectedExpert?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-terracotta" />
                    <span>{selectedDate && format(selectedDate, "PPP", { locale: fr })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-terracotta" />
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {consultationType === "online" ? (
                      <Video className="w-4 h-4 text-terracotta" />
                    ) : (
                      <MapPin className="w-4 h-4 text-terracotta" />
                    )}
                    <span>
                      {consultationType === "online" ? "Téléconsultation" : "Présentiel"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    value={memberInfo.name}
                    onChange={(e) => setMemberInfo({ ...memberInfo, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="Votre nom complet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={memberInfo.email}
                    onChange={(e) => setMemberInfo({ ...memberInfo, email: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={memberInfo.phone}
                    onChange={(e) => setMemberInfo({ ...memberInfo, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="+243 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Motif de consultation (optionnel)
                  </label>
                  <textarea
                    value={memberInfo.reason}
                    onChange={(e) => setMemberInfo({ ...memberInfo, reason: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold resize-none"
                    placeholder="Décrivez brièvement la raison de votre consultation..."
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Réservation en cours...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Confirmer la réservation
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Étape 4 : Confirmation */}
          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif text-anthracite mb-4">
                Réservation confirmée !
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Vous recevrez un email de confirmation avec tous les détails de votre consultation
                à l'adresse <strong>{memberInfo.email}</strong>
              </p>

              <div className="bg-beige/20 rounded-lg p-6 max-w-md mx-auto mb-6">
                <h3 className="font-medium text-anthracite mb-4">Détails de votre rendez-vous</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Expert</p>
                      <p className="font-medium text-anthracite">
                        Dr. {selectedExpert?.firstName} {selectedExpert?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium text-anthracite">
                        {selectedDate && format(selectedDate, "PPP", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Heure</p>
                      <p className="font-medium text-anthracite">{selectedTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/matching-quiz")}
                className="px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors"
              >
                Continuer vers le quiz de matching
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}