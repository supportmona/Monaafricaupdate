import { useState } from "react";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { 
  Upload,
  FileText,
  CheckCircle2,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Globe,
  Linkedin,
  Award,
  Send,
  AlertCircle
} from "lucide-react";

export default function ApplicationPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    profession: "",
    experience: "",
    diplomas: "",
    specialties: "",
    languages: "",
    availability: "",
    linkedin: "",
    motivation: "",
    licenseNumber: "", // Nouveau : numéro de licence professionnelle
  });

  const [files, setFiles] = useState({
    cv: null as File | null,
    diplomas: null as File | null,
    certifications: null as File | null,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({
        ...files,
        [fieldName]: e.target.files[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Convertir les fichiers en base64 pour stockage
      const filesData: any = {};
      
      if (files.cv) {
        filesData.cv = {
          name: files.cv.name,
          size: files.cv.size,
          type: files.cv.type,
          data: await fileToBase64(files.cv),
        };
      }
      
      if (files.diplomas) {
        filesData.diplomas = {
          name: files.diplomas.name,
          size: files.diplomas.size,
          type: files.diplomas.type,
          data: await fileToBase64(files.diplomas),
        };
      }
      
      if (files.certifications) {
        filesData.certifications = {
          name: files.certifications.name,
          size: files.certifications.size,
          type: files.certifications.type,
          data: await fileToBase64(files.certifications),
        };
      }

      // Log pour vérifier les fichiers avant envoi
      console.log("📎 Fichiers à envoyer:", {
        cv: filesData.cv ? `${filesData.cv.name} (${filesData.cv.size} bytes)` : "Aucun",
        diplomas: filesData.diplomas ? `${filesData.diplomas.name} (${filesData.diplomas.size} bytes)` : "Aucun",
        certifications: filesData.certifications ? `${filesData.certifications.name} (${filesData.certifications.size} bytes)` : "Aucun",
      });

      // Enregistrer la candidature dans le KV store
      const response = await fetch(`${serverUrl}/expert/application`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          files: filesData,
          status: "pending",
          submittedAt: new Date().toISOString(),
        }),
      });

      console.log("✅ Candidature envoyée avec succès, fichiers inclus:", Object.keys(filesData));

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi de la candidature");
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="flex items-center justify-center min-h-[80vh] px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-2xl"
          >
            <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-terracotta" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-anthracite mb-4">
              Candidature envoyée avec succès !
            </h1>
            <p className="text-lg text-muted-foreground font-sans mb-8">
              Merci pour votre intérêt à rejoindre M.O.N.A. Notre équipe clinique examinera votre dossier 
              et vous contactera sous 48h pour la suite du processus.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/carrieres"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 font-sans"
              >
                Retour aux carrières
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-300 font-sans"
              >
                Retour à l'accueil
              </a>
            </div>
          </motion.div>
        </div>
        <FooterSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 border border-terracotta/20 rounded-full mb-6"
          >
            <Briefcase className="w-4 h-4 text-terracotta" />
            <span className="text-sm text-terracotta font-sans">Candidature Expert</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4"
          >
            Postuler chez <span className="text-terracotta">M.O.N.A</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground font-sans max-w-2xl mx-auto"
          >
            Remplissez ce formulaire en 5 minutes. Nous examinerons votre candidature 
            et vous contacterons sous 48h.
          </motion.p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Informations personnelles */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige/30">
              <h2 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
                <User className="w-6 h-6 text-terracotta" />
                Informations personnelles
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Prénom <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                    placeholder="Votre prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Nom <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Email <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Téléphone <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Ville <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                    >
                      <option value="">Sélectionnez une ville</option>
                      <option value="Kinshasa">Kinshasa</option>
                      <option value="Dakar">Dakar</option>
                      <option value="Abidjan">Abidjan</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    LinkedIn
                  </label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Parcours professionnel */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige/30">
              <h2 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-terracotta" />
                Parcours professionnel
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Profession <span className="text-terracotta">*</span>
                  </label>
                  <select
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                  >
                    <option value="">Sélectionnez votre profession</option>
                    <option value="Psychologue">Psychologue</option>
                    <option value="Psychiatre">Psychiatre</option>
                    <option value="Psychothérapeute">Psychothérapeute</option>
                    <option value="Thérapeute">Thérapeute en santé mentale</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Années d'expérience <span className="text-terracotta">*</span>
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="0-3">0-3 ans</option>
                    <option value="3-5">3-5 ans</option>
                    <option value="5-10">5-10 ans</option>
                    <option value="10+">10+ ans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Diplômes et formations <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    name="diplomas"
                    value={formData.diplomas}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm resize-none"
                    placeholder="Ex: Master en Psychologie Clinique, Université de Kinshasa (2015)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Spécialités
                  </label>
                  <input
                    type="text"
                    name="specialties"
                    value={formData.specialties}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                    placeholder="Ex: TCC, EMDR, Thérapie de couple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Langues parlées <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                    placeholder="Ex: Français, Lingala, Anglais"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Disponibilité hebdomadaire <span className="text-terracotta">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm appearance-none bg-white"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="10h">10h / semaine</option>
                    <option value="20h">20h / semaine</option>
                    <option value="30h">30h / semaine</option>
                    <option value="temps-plein">Temps plein (35h+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Numéro de licence professionnelle <span className="text-terracotta">*</span>
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm"
                    placeholder="Ex: 123456"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige/30">
              <h2 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-terracotta" />
                Documents
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    CV <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, "cv")}
                      required
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-2">Format PDF, DOC ou DOCX (max 5MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Diplômes <span className="text-terracotta">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "diplomas")}
                      required
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-2">Format PDF, JPG ou PNG (max 5MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-sans text-anthracite mb-2">
                    Certifications (optionnel)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, "certifications")}
                      className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-terracotta/10 file:text-terracotta hover:file:bg-terracotta/20"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-sans mt-2">Format PDF, JPG ou PNG (max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Lettre de motivation */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-beige/30">
              <h2 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
                <Award className="w-6 h-6 text-terracotta" />
                Motivation
              </h2>
              
              <div>
                <label className="block text-sm font-sans text-anthracite mb-2">
                  Pourquoi souhaitez-vous rejoindre M.O.N.A ? <span className="text-terracotta">*</span>
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-beige/30 rounded-lg focus:outline-none focus:border-terracotta/50 font-sans text-sm resize-none"
                  placeholder="Parlez-nous de votre motivation à rejoindre M.O.N.A, de votre vision de la santé mentale en Afrique, et de ce que vous pouvez apporter à notre communauté..."
                />
                <p className="text-xs text-muted-foreground font-sans mt-2">Minimum 200 caractères</p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta text-white rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl font-sans"
              >
                <Send className="w-5 h-5" />
                <span>Envoyer ma candidature</span>
              </button>
              <a
                href="/carrieres"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-beige text-anthracite rounded-lg hover:bg-beige/10 transition-all duration-300 font-sans"
              >
                Retour
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 text-sm text-red-500 font-sans">
                <AlertCircle className="inline-block w-5 h-5 mr-2" />
                {error}
              </div>
            )}
          </form>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}