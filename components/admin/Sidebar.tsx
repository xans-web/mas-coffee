"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { 
  Sun, Moon, Layout, Menu as MenuIcon, Image, 
  Bell, Mail, Globe, MapPin, Package, Home, ChevronLeft, ChevronRight, X 
} from "lucide-react";

interface SidebarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  isLightMode?: boolean;
  toggleTheme?: () => void;
}

export default function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  isLightMode, 
  toggleTheme 
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cafeMenuLinks = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "menu", label: "Menu Items", icon: MenuIcon },
    { id: "categories", label: "Categories", icon: Layout },
    { id: "settings", label: "Settings", icon: Bell },
  ];

  const mainWebsiteLinks = [
    { id: "hero", label: "Hero Manager", icon: Image, path: "/admin/hero" },
    { id: "products", label: "Product Manager", icon: Package, path: "/admin/products" },
    { id: "lookbook", label: "Lookbook", icon: Layout, path: "/admin/lookbook" },
    { id: "events", label: "Event Manager", icon: Bell, path: "/admin/events" },
    { id: "map-settings", label: "Map Settings", icon: MapPin, path: "/admin/map-settings" },
    { id: "inquiries", label: "Inquiries", icon: Mail, path: "/admin/inquiries" },
  ];

  const handleCafeLinkClick = (id: string) => {
    if (pathname === "/admin/dashboard") {
      onTabChange?.(id);
    } else {
      router.push(`/admin/dashboard?tab=${id}`);
    }
    setIsMobileMenuOpen(false);
  };

  const handleWebsiteLinkClick = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-17.5 bg-[#0B2421] border-b border-[#C5A367]/20 z-1100 flex items-center justify-between px-6 shadow-md">
        <h1 className="text-lg font-serif text-[#C5A367] uppercase tracking-widest font-black truncate">
          Admin Panel
        </h1>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 text-[#C5A367] focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-8 h-8" /> : <MenuIcon className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-1050 bg-[#0B2421] flex flex-col p-6 pt-24 overflow-y-auto transition-all">
          <div className="flex flex-col gap-8 w-full">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-[#C5A367]/50 uppercase tracking-[0.3em] px-4">
                Section 1: Cafe Menu Admin
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {cafeMenuLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleCafeLinkClick(link.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all shadow-lg ${
                      pathname === "/admin/dashboard" && activeTab === link.id
                        ? "bg-[#C5A367] text-[#0B2421]" 
                        : "text-[#F5EFE0]/60 bg-[#0B2421] border border-[#C5A367]/10 hover:bg-[#C5A367]/5"
                    }`}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span className="font-black uppercase tracking-[0.2em] text-xs">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-[#C5A367] uppercase tracking-[0.3em] px-4 border-t border-[#C5A367]/10 pt-8">
                Section 2: Main Website Admin
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {mainWebsiteLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleWebsiteLinkClick(link.path)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
                      pathname === link.path 
                        ? "bg-[#C5A367] text-[#0B2421]" 
                        : "text-[#F5EFE0]/60 bg-[#0B2421] border border-[#C5A367]/10 hover:bg-[#C5A367]/5"
                    }`}
                  >
                    <link.icon className="w-5 h-5 shrink-0" />
                    <span className="font-black uppercase tracking-[0.2em] text-xs">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#C5A367]/20 flex flex-col gap-4">
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-6 px-8 py-4 rounded-2xl text-[#C5A367] bg-zinc-900/50 border border-[#C5A367]/20"
              >
                {isLightMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                <span className="font-black uppercase tracking-[0.2em] text-sm">Toggle Theme</span>
              </button>
              <button 
                onClick={() => { localStorage.removeItem("admin_authenticated"); router.push("/admin"); }} 
                className="flex items-center gap-6 px-8 py-4 rounded-2xl text-red-400 bg-red-500/10 border border-red-500/30"
              >
                <X className="w-6 h-6" />
                <span className="font-black uppercase tracking-[0.2em] text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-[#0B2421] border-r border-[#C5A367]/20 shadow-xl transition-all duration-300 z-50 sticky top-0 h-screen ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="h-17.5 flex items-center justify-between px-4 border-b border-[#C5A367]/20">
          {isSidebarOpen && <h1 className="text-xl font-serif text-[#C5A367] uppercase tracking-widest truncate font-black">Admin Panel</h1>}
          <div className="flex items-center gap-1">
            <button 
              onClick={toggleTheme}
              className="p-2 text-[#C5A367] hover:bg-[#C5A367]/10 rounded-full transition-colors"
              title="Toggle Theme"
            >
              {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-[#C5A367] hover:bg-[#C5A367]/10 rounded-full transition-colors">
              {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-8 px-3 space-y-8">
          {/* SECTION 1: CAFE MENU */}
          <div className="space-y-6">
            {isSidebarOpen && (
              <h3 className="px-4 text-[10px] font-black text-[#C5A367]/50 uppercase tracking-[0.3em]">
                Section 1: Cafe Menu Admin
              </h3>
            )}
            <nav className="space-y-2">
              {cafeMenuLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleCafeLinkClick(link.id)}
                  className={`flex items-center gap-4 px-4 py-3 w-full rounded-lg transition-all group ${
                    pathname === "/admin/dashboard" && activeTab === link.id
                      ? "bg-[#C5A367] text-[#0B2421] shadow-lg" 
                      : "text-[#F5EFE0]/60 hover:bg-[#C5A367]/10 hover:text-[#C5A367]"
                  }`}
                  title={link.label}
                >
                  <link.icon className={`w-5 h-5 shrink-0 ${pathname === "/admin/dashboard" && activeTab === link.id ? "text-[#0B2421]" : "text-[#C5A367]"}`} />
                  {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px] truncate">{link.label}</span>}
                </button>
              ))}
            </nav>
          </div>

          {/* SECTION 2: MAIN WEBSITE */}
          <div className="space-y-6">
            {isSidebarOpen && (
              <h3 className="px-4 text-[10px] font-black text-[#C5A367] uppercase tracking-[0.3em] border-t border-[#C5A367]/10 pt-8">
                Section 2: Main Website Admin
              </h3>
            )}
            <nav className="space-y-2">
              {mainWebsiteLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                    pathname === link.path 
                      ? "bg-[#C5A367] text-[#0B2421] shadow-lg" 
                      : "text-[#F5EFE0]/60 hover:bg-[#C5A367]/10 hover:text-[#C5A367]"
                  }`}
                  title={link.label}
                >
                  <link.icon className={`w-5 h-5 shrink-0 ${pathname === link.path ? "text-[#0B2421]" : "text-[#C5A367]"}`} />
                  {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px] truncate">{link.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-6 border-t border-[#C5A367]/20 space-y-3">
          <button 
            onClick={() => { localStorage.removeItem("admin_authenticated"); router.push("/admin"); }} 
            className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">Logout</span>}
          </button>
          <Link href="/" className="flex items-center gap-4 px-4 py-3 w-full rounded-lg text-[#F5EFE0]/40 hover:bg-[#C5A367]/10 hover:text-[#C5A367] transition-colors">
            <Globe className="w-5 h-5 shrink-0" />
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">View Site</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}
