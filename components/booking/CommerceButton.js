export default function CommerceButton({
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold border-2 rounded-none transition focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const primary =
    "bg-[#006747] border-[#006747] text-white hover:bg-black hover:border-black";

  const secondary =
    "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400";

  return (
    <button
      className={`${base} ${variant === "primary" ? primary : secondary} ${className}`}
      {...props}
    />
  );
}
