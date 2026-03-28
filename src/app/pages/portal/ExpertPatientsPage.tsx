import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Search, Calendar, ChevronRight,
  Plus, X, User, Mail, Phone, MapPin, AlertCircle, Loader2
} from "lucide-react";
import { projectId } from "/utils/supabase/info";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import ExpertLayout from "@/app/components/ExpertLayout";

interface NewPatientForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  notes: string;
}

const emptyForm: NewPatientForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  country: "Côte d'Ivoire",
  notes: "",
};

export default function ExpertPatientsPage() {
  const { accessToken } = useExpertAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<NewPatientForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const getToken = () => accessToken || localStorage.getItem("expert_access_token");

  useEffect(() => { loadPatients(); }, [accessToken]);

  const loadPatients = async () => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/list`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error("Erreur chargement patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setFormError("Le prénom et le nom sont obligatoires.");
      return;
    }
    if (!form.email.trim() && !form.phone.trim()) {
      setFormError("Un email ou un numéro de téléphone est requis.");
      return;
    }

    const token = getToken();
    if (!token) return;

    setSaving(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/patients/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            dateOfBirth: form.dateOfBirth,
            gender: form.gender,
            address: form.address.trim(),
            city: form.city.trim(),
            country: form.country,
            notes: form.notes.trim(),
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Ajoute le nouveau patient en tête de liste
        const newPatient = data.data || {
          id: Date.now().toString(),
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: form.phone,
          consultationsCount: 0,
        };
        setPatients([newPatient, ...patients]);
        setShowModal(false);
        setForm(emptyForm);
      } else {
        const err = await response.json();
        setFormError(err.error || "Erreur lors de la création du patient.");
      }
    } catch (error) {
      setFormError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <ExpertLayout title="Mes patients">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#1A1A1A]/60">Chargement...</p>
          </div>
        </div>
      </ExpertLayout>
    );
  }

  return (
    <ExpertLayout title="Mes patients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Titre + bouton ajouter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#1A1A1A]/60">
            {patients.length} patient{patients.length > 1 ? "s" : ""} au total
          </p>
          <button
            onClick={() => { setShowModal(true); setForm(emptyForm); setFormError(""); }}
            className="flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2.5 rounded-full hover:bg-[#2A2A2A] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un patient
          </button>
        </div>

        {/* Recherche */}
        <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9] mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste patients */}
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
            <Users className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">
              {searchQuery ? "Aucun patient trouvé" : "Aucun patient"}
            </h3>
            <p className="text-sm text-[#1A1A1A]/60 mb-6">
              {searchQuery
                ? "Essayez une autre recherche"
                : "Ajoutez votre premier patient ou attendez une réservation"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-[#1A1A1A] text-white px-6 py-3 rounded-full hover:bg-[#2A2A2A] transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Ajouter un patient
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/expert/patients/${patient.id}`}
                  className="flex items-center justify-between p-6 hover:bg-[#F5F1ED] transition-colors border-b border-[#D4C5B9] last:border-b-0 group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#A68B6F] to-[#C1694F] rounded-full flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                      {patient.name?.charAt(0) || "P"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[#1A1A1A] mb-1 truncate">{patient.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-[#1A1A1A]/60">
                        {patient.email && <span className="truncate">{patient.email}</span>}
                        {patient.phone && <span className="hidden sm:inline">{patient.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center gap-2 text-sm text-[#1A1A1A] mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>{patient.consultationsCount || 0} consultation{patient.consultationsCount > 1 ? "s" : ""}</span>
                      </div>
                      {patient.lastConsultation && (
                        <p className="text-xs text-[#1A1A1A]/60">
                          Dernière : {new Date(patient.lastConsultation).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#1A1A1A]/40 group-hover:text-[#A68B6F] transition-colors flex-shrink-0" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal — Ajouter un patient */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header modal */}
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between rounded-t-3xl z-10">
                <div>
                  <h2 className="text-2xl font-serif text-[#1A1A1A]">Nouveau patient</h2>
                  <p className="text-sm text-[#1A1A1A]/60 mt-1">Ajoutez un patient manuellement</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1A1A1A]" />
                </button>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleAddPatient} className="p-6 space-y-6">

                {formError && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-900">{formError}</p>
                  </div>
                )}

                {/* Identité */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Identité</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Prénom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="text"
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Amara"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Nom <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="text"
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Koné"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Date de naissance</label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Genre</label>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      >
                        <option value="">Non précisé</option>
                        <option value="female">Femme</option>
                        <option value="male">Homme</option>
                        <option value="other">Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="patient@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="+225 07 00 00 00 00"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Localisation */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] uppercase tracking-wider mb-4">Localisation</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Ville</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                        <input
                          type="text"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                          placeholder="Abidjan"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Pays</label>
                      <select
                        value={form.country}
                        onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                      >
                        <option>Côte d'Ivoire</option>
                        <option>Sénégal</option>
                        <option>République Démocratique du Congo</option>
                        <option>Congo-Brazzaville</option>
                        <option>Cameroun</option>
                        <option>Mali</option>
                        <option>Burkina Faso</option>
                        <option>Gabon</option>
                        <option>Guinée</option>
                        <option>Togo</option>
                        <option>Bénin</option>
                        <option>Madagascar</option>
                        <option>Canada</option>
                        <option>France</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Notes initiales</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-[#D4C5B9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A68B6F] resize-none"
                    placeholder="Motif de consultation, antécédents, remarques..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-[#D4C5B9] text-[#1A1A1A] rounded-full hover:bg-[#F5F1ED] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Créer le patient
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}
