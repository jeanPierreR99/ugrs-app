"use client";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        collapse={collapse}
        setCollapse={setCollapse}
      />

      <div
        className={`min-h-screen transition-all duration-300 relative z-[9] ml-20 ${collapse ? "" : "lg:ml-[260px]"
          }`}
      >
        <AdminHeader />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}