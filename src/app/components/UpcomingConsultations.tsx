import { format, parseISO, isToday, isTomorrow, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, Video, AlertCircle } from 'lucide-react';
import { Link } from 'react-router';

interface Consultation {
  id: string;
  expertName: string;
  expertTitle: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  roomUrl?: string;
}

interface UpcomingConsultationsProps {
  consultations: Consultation[];
}

export function UpcomingConsultations({ consultations }: UpcomingConsultationsProps) {
  // Filtrer et trier les consultations à venir
  const upcomingConsultations = consultations
    .filter(c => {
      if (c.status === 'cancelled' || c.status === 'completed') return false;
      try {
        const consultationDateTime = parseISO(`${c.date}T${c.time}`);
        return !isPast(consultationDateTime);
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`);
      const dateB = parseISO(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });

  const getDateLabel = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      if (isToday(date)) return "Aujourd'hui";
      if (isTomorrow(date)) return 'Demain';
      return format(date, 'EEEE d MMMM', { locale: fr });
    } catch {
      return dateStr;
    }
  };

  const getTimeUntil = (dateStr: string, timeStr: string) => {
    try {
      const consultationDateTime = parseISO(`${dateStr}T${timeStr}`);
      const now = new Date();
      const diffMs = consultationDateTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      
      if (diffMinutes < 0) return 'Passée';
      if (diffMinutes < 5) return 'Commence maintenant';
      if (diffMinutes < 60) return `Dans ${diffMinutes} min`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `Dans ${diffHours}h`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `Dans ${diffDays}j`;
    } catch {
      return '';
    }
  };

  const isUrgent = (dateStr: string, timeStr: string) => {
    try {
      const consultationDateTime = parseISO(`${dateStr}T${timeStr}`);
      const now = new Date();
      const diffMinutes = Math.floor((consultationDateTime.getTime() - now.getTime()) / 60000);
      return diffMinutes <= 15 && diffMinutes > 0;
    } catch {
      return false;
    }
  };

  if (upcomingConsultations.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-black/5 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Consultations à venir</h2>
        <Link 
          to="/member/consultations" 
          className="text-sm font-medium text-black/60 hover:text-black transition-colors"
        >
          Voir tout
        </Link>
      </div>

      <div className="space-y-4">
        {upcomingConsultations.slice(0, 3).map((consultation) => {
          const urgent = isUrgent(consultation.date, consultation.time);
          
          return (
            <div
              key={consultation.id}
              className={`p-4 rounded-xl border transition-all hover:shadow-md ${
                urgent
                  ? 'border-[#C67B5C] bg-[#C67B5C]/5'
                  : 'border-black/5 hover:border-black/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-black mb-1">{consultation.expertName}</h3>
                  <p className="text-sm text-black/60">{consultation.expertTitle}</p>
                </div>
                
                {urgent && (
                  <div className="flex items-center gap-1 text-xs font-medium text-[#C67B5C] bg-[#C67B5C]/10 px-3 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    <span>Bientôt</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-black/60 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{getDateLabel(consultation.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{consultation.time}</span>
                </div>
                <span className="font-medium text-black/80">
                  {getTimeUntil(consultation.date, consultation.time)}
                </span>
              </div>

              <div className="flex gap-2">
                <Link
                  to={`/member/consultations/${consultation.id}`}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-medium transition-all ${
                    urgent
                      ? 'bg-[#C67B5C] text-white hover:bg-[#B16A4D]'
                      : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{urgent ? 'Rejoindre maintenant' : 'Rejoindre'}</span>
                </Link>
                
                <Link
                  to={`/member/consultations/${consultation.id}/details`}
                  className="px-4 py-2.5 rounded-full font-medium bg-[#F5F1EB] text-black hover:bg-[#E8E1D5] transition-colors"
                >
                  Détails
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}