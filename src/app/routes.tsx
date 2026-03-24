import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import AdminProtectedRoute from "@/app/components/AdminProtectedRoute";
import MemberProtectedRoute from "@/app/components/MemberProtectedRoute";
import ExpertProtectedRoute from "@/app/components/ExpertProtectedRoute";
import CompanyProtectedRoute from "@/app/components/CompanyProtectedRoute";
// Import direct pour éviter les suspensions synchrones lors de l'auth
import AdminLoginPage from "@/app/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/app/pages/admin/AdminDashboardPage";
import AdminLoginTestPage from "@/app/pages/admin/AdminLoginTestPage";

// Lazy load all pages
const HomePage = lazy(() => import("@/app/pages/HomePage"));
const TestDailyPage = lazy(() => import("@/app/pages/TestDailyPage"));
const DailySetupPage = lazy(() => import("@/app/pages/DailySetupPage"));
const AboutPage = lazy(() => import("@/app/pages/AboutPage"));
const ServicesPage = lazy(() => import("@/app/pages/ServicesPage"));
const ExpertsPage = lazy(() => import("@/app/pages/ExpertsPage"));
const ExpertSpacePage = lazy(() => import("@/app/pages/ExpertSpacePage"));
const PortalExpertPage = lazy(() => import("@/app/pages/PortalExpertPage"));
const CerclePage = lazy(() => import("@/app/pages/CerclePage"));
const CasaDelToroPage = lazy(() => import("@/app/pages/CasaDelToroPage"));
const MaisonAkoulaPage = lazy(() => import("@/app/pages/MaisonAkoulaPage"));
const MbuelaLodgePage = lazy(() => import("@/app/pages/MbuelaLodgePage"));
const ResetStudioPage = lazy(() => import("@/app/pages/ResetStudioPage"));
const EforeaSpaPage = lazy(() => import("@/app/pages/EforeaSpaPage"));
const BodyPulsePage = lazy(() => import("@/app/pages/BodyPulsePage"));
const CardPage = lazy(() => import("@/app/pages/CardPage"));
const B2BPage = lazy(() => import("@/app/pages/B2BPage"));
const DashboardRHPage = lazy(() => import("@/app/pages/DashboardRHPage"));
const PartnershipsPage = lazy(() => import("@/app/pages/PartnershipsPage"));
const TestimonialsPage = lazy(() => import("@/app/pages/TestimonialsPage"));
const ContactPage = lazy(() => import("@/app/pages/ContactPage"));
const BlogPage = lazy(() => import("@/app/pages/BlogPage"));
const HelpCenterPage = lazy(() => import("@/app/pages/HelpCenterPage"));
const PrivacyPage = lazy(() => import("@/app/pages/PrivacyPage"));
const TermsPage = lazy(() => import("@/app/pages/TermsPage"));
const GDPRPage = lazy(() => import("@/app/pages/GDPRPage"));
const ResourcesPage = lazy(() => import("@/app/pages/ResourcesPage"));
const NotFoundPage = lazy(() => import("@/app/pages/NotFoundPage"));
const CareersPage = lazy(() => import("@/app/pages/CareersPage"));
const ApplicationPage = lazy(() => import("@/app/pages/ApplicationPage"));
const OpportunitiesPage = lazy(() => import("@/app/pages/OpportunitiesPage"));
const TarifsPage = lazy(() => import("@/app/pages/TarifsPage"));
const DemoPage = lazy(() => import("@/app/pages/DemoPage"));
const SmartMatchingPage = lazy(() => import("@/app/pages/SmartMatchingPage"));
const PasseportSantePage = lazy(() => import("@/app/pages/PasseportSantePage"));
const MembresPage = lazy(() => import("@/app/pages/MembresPage"));
const BibliotequePage = lazy(() => import("@/app/pages/BibliotequePage"));
const ApprocheCulturellePage = lazy(() => import("@/app/pages/ApprocheCulturellePage"));
const VisionAfricaFirstPage = lazy(() => import("@/app/pages/VisionAfricaFirstPage"));
const LegalPage = lazy(() => import("@/app/pages/LegalPage"));
const ConfidentialitePage = lazy(() => import("@/app/pages/ConfidentialitePage"));
const ConditionsPage = lazy(() => import("@/app/pages/ConditionsPage"));
const RgpdPage = lazy(() => import("@/app/pages/RgpdPage"));
const OnboardingPage = lazy(() => import("@/app/pages/OnboardingPage"));
const MatchingQuizPage = lazy(() => import("@/app/pages/MatchingQuizPage"));
const OnboardingResultsPage = lazy(() => import("@/app/pages/OnboardingResultsPage"));
const TestAuthPage = lazy(() => import("@/app/pages/TestAuthPage"));
const ResourceDetailPage = lazy(() => import("@/app/pages/ResourceDetailPage"));
const SanteMentalePage = lazy(() => import("@/app/pages/SanteMentalePage"));
const SoinsPrimairesPage = lazy(() => import("@/app/pages/SoinsPrimairesPage"));
const StudentsPage = lazy(() => import("@/app/pages/Students"));
const ReservationPage = lazy(() => import("@/app/pages/ReservationPage"));
const MobileMoneyMainPage = lazy(() => import("@/app/pages/MobileMoneyPage"));
const ChiffrementE2EMainPage = lazy(() => import("@/app/pages/ChiffrementE2EPage"));
const E2ETestPage = lazy(() => import("@/app/pages/E2ETestPage"));

// Help Pages
const CreerComptePage = lazy(() => import("@/app/pages/help/CreerComptePage"));
const PremiereConsultationPage = lazy(() => import("@/app/pages/help/PremiereConsultationPage"));
const SmartMatchingHelpPage = lazy(() => import("@/app/pages/help/SmartMatchingHelpPage"));
const MoyensPaiementPage = lazy(() => import("@/app/pages/help/MoyensPaiementPage"));
const MobileMoneyPage = lazy(() => import("@/app/pages/help/MobileMoneyPage"));
const AnnulerAbonnementPage = lazy(() => import("@/app/pages/help/AnnulerAbonnementPage"));
const SeanceEnLignePage = lazy(() => import("@/app/pages/help/SeanceEnLignePage"));
const ChangerTherapeutePage = lazy(() => import("@/app/pages/help/ChangerTherapeutePage"));
const UrgencePage = lazy(() => import("@/app/pages/help/UrgencePage"));
const DonneesSecuriseesPage = lazy(() => import("@/app/pages/help/DonneesSecuriseesPage"));
const AccesInformationsPage = lazy(() => import("@/app/pages/help/AccesInformationsPage"));
const ChiffrementE2EPage = lazy(() => import("@/app/pages/help/ChiffrementE2EPage"));
const FonctionnementOfflinePage = lazy(() => import("@/app/pages/help/FonctionnementOfflinePage"));
const TelechargerAppPage = lazy(() => import("@/app/pages/help/TelechargerAppPage"));
const FonctionnalitesOfflinePage = lazy(() => import("@/app/pages/help/FonctionnalitesOfflinePage"));

// Auth Pages
const LoginPage = lazy(() => import("@/app/pages/portal/LoginPage"));
const SignupPage = lazy(() => import("@/app/pages/portal/SignupPage"));
const TestCleanup = lazy(() => import("@/app/pages/TestCleanup"));

// Member Portal Pages
const MemberDashboardPage = lazy(() => import("@/app/pages/portal/MemberDashboardPage"));
const MemberConsultationsPage = lazy(() => import("@/app/pages/portal/MemberConsultationsPage"));
const MemberConsultationRoomPage = lazy(() => import("@/app/pages/portal/MemberConsultationRoomPage"));
const MemberHealthPassportPage = lazy(() => import("@/app/pages/portal/MemberHealthPassportPage"));
const MemberPassportPage = lazy(() => import("@/app/pages/portal/MemberPassportPage"));
const MemberResourcesPage = lazy(() => import("@/app/pages/portal/MemberResourcesPage"));
const MemberResourceDetailPage = lazy(() => import("@/app/pages/portal/MemberResourceDetailPage"));
const MemberProfilePage = lazy(() => import("@/app/pages/portal/MemberProfilePage"));
const MemberMatchingQuizPage = lazy(() => import("@/app/pages/portal/MemberMatchingQuizPage"));
const MemberMatchingQuizTallyPage = lazy(() => import("@/app/pages/portal/MemberMatchingQuizTallyPage"));
const MemberBookingPage = lazy(() => import("@/app/pages/portal/MemberBookingPage"));
const MemberTestConsultationPage = lazy(() => import("@/app/pages/portal/MemberTestConsultationPage"));
const MemberSubscriptionPage = lazy(() => import("@/app/pages/portal/MemberSubscriptionPage"));
const MemberUpgradePage = lazy(() => import("@/app/pages/portal/MemberUpgradePage"));
const MemberCercleInfoPage = lazy(() => import("@/app/pages/portal/MemberCercleInfoPage"));
const PaymentCheckoutPage = lazy(() => import("@/app/pages/portal/PaymentCheckoutPage"));
const PaymentSuccessPage = lazy(() => import("@/app/pages/payment/PaymentSuccessPage"));
const InvoicesPage = lazy(() => import("@/app/pages/portal/InvoicesPage"));

// Expert Portal Pages
const ExpertLoginPage = lazy(() => import("@/app/pages/expert/ExpertLoginPage"));
const ExpertDashboardPage = lazy(() => import("@/app/pages/portal/ExpertDashboardPage"));
const ExpertAgendaPage = lazy(() => import("@/app/pages/expert/ExpertAgendaPage"));
const ExpertPatientsPage = lazy(() => import("@/app/pages/portal/ExpertPatientsPage"));
const ExpertPatientDetailPage = lazy(() => import("@/app/pages/portal/ExpertPatientDetailPage"));
const ExpertMedicalRecordsPage = lazy(() => import("@/app/pages/expert/ExpertMedicalRecordsPage"));
const ExpertMedicalRecordDetailPage = lazy(() => import("@/app/pages/expert/ExpertMedicalRecordDetailPage"));
const ExpertConsultationRoomPage = lazy(() => import("@/app/pages/expert/ExpertConsultationRoomPage"));
const ExpertSettingsPage = lazy(() => import("@/app/pages/expert/ExpertSettingsPage"));
const PrescriptionPage = lazy(() => import("@/app/pages/expert/PrescriptionPage"));
const CarePlanPage = lazy(() => import("@/app/pages/expert/CarePlanPage"));
const ExpertDocumentsPage = lazy(() => import("@/app/pages/portal/ExpertDocumentsPage"));
const ExpertCalendarPage = lazy(() => import("@/app/pages/portal/ExpertCalendarPage"));
const ChatPage = lazy(() => import("@/app/pages/portal/ChatPage"));
const MedicalCertificatePage = lazy(() => import("@/app/pages/expert/MedicalCertificatePage"));
const MedicalReportPage = lazy(() => import("@/app/pages/expert/MedicalReportPage"));
const ReferralLetterPage = lazy(() => import("@/app/pages/expert/ReferralLetterPage"));
const ExpertConsultationsPage = lazy(() => import("@/app/pages/expert/ExpertConsultationsPage"));

// Company Portal Pages
const CompanyDashboardPage = lazy(() => import("@/app/pages/portal/CompanyDashboardPage"));
const CompanyEmployeesPage = lazy(() => import("@/app/pages/portal/CompanyEmployeesPage"));
const CompanyConsultationsPage = lazy(() => import("@/app/pages/portal/CompanyConsultationsPage"));
const CompanyAnalyticsPage = lazy(() => import("@/app/pages/portal/CompanyAnalyticsPage"));
const CompanySettingsPage = lazy(() => import("@/app/pages/portal/CompanySettingsPage"));
const CompanySubscriptionPage = lazy(() => import("@/app/pages/portal/CompanySubscriptionPage"));

// Admin Pages - AdminLoginPage et AdminDashboardPage sont importés directement ci-dessus
const AdminUsersPage = lazy(() => import("@/app/pages/admin/AdminUsersPage"));
const AdminExpertsPage = lazy(() => import("@/app/pages/admin/AdminExpertsPage"));
const AdminDataDiagnosticPage = lazy(() => import("@/app/pages/admin/AdminDataDiagnosticPage"));
const AdminEntreprisesPage = lazy(() => import("@/app/pages/admin/AdminEntreprisesPage"));
const AdminContentPage = lazy(() => import("@/app/pages/admin/AdminContentPage"));
const AdminAnalyticsPage = lazy(() => import("@/app/pages/admin/AdminAnalyticsPage"));
const AdminFinancesPage = lazy(() => import("@/app/pages/admin/AdminFinancesPage"));
const AdminSettingsPage = lazy(() => import("@/app/pages/admin/AdminSettingsPage"));

// RH Pages (Équipe M.O.N.A)
const RHLoginPage = lazy(() => import("@/app/pages/rh/RHLoginPage"));
const RHDashboardPage = lazy(() => import("@/app/pages/rh/RHDashboardPage"));
const RHTeamPage = lazy(() => import("@/app/pages/rh/RHTeamPage"));
const RHExpertsPage = lazy(() => import("@/app/pages/rh/RHExpertsPage"));

// Entreprise Pages (Vrais comptes B2B)
const EntrepriseLoginPage = lazy(() => import("@/app/pages/entreprise/EntrepriseLoginPage"));
const EntrepriseDashboardPage = lazy(() => import("@/app/pages/entreprise/EntrepriseDashboardPage"));
const EntrepriseEmployeesPage = lazy(() => import("@/app/pages/entreprise/EntrepriseEmployeesPage"));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    fontFamily: 'system-ui',
    fontSize: '18px',
    color: '#666'
  }}>
    Chargement...
  </div>
);

// Wrapper component for Suspense
const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  // Public Pages
  { path: "/", element: <SuspenseWrapper><HomePage /></SuspenseWrapper> },
  { path: "/test-daily", element: <SuspenseWrapper><TestDailyPage /></SuspenseWrapper> },
  { path: "/daily-setup", element: <SuspenseWrapper><DailySetupPage /></SuspenseWrapper> },
  { path: "/about", element: <SuspenseWrapper><AboutPage /></SuspenseWrapper> },
  { path: "/approche-culturelle", element: <SuspenseWrapper><ApprocheCulturellePage /></SuspenseWrapper> },
  { path: "/vision-africa-first", element: <SuspenseWrapper><VisionAfricaFirstPage /></SuspenseWrapper> },
  { path: "/services", element: <SuspenseWrapper><ServicesPage /></SuspenseWrapper> },
  { path: "/smart-matching", element: <SuspenseWrapper><SmartMatchingPage /></SuspenseWrapper> },
  { path: "/passeport-sante", element: <SuspenseWrapper><PasseportSantePage /></SuspenseWrapper> },
  { path: "/experts", element: <SuspenseWrapper><ExpertsPage /></SuspenseWrapper> },
  { path: "/expert-space", element: <SuspenseWrapper><ExpertSpacePage /></SuspenseWrapper> },
  { path: "/espace-expert", element: <SuspenseWrapper><ExpertSpacePage /></SuspenseWrapper> },
  { path: "/portal-expert", element: <SuspenseWrapper><PortalExpertPage /></SuspenseWrapper> },
  { path: "/cercle", element: <SuspenseWrapper><CerclePage /></SuspenseWrapper> },
  { path: "/membres", element: <SuspenseWrapper><MembresPage /></SuspenseWrapper> },
  { path: "/bibliotheque", element: <SuspenseWrapper><BibliotequePage /></SuspenseWrapper> },
  { path: "/bibliotheque/:id", element: <SuspenseWrapper><ResourceDetailPage /></SuspenseWrapper> },
  { path: "/ressources", element: <SuspenseWrapper><BibliotequePage /></SuspenseWrapper> },
  { path: "/casa-del-toro", element: <SuspenseWrapper><CasaDelToroPage /></SuspenseWrapper> },
  { path: "/maison-akoula", element: <SuspenseWrapper><MaisonAkoulaPage /></SuspenseWrapper> },
  { path: "/mbuela-lodge", element: <SuspenseWrapper><MbuelaLodgePage /></SuspenseWrapper> },
  { path: "/reset-studio", element: <SuspenseWrapper><ResetStudioPage /></SuspenseWrapper> },
  { path: "/eforea-spa", element: <SuspenseWrapper><EforeaSpaPage /></SuspenseWrapper> },
  { path: "/body-pulse", element: <SuspenseWrapper><BodyPulsePage /></SuspenseWrapper> },
  { path: "/card", element: <SuspenseWrapper><CardPage /></SuspenseWrapper> },
  { path: "/carte-membre", element: <SuspenseWrapper><CardPage /></SuspenseWrapper> },
  { path: "/tarifs", element: <SuspenseWrapper><TarifsPage /></SuspenseWrapper> },
  { path: "/pricing", element: <SuspenseWrapper><TarifsPage /></SuspenseWrapper> },
  { path: "/b2b", element: <SuspenseWrapper><B2BPage /></SuspenseWrapper> },
  { path: "/dashboard-rh", element: <SuspenseWrapper><DashboardRHPage /></SuspenseWrapper> },
  { path: "/partnerships", element: <SuspenseWrapper><PartnershipsPage /></SuspenseWrapper> },
  { path: "/partenariats", element: <SuspenseWrapper><PartnershipsPage /></SuspenseWrapper> },
  { path: "/testimonials", element: <SuspenseWrapper><TestimonialsPage /></SuspenseWrapper> },
  { path: "/contact", element: <SuspenseWrapper><ContactPage /></SuspenseWrapper> },
  { path: "/blog", element: <SuspenseWrapper><BlogPage /></SuspenseWrapper> },
  { path: "/help", element: <SuspenseWrapper><HelpCenterPage /></SuspenseWrapper> },
  { path: "/aide", element: <SuspenseWrapper><HelpCenterPage /></SuspenseWrapper> },
  { path: "/privacy", element: <SuspenseWrapper><PrivacyPage /></SuspenseWrapper> },
  { path: "/terms", element: <SuspenseWrapper><TermsPage /></SuspenseWrapper> },
  { path: "/gdpr", element: <SuspenseWrapper><GDPRPage /></SuspenseWrapper> },
  { path: "/legal", element: <SuspenseWrapper><LegalPage /></SuspenseWrapper> },
  { path: "/confidentialite", element: <SuspenseWrapper><ConfidentialitePage /></SuspenseWrapper> },
  { path: "/conditions", element: <SuspenseWrapper><ConditionsPage /></SuspenseWrapper> },
  { path: "/rgpd", element: <SuspenseWrapper><RgpdPage /></SuspenseWrapper> },
  { path: "/resources", element: <SuspenseWrapper><ResourcesPage /></SuspenseWrapper> },
  { path: "/resources/:id", element: <SuspenseWrapper><ResourceDetailPage /></SuspenseWrapper> },
  { path: "/careers", element: <SuspenseWrapper><CareersPage /></SuspenseWrapper> },
  { path: "/carrieres", element: <SuspenseWrapper><CareersPage /></SuspenseWrapper> },
  { path: "/business", element: <SuspenseWrapper><B2BPage /></SuspenseWrapper> },
  { path: "/application", element: <SuspenseWrapper><ApplicationPage /></SuspenseWrapper> },
  { path: "/postuler", element: <SuspenseWrapper><ApplicationPage /></SuspenseWrapper> },
  { path: "/opportunities", element: <SuspenseWrapper><OpportunitiesPage /></SuspenseWrapper> },
  { path: "/demo", element: <SuspenseWrapper><DemoPage /></SuspenseWrapper> },
  { path: "/onboarding", element: <SuspenseWrapper><OnboardingPage /></SuspenseWrapper> },
  { path: "/matching-quiz", element: <SuspenseWrapper><MatchingQuizPage /></SuspenseWrapper> },
  { path: "/onboarding-results", element: <SuspenseWrapper><OnboardingResultsPage /></SuspenseWrapper> },
  { path: "/test-auth", element: <SuspenseWrapper><TestAuthPage /></SuspenseWrapper> },
  { path: "/sante-mentale", element: <SuspenseWrapper><SanteMentalePage /></SuspenseWrapper> },
  { path: "/soins-primaires", element: <SuspenseWrapper><SoinsPrimairesPage /></SuspenseWrapper> },
  { path: "/students", element: <SuspenseWrapper><StudentsPage /></SuspenseWrapper> },
  { path: "/etudiants", element: <SuspenseWrapper><StudentsPage /></SuspenseWrapper> },
  { path: "/reservation", element: <SuspenseWrapper><ReservationPage /></SuspenseWrapper> },
  { path: "/reserver", element: <SuspenseWrapper><ReservationPage /></SuspenseWrapper> },
  { path: "/mobile-money", element: <SuspenseWrapper><MobileMoneyMainPage /></SuspenseWrapper> },
  { path: "/chiffrement-e2e", element: <SuspenseWrapper><ChiffrementE2EMainPage /></SuspenseWrapper> },
  { path: "/e2e-test", element: <SuspenseWrapper><E2ETestPage /></SuspenseWrapper> },

  // Help Pages
  { path: "/help/creer-compte", element: <SuspenseWrapper><CreerComptePage /></SuspenseWrapper> },
  { path: "/help/premiere-consultation", element: <SuspenseWrapper><PremiereConsultationPage /></SuspenseWrapper> },
  { path: "/help/smart-matching", element: <SuspenseWrapper><SmartMatchingHelpPage /></SuspenseWrapper> },
  { path: "/help/moyens-paiement", element: <SuspenseWrapper><MoyensPaiementPage /></SuspenseWrapper> },
  { path: "/help/mobile-money", element: <SuspenseWrapper><MobileMoneyPage /></SuspenseWrapper> },
  { path: "/help/annuler-abonnement", element: <SuspenseWrapper><AnnulerAbonnementPage /></SuspenseWrapper> },
  { path: "/help/seance-en-ligne", element: <SuspenseWrapper><SeanceEnLignePage /></SuspenseWrapper> },
  { path: "/help/changer-therapeute", element: <SuspenseWrapper><ChangerTherapeutePage /></SuspenseWrapper> },
  { path: "/help/urgence", element: <SuspenseWrapper><UrgencePage /></SuspenseWrapper> },
  { path: "/help/donnees-securisees", element: <SuspenseWrapper><DonneesSecuriseesPage /></SuspenseWrapper> },
  { path: "/help/acces-informations", element: <SuspenseWrapper><AccesInformationsPage /></SuspenseWrapper> },
  { path: "/help/chiffrement-e2e", element: <SuspenseWrapper><ChiffrementE2EPage /></SuspenseWrapper> },
  { path: "/help/fonctionnement-offline", element: <SuspenseWrapper><FonctionnementOfflinePage /></SuspenseWrapper> },
  { path: "/help/telecharger-app", element: <SuspenseWrapper><TelechargerAppPage /></SuspenseWrapper> },
  { path: "/help/fonctionnalites-offline", element: <SuspenseWrapper><FonctionnalitesOfflinePage /></SuspenseWrapper> },

  // Auth Pages
  { path: "/login", element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
  { path: "/signup", element: <SuspenseWrapper><SignupPage /></SuspenseWrapper> },
  { path: "/test-cleanup", element: <SuspenseWrapper><TestCleanup /></SuspenseWrapper> },

  // Member Portal
  { path: "/member/dashboard", element: <SuspenseWrapper><MemberProtectedRoute><MemberDashboardPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/consultations", element: <SuspenseWrapper><MemberProtectedRoute><MemberConsultationsPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/consultation-room/:id", element: <SuspenseWrapper><MemberProtectedRoute><MemberConsultationRoomPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/health-passport", element: <SuspenseWrapper><MemberProtectedRoute><MemberHealthPassportPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/passport", element: <SuspenseWrapper><MemberProtectedRoute><MemberPassportPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/resources", element: <SuspenseWrapper><MemberProtectedRoute><MemberResourcesPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/resources/:id", element: <SuspenseWrapper><MemberProtectedRoute><MemberResourceDetailPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/profile", element: <SuspenseWrapper><MemberProtectedRoute><MemberProfilePage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/matching-quiz", element: <SuspenseWrapper><MemberProtectedRoute><MemberMatchingQuizPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/matching-quiz-tally", element: <SuspenseWrapper><MemberProtectedRoute><MemberMatchingQuizTallyPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/booking", element: <SuspenseWrapper><MemberProtectedRoute><MemberBookingPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/test-consultation", element: <SuspenseWrapper><MemberProtectedRoute><MemberTestConsultationPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/subscription", element: <SuspenseWrapper><MemberProtectedRoute><MemberSubscriptionPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/upgrade", element: <SuspenseWrapper><MemberProtectedRoute><MemberUpgradePage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/cercle-info", element: <SuspenseWrapper><MemberProtectedRoute><MemberCercleInfoPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/member/messages", element: <SuspenseWrapper><MemberProtectedRoute><ChatPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/payment/checkout/:sessionId", element: <SuspenseWrapper><MemberProtectedRoute><PaymentCheckoutPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/payment/success", element: <SuspenseWrapper><MemberProtectedRoute><PaymentSuccessPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/invoices", element: <SuspenseWrapper><MemberProtectedRoute><InvoicesPage /></MemberProtectedRoute></SuspenseWrapper> },

  // Expert Portal
  { path: "/expert/login", element: <SuspenseWrapper><ExpertLoginPage /></SuspenseWrapper> },
  { path: "/expert/dashboard", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertDashboardPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/agenda", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertAgendaPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/patients", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertPatientsPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/patients/:patientId", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertPatientDetailPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/medical-records", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertMedicalRecordsPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/medical-records/:id", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertMedicalRecordDetailPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/documents", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertDocumentsPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/calendar", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertCalendarPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/messages", element: <SuspenseWrapper><ExpertProtectedRoute><ChatPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/member/messages", element: <SuspenseWrapper><MemberProtectedRoute><ChatPage /></MemberProtectedRoute></SuspenseWrapper> },
  { path: "/expert/consultation-room/:id", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertConsultationRoomPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/settings", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertSettingsPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/prescription-template", element: <SuspenseWrapper><ExpertProtectedRoute><PrescriptionPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/care-plan", element: <SuspenseWrapper><ExpertProtectedRoute><CarePlanPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/medical-certificate", element: <SuspenseWrapper><ExpertProtectedRoute><MedicalCertificatePage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/medical-report", element: <SuspenseWrapper><ExpertProtectedRoute><MedicalReportPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/referral-letter", element: <SuspenseWrapper><ExpertProtectedRoute><ReferralLetterPage /></ExpertProtectedRoute></SuspenseWrapper> },
  { path: "/expert/consultations", element: <SuspenseWrapper><ExpertProtectedRoute><ExpertConsultationsPage /></ExpertProtectedRoute></SuspenseWrapper> },

  // Company Portal
  { path: "/company/dashboard", element: <SuspenseWrapper><CompanyProtectedRoute><CompanyDashboardPage /></CompanyProtectedRoute></SuspenseWrapper> },
  { path: "/company/employees", element: <SuspenseWrapper><CompanyProtectedRoute><CompanyEmployeesPage /></CompanyProtectedRoute></SuspenseWrapper> },
  { path: "/company/consultations", element: <SuspenseWrapper><CompanyProtectedRoute><CompanyConsultationsPage /></CompanyProtectedRoute></SuspenseWrapper> },
  { path: "/company/analytics", element: <SuspenseWrapper><CompanyProtectedRoute><CompanyAnalyticsPage /></CompanyProtectedRoute></SuspenseWrapper> },
  { path: "/company/settings", element: <SuspenseWrapper><CompanyProtectedRoute><CompanySettingsPage /></CompanyProtectedRoute></SuspenseWrapper> },
  { path: "/company/subscription", element: <SuspenseWrapper><CompanyProtectedRoute><CompanySubscriptionPage /></CompanyProtectedRoute></SuspenseWrapper> },

  // Admin Portal
  { path: "/admin/login", element: <AdminLoginPage /> },
  { path: "/admin/login-test", element: <AdminLoginTestPage /> },
  { path: "/admin/dashboard", element: <AdminProtectedRoute><AdminDashboardPage /></AdminProtectedRoute> },
  { path: "/admin/users", element: <SuspenseWrapper><AdminProtectedRoute><AdminUsersPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/experts", element: <SuspenseWrapper><AdminProtectedRoute><AdminExpertsPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/data-diagnostic", element: <SuspenseWrapper><AdminProtectedRoute><AdminDataDiagnosticPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/entreprises", element: <SuspenseWrapper><AdminProtectedRoute><AdminEntreprisesPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/content", element: <SuspenseWrapper><AdminProtectedRoute><AdminContentPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/analytics", element: <SuspenseWrapper><AdminProtectedRoute><AdminAnalyticsPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/finances", element: <SuspenseWrapper><AdminProtectedRoute><AdminFinancesPage /></AdminProtectedRoute></SuspenseWrapper> },
  { path: "/admin/settings", element: <SuspenseWrapper><AdminProtectedRoute><AdminSettingsPage /></AdminProtectedRoute></SuspenseWrapper> },

  // RH Portal
  { path: "/rh/login", element: <SuspenseWrapper><RHLoginPage /></SuspenseWrapper> },
  { path: "/rh/dashboard", element: <SuspenseWrapper><RHDashboardPage /></SuspenseWrapper> },
  { path: "/rh/team", element: <SuspenseWrapper><RHTeamPage /></SuspenseWrapper> },
  { path: "/rh/experts", element: <SuspenseWrapper><RHExpertsPage /></SuspenseWrapper> },

  // Entreprise Portal
  { path: "/entreprise/login", element: <SuspenseWrapper><EntrepriseLoginPage /></SuspenseWrapper> },
  { path: "/entreprise/dashboard", element: <SuspenseWrapper><EntrepriseDashboardPage /></SuspenseWrapper> },
  { path: "/entreprise/employees", element: <SuspenseWrapper><EntrepriseEmployeesPage /></SuspenseWrapper> },

  // 404 - Must be last
  { path: "*", element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper> },
]);