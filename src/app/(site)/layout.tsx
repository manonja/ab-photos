import Navbar from "@/components/navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="flex min-h-screen flex-col items-center justify-between p-6">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
