import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "P2P Swap App",
  description: "A decentralized P2P token swap application",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="py-4 px-6 border-b">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="font-bold text-xl">P2P Swap</div>
            <ul className="flex gap-6">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/swap" className="hover:text-blue-600 transition-colors">
                  Swap
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
