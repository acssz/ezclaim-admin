import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getSession, toClientSession } from "@/lib/auth/session";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "EzClaim Admin",
  description: "Administration console for EzClaim",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = toClientSession(getSession());

  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider session={session}>{children}</AuthProvider>
      </body>
    </html>
  );
}
