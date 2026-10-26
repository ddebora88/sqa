import { useEffect, useState } from "react";
import { useAuth } from "../api/auth-context.jsx";
import { api } from "../api/client.js";
import HarvestList from "../components/HarvestList.jsx";

export default function FarmerDashboard() {
  const { session } = useAuth();
  const [harvests, setHarvests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    weightKg: "",
    location: "",
    harvestDate: "",
    notes: "",
    photo: null,
  });
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const data = await api.listHarvests(session.token);
      setHarvests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field) {
    return (e) =>
      setForm((f) => ({
        ...f,
        [field]: field === "photo" ? e.target.files?.[0] ?? null : e.target.value,
      }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("weightKg", form.weightKg);
      fd.append("location", form.location);
      fd.append("harvestDate", form.harvestDate);
      fd.append("notes", form.notes);
      if (form.photo) fd.append("photo", form.photo);

      await api.submitHarvest(session.token, fd);
      setForm({ weightKg: "", location: "", harvestDate: "", notes: "", photo: null });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-leaf-800 mb-4">Catat Panen Baru</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Berat (kg)"
              type="number"
              min="0.1"
              step="0.1"
              value={form.weightKg}
              onChange={update("weightKg")}
              required
            />
            <Field
              label="Tanggal panen"
              type="date"
              value={form.harvestDate}
              onChange={update("harvestDate")}
              required
            />
          </div>
          <Field
            label="Lokasi / blok"
            value={form.location}
            onChange={update("location")}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (opsional)
            </label>
            <textarea
              value={form.notes}
              onChange={update("notes")}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-leaf-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto (opsional, JPG/PNG/WEBP, maks 5MB)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={update("photo")}
              className="w-full text-sm"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-leaf-700 hover:bg-leaf-800 disabled:opacity-60 text-white py-2.5 rounded-md font-medium"
          >
            {submitting ? "Mengirim..." : "Kirim Data Panen"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-leaf-800 mb-4">Riwayat Panen Saya</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Memuat...</p>
        ) : (
          <HarvestList harvests={harvests} />
        )}
      </section>
    </div>
  );
}

function Field({ label, ...inputProps }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...inputProps}
        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-leaf-600"
      />
    </div>
  );
}
