"use client";

export default function StepTopic({ topics, topicId, setTopicId }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Select a Topic</h2>
        <p className="mt-1 text-slate-600">
          Choose the reason for your appointment.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {topics.map((t) => {
          const active = t.id === topicId;

          return (
            <button
              key={t.id}
              onClick={() => setTopicId(t.id)}
              className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                active
                  ? "border-[#006747] bg-[#006747]/5 shadow-sm"
                  : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              }`}
            >
              <p className="text-base font-semibold text-slate-900">{t.name}</p>
              <p className="mt-1 text-sm text-slate-600">
                Select this topic to filter available branches.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    active ? "text-[#006747]" : "text-slate-500"
                  }`}
                >
                </span>
              </div>

              <div className={`mt-3 h-1 w-16 ${active ? "bg-[#006747]" : "bg-slate-200"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
