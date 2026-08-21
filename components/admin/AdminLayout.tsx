import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="ml-[260px] min-h-screen">
        <AdminHeader />

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
