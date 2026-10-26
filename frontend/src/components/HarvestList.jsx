const STATUS_STYLES = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-leaf-100 text-leaf-800",
  rejected: "bg-red-100 text-red-700",
};

const STATUS_LABEL = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
};

export default function HarvestList({ harvests, renderActions }) {
  if (!harvests.length) {
    return (
      <p className="text-gray-500 text-sm py-6 text-center">
        Belum ada data panen.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {harvests.map((h) => (
        <li
          key={h.id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">
                {h.weightKg} kg · {h.location}
              </p>
              <p className="text-sm text-gray-500">
                Tanggal panen: {h.harvestDate}
              </p>
              {h.notes && (
                <p className="text-sm text-gray-600 mt-1">{h.notes}</p>
              )}
              {h.millNote && (
                <p className="text-sm text-gray-500 mt-1 italic">
                  Catatan PKS: {h.millNote}
                </p>
              )}
            </div>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[h.status]}`}
            >
              {STATUS_LABEL[h.status]}
            </span>
          </div>
          {renderActions && renderActions(h)}
        </li>
      ))}
    </ul>
  );
}
