export default function BookLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      {/* Green accent bar */}
      <div className="h-2 w-full bg-[#78be20]" />

      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
