import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Upload, Download, Trash2, Search, Filter,
  File, Image, FileVideo, Plus, X, Brain, Stethoscope,
  ChevronRight, User, Calendar, Clock, Paperclip,
  CheckCircle, Edit, FolderOpen, LayoutTemplate,
  BookOpen, History,
} from "lucide-react";
import { projectId } from "/utils/supabase/info";
import { useExpertAuth } from "@/app/contexts/ExpertAuthContext";
import ExpertLayout from "@/app/components/ExpertLayout";
import { useNavigate } from "react-router";

// ─── TYPES ───────────────────────────────────────────────
type Tab = "templates" | "dossiers" | "fichiers" | "historique";
type TemplateCategory = "prescription" | "careplan" | "certificate" | "report" | "referral";
type SpecialtyType = "mental_health" | "primary_care";

interface Template {
  id: string;
  type: TemplateCategory;
  category: SpecialtyType;
  name: string;
  description: string;
  route: string;
}

interface MedicalRecord {
  id: string;
  patientName: string;
  recordType: string;
  title: string;
  date: string;
  status: "draft" | "finalized" | "archived";
  content: string;
  attachments: number;
  tags: string[];
}

// ─── DONNÉES TEMPLATES ────────────────────────────────────
const TEMPLATES: Template[] = [
  { id: "p1", type: "prescription", category: "mental_health", name: "Ordonnance — Santé mentale", description: "Traitements psychiatriques", route: "/expert/prescription-template" },
  { id: "p2", type: "prescription", category: "primary_care", name: "Ordonnance — Soins primaires", description: "Soins médicaux généraux", route: "/expert/prescription-template" },
  { id: "c1", type: "careplan", category: "mental_health", name: "Plan de soins — Santé mentale", description: "Suivi psychiatrique/psychologique", route: "/expert/care-plan" },
  { id: "c2", type: "careplan", category: "primary_care", name: "Plan de soins — Soins primaires", description: "Pathologie médicale générale", route: "/expert/care-plan" },
  { id: "ce1", type: "certificate", category: "mental_health", name: "Certificat médical — Santé mentale", description: "Arrêt de travail ou aptitude psychologique", route: "/expert/medical-certificate" },
  { id: "ce2", type: "certificate", category: "primary_care", name: "Certificat médical — Soins primaires", description: "Justificatif ou arrêt de travail", route: "/expert/medical-certificate" },
  { id: "r1", type: "report", category: "mental_health", name: "Compte-rendu — Santé mentale", description: "Consultation psychiatrique/psychologique", route: "/expert/medical-report" },
  { id: "r2", type: "report", category: "primary_care", name: "Compte-rendu — Soins primaires", description: "Consultation médicale générale", route: "/expert/medical-report" },
  { id: "l1", type: "referral", category: "mental_health", name: "Lettre de liaison — Santé mentale", description: "Vers confrère ou structure spécialisée", route: "/expert/referral-letter" },
  { id: "l2", type: "referral", category: "primary_care", name: "Lettre de liaison — Soins primaires", description: "Vers spécialiste médical", route: "/expert/referral-letter" },
];

const TYPE_LABELS: Record<TemplateCategory, string> = {
  prescription: "Ordonnances",
  careplan: "Plans de soins",
  certificate: "Certificats",
  report: "Comptes-rendus",
  referral: "Lettres de liaison",
};

// ─── HELPERS ─────────────────────────────────────────────
const statusColor = (s: string) => ({
  finalized: "bg-green-100 text-green-700 border-green-200",
  draft: "bg-yellow-100 text-yellow-700 border-yellow-200",
  archived: "bg-gray-100 text-gray-700 border-gray-200",
}[s] || "bg-gray-100 text-gray-700");

const statusLabel = (s: string) => ({ finalized: "FINALISÉ", draft: "BROUILLON", archived: "ARCHIVÉ" }[s] || s);

const typeColor = (t: string) => ({
  consultation: "bg-blue-100 text-blue-700",
  diagnostic: "bg-purple-100 text-purple-700",
  prescription: "bg-green-100 text-green-700",
  lab: "bg-orange-100 text-orange-700",
  imaging: "bg-pink-100 text-pink-700",
}[t] || "bg-gray-100 text-gray-700");

const typeLabel = (t: string) => ({
  consultation: "Consultation", diagnostic: "Diagnostic",
  prescription: "Ordonnance", lab: "Laboratoire", imaging: "Imagerie",
}[t] || "Autre");

const fmtSize = (b: number) => b < 1024 ? b + " B" : b < 1024 * 1024 ? (b / 1024).toFixed(1) + " KB" : (b / (1024 * 1024)).toFixed(1) + " MB";

const fileIcon = (type: string) => {
  if (type?.startsWith("image/")) return <Image className="w-5 h-5" />;
  if (type?.startsWith("video/")) return <FileVideo className="w-5 h-5" />;
  return <File className="w-5 h-5" />;
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────
export default function ExpertDocumentsUnifiedPage() {
  const { accessToken } = useExpertAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("templates");

  // Templates
  const [templateFilter, setTemplateFilter] = useState<TemplateCategory | "all">("all");

  // Dossiers
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);
  const [recordSearch, setRecordSearch] = useState("");
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [recordStatusFilter, setRecordStatusFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  // Fichiers
  const [files, setFiles] = useState<any[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [fileSearch, setFileSearch] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getToken = () => accessToken || localStorage.getItem("expert_access_token");

  useEffect(() => {
    loadRecords();
    loadFiles();
  }, [accessToken]);

  const loadRecords = async () => {
    const token = getToken();
    if (!token) { setRecordsLoading(false); return; }
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/medical-records/list`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) { const d = await res.json(); setRecords(d.data || []); }
    } catch {}
    finally { setRecordsLoading(false); }
  };

  const loadFiles = async () => {
    const token = getToken();
    if (!token) { setFilesLoading(false); return; }
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/list`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) { const d = await res.json(); setFiles(d.data || []); }
    } catch {}
    finally { setFilesLoading(false); }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const token = getToken();
    if (!token) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("documentType", "general");
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/upload`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
      );
      if (res.ok) { const d = await res.json(); setFiles([d.data, ...files]); }
    } catch {}
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ""; }
  };

  const handleDownload = async (id: string) => {
    const token = getToken(); if (!token) return;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/${id}/download`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) { const d = await res.json(); window.open(d.data.url, "_blank"); }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Supprimer ce fichier ?")) return;
    const token = getToken(); if (!token) return;
    const res = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/expert/documents/${id}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.ok) setFiles(files.filter(f => f.id !== id));
  };

  // Filtres
  const filteredTemplates = templateFilter === "all" ? TEMPLATES : TEMPLATES.filter(t => t.type === templateFilter);
  const groupedTemplates = filteredTemplates.reduce((acc, t) => {
    if (!acc[t.type]) acc[t.type] = [];
    acc[t.type].push(t);
    return acc;
  }, {} as Record<string, Template[]>);

  const filteredRecords = records.filter(r => {
    const q = recordSearch.toLowerCase();
    return (
      (r.title?.toLowerCase().includes(q) || r.patientName?.toLowerCase().includes(q)) &&
      (recordTypeFilter === "all" || r.recordType === recordTypeFilter) &&
      (recordStatusFilter === "all" || r.status === recordStatusFilter)
    );
  });

  const filteredFiles = files.filter(f =>
    f.fileName?.toLowerCase().includes(fileSearch.toLowerCase()) &&
    (fileTypeFilter === "all" || f.documentType === fileTypeFilter)
  );

  // Historique combiné
  const history = [
    ...records.map(r => ({ id: r.id, type: "dossier", label: r.title, sub: r.patientName, date: r.date, status: r.status })),
    ...files.map(f => ({ id: f.id, type: "fichier", label: f.fileName, sub: fmtSize(f.fileSize), date: f.uploadedAt, status: "uploaded" })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const tabs = [
    { id: "templates" as Tab, label: "Templates", icon: LayoutTemplate, count: TEMPLATES.length },
    { id: "dossiers" as Tab, label: "Dossiers", icon: BookOpen, count: records.length },
    { id: "fichiers" as Tab, label: "Fichiers", icon: Paperclip, count: files.length },
    { id: "historique" as Tab, label: "Historique", icon: History, count: history.length },
  ];

  return (
    <ExpertLayout title="Documents & Dossiers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Onglets */}
        <div className="bg-white rounded-2xl p-2 border border-[#D4C5B9] mb-8">
          <div className="flex gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? "bg-[#1A1A1A] text-white shadow-lg"
                      : "text-[#1A1A1A]/60 hover:bg-[#F5F1ED] hover:text-[#1A1A1A]"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20" : "bg-[#F5F1ED]"}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ONGLET TEMPLATES ── */}
        {activeTab === "templates" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Filtres */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
              {(["all", ...Object.keys(TYPE_LABELS)] as (TemplateCategory | "all")[]).map(f => (
                <button
                  key={f}
                  onClick={() => setTemplateFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    templateFilter === f ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#D4C5B9] text-[#1A1A1A]/70 hover:bg-[#F5F1ED]"
                  }`}
                >
                  {f === "all" ? "Tous" : TYPE_LABELS[f as TemplateCategory]}
                </button>
              ))}
            </div>

            <div className="space-y-8">
              {Object.entries(groupedTemplates).map(([type, templates]) => (
                <div key={type}>
                  <h2 className="text-lg font-serif text-[#1A1A1A] mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#A68B6F]" />
                    {TYPE_LABELS[type as TemplateCategory]}
                    <span className="text-sm text-[#1A1A1A]/40 font-sans">({templates.length})</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => navigate(t.route)}
                        className="bg-white border border-[#D4C5B9] rounded-2xl p-6 hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            t.category === "mental_health" ? "bg-[#A68B6F]/10" : "bg-[#B85C50]/10"
                          }`}>
                            {t.category === "mental_health"
                              ? <Brain className="w-5 h-5 text-[#A68B6F]" />
                              : <Stethoscope className="w-5 h-5 text-[#B85C50]" />}
                          </div>
                          <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30 group-hover:text-[#1A1A1A] transition-colors" />
                        </div>
                        <h3 className="text-base font-medium text-[#1A1A1A] mb-1">{t.name}</h3>
                        <p className="text-sm text-[#1A1A1A]/60">{t.description}</p>
                        <div className="mt-3 pt-3 border-t border-[#D4C5B9]">
                          <span className="text-xs uppercase tracking-wider text-[#1A1A1A]/40">
                            {t.category === "mental_health" ? "Santé mentale" : "Soins primaires"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── ONGLET DOSSIERS ── */}
        {activeTab === "dossiers" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9] mb-6">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                  <input
                    type="text" placeholder="Rechercher un dossier..." value={recordSearch}
                    onChange={e => setRecordSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F]"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <select value={recordTypeFilter} onChange={e => setRecordTypeFilter(e.target.value)}
                    className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                    <option value="all">Tous les types</option>
                    <option value="consultation">Consultations</option>
                    <option value="diagnostic">Diagnostics</option>
                    <option value="prescription">Ordonnances</option>
                    <option value="lab">Laboratoire</option>
                  </select>
                  <select value={recordStatusFilter} onChange={e => setRecordStatusFilter(e.target.value)}
                    className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                    <option value="all">Tous les statuts</option>
                    <option value="finalized">Finalisés</option>
                    <option value="draft">Brouillons</option>
                    <option value="archived">Archivés</option>
                  </select>
                  <Link to="/expert/medical-records/new"
                    className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors text-sm">
                    <Plus className="w-4 h-4" /> Nouveau
                  </Link>
                </div>
              </div>
            </div>

            {recordsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
                <FolderOpen className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun dossier</h3>
                <p className="text-sm text-[#1A1A1A]/60">Créez votre premier dossier médical</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
                {filteredRecords.map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="p-6 hover:bg-[#F5F1ED]/50 cursor-pointer border-b border-[#D4C5B9] last:border-0 group"
                    onClick={() => setSelectedRecord(r)}>
                    <div className="flex items-start gap-4">
                      <div className={`w-11 h-11 ${typeColor(r.recordType)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <h3 className="text-base font-serif text-[#1A1A1A]">{r.title}</h3>
                          <ChevronRight className="w-5 h-5 text-[#1A1A1A]/30 group-hover:text-[#A68B6F] flex-shrink-0" />
                        </div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColor(r.recordType)}`}>{typeLabel(r.recordType)}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColor(r.status)}`}>{statusLabel(r.status)}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-[#1A1A1A]/60">
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{r.patientName}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(r.date).toLocaleDateString("fr-FR")}</span>
                          {r.attachments > 0 && <span className="flex items-center gap-1"><Paperclip className="w-3.5 h-3.5" />{r.attachments} fichier{r.attachments > 1 ? "s" : ""}</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── ONGLET FICHIERS ── */}
        {activeTab === "fichiers" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-4 border border-[#D4C5B9] mb-6">
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A1A1A]/40" />
                  <input type="text" placeholder="Rechercher un fichier..." value={fileSearch}
                    onChange={e => setFileSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full focus:outline-none focus:ring-2 focus:ring-[#A68B6F]" />
                </div>
                <div className="flex gap-2">
                  <select value={fileTypeFilter} onChange={e => setFileTypeFilter(e.target.value)}
                    className="px-4 py-3 bg-[#F5F1ED] border border-[#D4C5B9] rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#A68B6F]">
                    <option value="all">Tous</option>
                    <option value="general">Général</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="report">Rapports</option>
                  </select>
                  <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="flex items-center gap-2 px-5 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors text-sm disabled:opacity-50">
                    <Upload className="w-4 h-4" />
                    {uploading ? "Upload..." : "Uploader"}
                  </button>
                </div>
              </div>
            </div>

            {filesLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#A68B6F] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
                <FileText className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun fichier</h3>
                <p className="text-sm text-[#1A1A1A]/60 mb-6">Uploadez votre premier document</p>
                <button onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors">
                  <Upload className="w-4 h-4" /> Uploader un fichier
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFiles.map((f, i) => (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl p-5 border border-[#D4C5B9] hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 bg-[#A68B6F]/10 rounded-xl flex items-center justify-center text-[#A68B6F]">
                        {fileIcon(f.fileType)}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleDownload(f.id)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors"><Download className="w-4 h-4 text-[#1A1A1A]/60" /></button>
                        <button onClick={() => handleDeleteFile(f.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-[#1A1A1A] truncate mb-2">{f.fileName}</h3>
                    <div className="text-xs text-[#1A1A1A]/60 space-y-0.5">
                      <p>{fmtSize(f.fileSize)}</p>
                      <p>{new Date(f.uploadedAt).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── ONGLET HISTORIQUE ── */}
        {activeTab === "historique" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 border border-[#D4C5B9] text-center">
                <History className="w-16 h-16 text-[#1A1A1A]/20 mx-auto mb-4" />
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">Aucun historique</h3>
                <p className="text-sm text-[#1A1A1A]/60">Vos dossiers et fichiers apparaîtront ici</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#D4C5B9] overflow-hidden">
                {history.map((item, i) => (
                  <motion.div key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 p-5 border-b border-[#D4C5B9] last:border-0 hover:bg-[#F5F1ED]/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      item.type === "dossier" ? "bg-blue-100 text-blue-600" : "bg-[#A68B6F]/10 text-[#A68B6F]"
                    }`}>
                      {item.type === "dossier" ? <BookOpen className="w-5 h-5" /> : <Paperclip className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.label}</p>
                      <p className="text-xs text-[#1A1A1A]/60">{item.sub}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[#1A1A1A]/60">{new Date(item.date).toLocaleDateString("fr-FR")}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === "dossier" ? statusColor(item.status) : "bg-green-100 text-green-700"
                      }`}>
                        {item.type === "dossier" ? statusLabel(item.status) : "Uploadé"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Modal dossier sélectionné */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-[#D4C5B9] p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-serif text-[#1A1A1A]">{selectedRecord.title}</h2>
                  <p className="text-sm text-[#1A1A1A]/60">{typeLabel(selectedRecord.recordType)}</p>
                </div>
                <button onClick={() => setSelectedRecord(null)} className="p-2 hover:bg-[#F5F1ED] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-[#F5F1ED] rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm"><User className="w-4 h-4 text-[#A68B6F]" /><span>{selectedRecord.patientName}</span></div>
                  <div className="flex items-center gap-3 text-sm"><Calendar className="w-4 h-4 text-[#A68B6F]" /><span>{new Date(selectedRecord.date).toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span></div>
                </div>
                <div>
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold border ${statusColor(selectedRecord.status)}`}>{statusLabel(selectedRecord.status)}</span>
                </div>
                {selectedRecord.content && (
                  <div className="bg-[#F5F1ED] rounded-2xl p-5">
                    <p className="text-sm text-[#1A1A1A] leading-relaxed">{selectedRecord.content}</p>
                  </div>
                )}
                {selectedRecord.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedRecord.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-[#A68B6F]/10 text-[#A68B6F] rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Link to={`/expert/medical-records/${selectedRecord.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1A1A1A] text-white rounded-full hover:bg-[#2A2A2A] transition-colors text-sm">
                    <Edit className="w-4 h-4" /> Modifier
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-5 py-3 border border-[#D4C5B9] rounded-full hover:bg-[#F5F1ED] transition-colors text-sm">
                    <Download className="w-4 h-4" /> Télécharger
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ExpertLayout>
  );
}
