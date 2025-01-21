import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Footer from "./components/screens/footer";
import AuthProvider from "./providers/auth";
import { Toaster } from "./components/ui/sonner";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "Dapper date",
  description: "Horários e agendamentos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunito.className} dark`}>
        <AuthProvider>
          <div className="flex-1 pb-5">{children}</div>
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
