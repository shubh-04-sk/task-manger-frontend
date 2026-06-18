interface Props {
  priority: string;
  setPriority: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
}

export default function FilterBar({
  priority,
  setPriority,
  status,
  setStatus,
}: Props) {
  const priorities = ["All", "High", "Medium", "Low"];
  const statuses = ["All", "Pending", "Completed"];

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 backdrop-blur-md p-4 px-6 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] mb-8 border border-white/80">
      {/* Priority Pill Group */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:ml-2">Priority</span>
        <div className="flex flex-wrap gap-2">
          {priorities.map((p) => {
            const isActive = priority === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm shadow-[#2563eb]/20 scale-105"
                    : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Pill Group */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 sm:ml-2">Status</span>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const isActive = status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#2563eb] text-white shadow-sm shadow-[#2563eb]/20 scale-105"
                    : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 hover:text-slate-800"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

