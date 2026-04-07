import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abay Restaurant | Premium Luxury Dining in Ethiopia",
  description: "Discover the best traditional food and drinks at Abay Restaurant. View our luxury menu, prices, and location online.",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Abay Restaurant | Premium Luxury Dining in Ethiopia",
    description: "Discover the best traditional food and drinks at Abay Restaurant. View our luxury menu, prices, and location online.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <MenuProvider>
          {children}
        </MenuProvider>
      </body>
    </html>
  );
}
