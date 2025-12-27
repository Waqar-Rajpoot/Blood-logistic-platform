import ReceiverNavbar from "@/components/ReceiverNavbar";

export default function ReceiverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <ReceiverNavbar />
      <main>
        {children}
      </main>
    </div>
  );
}