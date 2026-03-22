import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  LayoutDashboard,
  BarChart3,
  Settings,
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface Entreprise {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  secteur?: string;
  nombreEmployes: number;
  credits: number;
  statut: string;
  dateInscription: string;
}

export default function AdminEntreprisesPage() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEntreprises();
  }, []);

  const loadEntreprises = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/entreprises`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
        }
      );
      const data = await response.json();
      setEntreprises(data.entreprises || []);
    } catch (error) {
      console.error("Erreur chargement entreprises:", error);
    } finally {
      setLoading(false);
    }
  };

  const ajouterEntreprise = async (entrepriseData: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/entreprises`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(entrepriseData)
        }
      );
      
      if (response.ok) {
        await loadEntreprises();
        setShowModal(false);
      } else {
        alert("Erreur lors de l'ajout de l'entreprise");
      }
    } catch (error) {
      console.error("Erreur ajout entreprise:", error);
      alert("Erreur lors de l'ajout de l'entreprise");
    }
  };

  const modifierEntreprise = async (entrepriseId: string, updates: any) => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/entreprises/${entrepriseId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        }
      );
      
      if (response.ok) {
        await loadEntreprises();
        setSelectedEntreprise(null);
      } else {
        alert("Erreur lors de la modification de l'entreprise");
      }
    } catch (error) {
      console.error("Erreur modification entreprise:", error);
      alert("Erreur lors de la modification de l'entreprise");
    }
  };

  const supprimerEntreprise = async (entrepriseId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ? Cette action est irréversible.")) {
      return;
    }
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/entreprises/${entrepriseId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        await loadEntreprises();
      } else {
        alert("Erreur lors de la suppression de l'entreprise");
      }
    } catch (error) {
      console.error("Erreur suppression entreprise:", error);
      alert("Erreur lors de la suppression de l'entreprise");
    }
  };

  const filteredEntreprises = entreprises.filter(e => 
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcul des statistiques
  const totalEmployes = entreprises.reduce((sum, e) => sum + (e.nombreEmployes || 0), 0);
  const totalCredits = entreprises.reduce((sum, e) => sum + (e.credits || 0), 0);
  const entreprisesActives = entreprises.filter(e => e.statut === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-terracotta border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des entreprises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-beige/5 to-white pb-12">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-beige/30 px-8 py-6 sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif text-anthracite mb-2">
              Gestion des Entreprises
            </h1>
            <p className="text-muted-foreground">
              {entreprises.length} entreprise{entreprises.length > 1 ? 's' : ''} partenaire{entreprises.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition"
          >
            <Plus className="w-4 h-4" />
            Nouvelle entreprise
          </button>
        </div>
      </div>

      <div className="px-8 pt-8 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-beige/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-terracotta" />
              </div>
            </div>
            <div className="text-3xl font-bold text-anthracite mb-1">
              {entreprisesActives}
            </div>
            <div className="text-sm text-muted-foreground">Entreprises actives</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-beige/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-gold" />
              </div>
            </div>
            <div className="text-3xl font-bold text-anthracite mb-1">
              {totalEmployes}
            </div>
            <div className="text-sm text-muted-foreground">Employés totaux</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-beige/30">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-terracotta/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-terracotta" />
              </div>
            </div>
            <div className="text-3xl font-bold text-anthracite mb-1">
              {totalCredits}
            </div>
            <div className="text-sm text-muted-foreground">Crédits totaux</div>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl p-4 border border-beige/30">
          <input
            type="text"
            placeholder="Rechercher une entreprise..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* Tableau des entreprises */}
        <div className="bg-white rounded-xl border border-beige/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Entreprise
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Secteur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Employés
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Crédits
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-anthracite">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige/20">
                {filteredEntreprises.map((entreprise) => (
                  <tr key={entreprise.id} className="hover:bg-beige/5 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-anthracite">
                          {entreprise.nom}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Depuis {new Date(entreprise.dateInscription).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-anthracite">{entreprise.email}</div>
                        <div className="text-muted-foreground">{entreprise.telephone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {entreprise.secteur || 'Non spécifié'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-anthracite">
                        {entreprise.nombreEmployes || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gold">
                        {entreprise.credits || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        entreprise.statut === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {entreprise.statut === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedEntreprise(entreprise)}
                          className="p-2 hover:bg-beige/20 rounded-lg transition"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4 text-gold" />
                        </button>
                        <button
                          onClick={() => supprimerEntreprise(entreprise.id)}
                          className="p-2 hover:bg-beige/20 rounded-lg transition"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEntreprises.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                {searchTerm ? (
                  <>Aucune entreprise ne correspond à votre recherche</>
                ) : (
                  <>Aucune entreprise enregistrée. Cliquez sur "Nouvelle entreprise" pour commencer.</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal ajout/modification entreprise */}
      {(showModal || selectedEntreprise) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-serif text-anthracite mb-6">
              {selectedEntreprise ? 'Modifier l\'entreprise' : 'Nouvelle entreprise'}
            </h3>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = {
                nom: formData.get('nom'),
                email: formData.get('email'),
                telephone: formData.get('telephone'),
                secteur: formData.get('secteur'),
                credits: parseInt(formData.get('credits') as string || '100'),
              };
              
              if (selectedEntreprise) {
                modifierEntreprise(selectedEntreprise.id, data);
              } else {
                ajouterEntreprise(data);
              }
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    defaultValue={selectedEntreprise?.nom}
                    required
                    className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedEntreprise?.email}
                    required
                    className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    defaultValue={selectedEntreprise?.telephone}
                    className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Secteur d'activité
                  </label>
                  <input
                    type="text"
                    name="secteur"
                    defaultValue={selectedEntreprise?.secteur}
                    className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-2">
                    Crédits initiaux
                  </label>
                  <input
                    type="number"
                    name="credits"
                    defaultValue={selectedEntreprise?.credits || 100}
                    min="0"
                    className="w-full px-4 py-2 border border-beige/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedEntreprise(null);
                  }}
                  className="flex-1 px-4 py-2 border border-beige/30 text-anthracite rounded-lg hover:bg-beige/10 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition"
                >
                  {selectedEntreprise ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Navigation PWA Bottom */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#D4C5B9] safe-area-inset-bottom z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button 
              onClick={() => window.location.href = '/admin/dashboard'}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-xs">Dashboard</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/users'}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs">Utilisateurs</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/analytics'}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <span className="text-xs">Analytics</span>
            </button>
            <button 
              onClick={() => window.location.href = '/admin/settings'}
              className="flex flex-col items-center gap-1 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs">Paramètres</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="h-20"></div>
    </div>
  );
}