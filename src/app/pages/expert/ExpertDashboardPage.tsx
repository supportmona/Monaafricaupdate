import ExpertLayout from "@/app/components/ExpertLayout";

export default function ExpertDashboardPage() {
  return (
    <ExpertLayout title="Tableau de bord">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Bienvenue sur votre tableau de bord</h1>
        <p className="text-[#1A1A1A]/70">Cette page sera prochainement enrichie avec des statistiques, rappels et accès rapide à vos fonctions clés.</p>
      </div>
    </ExpertLayout>
  );
}
