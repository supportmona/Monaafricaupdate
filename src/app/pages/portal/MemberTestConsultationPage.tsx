import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useMemberAuth } from '@/app/contexts/MemberAuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { Link, useNavigate } from 'react-router';
import MemberHeader from '@/app/components/MemberHeader';

export default function MemberTestConsultationPage() {
  const { user } = useMemberAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    expertId: 'expert_test_001',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    duration: 60,
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: '+243 900 000 000',
    reason: 'Test consultation'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; appointmentId?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const token = localStorage.getItem('mona_member_token');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/webhooks/cal/test`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            ...(token && { 'X-User-Token': token })
          },
          body: JSON.stringify({
            userId: user?.id || `guest_${Date.now()}`,
            ...formData
          })
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          success: true,
          message: 'Consultation créée avec succès !',
          appointmentId: data.appointment?.id
        });
        
        // Rediriger vers les consultations après 2 secondes
        setTimeout(() => {
          navigate('/member/consultations');
        }, 2000);
      } else {
        setResult({
          success: false,
          message: data.error || 'Erreur lors de la création'
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Erreur réseau'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <MemberHeader title="Test - Créer une consultation" showBack />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-1">Page de test</p>
            <p className="text-blue-700">
              Cette page permet de créer manuellement une consultation pour tester le système.
              Les consultations réservées via Cal.com nécessitent une configuration webhook.
            </p>
          </div>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D4C5B9]"
        >
          <h2 className="text-2xl font-serif text-[#1A1A1A] mb-6">
            Créer une consultation de test
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expert ID */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                ID Expert
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="text"
                  value={formData.expertId}
                  onChange={(e) => setFormData({ ...formData, expertId: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  required
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  required
                />
              </div>
            </div>

            {/* Heure */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Heure
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  required
                />
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  required
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Téléphone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A68B6F]" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>
            </div>

            {/* Raison */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                Raison de la consultation
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#A68B6F]" />
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={3}
                  className="w-full pl-11 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                />
              </div>
            </div>

            {/* Résultat */}
            {result && (
              <div className={`p-4 rounded-xl flex items-start gap-3 ${
                result.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  <p className={`font-semibold mb-1 ${result.success ? 'text-green-900' : 'text-red-900'}`}>
                    {result.success ? 'Succès' : 'Erreur'}
                  </p>
                  <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                    {result.message}
                  </p>
                  {result.appointmentId && (
                    <p className="text-green-600 mt-1 font-mono text-xs">
                      ID: {result.appointmentId}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3 pt-4">
              <Link
                to="/member/consultations"
                className="flex-1 px-6 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full font-medium hover:bg-[#F5F1ED] transition-colors text-center"
              >
                Voir mes consultations
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#A68B6F] to-[#D4C5B9] text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Création...
                  </>
                ) : (
                  'Créer la consultation'
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Instructions Cal.com */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-[#D4C5B9]"
        >
          <h3 className="text-lg font-serif text-[#1A1A1A] mb-4">
            Configuration Cal.com Webhook
          </h3>
          <div className="space-y-3 text-sm text-[#1A1A1A]/70">
            <p>
              Pour synchroniser automatiquement les réservations Cal.com avec M.O.N.A :
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Allez sur Cal.com → Settings → Developer → Webhooks</li>
              <li>Créez un nouveau webhook</li>
              <li>URL du webhook :</li>
            </ol>
            <div className="bg-[#F5F1ED] p-3 rounded-lg font-mono text-xs break-all">
              https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/webhooks/cal
            </div>
            <ol start={4} className="list-decimal list-inside space-y-2 ml-2">
              <li>Sélectionnez les événements : BOOKING_CREATED, BOOKING_CANCELLED, BOOKING_RESCHEDULED</li>
              <li>Sauvegardez</li>
            </ol>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
