"use client";

// Force dynamic rendering to ensure real-time updates for users
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMenu } from "@/context/MenuContext";
import { Sun, Moon, MapPin, Clock, Phone, ChefHat, Info, Search, SlidersHorizontal, Menu, X, Globe } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const translations = {
  en: {
    title: "MAS COFFEE",
    subtitle: "Where Every Sip Tells a Story",
    search: "Search...",
    specials: "Chef's Recommendations",
    menu: "MENU",
    home: "Home",
    ourStory: "Our Story",
    contact: "Contact",
    checkout: "Checkout",
    cancel: "Cancel",
    total: "Total",
    items: "items",
    new: "New",
    soldOut: "Sold Out",
    special: "Special",
    clear: "Clear all filters",
    noMatch: "No dishes found matching your criteria.",
    contactInfo: "Contact Information",
    address: "Address",
    phone: "Phone",
    hours: "Opening Hours",
    hoursVal: "7 AM - 10 PM",
    callToOrder: "Call to Order",
    addressVal: "Mas Coffee Plaza, Addis Ababa, Ethiopia",
    phoneVal: "+251 911 234 567",
    storyTitle: "A Legacy of Flavor",
    storyText: "At Mas Coffee, we believe that coffee is more than just a drink—it's a journey. Founded on the principles of quality, community, and heritage, we source the finest beans from the heart of Ethiopia. Our 'Midnight Forest' experience is designed to transport you to the lush highlands where every bean is nurtured with care.",
    close: "Close",
    categories: {
      All: "All",
      "Yefisig (Meat Specialties)": "Yefisig",
      "Yetsom (Vegan/Fasting)": "Yetsom",
      "Soft Drinks": "Soft Drinks",
      "Alcoholic Drinks": "Alcohol",
      "Hot Drinks": "Hot Drinks",
      Special: "Special",
      New: "New"
    }
  },
  am: {
    title: "ማስ ኮፊ",
    subtitle: "እያንዳንዱ ጠብታ ታሪክ አለው",
    search: "ፈልግ...",
    specials: "የሼፍ ምርጫዎች",
    menu: "ሜኑ",
    home: "መነሻ",
    ourStory: "ታሪካችን",
    contact: "አድራሻ",
    checkout: "ክፈል",
    cancel: "አጥፋ",
    total: "ጠቅላላ",
    items: "ምግቦች",
    new: "አዲስ",
    soldOut: "አልቋል",
    special: "ልዩ",
    clear: "ሁሉንም አጥፋ",
    noMatch: "የፈለጉት ምግብ አልተገኘም።",
    contactInfo: "የመገናኛ መረጃ",
    address: "አድራሻ",
    phone: "ስልክ",
    hours: "የስራ ሰዓት",
    hoursVal: "ከጠዋቱ 1 ሰዓት - ከምሽቱ 4 ሰዓት",
    callToOrder: "ለመዘዝ ይደውሉ",
    addressVal: "ማስ ኮፊ ፕላዛ፣ አዲስ አበባ፣ ኢትዮጵያ",
    phoneVal: "+251 911 234 567",
    storyTitle: "የጣዕም ቅርስ",
    storyText: "በማስ ኮፊ፣ ቡና ከመጠጥ በላይ መሆኑን እናምናለን—ጉዞ ነው። በጥራት፣ በማህበረሰብ እና በቅርስ መርሆዎች ላይ የተመሰረተ፣ ምርጥ የቡና ፍሬዎችን ከኢትዮጵያ እምብርት እናመጣለን። የእኛ 'ሚድናይት ፎረስት' ተሞክሮ እያንዳንዱ ፍሬ በጥንቃቄ ወደሚያድግበት ለምለም ደጋማ ቦታዎች እንዲወስድዎት ተደርጎ የተዘጋጀ ነው።",
    close: "ዝጋ",
    categories: {
      All: "ሁሉንም",
      "Yefisig (Meat Specialties)": "የፍስክ ምግቦች",
      "Yetsom (Vegan/Fasting)": "የጾም ምግቦች",
      "Soft Drinks": "ቀዝቃዛ መጠጦች",
      "Alcoholic Drinks": "የአልኮል መጠጦች",
      "Hot Drinks": "ትኩስ መጠጦች",
      Special: "ልዩ",
      New: "አዲስ"
    }
  }
};

const CategoryIcon = ({ name, className = "w-4 h-4" }: { name: string, className?: string }) => {
  switch(name) {
    case "All":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    case "Special":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
    case "New":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    default:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
  }
};

const SafeImage = ({ src, alt, fill, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  if (!imgSrc) return <div className="w-full h-full bg-[#F3E5AB]/5 animate-pulse" />;

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      {...props}
    />
  );
};

export default function Home() {
  const router = useRouter();
  const { menuData, siteContent, websiteContent, refreshData, language: lang, setLanguage: setLang } = useMenu();
  const [isLightMode, setIsLightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(30);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"home" | "menu" | "story" | "specials" | "contact">("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Website Manager Frontend States
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [activeLookbookCategory, setActiveLookbookCategory] = useState("All");
  const [lookbookSearch, setLookbookSearch] = useState("");
  
  const [flyingItems, setFlyingItems] = useState<{ id: string, image: string, startX: number, startY: number, endX: number, endY: number, active: boolean }[]>([]);
  const [cartPulse, setCartPulse] = useState(false);
  
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pageView' })
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (showPriceFilter) {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        setShowPriceFilter(false);
      }, 5000);
    }
    return () => {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
    };
  }, [showPriceFilter, priceLimit]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshData]);

  // Auto-scroll for specials carousel removed in favor of Swiper.js

  // Auto-scroll for hero carousel
  useEffect(() => {
    if (activeSection === 'home' && websiteContent.heroes.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex(prev => (prev + 1) % websiteContent.heroes.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [activeSection, websiteContent.heroes.length]);

  const filteredLookbookItems = useMemo(() => {
    return websiteContent.lookbookItems.filter(item => {
      const matchesCategory = activeLookbookCategory === "All" || item.category === activeLookbookCategory;
      const matchesSearch = item.name.toLowerCase().includes(lookbookSearch.toLowerCase()) || 
                           item.description.toLowerCase().includes(lookbookSearch.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [websiteContent.lookbookItems, activeLookbookCategory, lookbookSearch]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showModal, setShowModal] = useState<"cart" | null>(null);

  const { minPrice, maxPrice } = useMemo(() => {
    const allPrices = menuData.flatMap(cat => cat.items.map(item => item.price));
    if (allPrices.length === 0) return { minPrice: 0, maxPrice: 1000 };
    return {
      minPrice: Math.floor(Math.min(...allPrices)) || 0,
      maxPrice: Math.ceil(Math.max(...allPrices)) || 1000
    };
  }, [menuData]);

  useEffect(() => {
    if (maxPrice > 0) {
      setPriceLimit(maxPrice);
    }
  }, [maxPrice]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
    } else if (savedTheme === "dark") {
      setIsLightMode(false);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
       setIsLightMode(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", isLightMode ? "light" : "dark");
    if (isLightMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const t = translations[lang];

  // Loading State
  const isWebsiteLoading = websiteContent.heroes.length === 0 && websiteContent.lookbookItems.length === 0;

  // Theme variables - Midnight Forest Luxury Theme
  const tm = {
    bgApp: isLightMode ? "bg-[#FDF8F0]" : "bg-[#08120F]",
    textApp: isLightMode ? "text-[#08120F]" : "text-[#F3E5AB]",
    bgHeader: isLightMode ? "bg-[#FDF8F0]/95" : "bg-[#08120F]/95",
    borderMain: isLightMode ? "border-[#08120F]/10" : "border-[#F3E5AB]/10",
    textAcc: "text-[#F3E5AB]",
    textMuted: isLightMode ? "text-[#08120F]/60" : "text-[#F3E5AB]/60",
    searchBg: isLightMode ? "bg-[#FDF8F0]/80" : "bg-[#08120F]/80",
    searchIcon: isLightMode ? "text-[#08120F]" : "text-[#F3E5AB]",
    switchBtn: isLightMode ? "bg-[#FDF8F0] border-[#08120F]/10 text-[#08120F]" : "bg-[#08120F] border-[#F3E5AB]/10 text-[#F3E5AB]",
    catBgActive: "bg-[#F3E5AB] text-[#08120F] shadow-[0_0_20px_rgba(243,229,171,0.4)] scale-105 border-[#F3E5AB]",
    catBgInactive: isLightMode ? "bg-[#FDF8F0]/80 text-[#08120F]/70 border-[#08120F]/10 hover:border-[#08120F]/40 hover:scale-105" : "bg-[#08120F]/80 text-[#F3E5AB]/70 border-[#F3E5AB]/10 hover:border-[#F3E5AB]/40 hover:scale-105",
    cardBg: isLightMode ? "bg-[#FDF8F0]/80 backdrop-blur-md border-[#08120F]/10 shadow-xl" : "bg-[#08120F]/80 backdrop-blur-md border-[#F3E5AB]/10 shadow-xl",
    modalOverlay: "bg-[#08120F]/60 backdrop-blur-sm",
    modalBg: isLightMode ? "bg-[#FDF8F0] backdrop-blur-xl border border-[#08120F]/10" : "bg-[#08120F] backdrop-blur-xl border border-[#F3E5AB]/10",
    // Food card specifics
    cardFrameBg: isLightMode ? "bg-[#FDF8F0]/85 backdrop-blur-md" : "bg-[#08120F]/85 backdrop-blur-md",
    cardFrameBorder: isLightMode ? "border-[#08120F]/10" : "border-[#F3E5AB]/10",
    cardTitleColor: isLightMode ? "text-[#08120F]" : "text-[#F3E5AB]",
    cardDescColor: isLightMode ? "text-[#08120F]/70" : "text-[#F3E5AB]/70",
    cardPriceColor: isLightMode ? "text-[#08120F]" : "text-[#F3E5AB]",
    cardDivider: isLightMode ? "border-[#08120F]/10" : "border-[#F3E5AB]/10"
  };

  const addToCart = (id: number, e?: React.MouseEvent) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (e && typeof window !== "undefined") {
      const item = menuData.flatMap(c => c.items).find(i => i.id === id);
      if (item && item.image) {
        const startX = e.clientX;
        const startY = e.clientY;
        const cartBtn = document.getElementById("cart-btn");
        if (cartBtn) {
          const rect = cartBtn.getBoundingClientRect();
          const flyId = Math.random().toString(36).substring(7);
          setFlyingItems(prev => [...prev, { id: flyId, image: item.image, startX, startY, endX: rect.left + rect.width / 2, endY: rect.top + rect.height / 2, active: false }]);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setFlyingItems(prev => prev.map(f => f.id === flyId ? { ...f, active: true } : f));
            });
          });
          setTimeout(() => {
            setFlyingItems(prev => prev.filter(f => f.id !== flyId));
            setCartPulse(true);
            setTimeout(() => setCartPulse(false), 300);
          }, 600);
        }
      }
    }
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) newCart[id] -= 1;
      else delete newCart[id];
      return newCart;
    });
  };

  const cartTotal = useMemo(() => {
    let total = 0;
    menuData.forEach(cat => cat.items.forEach(item => { if (cart[item.id]) total += item.price * cart[item.id]; }));
    return total;
  }, [cart, menuData]);

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount === 3) { router.push("/admin"); setLogoClicks(0); return; }
    if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
    logoClickTimeoutRef.current = setTimeout(() => setLogoClicks(0), 1500);
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const specials = useMemo(() => menuData.flatMap(cat => cat.items).filter(item => item.isSpecial), [menuData]);

  const filteredMenuData = useMemo(() => {
    return menuData.map(section => ({
      ...section,
      items: section.items.filter(item => {
        const itemName = lang === 'en' ? item.name_en : item.name_am;
        const sectionCat = lang === 'en' ? section.category_en : section.category_am;
        const matchesSearch = (itemName || "").toLowerCase().includes((searchQuery || "").toLowerCase());
        const matchesPrice = item.price <= priceLimit;
        const matchesCategory = activeCategory === "All" || sectionCat === activeCategory;
        return matchesSearch && matchesPrice && matchesCategory;
      })
    })).filter(section => section.items.length > 0);
  }, [searchQuery, priceLimit, activeCategory, lang, menuData]);

  return (
    <div className={`min-h-screen ${tm.bgApp} ${tm.textApp} transition-colors duration-500 font-sans selection:bg-[#F3E5AB] selection:text-[#08120F] overflow-x-hidden touch-pan-y`}>
      <div className={`fixed inset-0 ${tm.bgApp} tilet-pattern -z-20 transition-colors duration-500 opacity-20`} />
      
      {/* Global Header - Strictly Fixed */}
      <header className={`fixed top-0 left-0 right-0 z-[1000] ${activeSection === 'home' ? 'bg-transparent border-none' : `${tm.bgHeader} backdrop-blur-xl border-b ${tm.borderMain}`} px-4 md:px-12 w-full h-[56px] md:h-[70px] flex items-center transition-all duration-500`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full relative">
          
          {/* Mobile Header Row (Visible only on mobile/tablet < 768px) */}
          <div className="flex lg:hidden items-center justify-between w-full h-full gap-2">
            {/* Left: Logo & Company Name (Hidden on Home Page) */}
            <div className={`flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${activeSection === 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={handleLogoClick}>
              <div className="w-7 h-7 relative rounded-lg overflow-hidden border border-[#F3E5AB]/20">
                <img src={siteContent.logo || "/logo.png"} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-[10px] font-serif font-black tracking-tighter uppercase text-[#F3E5AB] whitespace-nowrap">Mas Coffee</h1>
            </div>

            {/* Icons Group: Search, Filter, Lang, Hamburger */}
            <div className="flex items-center gap-1 flex-grow justify-end">
              {/* Other Icons (Hidden on Home Page) */}
              <div className={`flex items-center gap-1 ${activeSection === 'home' ? 'hidden' : 'flex'}`}>
                <button 
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 ${showSearchInput ? 'bg-[#F3E5AB] text-[#08120F]' : 'text-[#F3E5AB]'}`}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[#F3E5AB] transition-all active:scale-95 ${showPriceFilter ? 'bg-[#F3E5AB] text-[#08120F]' : ''}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                  className={`w-8 h-8 rounded-full border border-[#F3E5AB]/10 flex items-center justify-center text-[9px] font-bold text-[#F3E5AB] transition-all active:scale-95`}
                >
                  {lang === 'en' ? 'አማ' : 'EN'}
                </button>
              </div>

              {/* Hamburger Menu Icon (Always Visible) */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[#F3E5AB] transition-all active:scale-95 ${isMobileMenuOpen ? 'bg-[#F3E5AB] text-[#08120F]' : ''}`}
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Desktop Header Content (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 md:gap-6 cursor-pointer group" onClick={handleLogoClick}>
              <div className="w-10 h-10 md:w-14 md:h-14 relative rounded-xl overflow-hidden border border-[#F3E5AB]/30 shadow-2xl transition-transform group-hover:scale-105">
                <img src={siteContent.logo || "/logo.png"} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tighter uppercase text-[#F3E5AB]">Mas Coffee</h1>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-medium opacity-60`}>Midnight Forest Experience</p>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { id: 'home', label: t.home },
                { id: 'menu', label: t.menu },
                { id: 'specials', label: t.specials },
                { id: 'story', label: t.ourStory },
                { id: 'contact', label: t.contact }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveSection(link.id as any)}
                  className={`text-xs font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                    activeSection === link.id ? 'text-[#F3E5AB]' : 'opacity-40 hover:opacity-100'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F3E5AB] rounded-full animate-scale-x" />
                  )}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center text-[10px] md:text-xs font-bold transition-all hover:bg-[#F3E5AB] hover:text-[#08120F] active:scale-95 ${tm.switchBtn}`}
              >
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              <button 
                onClick={() => setIsLightMode(!isLightMode)}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center transition-all hover:bg-[#F3E5AB] hover:text-[#08120F] active:scale-95 ${tm.switchBtn}`}
              >
                {isLightMode ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {showSearchInput && (
          <div className="lg:hidden absolute top-[56px] left-0 w-full p-3 bg-[#08120F] border-b border-[#F3E5AB]/10 animate-fade-in z-[900]">
            <div className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder={t.search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${tm.searchBg} border border-[#F3E5AB]/30 rounded-full py-2 px-10 focus:outline-none focus:border-[#F3E5AB] transition-all text-xs text-[#F3E5AB]`}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#F3E5AB]/50" />
              <button onClick={() => { setSearchQuery(""); setShowSearchInput(false); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#F3E5AB]/50" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Price Filter Overlay */}
        {showPriceFilter && (
          <div className="lg:hidden absolute top-[56px] left-0 w-full p-4 bg-[#08120F] border-b border-[#F3E5AB]/10 animate-fade-in z-[900]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Price Limit</span>
              <span className="font-serif font-black text-[#F3E5AB] text-sm">{priceLimit} ETB</span>
            </div>
            <input 
              type="range" 
              min={minPrice} 
              max={maxPrice} 
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              className="w-full h-1 bg-[#F3E5AB]/10 rounded-full appearance-none accent-[#F3E5AB]"
            />
          </div>
        )}
      </header>

      {/* Mobile Hamburger Menu Overlay (Right Slide-In) */}
      <div 
        className={`fixed inset-0 z-[1500] lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-[#08120F]/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm ${tm.modalBg} shadow-2xl transition-transform duration-300 ease-in-out flex flex-col p-6 md:p-12 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative rounded-xl overflow-hidden border border-[#F3E5AB]/20">
                <img src={siteContent.logo || "/logo.png"} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className={`text-lg font-serif font-black ${tm.textApp}`}>Mas Coffee</h2>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className={`w-8 h-8 rounded-full border ${tm.borderMain} flex items-center justify-center ${tm.textApp}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {[
              { id: 'home', label: t.home },
              { id: 'menu', label: t.menu },
              { id: 'specials', label: t.specials },
              { id: 'story', label: t.ourStory },
              { id: 'contact', label: t.contact }
            ].map((link) => (
              <button
                key={link.id}
                onClick={() => { setActiveSection(link.id as any); setIsMobileMenuOpen(false); }}
                className={`text-lg font-serif font-black uppercase tracking-widest text-left transition-all py-1.5 border-b ${tm.borderMain} ${
                  activeSection === link.id ? 'text-[#F3E5AB]' : tm.textMuted
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#F3E5AB]/10 space-y-3">
             <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className={`flex items-center gap-3 w-full py-3 px-5 rounded-2xl border ${tm.borderMain} ${tm.textApp} font-black uppercase tracking-widest text-[10px]`}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isLightMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className={`flex items-center gap-3 w-full py-3 px-5 rounded-2xl border ${tm.borderMain} ${tm.textApp} font-black uppercase tracking-widest text-[10px]`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections - Offset by header height (Removed offset for Home Section) */}
      <div className={`relative overflow-hidden ${activeSection === 'home' ? 'pt-0' : 'pt-[56px] md:pt-[70px]'} transition-all duration-500`}>
        
        {/* Home Section (Dynamic Hero & Lookbook) */}
        {activeSection === 'home' && (
          <div className="animate-fade-in">
            {isWebsiteLoading ? (
              <div className="h-[calc(100vh-56px)] md:h-[calc(100vh-70px)] flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-2 border-[#F3E5AB]/20 border-t-[#F3E5AB] rounded-full animate-spin" />
                <p className="text-[#F3E5AB] font-serif italic uppercase tracking-widest opacity-40">Loading Luxury Experience...</p>
              </div>
            ) : (
              <>
                {/* Hero Slider */}
                <section className="relative h-[55vh] md:h-[70vh] overflow-hidden">
                  {websiteContent.heroes.length > 0 ? (
                    websiteContent.heroes.map((hero, idx) => (
                      <div
                        key={hero.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${idx === currentHeroIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                        <img src={hero.image} className="w-full h-full object-cover" alt={hero.title} />
                        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end text-center px-4 pb-16 md:pb-24">
                          <h2 className="text-3xl md:text-6xl font-serif font-black mb-4 tracking-[0.15em] uppercase text-white drop-shadow-2xl max-w-5xl">
                            {hero.title}
                          </h2>
                          <p className="max-w-2xl text-xs md:text-base text-[#F3E5AB] font-medium mb-0 drop-shadow-lg opacity-90 tracking-[0.2em] uppercase leading-relaxed [word-spacing:0.3em]">
                            {hero.subtitle}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-end text-center px-4 pb-16 md:pb-24 relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                      <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#F3E5AB]/10 rounded-full blur-[80px]" />
                      </div>
                      <h2 className="text-3xl md:text-6xl font-serif font-black mb-4 tracking-[0.15em] animate-fade-in-up text-white drop-shadow-2xl uppercase">
                        Mas Coffee: <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#FDF8F0]">Where Every Sip Tells a Story</span>
                      </h2>
                      <p className="max-w-2xl text-xs md:text-base text-[#F3E5AB] opacity-90 mb-0 animate-fade-in-up delay-200 tracking-[0.2em] uppercase leading-relaxed [word-spacing:0.3em]">
                        Immerse yourself in the luxury of Ethiopian coffee culture. A sensory journey through the highlands, delivered with elegance.
                      </p>
                    </div>
                  )}
                  
                  {/* Slider Dots */}
                  {websiteContent.heroes.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                      {websiteContent.heroes.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentHeroIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${idx === currentHeroIndex ? 'bg-[#F3E5AB] w-8' : 'bg-white/30 hover:bg-white/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </section>

                {/* Divider line */}
                <div className="w-full h-px bg-[#F3E5AB]/20" />

                {/* Lookbook (Gallery) Section */}
                <section className="py-6 md:py-10 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
                  {/* Branding text removed per user request */}

                  {/* Lookbook Filters - Sticky Navigation */}
              <div className={`sticky top-[56px] md:top-[70px] z-[800] ${tm.bgHeader} backdrop-blur-xl border-b ${tm.borderMain} py-2 md:py-4 mb-4`}>
                <div className="max-w-7xl mx-auto px-4 md:px-12">
                  <div className="flex items-center justify-start md:justify-center gap-3 md:gap-4 w-full overflow-x-auto no-scrollbar">
                    <button
                      onClick={() => setActiveLookbookCategory("All")}
                      className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border flex-shrink-0 ${
                        activeLookbookCategory === "All" 
                        ? 'bg-[#F3E5AB] text-[#08120F] shadow-[0_0_20px_rgba(243,229,171,0.4)] scale-105 border-[#F3E5AB]' 
                        : 'border-[#F3E5AB]/20 opacity-40 hover:opacity-100 hover:border-[#F3E5AB]/40 hover:scale-105'
                      }`}
                    >
                      All Gallery
                    </button>
                    {websiteContent.lookbookCategories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setActiveLookbookCategory(cat.id)}
                        className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border flex-shrink-0 ${
                          activeLookbookCategory === cat.id 
                          ? 'bg-[#F3E5AB] text-[#08120F] shadow-[0_0_20px_rgba(243,229,171,0.4)] scale-105 border-[#F3E5AB]' 
                          : 'border-[#F3E5AB]/20 opacity-40 hover:opacity-100 hover:border-[#F3E5AB]/40 hover:scale-105'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

                  {/* Lookbook List - Full Width & Vertical Scroll */}
                  <div className="w-full max-h-[85vh] overflow-y-auto no-scrollbar space-y-12 py-10 px-4 md:px-12">
                    {filteredLookbookItems.map((item, idx) => (
                      <div 
                        key={item.id} 
                        className="group relative w-full h-[50vh] md:h-[60vh] bg-[#08120F] rounded-[32px] md:rounded-[56px] border border-[#F3E5AB]/10 shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#F3E5AB]/30"
                      >
                        {/* Image Layer - 100% Width & Height Cover */}
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={item.image} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt={item.name} 
                          />
                          {/* Dark Overlay for Text Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#08120F] via-[#08120F]/20 to-transparent opacity-80" />
                        </div>

                        {/* Card Body Content - Positioned at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col items-start text-left">
                          <span className="text-[8px] md:text-[10px] font-black text-[#F3E5AB] uppercase tracking-[0.4em] mb-2 md:mb-3">
                            {websiteContent.lookbookCategories.find(c => c.id === item.category)?.name || "Collection"}
                          </span>
                          <h3 className="text-xl md:text-4xl font-serif font-black text-[#F3E5AB] mb-2 md:mb-4 tracking-tight drop-shadow-2xl">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-4">
                            {item.price && (
                              <span className="text-base md:text-2xl font-black text-[#F3E5AB] tracking-widest drop-shadow-lg">{item.price} ETB</span>
                            )}
                          </div>
                          <p className="hidden lg:block text-xs md:text-sm text-[#F3E5AB]/80 mt-4 italic font-light max-w-2xl drop-shadow-lg leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                    {filteredLookbookItems.length === 0 && (
                      <div className="py-20 text-center w-full">
                        <p className="font-serif italic text-2xl opacity-20 uppercase tracking-widest">No items found in this collection.</p>
                      </div>
                    )}
                  </div>
                </section>
              </>
            )}
          </div>
        )}

        {/* Menu Section */}
        {activeSection === 'menu' && (
          <div className="animate-fade-in">
            {/* Section 2: Hero Header (Specials Carousel) */}
            <div className={`section-2-hero-header lg:hidden my-[20px] mx-auto w-[70%] h-[25vh] flex items-center justify-center bg-cover bg-center overflow-visible ${isLightMode ? 'bg-[#FDF8F0]' : 'bg-[#08120F]'}`}>
              <div className="w-full h-full relative">
                <Swiper
                  slidesPerView="auto"
                  centeredSlides={true}
                  spaceBetween={16}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                  className="w-full h-full !overflow-visible"
                >
                  {specials.map((item) => (
                    <SwiperSlide key={item.id} className="h-full w-full">
                      <div 
                        className={`w-full h-full rounded-2xl border ${isLightMode ? 'border-[#08120F]/10' : 'border-[#D4AF37]/30'} overflow-hidden relative group cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-500 hover:scale-105 hover:border-[#D4AF37]/60 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)]`}
                        onClick={() => setExpandedDesc(item.id)}
                      >
                        <img src={item.image} className="w-full h-full object-cover opacity-100 transition-transform duration-1000 group-hover:scale-105" alt="" />
                        <div className="absolute bottom-3 left-4 right-4 text-center">
                          <h4 className={`text-xs md:text-sm font-serif font-black text-[#D4AF37] line-clamp-1 tracking-widest uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>{lang === 'en' ? item.name_en : item.name_am}</h4>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            
            {/* Categories Row - Sticky to the very top */}
            <div className={`sticky top-0 z-50 ${isLightMode ? 'bg-[#FDF8F0]/95' : 'bg-[#08120F]/95'} backdrop-blur-md my-[20px]`}>
              {/* Top Frame Divider */}
              <div className="w-full h-[1px] bg-[#D4AF37]/40" />

              <div className="max-w-7xl mx-auto px-4 md:px-12 py-2 md:py-3">
                <div className="flex justify-center items-center w-full overflow-x-auto no-scrollbar gap-2 sm:gap-4 md:gap-6">
                  {(() => {
                    const cats = menuData.map(c => lang === 'en' ? c.category_en : c.category_am);
                    const midIndex = Math.floor(cats.length / 2);
                    const arranged = [...cats.slice(0, midIndex), "All", ...cats.slice(midIndex)];
                    return arranged.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 sm:px-8 py-2 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all flex-shrink-0 border shadow-md ${
                          activeCategory === cat ? tm.catBgActive : tm.catBgInactive
                        } ${cat === 'All' ? 'mx-8 sm:mx-12 md:mx-20' : ''}`}
                      >
                        {t.categories[cat as keyof typeof t.categories] || cat}
                      </button>
                    ));
                  })()}
                </div>
              </div>
              
              {/* Bottom Frame Divider */}
              <div className="w-full h-[1px] bg-[#D4AF37]/40" />
            </div>

            <main className="max-w-7xl mx-auto px-2 md:px-12 pt-0 md:pt-2 pb-32 min-h-[70vh]">
              <div className="space-y-4 md:space-y-8">
                {/* Section 4 Heading - Centered and Separated */}
                <div className="flex flex-col items-center mb-4 md:mb-6 pt-0">
                  <h2 className="text-center text-lg md:text-2xl font-serif font-black text-[#D4AF37] uppercase tracking-[0.5em]">
                    MENU
                  </h2>
                  <div className="w-16 md:w-24 h-[1px] bg-[#D4AF37]/40 mt-1 md:mt-2 mb-1" />
                </div>
                
                {filteredMenuData.map((section) => (
                  <section key={section.category_en} className="scroll-mt-[100px] relative mt-12 md:mt-16 first:mt-0">
                    {/* Functional Header (Category Indicator) */}
                    <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 relative z-20 px-4 md:px-0">
                      <CategoryIcon name={section.category_en} className="w-4 h-4 md:w-5 md:h-5 text-[#F3E5AB]/40" />
                      <h4 className="text-xs md:text-sm font-bold text-[#F3E5AB]/40 uppercase tracking-[0.2em] whitespace-nowrap">
                        {lang === 'en' ? section.category_en : section.category_am}
                      </h4>
                      <div className="w-12 md:w-20 h-[1px] bg-[#D4AF37]/50" />
                    </div>

                    <div className="grid grid-cols-1 gap-12 md:gap-20 relative z-10 pt-2 md:pt-4">
                      {section.items.map((item) => (
                        <article 
                          key={item.id} 
                          className={`relative flex items-center w-full h-[180px] md:h-[280px] group mx-auto ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`}
                        >
                          {/* Symmetrical Left Margin - Image */}
                          <div className="absolute left-[6%] z-20 w-[42%] md:w-[32%] max-w-[180px] md:max-w-[300px] aspect-square flex items-center">
                            <div className="w-full h-full rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-[#08120F]">
                              {item.image ? (
                                <SafeImage src={item.image} alt={item.name_en} fill className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl font-serif text-[#D4AF37] opacity-40">
                                  {item.name_en[0]}
                                </div>
                              )}
                            </div>
                            {/* Badges */}
                            {(item.isSpecial || item.isNew) && (
                              <div className="absolute top-[10%] right-[10%] bg-[#D4AF37] text-black px-3 py-0.5 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest shadow-lg z-20 animate-pulse">
                                {item.isSpecial ? 'Special' : 'New'}
                              </div>
                            )}
                          </div>

                          {/* Symmetrical Right Margin - Card */}
                          <div className="absolute right-[6%] w-[70%] md:w-[68%] h-[85%] md:h-[90%] bg-[#0a2c26] rounded-[24px] md:rounded-[40px] flex flex-col items-center justify-center pl-[36%] sm:pl-[30%] md:pl-[20%] pr-4 md:pr-10 shadow-[0_15px_50px_rgba(0,0,0,0.6)] border border-[#D4AF37]/20 transition-all duration-500 hover:border-[#D4AF37]/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:scale-[1.01] text-center">
                            {/* Vibrant Visibility: Name -> Price -> Description */}
                            <div className="flex flex-col gap-1 md:gap-2 mb-2 items-center w-full min-w-0">
                              <h4 className="text-lg sm:text-xl md:text-3xl font-black text-[#D4AF37] leading-tight line-clamp-1 uppercase tracking-widest px-2 w-full">
                                {lang === 'en' ? item.name_en : item.name_am}
                              </h4>
                              <span className="text-[#D4AF37] font-black text-xl sm:text-2xl md:text-4xl leading-none">
                                {item.price} ETB
                              </span>
                            </div>

                            {/* Crisp Elegant Description Card */}
                            <p className="text-[10px] sm:text-xs md:text-base text-[#F3E5AB]/60 line-clamp-2 italic font-medium max-w-[90%] mb-2.5 md:mb-4 px-2 overflow-hidden w-full">
                              {lang === 'en' ? item.description_en : item.description_am}
                            </p>

                            {/* LINE C: Inside Food Item Cards - Full Width Divider Above ADD Button */}
                            <div className="w-[90%] md:w-[95%] h-[1px] bg-[#D4AF37]/20 mb-2.5 md:mb-4" />

                            {/* Action Button (Gold Pill) */}
                            <div className="w-fit pb-1 relative z-10">
                              {cart[item.id] > 0 ? (
                                <div className="flex items-center gap-3 md:gap-4 bg-[#D4AF37]/10 rounded-full px-3 py-1.5 md:py-2 border border-[#D4AF37]/20 backdrop-blur-sm">
                                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-sm md:text-xl font-bold">-</button>
                                  <span className="font-black text-sm md:text-2xl text-[#D4AF37] w-6 md:w-10 text-center">{cart[item.id]}</span>
                                  <button onClick={(e) => addToCart(item.id, e)} className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-black hover:scale-105 transition-all text-sm md:text-xl">+</button>
                                </div>
                              ) : (
                                <button 
                                  disabled={item.isSoldOut}
                                  onClick={(e) => addToCart(item.id, e)}
                                  className="bg-[#D4AF37] text-black px-6 md:px-14 py-2 md:py-4 rounded-full text-xs md:text-lg font-black uppercase tracking-[0.1em] hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(212,175,55,0.3)] disabled:opacity-50"
                                >
                                  + ADD
                                </button>
                              )}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </main>
          </div>
        )}

        {/* Our Story Section */}
        {activeSection === 'story' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.ourStory}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#F3E5AB] mx-auto rounded-full" />
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-[#F3E5AB]/20 shadow-2xl">
                  <img src="/story-image.jpg" alt="Our Story" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08120F] to-transparent" />
                </div>
                <div className={`${tm.cardBg} p-8 md:p-12 rounded-3xl border border-[#F3E5AB]/10 backdrop-blur-2xl`}>
                  <h3 className="text-2xl md:text-3xl font-serif font-black mb-6 text-[#F3E5AB]">{siteContent.storyTitle}</h3>
                  <p className="text-base md:text-lg leading-relaxed opacity-70 whitespace-pre-wrap">
                    {siteContent.storyText}
                  </p>
                  <div className="mt-8 md:mt-12 flex gap-8">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-serif font-black text-[#F3E5AB]">25+</div>
                      <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Years of Heritage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-serif font-black text-[#F3E5AB]">100%</div>
                      <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Organic Beans</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Specials Section */}
        {activeSection === 'specials' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.specials}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#F3E5AB] mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {specials.map((item) => (
                  <div key={item.id} className={`${tm.cardBg} rounded-3xl border border-[#F3E5AB]/10 overflow-hidden group hover:border-[#F3E5AB]/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
                    <div className="h-56 md:h-64 relative overflow-hidden">
                      {item.image ? <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" /> : <div className="w-full h-full bg-[#F3E5AB]/5" />}
                      <div className="absolute top-4 left-4 bg-[#F3E5AB] text-[#08120F] px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">Chef's Choice</div>
                    </div>
                    <div className="p-6 md:p-8">
                      <h4 className="text-xl md:text-2xl font-serif font-black mb-2">{lang === 'en' ? item.name_en : item.name_am}</h4>
                      <p className="text-xs md:text-sm opacity-60 mb-6 line-clamp-3">{lang === 'en' ? item.description_en : item.description_am}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg md:text-xl font-black text-[#F3E5AB]">{item.price} ETB</span>
                        <button onClick={(e) => addToCart(item.id, e)} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F3E5AB] text-[#08120F] flex items-center justify-center font-black hover:scale-110 transition-transform shadow-xl">+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.contact}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#F3E5AB] mx-auto rounded-full" />
              </div>

              <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                {/* Contact Cards */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                  {[
                    { icon: MapPin, label: t.address, val: siteContent.address },
                    { icon: Clock, label: t.hours, val: t.hoursVal },
                    { icon: Phone, label: t.phone, val: siteContent.phone }
                  ].map((info, idx) => (
                    <div key={idx} className={`${tm.cardBg} p-6 md:p-8 rounded-3xl border border-[#F3E5AB]/10 flex items-start gap-4 md:gap-6 transition-all duration-500 hover:border-[#F3E5AB]/30 hover:shadow-xl hover:scale-[1.02]`}>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#F3E5AB]/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-5 h-5 md:w-6 md:h-6 text-[#F3E5AB]" />
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{info.label}</p>
                        <p className="text-base md:text-lg font-medium">{info.val}</p>
                      </div>
                    </div>
                  ))}
                  <button className="w-full bg-[#F3E5AB] text-[#08120F] py-5 md:py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-xs md:text-sm shadow-2xl hover:scale-[1.02] transition-all">
                    {t.callToOrder}
                  </button>
                </div>

                {/* Google Maps Placeholder */}
                <div className="lg:col-span-2 relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden border border-[#F3E5AB]/20 bg-[#08120F] group">
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 transition-opacity group-hover:opacity-40">
                    <MapPin className="w-16 h-16 md:w-24 md:h-24 mb-6" />
                    <p className="font-serif text-xl md:text-2xl uppercase tracking-[0.5em]">Map View</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08120F] via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                    <h4 className="text-2xl md:text-3xl font-serif font-black text-[#F3E5AB] mb-2">Mas Coffee Plaza</h4>
                    <p className="text-sm md:text-base opacity-60">The heart of luxury coffee in Addis Ababa</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Expanded Description Popup */}
      {expandedDesc !== null && (() => {
        const found = menuData.flatMap(s => s.items).find(i => i.id === expandedDesc);
        if (!found) return null;
        return (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4" onClick={() => setExpandedDesc(null)}>
            <div className="absolute inset-0 bg-[#08120F]/95 backdrop-blur-md" />
            <div className={`${tm.modalBg} relative z-10 p-8 max-w-lg w-full rounded-3xl shadow-2xl animate-fade-in-up`} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setExpandedDesc(null)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 hover:scale-110 transition-all">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl md:text-3xl font-serif font-black mb-2 text-[#F3E5AB]">{lang === 'en' ? found.name_en : found.name_am}</h3>
              <p className="text-lg md:text-xl font-black mb-6 md:mb-8 opacity-60">{found.price} ETB</p>
              <p className="text-base md:text-lg leading-relaxed italic opacity-80">{lang === 'en' ? found.description_en : found.description_am}</p>
            </div>
          </div>
        );
      })()}

      {/* Floating Cart Button */}
      <div className={`fixed bottom-8 left-0 right-0 px-6 z-[950] pointer-events-none transition-all duration-700 ${cartItemCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <button 
          id="cart-btn"
          onClick={() => setShowModal("cart")}
          className={`mx-auto bg-[#F3E5AB] text-[#08120F] px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4 pointer-events-auto relative overflow-hidden group ${cartPulse ? 'scale-110' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <span>View Order ({cartTotal.toFixed(0)} ETB)</span>
        </button>
      </div>

      {/* Cart Modal (Bottom Slide-Up Drawer) */}
      <div className={`fixed inset-0 z-[2000] lg:hidden transition-opacity duration-300 ${showModal === "cart" ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#08120F]/60 backdrop-blur-md" onClick={() => setShowModal(null)} />
        <div 
          className={`absolute bottom-0 left-0 w-full ${tm.modalBg} rounded-t-[40px] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${showModal === "cart" ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ maxHeight: '90vh', willChange: 'transform' }}
        >
          {/* Drag Handle / Close Header */}
          <div className="pt-4 pb-2 flex flex-col items-center gap-4 border-b border-[#F3E5AB]/10">
            <div className="w-12 h-1.5 bg-[#F3E5AB]/20 rounded-full" onClick={() => setShowModal(null)} />
            <div className="w-full px-8 flex items-center justify-between">
              <h2 className={`text-2xl font-serif font-black uppercase tracking-widest ${tm.textApp}`}>My Order</h2>
              <button onClick={() => setShowModal(null)} className={`w-10 h-10 rounded-full border ${tm.borderMain} flex items-center justify-center ${tm.textApp}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {menuData.flatMap(c => c.items).filter(i => cart[i.id]).map(item => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#F3E5AB]/10 flex-shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-lg font-serif font-black mb-1 truncate ${tm.textApp}`}>{lang === 'en' ? item.name_en : item.name_am}</h4>
                  <p className="font-black text-[#F3E5AB] opacity-60 text-sm">{item.price} ETB</p>
                </div>
                <div className="flex items-center gap-2 bg-[#F3E5AB]/10 rounded-full px-2 py-1">
                  <button onClick={() => removeFromCart(item.id)} className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E5AB] hover:text-[#08120F] transition-all hover:scale-110 ${tm.textApp}`}>-</button>
                  <span className={`font-black text-sm ${tm.textApp}`}>{cart[item.id]}</span>
                  <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-full bg-[#F3E5AB] text-[#08120F] flex items-center justify-center font-black transition-all hover:scale-110">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-8 bg-[#08120F]/50 border-t ${tm.borderMain}`}>
            <div className="flex justify-between items-center mb-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-40 ${tm.textApp}`}>Total Amount</span>
              <span className="text-3xl font-serif font-black text-[#F3E5AB]">{cartTotal.toFixed(0)} ETB</span>
            </div>
            <button className="w-full bg-[#F3E5AB] text-[#08120F] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all">
              Complete Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Cart Modal */}
      {showModal === "cart" && (
        <div className="hidden lg:flex fixed inset-0 z-[2000] items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#08120F]/60 backdrop-blur-xl" onClick={() => setShowModal(null)} />
          <div className={`${tm.modalBg} relative z-10 w-full max-w-2xl max-h-[85vh] rounded-3xl flex flex-col overflow-hidden animate-fade-in-up`}>
            <div className="p-8 border-b border-[#F3E5AB]/10 flex items-center justify-between">
              <h2 className="text-3xl font-serif font-black uppercase tracking-widest text-[#F3E5AB]">My Order</h2>
              <button onClick={() => setShowModal(null)} className="opacity-40 hover:opacity-100">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {menuData.flatMap(c => c.items).filter(i => cart[i.id]).map(item => (
                <div key={item.id} className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F3E5AB]/10 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-serif font-black mb-1 truncate">{lang === 'en' ? item.name_en : item.name_am}</h4>
                    <p className="font-black text-[#F3E5AB] opacity-60">{item.price} ETB</p>
                  </div>
                  <div className="flex items-center gap-4 bg-[#F3E5AB]/10 rounded-full px-4 py-2">
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F3E5AB] hover:text-[#08120F] transition-all hover:scale-110">-</button>
                    <span className="font-black">{cart[item.id]}</span>
                    <button onClick={() => addToCart(item.id)} className="w-8 h-8 rounded-full bg-[#F3E5AB] text-[#08120F] flex items-center justify-center font-black transition-all hover:scale-110">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-[#08120F]/50 border-t border-[#F3E5AB]/10">
              <div className="flex justify-between items-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Total Amount</span>
                <span className="text-4xl font-serif font-black text-[#F3E5AB]">{cartTotal.toFixed(0)} ETB</span>
              </div>
              <button className="w-full bg-[#F3E5AB] text-[#08120F] py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-2xl hover:scale-[1.02] transition-all">
                Complete Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-20 border-t ${tm.borderMain} relative overflow-hidden transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-black mb-8 tracking-widest uppercase text-[#F3E5AB]">Mas Coffee</h2>
          <div className="flex justify-center gap-8 md:gap-12 text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
            <button onClick={() => setActiveSection('story')} className="hover:opacity-100 hover:scale-110 transition-all">Our Story</button>
            <button onClick={() => setActiveSection('contact')} className="hover:opacity-100 hover:scale-110 transition-all">Contact</button>
            <button onClick={() => setActiveSection('menu')} className="hover:opacity-100 hover:scale-110 transition-all">Menu</button>
          </div>
          <p className="mt-12 text-[8px] md:text-[10px] opacity-20 tracking-widest uppercase">© 2026 MAS COFFEE - THE MIDNIGHT FOREST EXPERIENCE</p>
        </div>
      </footer >

      {/* Fly-to-Cart Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-[3000] overflow-hidden">
        {flyingItems.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full overflow-hidden border-2 border-[#F3E5AB] bg-[#08120F] shadow-2xl"
            style={{
              width: '80px', height: '80px', left: 0, top: 0,
              willChange: 'transform, opacity',
              transition: f.active ? 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none',
              opacity: f.active ? 0 : 0.8,
              transform: f.active 
                ? `translate(${f.endX - 40}px, ${f.endY - 40}px) scale(0.1)` 
                : `translate(${f.startX - 40}px, ${f.startY - 40}px) scale(1)`,
            }}
          >
            <img src={f.image} className="w-full h-full object-cover" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
