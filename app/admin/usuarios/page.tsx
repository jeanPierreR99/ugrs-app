import { prisma } from "@/lib/prisma";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersTable from "./UsersTable";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      lastname: true,
      email: true,
      role: true,
      status: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminLayout>
      <UsersTable users={users} />
    </AdminLayout>
  );
}
