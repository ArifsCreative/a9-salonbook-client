import AdminCustomersManager from "@/components/dashboard/AdminCustomersManager";

export default function AdminCustomersPage() {
  return (
    <main className="min-h-screen bg-[#F6F3ED] px-4 py-14 md:px-8 md:py-20">
      <div className="mx-auto max-w-6xl">
        <AdminCustomersManager />
      </div>
    </main>
  );
}
