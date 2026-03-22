import { useState, useEffect } from "react";
import NavigationBar from "@/app/components/NavigationBar";
import FooterSection from "@/app/components/FooterSection";
import { 
  BarChart3, Shield, TrendingUp, Users, Bell, Download, 
  DollarSign, Globe, Plus, Edit2, Trash2, UserPlus 
} from "lucide-react";
import { formatCurrency, CurrencyCode } from "@/app/utils/currency";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export default function DashboardRHPage() {
  // Note: Dans un vrai scénario, l'entrepriseId viendrait de l'authentification
  const [entrepriseId] = useState("ent_demo_001"); 
  
  const [stats, setStats] = useState<any>(null);
  const [employes, setEmployes] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [santeGlobale, setSanteGlobale] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEmployeModal, setShowEmployeModal] = useState(false);
  const [selectedEmploye, setSelectedEmploye] = useState<any>(null);

  // Charger les données
  useEffect(() => {
    loadAllData();
  }, [entrepriseId]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadEmployes(),
        loadAnalytics(),
        loadSanteGlobale()
      ]);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/stats`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Erreur chargement stats:", error);
    }
  };

  const loadEmployes = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/employes`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setEmployes(data.employes || []);
    } catch (error) {
      console.error("Erreur chargement employés:", error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/analytics`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Erreur chargement analytics:", error);
    }
  };

  const loadSanteGlobale = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/sante-globale`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = await response.json();
      setSanteGlobale(data);
    } catch (error) {
      console.error("Erreur chargement santé globale:", error);
    }
  };

  const ajouterEmploye = async (employeData: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/employes`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(employeData)
        }
      );
      
      if (response.ok) {
        await loadEmployes();
        await loadStats();
        setShowEmployeModal(false);
      }
    } catch (error) {
      console.error("Erreur ajout employé:", error);
    }
  };

  const modifierEmploye = async (employeId: string, updates: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/employes/${employeId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );
      
      if (response.ok) {
        await loadEmployes();
        setSelectedEmploye(null);
      }
    } catch (error) {
      console.error("Erreur modification employé:", error);
    }
  };

  const desactiverEmploye = async (employeId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir désactiver cet employé ?")) return;
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/dashboard-entreprise/${entrepriseId}/employes/${employeId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        await loadEmployes();
        await loadStats();
      }
    } catch (error) {
      console.error("Erreur désactivation employé:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero avec statistiques */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-beige/10 to-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-serif text-anthracite mb-6">
              Dashboard RH <span className="text-terracotta">Entreprise</span>
            </h1>
            <p className="text-xl text-muted-foreground font-sans max-w-3xl mx-auto">
              Gérez le bien-être de vos équipes avec des données en temps réel
            </p>
          </div>

          {/* Statistiques principales */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 border border-beige/30 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-terracotta" />
                  <span className="text-sm text-muted-foreground">Employés</span>
                </div>
                <div className="text-3xl font-bold text-anthracite">{stats.totalEmployes}</div>
                <div className="text-sm text-green-600 mt-1">
                  {stats.employesActifs} actifs
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-beige/30 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 text-gold" />
                  <span className="text-sm text-muted-foreground">Engagement</span>
                </div>
                <div className="text-3xl font-bold text-anthracite">{stats.tauxEngagement}%</div>
                <div className="text-sm text-muted-foreground mt-1">Taux global</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-beige/30 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-8 h-8 text-terracotta" />
                  <span className="text-sm text-muted-foreground">Consultations</span>
                </div>
                <div className="text-3xl font-bold text-anthracite">{stats.consultationsMoisEnCours}</div>
                <div className="text-sm text-muted-foreground mt-1">Ce mois-ci</div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-beige/30 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-gold" />
                  <span className="text-sm text-muted-foreground">Crédits</span>
                </div>
                <div className="text-3xl font-bold text-anthracite">{stats.creditsRestants}</div>
                <div className="text-sm text-muted-foreground mt-1">Disponibles</div>
              </div>
            </div>
          )}

          {/* Santé mentale globale */}
          {santeGlobale && (
            <div className="bg-white rounded-2xl p-8 border border-beige/30 shadow-lg mb-12">
              <h2 className="text-2xl font-serif text-anthracite mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 text-terracotta" />
                Santé Mentale Globale (Anonymisé)
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold text-terracotta mb-2">
                      {santeGlobale.scoreMoyen}
                    </div>
                    <div className="text-muted-foreground">Score moyen global</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {santeGlobale.totalEvaluations} évaluations
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-anthracite mb-4">Distribution</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-600">Excellent (80+)</span>
                        <span className="font-semibold">{santeGlobale.distribution.excellent}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(santeGlobale.distribution.excellent / santeGlobale.totalEvaluations) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-600">Bon (60-79)</span>
                        <span className="font-semibold">{santeGlobale.distribution.bon}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(santeGlobale.distribution.bon / santeGlobale.totalEvaluations) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-yellow-600">Moyen (40-59)</span>
                        <span className="font-semibold">{santeGlobale.distribution.moyen}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${(santeGlobale.distribution.moyen / santeGlobale.totalEvaluations) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-600">Faible (&lt;40)</span>
                        <span className="font-semibold">{santeGlobale.distribution.faible}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full" 
                          style={{ width: `${(santeGlobale.distribution.faible / santeGlobale.totalEvaluations) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Gestion des employés */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif text-anthracite">Employés</h2>
            <button
              onClick={() => setShowEmployeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition"
            >
              <UserPlus className="w-4 h-4" />
              Ajouter un employé
            </button>
          </div>

          <div className="bg-white rounded-xl border border-beige/30 overflow-hidden">
            <table className="w-full">
              <thead className="bg-beige/10">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Département</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Consultations</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-anthracite">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/20">
                {employes.map((employe) => (
                  <tr key={employe.id} className="hover:bg-beige/5 transition">
                    <td className="px-6 py-4 text-sm text-anthracite">
                      {employe.nom} {employe.prenom}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{employe.email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{employe.departement}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        employe.statut === 'actif' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {employe.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {employe.nombreConsultations || 0}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEmploye(employe)}
                          className="p-2 hover:bg-beige/20 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4 text-gold" />
                        </button>
                        <button
                          onClick={() => desactiverEmploye(employe.id)}
                          className="p-2 hover:bg-beige/20 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {employes.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                Aucun employé enregistré. Cliquez sur "Ajouter un employé" pour commencer.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analytics */}
      {analytics && (
        <section className="py-16 bg-beige/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-serif text-anthracite mb-8">Analytics</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Consultations par mois */}
              <div className="bg-white rounded-xl p-6 border border-beige/30">
                <h3 className="text-lg font-semibold text-anthracite mb-4">
                  Consultations (6 derniers mois)
                </h3>
                <div className="space-y-3">
                  {analytics.consultationsParMois?.map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.mois}</span>
                        <span className="font-semibold">{item.total}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-terracotta h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(item.total * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top services */}
              <div className="bg-white rounded-xl p-6 border border-beige/30">
                <h3 className="text-lg font-semibold text-anthracite mb-4">
                  Services les plus utilisés
                </h3>
                <div className="space-y-3">
                  {analytics.consultationsParService?.map((item: any, idx: number) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{item.service}</span>
                        <span className="font-semibold">{item.total}</span>
                      </div>
                      <div className="w-full bg-beige/20 rounded-full h-2">
                        <div 
                          className="bg-gold h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(item.total * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <FooterSection />

      {/* Modal ajout employé */}
      {showEmployeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-serif text-anthracite mb-6">Ajouter un employé</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              ajouterEmploye({
                nom: formData.get('nom'),
                prenom: formData.get('prenom'),
                email: formData.get('email'),
                departement: formData.get('departement'),
              });
            }}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  required
                  className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  required
                  className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
                <input
                  type="text"
                  name="departement"
                  placeholder="Département"
                  required
                  className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEmployeModal(false)}
                  className="flex-1 px-4 py-2 border border-beige/30 text-anthracite rounded-lg hover:bg-beige/10 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
