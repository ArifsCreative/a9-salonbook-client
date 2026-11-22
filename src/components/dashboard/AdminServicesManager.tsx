"use client";

import { useEffect, useState, type FormEvent } from "react";
import Container from "@/components/layout/Container";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  LoaderCircle,
  X,
  Upload,
  Scissors,
} from "lucide-react";

interface SalonService {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
}

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const emptyForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
};

export default function AdminServicesManager() {
  const [token, setToken] = useState("");
  const [services, setServices] = useState<SalonService[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        if (!API) throw new Error("API URL is not configured.");

        const authResponse = await fetch(`${API}/api/auth/token`, {
          credentials: "include",
        });

        const authData = await authResponse.json();

        if (!authResponse.ok || !authData.token) {
          throw new Error("Please sign in again as an administrator.");
        }

        const authToken = authData.token;

        const profileResponse = await fetch(`${API}/api/profile/me`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const profileData = await profileResponse.json();

        if (
          !profileResponse.ok ||
          !profileData.success ||
          profileData.profile?.role !== "admin"
        ) {
          throw new Error("Administrator access is required.");
        }

        const response = await fetch(`${API}/api/services/admin/all`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load services.");
        }

        if (!cancelled) {
          setToken(authToken);
          setServices(data.services);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const refreshServices = async () => {
    const response = await fetch(`${API}/api/services/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to refresh services.");
    }

    setServices(data.services);
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (service: SalonService) => {
    setEditingId(service._id);
    setForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
    });
    setImageFile(null);
    setShowForm(true);
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      let imageUrl = "";

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadResponse = await fetch(`${API}/api/images/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: uploadData,
        });

        const uploaded = await uploadResponse.json();

        if (!uploadResponse.ok || !uploaded.success) {
          throw new Error(uploaded.message || "Image upload failed.");
        }

        imageUrl = uploaded.image.url;
      }

      if (!editingId && !imageUrl) {
        throw new Error("Please select a service image.");
      }

      const payload = {
        ...form,
        price: Number(form.price),
        duration: Number(form.duration),
        ...(imageUrl ? { image: imageUrl } : {}),
      };

      const response = await fetch(
        `${API}/api/services${editingId ? `/${editingId}` : ""}`,
        {
          method: editingId ? "PATCH" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save service.");
      }

      await refreshServices();

      setMessage(
        editingId
          ? "Service updated successfully."
          : "New service added successfully.",
      );

      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (service: SalonService) => {
    try {
      const response = await fetch(`${API}/api/services/${service._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: service.status === "active" ? "inactive" : "active",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update service status.");
      }

      await refreshServices();
      setMessage("Service availability updated.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    }
  };

  const deleteService = async (service: SalonService) => {
    if (!window.confirm(`Delete "${service.serviceName}" permanently?`)) {
      return;
    }

    try {
      const response = await fetch(`${API}/api/services/${service._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete service.");
      }

      await refreshServices();
      setMessage("Service deleted successfully.");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deletion failed.");
    }
  };

  const filteredServices = services.filter((service) =>
    `${service.serviceName} ${service.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-[#F6F3ED] py-12 sm:py-16">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="sb-label text-[#633B45]">
              SALONBOOK / ADMINISTRATION
            </p>
            <h1 className="mt-4 font-serif text-4xl text-[#211F20] sm:text-5xl">
              Service management.
            </h1>
            <p className="mt-3 text-sm text-[#746B62]">
              Manage your salon collection, pricing and availability.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(true);
              setError("");
              setMessage("");
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#633B45] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#211F20]"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>

        {(error || message) && (
          <div
            role="alert"
            className={`mt-7 border px-5 py-4 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {showForm && (
          <section className="mt-10 border border-[#D8CEC1] bg-white p-6 sm:p-9">
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="sb-label text-[#AA8964]">SERVICE DETAILS</p>
                <h2 className="mt-2 font-serif text-3xl text-[#211F20]">
                  {editingId ? "Edit service." : "Create a service."}
                </h2>
              </div>

              <button
                type="button"
                onClick={resetForm}
                aria-label="Close form"
                className="text-[#746B62] hover:text-[#633B45]"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Service name
                </label>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={form.serviceName}
                  onChange={(e) =>
                    setForm({ ...form, serviceName: e.target.value })
                  }
                  className="h-12 w-full border border-[#D8CEC1] px-4 text-sm outline-none focus:border-[#AA8964]"
                  placeholder="Signature Haircut"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Category
                </label>
                <input
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="h-12 w-full border border-[#D8CEC1] px-4 text-sm outline-none focus:border-[#AA8964]"
                  placeholder="Hair Care"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Price (USD)
                </label>
                <input
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="h-12 w-full border border-[#D8CEC1] px-4 text-sm outline-none focus:border-[#AA8964]"
                  placeholder="45"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Duration (minutes)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  className="h-12 w-full border border-[#D8CEC1] px-4 text-sm outline-none focus:border-[#AA8964]"
                  placeholder="45"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Description
                </label>
                <textarea
                  required
                  minLength={5}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={4}
                  className="w-full border border-[#D8CEC1] p-4 text-sm outline-none focus:border-[#AA8964]"
                  placeholder="Describe the salon experience..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-semibold text-[#211F20]">
                  Service image {editingId ? "(optional)" : ""}
                </label>
                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-[#AA8964] bg-[#F6F3ED] p-5 text-sm text-[#633B45]">
                  <Upload size={20} />
                  <span>
                    {imageFile
                      ? imageFile.name
                      : "Choose JPG, PNG or WEBP image (maximum 5 MB)"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-3 sm:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-[#633B45] px-7 py-4 text-sm font-semibold text-white hover:bg-[#211F20] disabled:opacity-60"
                >
                  {saving ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Service"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-[#D8CEC1] px-7 py-4 text-sm text-[#746B62] hover:border-[#633B45]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="mt-12">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="sb-label text-[#AA8964]">YOUR COLLECTION</p>
              <h2 className="mt-2 font-serif text-3xl text-[#211F20]">
                All services ({services.length})
              </h2>
            </div>

            <div className="flex gap-3">
              <input
                type="search"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full border border-[#D8CEC1] bg-white px-4 text-sm outline-none focus:border-[#AA8964] sm:w-64"
              />

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  refreshServices()
                    .then(() => setError(""))
                    .catch((err: unknown) =>
                      setError(
                        err instanceof Error ? err.message : "Refresh failed.",
                      ),
                    )
                    .finally(() => setLoading(false));
                }}
                aria-label="Refresh services"
                className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#D8CEC1] bg-white text-[#633B45]"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#746B62]">
              <LoaderCircle size={20} className="animate-spin" />
              Loading service catalogue...
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="border border-[#D8CEC1] bg-white py-16 text-center">
              <Scissors size={28} className="mx-auto text-[#AA8964]" />
              <p className="mt-4 font-serif text-2xl text-[#211F20]">
                No services found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-[#D8CEC1] bg-white">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-[#211F20] text-white">
                  <tr className="text-xs">
                    <th className="p-5 font-medium">Service</th>
                    <th className="p-5 font-medium">Category</th>
                    <th className="p-5 font-medium">Price</th>
                    <th className="p-5 font-medium">Duration</th>
                    <th className="p-5 font-medium">Status</th>
                    <th className="p-5 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr
                      key={service._id}
                      className="border-t border-[#EAE5DD] text-sm"
                    >
                      <td className="p-5 font-semibold text-[#211F20]">
                        {service.serviceName}
                      </td>
                      <td className="p-5 text-[#746B62]">{service.category}</td>
                      <td className="p-5 font-semibold text-[#633B45]">
                        ${service.price.toFixed(2)}
                      </td>
                      <td className="p-5 text-[#746B62]">
                        {service.duration} min
                      </td>
                      <td className="p-5">
                        <span
                          className={
                            service.status === "active"
                              ? "text-green-700"
                              : "text-red-700"
                          }
                        >
                          {service.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleEdit(service)}
                            aria-label={`Edit ${service.serviceName}`}
                            className="text-[#633B45] hover:text-[#AA8964]"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void toggleStatus(service)}
                            className="text-xs text-[#746B62] underline"
                          >
                            {service.status === "active"
                              ? "Deactivate"
                              : "Activate"}
                          </button>

                          <button
                            type="button"
                            onClick={() => void deleteService(service)}
                            aria-label={`Delete ${service.serviceName}`}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
