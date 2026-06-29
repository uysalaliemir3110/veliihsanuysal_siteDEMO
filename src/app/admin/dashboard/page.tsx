import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import AdminDashboard from "./admin-dashboard";

export default async function DashboardPage() {
  const authenticated = await verifySession();
  if (!authenticated) redirect("/admin");

  return <AdminDashboard />;
}
