import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { DBStatusIndicator } from "./DBStatusIndicator";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export function Layout({ children, title, hideHeader }: LayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Header (optional) */}
      {!hideHeader && (
        <header className="fixed top-0 left-0 right-0 z-40 bg-transparent header-backdrop">
          <div className="relative">
            <div className="h-16 sm:h-20 ml-0 md:ml-64 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
              {title && (
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent truncate">
                  {title}
                </h3>
              )}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto">
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="md:ml-64 pt-20 sm:pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto fade-in-up">
          {title && (
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {title}
              </h2>
              <div className="h-1 w-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full mt-3"></div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
