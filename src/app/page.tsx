
import BackendStatus from "@/components/BackendStatus";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          SalonBook
        </h1>

        <p className="mb-8 text-gray-600">
          Your salon appointment booking platform.
        </p>

        <BackendStatus />
      </div>
    </main>
  );
}
