import "./globals.css";
import { Open_Sans } from "next/font/google";

const openSans = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${openSans.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
