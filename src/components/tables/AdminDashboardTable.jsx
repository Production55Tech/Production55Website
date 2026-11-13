import { Trash2, Pencil } from "lucide-react";
import { useState } from "react";

// TODO: Remove these hardcoded shite
const COLUMNS = [
  { key: "thumbnail", label: "Thumbnail", width: 140, min: 120 },
  { key: "title", label: "Title", width: 240, min: 120 },
  { key: "date published", label: "Date Published", width: 150, min: 100 },
  { key: "actions", label: "Actions", width: 110, min: 110 },
];

const galleryItems = [
  {
    id: 1,
    thumbnail: "wow",
    title: "Sunset at the Pier",
    datePublished: "Nov 10, 2026",
  },
];

export default function AdminDashboardTable() {
  const [widths, setWidths] = useState(() => COLUMNS.map((c) => c.width));

  const startResize = (e, index) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = widths[index];
    const min = COLUMNS[index].min;

    const onMove = (ev) => {
      const next = Math.max(min, startWidth + ev.clientX - startX);
      setWidths((prev) => prev.map((w, i) => (i === index ? next : w)));
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const fixedTotal = widths.reduce((sum, w) => sum + (w ?? 0), 0);
  const [query, setQuery] = useState("");
  const filteredItems = galleryItems.filter((item) =>
    `${item.title} ${item.category} ${item.uploadedBy}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden rounded-lg bg-white/5">
      <div className="custom-scrollbar h-full overflow-auto">
        <table
          className="w-full table-fixed text-left text-sm text-white"
          style={{ minWidth: fixedTotal + 120 }}
        >
          <colgroup>
            {COLUMNS.map((col, i) => (
              <col key={col.key} style={widths[i] ? { width: widths[i] } : undefined} />
            ))}
          </colgroup>

          <thead className="sticky top-0 z-10 bg-[#232323] text-xs uppercase tracking-wide text-gray-400">
            <tr>
              {COLUMNS.map((col, i) => (
                <th
                  key={col.key}
                  className={`relative px-4 py-3 font-medium ${
                    col.key === "actions" ? "text-right" : ""
                  }`}
                >
                  <span className="block truncate">{col.label}</span>

                  {/* resize handle: every column except the last */}
                  {i < COLUMNS.length - 1 && (
                    <div
                      onPointerDown={(e) => startResize(e, i)}
                      className="group absolute -right-1.5 top-0 z-10 flex h-full w-3 cursor-col-resize touch-none items-center justify-center"
                    >
                      <div className="h-5 w-px bg-white/20 transition-colors group-hover:bg-prod-pink" />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr
                key={item.id}
                className="odd:bg-white/3 even:bg-white/4 cursor-pointer transition-colors hover:bg-white/10 font-prodFont"
              >
                <td className="px-4 py-3">
                  <img src={item.thumbnail} className="h-12 w-12 rounded-lg object-cover" />
                </td>
                <td className="truncate px-4 py-3 font-medium">{item.title}</td>
                <td className="truncate px-4 py-3 text-gray-300">{item.datePublished}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      title="Edit"
                      type="button"
                      aria-label={`Edit ${item.title}`}
                      className="rounded-lg p-3 text-gray-300 transition-colors hover:bg-white/10 hover:text-prod-pink"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      title="Delete :("
                      type="button"
                      aria-label={`Delete ${item.title}`}
                      className="rounded-lg p-3 text-gray-300 transition-colors hover:bg-red-500/20 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-12 text-center text-gray-400">
                  No images found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
