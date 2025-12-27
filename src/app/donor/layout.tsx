import DonorNavbar from "@/components/DonorNavbar";

export default function DonorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* This shows the header you are seeing */}
      <DonorNavbar />
      
      {/* This is the part that loads your UI for dashboard, alerts, etc. */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}