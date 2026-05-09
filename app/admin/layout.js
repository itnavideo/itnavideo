import AdminSidebar from "@/components/AdminSidebar";

export const metadata = {
  title: "Admin | Itnavideo",
  description: "Admin dashboard for managing Itnavideo.",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <main className="flex-1 p-8 lg:p-12">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
