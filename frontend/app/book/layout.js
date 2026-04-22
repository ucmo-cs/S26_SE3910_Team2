export default function BookLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-74px)]">
      <div className="px-6 py-8">{children}</div>
    </div>
  );
}
