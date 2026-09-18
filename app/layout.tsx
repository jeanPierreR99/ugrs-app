import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";
import { SocketProvider } from "./providers/SockerProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Monitoreo de Recolectores | MPT",
  description: "Sistema de monitoreo y seguimiento de vehículos recolectores de residuos sólidos de la Municipalidad Provincial de Tambopata.",
  icons: {
    icon: [{ url: "/logo-main.ico", rel: "icon", type: "image/x-icon" }],
    shortcut: [{ url: "/logo-main.ico", rel: "shortcut icon" }],
    apple: [{ url: "/logo-main.ico", rel: "apple-touch-icon" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SocketProvider>{children}</SocketProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
