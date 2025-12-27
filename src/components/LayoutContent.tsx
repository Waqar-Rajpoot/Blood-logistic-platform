"use client";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import PublicNavbar from "@/components/Navbar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hidePublicNav = /^\/(admin|donor|receiver)/.test(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      {!hidePublicNav && <PublicNavbar />}
      
      <main className={`flex-grow w-full ${!hidePublicNav ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" : ""}`}>
        {children}
      </main>

      {!hidePublicNav && (
        <footer className="py-8 border-t bg-gray-50 text-center px-4">
          <p className="text-gray-400 text-sm font-medium">
            © 2025 LifeFlow Management System.
          </p>
        </footer>
      )}
    </div>
  );
}