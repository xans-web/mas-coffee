import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "Abay Restaurant | Premium Luxury Dining in Ethiopia",
  description: "Discover the best traditional food and drinks at Abay Restaurant. View our luxury menu, prices, and location online.",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Abay Restaurant | Premium Luxury Dining in Ethiopia",
    description: "Discover the best traditional food and drinks at Abay Restaurant. View our luxury menu, prices, and location online.",
    images: [{ url: "/logo.svg", width: 1200, height: 630 }],
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
    <html lang="en" className="overflow-x-hidden touch-pan-y">
      <body
        className={`${inter.variable} ${geistMono.variable} ${playfair.variable} antialiased overflow-x-hidden touch-pan-y`}
        suppressHydrationWarning
      >
        <MenuProvider>
          {children}
          <Toaster
            position="bottom-right"
            richColors
            toastOptions={{
              classNames: {
                toast: "bg-[#0B2421] text-[#F5EFE0] border border-[#C5A367]/30",
              },
            }}
          />
        </MenuProvider>
      </body>
    </html>
  );
}
