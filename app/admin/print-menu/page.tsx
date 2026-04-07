"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Printer, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: number;
  name_en: string;
  name_am: string;
  description_en: string;
  description_am: string;
  price: number;
}

interface MenuSection {
  id: string;
  category_en: string;
  category_am: string;
  items: MenuItem[];
}

interface Settings {
  hotelName: string;
  hotelSlogan: string;
  logo: string;
}

export default function PrintMenuPage() {
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, settingsRes] = await Promise.all([
          fetch("/api/menu"),
          fetch("/api/settings")
        ]);
        
        if (menuRes.ok) setMenuData(await menuRes.json());
        if (settingsRes.ok) {
           const settingsData = await settingsRes.json();
           setSettings(settingsData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <div className="text-lg animate-pulse tracking-widest uppercase font-black">Generating A5 Menu...</div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Flatten all items for pagination
  const allSections = menuData;
  
  // Simple split: Page 1 gets first ~half of categories, Page 2 gets the rest
  const page1Categories = allSections.slice(0, Math.ceil(allSections.length / 2));
  const page2Categories = allSections.slice(Math.ceil(allSections.length / 2));

  const renderItem = (item: MenuItem) => (
    <div key={item.id} className="flex items-baseline gap-0.5 leading-[1.3] py-[0.5px]">
      <span className="text-[9pt] font-bold text-black flex-shrink-0 max-w-[72%] truncate">
        {item.name_en}
      </span>
      <div className="flex-1 border-b border-dotted border-black/15 mb-[2px] min-w-[8px]" />
      <span className="text-[9pt] font-bold text-black flex-shrink-0 tabular-nums">
        {item.price}
      </span>
    </div>
  );

  const renderSection = (section: MenuSection) => (
    <div key={section.id} className="break-inside-avoid mb-2">
      <h2 className="text-[8pt] font-black text-white bg-black px-1.5 py-[2px] mb-1 uppercase tracking-tight w-fit leading-tight">
        {section.id.replace(/-/g, ' ')}
      </h2>
      <div className="flex flex-col gap-0">
        {section.items.map(renderItem)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-200 py-10 print:py-0 print:bg-white overflow-x-hidden font-condensed">
      {/* Precision Controls */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-black text-white rounded-full shadow-2xl flex items-center gap-4 print:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-[#D4AF37] transition-colors text-[10px] font-bold uppercase tracking-wider">
          <ChevronLeft className="w-3 h-3" />
          Dashboard
        </Link>
        <div className="h-4 w-px bg-white/20" />
        <button
          onClick={handlePrint}
          className="px-6 py-2 bg-[#D4AF37] text-black text-[11px] font-black uppercase tracking-widest rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.5)] border-2 border-white/20"
        >
          <Printer className="w-4 h-4" />
          Print A5
        </button>
      </div>

      <div className="flex flex-col items-center gap-10 print:gap-0">
        
        {/* ═══════════════════ PAGE 1 (A5 STRICT) ═══════════════════ */}
        <div className="print-canvas bg-white shadow-2xl relative overflow-hidden" 
          style={{ width: '148mm', height: '210mm', padding: '5mm', boxSizing: 'border-box' }}>
          
          {/* ── HOTEL NAME BAR ── */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <img src={settings?.logo || "/logo.png"} alt="Logo" className="w-7 h-7 object-contain grayscale" />
              <h1 className="text-[11pt] font-black tracking-tighter text-black uppercase leading-none">
                {settings?.hotelName || "ABAY HOTEL"}
              </h1>
            </div>
            <span className="text-[6pt] text-neutral-400 font-bold uppercase tracking-widest">PAGE I</span>
          </div>

          {/* ── HIGH-IMPACT QR FRAME (Centered) ── */}
          <div className="flex justify-center mb-3">
            <div className="px-4 py-3 flex items-center gap-4 bg-neutral-50 rounded-lg">
              
              {/* Phone Mockup */}
              <div className="w-[55px] h-[95px] bg-white border-2 border-black/80 rounded-lg overflow-hidden flex flex-col shadow-md relative">
                {/* Phone Notch */}
                <div className="w-[20px] h-[3px] bg-black/60 rounded-full mx-auto mt-[2px]" />
                {/* Mini Screen */}
                <div className="flex-1 px-1 pt-1 pb-0.5 flex flex-col">
                  <div className="bg-[#D4AF37] text-black text-center py-[1px] rounded-sm mb-0.5">
                    <span style={{ fontSize: '4pt', fontWeight: 900, letterSpacing: '0.05em' }}>DIGITAL MENU</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-start gap-[1px]">
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontSize: '3.5pt', fontWeight: 700, color: '#000' }}>Doro Wot</span>
                      <span style={{ fontSize: '3.5pt', fontWeight: 900, color: '#D4AF37' }}>700</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontSize: '3.5pt', fontWeight: 700, color: '#000' }}>Shiro</span>
                      <span style={{ fontSize: '3.5pt', fontWeight: 900, color: '#D4AF37' }}>200</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontSize: '3.5pt', fontWeight: 700, color: '#000' }}>Coffee</span>
                      <span style={{ fontSize: '3.5pt', fontWeight: 900, color: '#D4AF37' }}>50</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span style={{ fontSize: '3.5pt', fontWeight: 700, color: '#000' }}>Key Wot</span>
                      <span style={{ fontSize: '3.5pt', fontWeight: 900, color: '#D4AF37' }}>850</span>
                    </div>
                  </div>
                </div>
                {/* Home Button */}
                <div className="w-[8px] h-[8px] border border-black/30 rounded-full mx-auto mb-[2px]" />
              </div>

              {/* Center: Scan Text */}
              <div className="flex flex-col items-center justify-center gap-1">
                <span className="text-[7pt] font-black text-black uppercase tracking-tight leading-tight text-center">
                  SCAN TO SEE<br/>FULL MENU<br/>WITH PHOTOS
                </span>
                <div className="w-8 h-[1px] bg-[#D4AF37]" />
                <span className="text-[5pt] font-bold text-neutral-400 uppercase tracking-widest text-center">
                  {settings?.hotelName || "ABAY HOTEL"}
                </span>
              </div>

              {/* QR Code */}
              <div className="border-2 border-black/20 rounded-md p-1 bg-white">
                <QRCodeSVG 
                  value="https://abayhotel.vercel.app" 
                  size={65}
                  level="M"
                  includeMargin={false}
                />
              </div>
            </div>
          </div>

          {/* ── 3-COLUMN FOOD GRID ── */}
          <div className="columns-3 gap-4 print:columns-3" style={{ height: 'calc(100% - 42mm)' }}>
            {page1Categories.map(renderSection)}
          </div>

          <div className="absolute bottom-[3mm] left-[5mm] text-[6pt] font-bold text-neutral-300 uppercase tracking-widest">
            {settings?.hotelName || "ABAY HOTEL"} © 2026 • PAGE I
          </div>
        </div>

        {/* ═══════════════════ PAGE 2 (A5 STRICT) ═══════════════════ */}
        <div className="print-canvas bg-white shadow-2xl relative overflow-hidden" 
          style={{ width: '148mm', height: '210mm', padding: '5mm', boxSizing: 'border-box', pageBreakBefore: 'always' as const }}>
          
          {/* Page 2 Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
            <div className="flex items-center gap-2">
              <img src={settings?.logo || "/logo.png"} alt="Logo" className="w-7 h-7 object-contain grayscale" />
              <h2 className="text-[11pt] font-black tracking-tighter text-black uppercase leading-none">
                {settings?.hotelName || "ABAY HOTEL"}
              </h2>
            </div>
            <span className="text-[7pt] text-neutral-400 font-black uppercase tracking-widest">PAGE II</span>
          </div>

          {/* ── 3-COLUMN FOOD GRID ── */}
          <div className="columns-3 gap-4 print:columns-3" style={{ height: 'calc(100% - 18mm)' }}>
            {page2Categories.map(renderSection)}
          </div>

          <div className="absolute bottom-[3mm] right-[5mm] text-[6pt] font-bold text-neutral-300 uppercase tracking-widest text-right">
            DIGITAL MENU: ABAYHOTEL.VERCEL.COM
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700;900&display=swap');

        body {
          font-family: 'Roboto Condensed', 'Arial Narrow', sans-serif;
          -webkit-font-smoothing: antialiased;
          background-color: #f5f5f5;
        }

        @media print {
          body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important;
            font-family: 'Roboto Condensed', 'Arial Narrow', sans-serif !important;
          }
          .print-canvas {
            box-shadow: none !important;
            margin: 0 !important;
            border-radius: 0 !important;
            width: 148mm !important;
            height: 210mm !important;
            padding: 5mm !important;
            page-break-after: always !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden, .fixed { display: none !important; }
        }

        @page {
          size: A5;
          margin: 0;
        }

        .break-inside-avoid {
          break-inside: avoid;
        }

        .font-condensed {
          font-family: 'Roboto Condensed', 'Arial Narrow', sans-serif;
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
      `}</style>
    </div>
  );
}
