import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { CoinProvider } from "./context/CoinContext";
import { SettingsProvider } from "./context/SettingsContext";
import Navbar from "./components/Navbar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Math Masters",
  description: "A fun educational game platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <SettingsProvider>
          <CoinProvider>
            <Navbar />
            {children}
            <footer className="w-full py-6 text-center text-slate-400 text-sm font-medium border-t border-slate-100 mt-12 bg-slate-50">
              Made with love by <span className="text-indigo-500">Ariverse Studio</span>
            </footer>
          </CoinProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
