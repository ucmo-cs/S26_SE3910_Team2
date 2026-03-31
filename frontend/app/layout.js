import "./globals.css";
import { Open_Sans } from "next/font/google";
import SiteNav from "../components/SiteNav";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-open-sans",
  display: "swap",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${openSans.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}
      >
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
          <SiteNav />
          {children}
        </div>
      </body>
    </html>
  );
}
