import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/context/AdminContext";

export const metadata: Metadata = {
  title: "Khanate MUN | Empowering Youth through Diplomacy",
  description: "Official website of Khanate MUN. Join us for a journey of diplomacy, leadership, and global impact.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminProvider>
          <Header />
          <div style={{ flex: 1, minHeight: 'calc(100vh - 80px - 200px)' }}>
            {children}
          </div>
          <Footer />
        </AdminProvider>
      </body>
    </html>
  );
}
