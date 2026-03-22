import { useState, useEffect } from "react";
import { Ticket, Plus, X, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface TicketMessage {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: string;
  isStaffReply: boolean;
}

interface TicketData {
  id: string;
  createdBy: string;
  createdByName: string;
  createdByRole: string;
  category: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

interface TicketWidgetProps {
  userId: string;
  userName: string;
  userRole: "member" | "expert" | "b2b";
}

export default function TicketWidget({ userId, userName, userRole }: TicketWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
  const [newTicket, setNewTicket] = useState({
    category: "technique" as const,
    subject: "",
    description: "",
    priority: "medium" as const,
  });
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTickets();
    }
  }, [isOpen]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/tickets/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTickets(data.data);
        }
      }
    } catch (error) {
      console.error("Erreur chargement tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/tickets/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            createdBy: userId,
            createdByName: userName,
            createdByRole: userRole,
            category: newTicket.category,
            subject: newTicket.subject,
            description: newTicket.description,
            priority: newTicket.priority,
          }),
        }
      );

      if (response.ok) {
        setShowNewTicket(false);
        setNewTicket({
          category: "technique",
          subject: "",
          description: "",
          priority: "medium",
        });
        await loadTickets();
      }
    } catch (error) {
      console.error("Erreur création ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/tickets/${selectedTicket.id}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            authorId: userId,
            authorName: userName,
            authorRole: userRole,
            content: replyMessage,
            isStaffReply: false,
          }),
        }
      );

      if (response.ok) {
        setReplyMessage("");
        await loadTickets();
        // Recharger le ticket sélectionné
        const updatedTicket = tickets.find((t) => t.id === selectedTicket.id);
        if (updatedTicket) {
          setSelectedTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error("Erreur envoi réponse:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      ouvert: { icon: AlertCircle, class: "bg-blue-100 text-blue-800", label: "Ouvert" },
      en_cours: { icon: Clock, class: "bg-amber-100 text-amber-800", label: "En cours" },
      resolu: { icon: CheckCircle2, class: "bg-green-100 text-green-800", label: "Résolu" },
      ferme: { icon: X, class: "bg-gray-100 text-gray-800", label: "Fermé" },
    };

    const badge = badges[status as keyof typeof badges] || badges.ouvert;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="fixed bottom-24 left-6 z-50">
      {/* Bouton flottant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Ticket className="w-6 h-6" />}
      </button>

      {/* Panneau tickets */}
      {isOpen && (
        <div className="absolute bottom-16 left-0 w-96 bg-white rounded-2xl shadow-2xl border border-border max-h-[600px] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-serif text-lg text-anthracite">Mes tickets</h3>
            <button
              onClick={() => setShowNewTicket(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-sans flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Nouveau
            </button>
          </div>

          {/* Nouveau ticket */}
          {showNewTicket ? (
            <div className="p-4 overflow-y-auto">
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-anthracite mb-1 font-sans">
                    Catégorie
                  </label>
                  <select
                    value={newTicket.category}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, category: e.target.value as any })
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans text-sm"
                    required
                  >
                    <option value="technique">Technique</option>
                    <option value="facturation">Facturation</option>
                    <option value="compte">Compte</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-1 font-sans">
                    Sujet
                  </label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, subject: e.target.value })
                    }
                    placeholder="Décrivez brièvement le problème"
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-anthracite mb-1 font-sans">
                    Description
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) =>
                      setNewTicket({ ...newTicket, description: e.target.value })
                    }
                    placeholder="Détails du problème..."
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans text-sm resize-none"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-2 border border-border text-anthracite rounded-lg hover:bg-gray-50 transition-colors font-sans text-sm"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-sans text-sm"
                  >
                    {loading ? "Envoi..." : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedTicket ? (
            /* Vue détail ticket */
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="p-4 border-b border-border">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-sm text-terracotta hover:underline mb-2 font-sans"
                >
                  ← Retour aux tickets
                </button>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-anthracite font-sans">
                    {selectedTicket.subject}
                  </h4>
                  {getStatusBadge(selectedTicket.status)}
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-sans">
                  {selectedTicket.description}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedTicket.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-lg p-3 ${
                      msg.isStaffReply
                        ? "bg-terracotta/10 border border-terracotta/20"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-anthracite font-sans">
                        {msg.authorName}
                      </p>
                      {msg.isStaffReply && (
                        <span className="px-2 py-0.5 bg-terracotta text-white text-xs rounded font-sans">
                          Staff
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-anthracite font-sans">{msg.content}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-sans">
                      {new Date(msg.timestamp).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>

              {selectedTicket.status !== "ferme" && (
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendReply()}
                      placeholder="Ajouter un message..."
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-sans"
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim() || loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm font-sans"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Liste tickets */
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground font-sans">Chargement...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="p-8 text-center">
                  <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground font-sans">
                    Aucun ticket
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-sans">
                    Cliquez sur "Nouveau" pour créer un ticket
                  </p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full p-4 border-b border-border hover:bg-gray-50 text-left transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-sm text-anthracite font-sans line-clamp-1">
                        {ticket.subject}
                      </h4>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <p className="text-xs text-muted-foreground font-sans line-clamp-2">
                      {ticket.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 font-sans">
                      {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
