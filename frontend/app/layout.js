import "./globals.css";
import SiteNav from "../components/SiteNav";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  );
}
