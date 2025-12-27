import AdminNavbar from "@/components/adminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar handles its own mobile/desktop states */}
      <AdminNavbar />
      
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        {/* Responsive padding: smaller on mobile, generous on desktop */}
        <div className="p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}