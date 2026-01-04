import AdminNavbar from "@/components/adminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Section - Properly fixed on desktop */}
      <AdminNavbar />

      {/* Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-[73px] lg:pt-0">
        <div className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-gray-50/50">
          <div className="p-4 sm:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}