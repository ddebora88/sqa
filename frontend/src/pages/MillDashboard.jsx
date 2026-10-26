import { useEffect, useState } from "react";
import { useAuth } from "../api/auth-context.jsx";
import { api } from "../api/client.js";
import HarvestList from "../components/HarvestList.jsx";

const FILTERS = [
  { value: "", label: "Semua" },
  { value: "pending", label: "Menunggu" },
  { value: "approved", label: "Disetujui" },
  { value: "rejected", label: "Ditolak" },
];

export default function MillDashboard() {
  const { session } = useAuth();
  const [harvests, setHarvests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

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

  async function decide(id, decision) {
    setBusyId(id);
    setError("");
    try {
      await api.decideHarvest(session.token, id, { decision });
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const visible = filter ? harvests.filter((h) => h.status === filter) : harvests;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-leaf-800">Batch Panen Masuk</h2>
        <div className="flex gap-1 text-sm">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1 rounded-full border ${
                filter === f.value
                  ? "bg-leaf-700 text-white border-leaf-700"
                  : "border-gray-300 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

      {loading ? (
        <p className="text-gray-500 text-sm">Memuat...</p>
      ) : (
        <HarvestList
          harvests={visible}
          renderActions={(h) =>
            h.status === "pending" && (
              <div className="flex gap-2 mt-3">
                <button
                  disabled={busyId === h.id}
                  onClick={() => decide(h.id, "approved")}
                  className="flex-1 bg-leaf-700 hover:bg-leaf-800 disabled:opacity-60 text-white text-sm py-1.5 rounded-md"
                >
                  Setujui
                </button>
                <button
                  disabled={busyId === h.id}
                  onClick={() => decide(h.id, "rejected")}
                  className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 disabled:opacity-60 text-sm py-1.5 rounded-md"
                >
                  Tolak
                </button>
              </div>
            )
          }
        />
      )}
    </div>
  );
}
