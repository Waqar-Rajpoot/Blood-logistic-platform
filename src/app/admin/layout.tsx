import AdminNavbar from "@/components/adminNavbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden">
      <aside className="lg:h-screen lg:sticky lg:top-0 z-50">
        <AdminNavbar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
