export default function ProgressBar({ step, steps }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {steps.map((label, idx) => {
          const done = idx < step;
          const active = idx === step;

          return (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full ${
                  done ? "bg-[#006747]" : active ? "bg-[#006747]/60" : "bg-slate-200"
                }`}
              />
              {idx !== steps.length - 1 ? (
                <div className="h-2 w-2 rounded-full bg-slate-200" />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Step <span className="font-semibold">{step + 1}</span> of{" "}
          <span className="font-semibold">{steps.length}</span>
        </p>
        <p className="text-sm font-semibold text-slate-900">{steps[step]}</p>
      </div>
    </div>
  );
}
