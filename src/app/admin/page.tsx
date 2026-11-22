import type { Metadata } from "next";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage SalonBook operations and monitor business performance.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
