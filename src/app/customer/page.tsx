import type { Metadata } from "next";
import CustomerDashboard from "@/components/dashboard/CustomerDashboard";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Manage your SalonBook appointments and account.",
};

export default function CustomerPage() {
  return <CustomerDashboard />;
}
