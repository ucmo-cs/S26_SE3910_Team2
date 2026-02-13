"use client";

export default function StepBranch({ branches, branchId, setBranchId }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Select a Branch</h2>
        <p className="mt-1 text-slate-600">
          Branches shown are filtered to support the selected topic.
        </p>
      </div>

      {branches.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          No branches available for this topic.
        </div>
      ) : (
        <div className="space-y-4">
          {branches.map((b) => {
            const active = b.id === branchId;

            return (
              <button
                key={b.id}
                onClick={() => setBranchId(b.id)}
                className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                  active
                    ? "border-[#006747] bg-[#006747]/5 shadow-sm"
                    : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {b.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{b.address}</p>
                  </div>

                  <span
                    className={`mt-1 text-xs font-semibold uppercase tracking-widest ${
                      active ? "text-[#006747]" : "text-slate-500"
                    }`}
                  >
                    {active ? "Selected" : "Available"}
                  </span>
                </div>

                <div className={`mt-4 h-1 w-16 ${active ? "bg-[#006747]" : "bg-slate-200"}`} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
