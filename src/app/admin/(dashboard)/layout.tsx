import AdminSidebar from "@/components/admin/AdminSidebar";

// Admin pages are behind auth and always need fresh data, so they should
// never be statically prerendered at build time (which would also require
// DB access during the Docker build, before the runtime volume is mounted).
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505] text-cream flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 md:p-12 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}
