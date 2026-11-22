import type { Metadata } from "next";
import { Suspense } from "react";
import ServiceDetailsBooking from "@/components/services/ServiceDetailsBooking";

export const metadata: Metadata = {
  title: "Service Details",
  description:
    "Explore your selected SalonBook beauty service and request an appointment.",
};

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

async function ServiceDetailsContent({ params }: ServiceDetailsPageProps) {
  const { id } = await params;

  return <ServiceDetailsBooking serviceId={id} />;
}

function ServiceDetailsFallback() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#F6F3ED]">
      <p className="font-serif text-xl text-[#633B45]">
        Preparing your service experience...
      </p>
    </main>
  );
}

export default function ServiceDetailsPage({
  params,
}: ServiceDetailsPageProps) {
  return (
    <Suspense fallback={<ServiceDetailsFallback />}>
      <ServiceDetailsContent params={params} />
    </Suspense>
  );
}
