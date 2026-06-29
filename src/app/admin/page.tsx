import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function AdminGateway() {
  const authenticated = await verifySession();
  if (authenticated) redirect("/admin/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#f8f8f8]">
      <div className="w-full max-w-sm animate-fade-up">
        <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted mt-1">
              Sign in to manage your portfolio
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
