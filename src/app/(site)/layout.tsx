import Navbar from "@/components/navbar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">
      <Navbar />
      {children}
    </main>
  );
}
