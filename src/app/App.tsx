import { RouterProvider } from "react-router";
import { router } from "@/app/routes";
import { ExpertAuthProvider } from "@/app/contexts/ExpertAuthContext";
import { B2BAuthProvider } from "@/app/contexts/B2BAuthContext";
import { AdminAuthProvider } from "@/app/contexts/AdminAuthContext";
import { MemberAuthProvider } from "@/app/contexts/MemberAuthContext";
import { NotificationProvider } from "@/app/contexts/NotificationContext";
import { LanguageProvider } from "@/app/contexts/LanguageContext";
import { Toaster } from "sonner";
import DebugVersion from "@/app/components/DebugVersion";

export default function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <MemberAuthProvider>
          <AdminAuthProvider>
            <ExpertAuthProvider>
              <B2BAuthProvider>
                <RouterProvider router={router} />
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    style: {
                      background: 'white',
                      color: 'black',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '16px',
                      fontFamily: 'inherit',
                    },
                    className: 'sonner-toast',
                  }}
                  closeButton
                />
                <DebugVersion />
              </B2BAuthProvider>
            </ExpertAuthProvider>
          </AdminAuthProvider>
        </MemberAuthProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}