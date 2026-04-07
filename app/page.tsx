"use client";

// Force dynamic rendering to ensure real-time updates for users
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMenu } from "@/context/MenuContext";
import { Sun, Moon, SlidersHorizontal, X } from "lucide-react";

const translations = {
  en: {
    title: "ADDIS CULINARY",
    subtitle: "The Essence of Ethiopia",
    search: "Search...",
    specials: "Our Specials",
    menu: "MENU",
    experience: "Experience",
    checkout: "Checkout",
    cancel: "Cancel",
    total: "Total",
    items: "items",
    new: "New",
    soldOut: "Sold Out",
    special: "Special",
    clear: "Clear all filters",
    noMatch: "No dishes found matching your criteria.",
    ourStory: "Our Story",
    contactInfo: "Contact Information",
    address: "Address",
    phone: "Phone",
    addressVal: "123 Cultural Way, Addis Ababa, Ethiopia",
    phoneVal: "+251 11 123 4567",
    storyTitle: "The Essence of Addis",
    storyText: "Established in 1998, Addis Culinary brings the rich heritage of Ethiopian hospitality to your table. Every dish is prepared with love and authentic spices imported directly from the highlands. Our mission is to share the vibrant flavors and communal dining traditions of our motherland with the world.",
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
    title: "አዲስ ኩሊናሪ",
    subtitle: "የኢትዮጵያ ምርጥ ጣዕም",
    search: "ፈልግ...",
    specials: "የዛሬ ልዩ ምግቦች",
    menu: "ሜኑ",
    experience: "ተመገቡ",
    checkout: "ክፈል",
    cancel: "አጥፋ",
    total: "ጠቅላላ",
    items: "ምግቦች",
    new: "አዲስ",
    soldOut: "አልቋል",
    special: "ልዩ",
    clear: "ሁሉንም አጥፋ",
    noMatch: "የፈለጉት ምግብ አልተገኘም።",
    ourStory: "ታሪካችን",
    contactInfo: "የመገናኛ መረጃ",
    address: "አድራሻ",
    phone: "ስልክ",
    addressVal: "123 የባህል መንገድ፣ አዲስ አበባ፣ ኢትዮጵያ",
    phoneVal: "+251 11 123 4567",
    storyTitle: "የአዲስ ኩሊናሪ ምንነት",
    storyText: "በ1990 ዓ.ም የተመሰረተው አዲስ ኩሊናሪ የኢትዮጵያን የእንግዳ ተቀባይነት ባህል ወደ ገበታዎ ያቀርባል። እያንዳንዱ ምግብ በፍቅር እና በቀጥታ ከደጋማው አካባቢ በሚመጡ ኦሪጅናል ቅመሞች ይዘጋጃል። አላማችን የእናት ሀገራችንን ደማቅ ጣዕም እና የጋራ አመጋገብ ባህል ለአለም ማካፈል ነው።",
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
    case "Traditional Foods":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15c0-4.418-4.03-8-9-8s-9 3.582-9 8h18zM12 7V4M8 7V5M16 7V5M3 15h18" /></svg>;
    case "Specialty Drinks":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5V3m0 0H8m4 0h4m-4 5v13m0 0H8m4 0h4m-7-9l2 9h6l2-9H5z" /></svg>;
    case "Side Dishes":
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>;
    default:
      return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
  }
};

// Safe Image Component to handle Hydration and Remote URLs
const SafeImage = ({ src, alt, fill, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    // Set src after mount to avoid hydration mismatch
    setImgSrc(src);
  }, [src]);

  if (!imgSrc) return <div className="w-full h-full bg-[#D4AF37]/5 animate-pulse" />;

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
  const { menuData, siteContent, refreshData, language: lang, setLanguage: setLang } = useMenu();
  const [isLightMode, setIsLightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(30);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<number | null>(null);
  
  // Animation State
  const [flyingItems, setFlyingItems] = useState<{ id: string, image: string, startX: number, startY: number, endX: number, endY: number, active: boolean }[]>([]);
  const [cartPulse, setCartPulse] = useState(false);
  
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [logoClicks, setLogoClicks] = useState(0);

  // Analytics: Record Page View on mount
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'pageView' })
    }).catch(console.error);
  }, []);

  // Auto-close filter after 5s of inactivity
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
    // 3-second Fast Polling for Real-Time Updates
    const interval = setInterval(() => {
      refreshData();
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshData]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [showModal, setShowModal] = useState<"story" | "contact" | "cart" | null>(null);
  const [isSpecialsHovered, setIsSpecialsHovered] = useState(false);

  const { minPrice, maxPrice } = useMemo(() => {
    const allPrices = menuData.flatMap(cat => cat.items.map(item => item.price));
    if (allPrices.length === 0) return { minPrice: 0, maxPrice: 1000 };
    return {
      minPrice: Math.floor(Math.min(...allPrices)) || 0,
      maxPrice: Math.ceil(Math.max(...allPrices)) || 1000
    };
  }, [menuData]);

  // Update priceLimit when maxPrice changes, but only if it's currently at a default
  useEffect(() => {
    if (maxPrice > 0) {
      setPriceLimit(maxPrice);
    }
  }, [maxPrice]);

  // Sync theme with localStorage
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

  // Theme variables derived logically
  const tm = isLightMode ? {
    bgApp: "bg-[#F9F9F9]",
    textApp: "text-[#1A1A1A]",
    bgHeader: "bg-white/90",
    borderMain: "border-[#D4AF37]/30",
    textAcc: "text-[#D4AF37]",
    textMuted: "text-[#4A4A4A]/60",
    searchBg: "bg-white",
    searchIcon: "text-[#D4AF37]",
    switchBtn: "bg-white border-[#D4AF37]/20 text-[#D4AF37]",
    heroGradient: "from-white to-[#F9F9F9]",
    catBgActive: "bg-[#D4AF37] text-white shadow-md",
    catBgInactive: "bg-white text-gray-400 border-gray-200 hover:border-[#D4AF37]",
    watermark: "text-[#D4AF37]/10",
    cardBg: "bg-white border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-[#D4AF37]/40",
    cartModalTotal: "text-[#D4AF37]",
    // Light mode food card specifics
    cardFrameBg: "bg-white",
    cardFrameBorder: "border-[#D4AF37]/15",
    cardFrameShadow: "shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_4px_rgba(212,175,55,0.08)]",
    cardFrameHoverBorder: "hover:border-[#D4AF37]/40",
    cardFrameHoverShadow: "hover:shadow-[0_12px_40px_rgba(212,175,55,0.12),0_4px_12px_rgba(0,0,0,0.06)]",
    cardTitleColor: "text-[#1A1A1A]",
    cardDescColor: "text-[#4A4A4A]",
    cardPriceColor: "text-[#D4AF37]",
    cardDivider: "border-[#D4AF37]/10",
    cardTitleSecondary: "text-[#1A1A1A] group-hover:text-[#D4AF37] font-bold",
    cardDesc: "text-[#4A4A4A]",
    textDesc: "text-[#4A4A4A]",
    cardTitle: "text-[#1A1A1A]",
    borderCard: "border-gray-100 hover:border-[#D4AF37]/30",
    smallBtnBg: "bg-gray-50 border-gray-100 text-[#D4AF37] hover:bg-gray-100",
    addBtnActive: "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white active:scale-95 shadow-sm",
    addBtnDisabled: "border border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed",
    modalOverlay: "bg-black/60",
    modalBg: "bg-white border border-[#D4AF37]/30 shadow-2xl",
    modalText: "text-[#1A1A1A]",
    footerBg: "bg-[#F5F5F5]"
  } : {
    bgApp: "bg-[#1A1A1A]",
    textApp: "text-white",
    bgHeader: "bg-[#1A1A1A]/95",
    borderMain: "border-[#D4AF37]/30",
    textAcc: "text-[#D4AF37]",
    textMuted: "text-white/40",
    searchBg: "bg-black",
    searchIcon: "text-[#D4AF37]/80 group-focus-within:text-[#D4AF37]",
    switchBtn: "bg-[#0A0A0A] border-[#D4AF37]/30 text-[#D4AF37]",
    heroGradient: "from-[#0A0A0A] to-[#0A0A0A]",
    catBgActive: "bg-[#D4AF37] text-black shadow-none",
    catBgInactive: "bg-[#0A0A0A] text-[#D4AF37]/70 border-[#D4AF37]/20 hover:border-[#D4AF37]",
    watermark: "text-[#D4AF37]/5",
    cardBg: "bg-[#0A0A0A] bg-none border-[#D4AF37]/20 shadow-none hover:border-[#D4AF37]/60",
    cardTitle: "text-[#D4AF37]",
    cardTitleSecondary: "text-white group-hover:text-[#D4AF37]",
    cardDesc: "text-white/70",
    textDesc: "text-white/70",
    borderCard: "border-[#D4AF37]/20 hover:border-[#D4AF37]",
    smallBtnBg: "bg-[#000000] border-[#D4AF37]/20 text-[#D4AF37] hover:bg-black/80",
    addBtnActive: "border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black active:scale-95 shadow-none",
    addBtnDisabled: "border border-white/10 text-white/20 bg-black/40 cursor-not-allowed",
    modalOverlay: "bg-black/98",
    modalBg: "bg-[#000000] border border-[#D4AF37]/30 shadow-none",
    modalText: "text-white",
    footerBg: "bg-[#1A1A1A]",
    cartModalTotal: "text-[#D4AF37]",
    // Dark mode food card specifics
    cardFrameBg: "bg-[#1A1A1A]",
    cardFrameBorder: "border-[#D4AF37]/20",
    cardFrameShadow: "shadow-[0_25px_60px_rgba(0,0,0,1)]",
    cardFrameHoverBorder: "hover:border-[#D4AF37]/40",
    cardFrameHoverShadow: "",
    cardTitleColor: "text-[#D4AF37]",
    cardDescColor: "text-white/60",
    cardPriceColor: "text-[#D4AF37]",
    cardDivider: "border-[#D4AF37]/10"
  };

  const addToCart = (id: number, e?: React.MouseEvent) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    // Analytics
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cartAdd', itemId: id })
    }).catch(console.error);

    // Fly-to-Cart Animation
    if (e && typeof window !== "undefined") {
      const item = menuData.flatMap(c => c.items).find(i => i.id === id);
      if (item && item.image) {
        const startX = e.clientX;
        const startY = e.clientY;
        const cartBtn = document.getElementById("cart-btn");
        
        if (cartBtn) {
          const rect = cartBtn.getBoundingClientRect();
          const endX = rect.left + rect.width / 2;
          const endY = rect.top + rect.height / 2;
          
          const flyId = Math.random().toString(36).substring(7);
          
          setFlyingItems(prev => [...prev, { id: flyId, image: item.image, startX, startY, endX, endY, active: false }]);
          
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

  const handleItemClick = (id: number) => {
    setExpandedDesc(expandedDesc === id ? null : id);
    if (expandedDesc !== id) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'itemClick', itemId: id })
      }).catch(console.error);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const cartTotal = useMemo(() => {
    let total = 0;
    menuData.forEach(cat => {
      cat.items.forEach(item => {
        if (cart[item.id]) {
          total += item.price * cart[item.id];
        }
      });
    });
    return total;
  }, [cart, menuData]);

  const formattedTotal = `${cartTotal.toLocaleString()} ETB`;

  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      router.push("/admin");
    }, 5000);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    
    if (newCount === 3) {
      router.push("/admin");
      setLogoClicks(0);
      if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
      return;
    }
    
    if (logoClickTimeoutRef.current) clearTimeout(logoClickTimeoutRef.current);
    logoClickTimeoutRef.current = setTimeout(() => {
      setLogoClicks(0);
    }, 1500);
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const cartItemsData = useMemo(() => {
    const items: any[] = [];
    menuData.forEach(cat => {
      cat.items.forEach(item => {
        if (cart[item.id]) {
          items.push({ ...item, quantity: cart[item.id] });
        }
      });
    });
    return items;
  }, [cart, menuData]);

  const specials = useMemo(() => {
    return menuData.flatMap(cat => cat.items).filter(item => item.isSpecial);
  }, [menuData]);

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
    <div className={`min-h-screen ${tm.bgApp} ${tm.textApp} transition-colors duration-500`}>
      <div className={`fixed inset-0 ${tm.bgApp} tilet-pattern -z-20 transition-colors duration-500`} />
      
      {/* Decorative Glows Removed to eliminate elusive blue tints in Dark Mode */}

      {/* Layer 1: Main Header (70px) */}
      <header 
        className={`!sticky !top-0 !z-[1000] ${tm.bgHeader} ${isLightMode ? 'backdrop-blur-xl' : ''} border-b ${tm.borderMain} px-2 md:px-12 w-full !h-[70px] flex items-center transition-colors duration-500`}
        style={{ position: 'sticky', top: '0px', zIndex: 1000, height: '70px' }}
      >
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3 md:gap-8 w-full py-2">
          {/* Logo and Title Group */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div 
              className="w-9 h-9 md:w-16 md:h-16 relative flex-shrink-0 border border-[#D4AF37]/30 rounded-lg overflow-hidden bg-black shadow-lg cursor-pointer"
              onClick={handleLogoClick}
            >
              <img src={siteContent.logo || "/logo.png"} alt="Logo" className="w-full h-full object-cover pointer-events-none select-none" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-[10px] md:text-3xl font-serif text-[#D4AF37] tracking-tighter leading-none font-bold uppercase">{siteContent.hotelName}</h1>
              <p className={`text-[5px] md:text-[10px] ${tm.textMuted} uppercase tracking-[0.2em] mt-0.5 whitespace-nowrap font-medium`}>{siteContent.hotelSlogan}</p>
            </div>
          </div>
          
          {/* Search and Filters Group */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-6 ml-1 md:ml-4">
            <div className="relative flex-grow max-w-[120px] md:max-w-[400px] group">
              <input 
                type="text" 
                placeholder={t.search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${tm.searchBg} border ${tm.borderMain} rounded-full compact-input text-[10px] md:text-base py-1 px-6 md:py-2.5 md:px-10 focus:outline-none focus:border-[#D4AF37] transition-all`}
              />
              <svg className={`absolute left-2 md:left-3.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 md:w-4 md:h-4 ${tm.searchIcon} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Price Filter - Desktop: inline slider, Mobile: gold icon + dropdown */}
            <div className={`hidden lg:flex items-center gap-2 ${tm.searchBg} border ${tm.borderMain} rounded-full px-3 py-1 flex-shrink-0 h-9 transition-colors`}>
              <span className="text-[10px] text-[#D4AF37] font-black">{priceLimit} ETB</span>
              <input 
                type="range" 
                min={Number(minPrice) || 0} 
                max={Number(maxPrice) || 1000} 
                value={Number(priceLimit) || 0}
                onChange={(e) => setPriceLimit(Number(e.target.value))}
                className="price-range-slider w-16 md:w-24"
                style={{ '--progress': `${(Number(maxPrice) || 1000) > (Number(minPrice) || 0) ? ((Number(priceLimit) || 0) - (Number(minPrice) || 0)) / ((Number(maxPrice) || 1000) - (Number(minPrice) || 0)) * 100 : 0}%` } as React.CSSProperties}
              />
            </div>

            {/* Mobile Price Filter Icon */}
            <div className="relative lg:hidden flex-shrink-0">
              <button
                onClick={() => setShowPriceFilter(!showPriceFilter)}
                className={`px-3 md:px-4 h-7 md:h-9 rounded-full border flex items-center justify-center transition-all active:scale-95 flex-shrink-0 ${
                  showPriceFilter
                    ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-[0_0_16px_rgba(212,175,55,0.5)]'
                    : `${tm.switchBtn} ${tm.borderMain}`
                }`}
                aria-label="Price filter"
              >
                <span className="text-[10px] md:text-xs font-black tracking-widest uppercase">ETB</span>
              </button>
              
              {/* Mobile Price Filter Dropdown Overlay */}
              {showPriceFilter && (
                <>
                  {/* Transparent Backdrop to close */}
                  <div 
                    className="fixed inset-0 z-[1050] bg-transparent" 
                    onClick={() => setShowPriceFilter(false)} 
                  />
                  <div className={`fixed left-1/2 -translate-x-1/2 top-[85px] z-[1060] w-[92%] max-w-md rounded-3xl border border-[#D4AF37]/40 ${
                    isLightMode 
                      ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)]' 
                      : 'bg-[#0A0A0A] shadow-[0_20px_60px_rgba(0,0,0,0.9)]'
                  } p-6 md:p-8 animate-price-filter-in`}>
                    {/* Centered Gold notch arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 border-l border-t border-[#D4AF37]/40" style={{ background: isLightMode ? '#FFFFFF' : '#0A0A0A' }} />
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <span className={`text-[10px] uppercase tracking-[0.4em] font-black ${isLightMode ? 'text-gray-400' : 'text-white/40'}`}>Price Range</span>
                        <span className={`text-[8px] uppercase tracking-[0.2em] font-serif italic ${isLightMode ? 'text-gray-300' : 'text-white/20'}`}>Live Filtering</span>
                      </div>
                      <span className="text-2xl font-black text-[#D4AF37] font-serif">{priceLimit} <small className="text-[10px] tracking-widest">ETB</small></span>
                    </div>
                    
                    {/* Sleek Range Slider */}
                    <div className="relative mb-2 px-2">
                      <input 
                        type="range" 
                        min={Number(minPrice) || 0} 
                        max={Number(maxPrice) || 1000} 
                        value={Number(priceLimit) || 0}
                        onChange={(e) => setPriceLimit(Number(e.target.value))}
                        className="price-range-slider w-full"
                        style={{ '--progress': `${(Number(maxPrice) || 1000) > (Number(minPrice) || 0) ? ((Number(priceLimit) || 0) - (Number(minPrice) || 0)) / ((Number(maxPrice) || 1000) - (Number(minPrice) || 0)) * 100 : 0}%` } as React.CSSProperties}
                      />
                      <div className="flex justify-between mt-4">
                        <span className={`text-[10px] font-bold tracking-tighter ${isLightMode ? 'text-gray-400' : 'text-white/30'}`}>{minPrice} ETB</span>
                        <span className={`text-[10px] font-bold tracking-tighter ${isLightMode ? 'text-gray-400' : 'text-white/30'}`}>{maxPrice} ETB</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Icons Group */}
            <div className="flex items-center gap-1.5 md:gap-4 flex-shrink-0">
              <button 
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className={`w-7 h-7 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center text-[8px] md:text-xs font-bold transition-all hover:bg-[#D4AF37] hover:text-white active:scale-95 ${tm.switchBtn}`}
              >
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              
              <button 
                onClick={() => setIsLightMode(!isLightMode)}
                className={`w-7 h-7 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center transition-all hover:bg-[#D4AF37] hover:text-white active:scale-95 ${tm.switchBtn}`}
              >
                {isLightMode ? <Moon className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Sun className="w-3.5 h-3.5 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Layer 2: Specials Hero Section (180px) */}
      <div 
        className={`${tm.bgHeader} backdrop-blur-md border-b ${tm.borderMain} overflow-hidden w-full !h-[180px] relative transition-colors duration-500 specials-scroll-container`}
        style={{ height: '180px' }}
      >
        <div className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 ${isLightMode ? 'backdrop-blur-sm' : ''} px-4 py-2 rounded-r-xl border-y border-r border-[#D4AF37]/30 ${isLightMode ? 'shadow-2xl' : 'shadow-none'} hidden md:block`}>
          <span className="text-[10px] md:text-xs font-serif text-[#D4AF37] uppercase tracking-[0.4em] whitespace-nowrap">{t.specials}</span>
        </div>
        <div 
          className="animate-infinite-scroll flex h-full gap-4 px-4 py-4 items-center relative z-10 pointer-events-auto"
          style={{ animationPlayState: isSpecialsHovered ? 'paused' : 'running' }}
          onMouseEnter={() => setIsSpecialsHovered(true)}
          onMouseLeave={() => setIsSpecialsHovered(false)}
        >
          {[...specials, ...specials, ...specials].map((item, idx) => (
            <div 
              key={`${item.id}-${idx}`} 
              className="relative h-[148px] w-[195px] md:w-[325px] flex-shrink-0 group overflow-hidden rounded-xl border border-[#D4AF37]/10"
            >
              {item.image ? (
                <SafeImage 
                  src={item.image} 
                  alt={lang === 'en' ? item.name_en : item.name_am} 
                  fill
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                />
              ) : (
                <div className={`absolute inset-0 w-full h-full ${isLightMode ? 'bg-gradient-to-br from-[#FFFBEB] to-[#F9F9F9]' : 'bg-[#000000]'} flex items-center justify-center`}>
                  <span className={`${tm.textAcc} font-serif text-4xl opacity-40`}>{(lang === 'en' ? item.name_en : item.name_am).charAt(0)}</span>
                </div>
              )}
              {/* No darkening overlay for 100% clarity */}
              <div className="absolute bottom-2 left-4 z-10">
                <h3 className={`font-serif text-sm md:text-xl tracking-wide leading-tight transition-colors text-[#D4AF37] drop-shadow-md`}>{lang === 'en' ? item.name_en : item.name_am}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-[#D4AF37] font-black text-xs md:text-lg">{item.price} ETB</span>
                  <div className="flex items-center gap-2">
                    {cart[item.id] > 0 ? (
                      <div className={`flex items-center gap-2 ${isLightMode ? 'bg-zinc-950/80 backdrop-blur-md' : 'bg-[#000000]'} rounded-full px-1.5 py-0.5 border border-[#D4AF37]/30`}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}
                          className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center ${isLightMode ? 'bg-zinc-800 text-[#D4AF37]' : 'bg-black text-[#D4AF37] border border-[#D4AF37]/20'} rounded-full text-xs hover:bg-[#D4AF37]/20 transition-all`}
                        >
                          -
                        </button>
                        <span className="text-[10px] md:text-xs font-black text-[#D4AF37] px-1">{cart[item.id]}</span>
                        <button 
                          onClick={(e) => { e.stopPropagation(); addToCart(item.id); }}
                          className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center bg-[#D4AF37] ${isLightMode ? 'text-zinc-950' : 'text-black'} rounded-full text-xs font-black hover:scale-110 transition-transform shadow-none border border-[#D4AF37]`}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(item.id); }}
                        className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-black hover:scale-110 transition-transform ${isLightMode ? 'shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'shadow-none'} border border-[#D4AF37] ${isLightMode ? 'bg-[#D4AF37] text-white' : 'bg-[#D4AF37] text-black'}`}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer 3: Category List Section (60px) */}
      <div 
        className={`!sticky !top-[70px] !z-[998] ${tm.bgHeader} ${isLightMode ? 'backdrop-blur-xl' : ''} border-b ${tm.borderMain} px-4 md:px-12 w-full !h-[60px] flex items-center transition-colors duration-500`}
        style={{ position: 'sticky', top: '70px', zIndex: 998, height: '60px' }}
      >
        <div className="max-w-7xl mx-auto flex flex-nowrap justify-start gap-2 md:gap-4 overflow-x-auto no-scrollbar py-2 w-full category-scroll-list">
          {["All", ...menuData.map(c => lang === 'en' ? c.category_en : c.category_am)].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-4 py-2 md:px-8 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 border flex-shrink-0 whitespace-nowrap flex items-center justify-center gap-1.5 md:gap-2 ${
                activeCategory === cat 
                  ? `${tm.catBgActive} scale-[1.02]`
                  : tm.catBgInactive
              }`}
            >
              <CategoryIcon name={cat} className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
                activeCategory === cat ? '' : isLightMode ? 'text-gray-400' : 'text-[#D4AF37]/50'
              }`} />
              {t.categories[cat as keyof typeof t.categories] || cat}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-12 pt-4 md:pt-6 pb-32">
        {/* Menu Watermark Heading */}
        <section className="mb-8 md:mb-10">
          <div className="text-center relative">
            <h2 className={`text-2xl md:text-4xl font-black ${tm.textAcc} select-none tracking-[0.4em] m-0 leading-none transition-colors duration-500 uppercase pb-1`}>
              {t.menu}
            </h2>
            <div className={`h-1 w-20 bg-[#D4AF37]/20 mx-auto mt-2 rounded-full ${isLightMode ? 'shadow-sm' : ''}`}></div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="space-y-16 md:space-y-24">
          {filteredMenuData.map((section) => (
            <section key={section.category_en} className="">
              <div className="flex items-center gap-3 mb-10">
                <CategoryIcon name={lang === 'en' ? section.category_en : section.category_am} className={`w-5 h-5 ${tm.textMuted}`} />
                <h3 className={`text-sm md:text-base font-serif ${tm.textMuted} uppercase tracking-[0.4em]`}>
                  {t.categories[(lang === 'en' ? section.category_en : section.category_am) as keyof typeof t.categories] || (lang === 'en' ? section.category_en : section.category_am)}
                </h3>
                <div className={`h-[1px] flex-grow ${tm.borderMain} border-t ml-2`}></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {section.items.map((item) => (
                  <article 
                    key={item.id} 
                    className={`relative flex items-center justify-center w-full max-w-[340px] md:max-w-[700px] mx-auto h-36 md:h-48 my-6 md:my-10 translate-x-2 md:translate-x-4 ${
                      item.isSoldOut ? 'opacity-50 grayscale contrast-75' : ''
                    }`}
                  >
                    {/* Floating Circular Image Layer (Offset Left) */}
                    <div className="absolute -left-4 md:-left-8 w-44 h-44 md:w-60 md:h-60 flex-shrink-0 z-30 transition-transform duration-500 group-hover:scale-105">
                      <div className={`relative w-full h-full rounded-full overflow-hidden border-2 border-[#D4AF37] ${isLightMode ? 'shadow-[0_12px_40px_rgba(0,0,0,0.15)]' : 'shadow-[0_20px_50px_rgba(0,0,0,0.8)]'} bg-[#000000]`}>
                      {item.image ? (
                        <SafeImage 
                          src={item.image} 
                          alt={lang === 'en' ? item.name_en : item.name_am} 
                          fill
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center bg-[#1A1A1A]`}>
                          <span className={`${tm.textAcc} font-serif text-5xl opacity-40`}>{(lang === 'en' ? item.name_en : item.name_am).charAt(0)}</span>
                        </div>
                      )}
                      </div>
                      
                      {/* Tags inside floating circle */}
                      <div className="absolute top-6 left-6 flex flex-col gap-1 z-40">
                          {item.isSpecial && (
                            <div className={`px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-[#D4AF37] text-[#000000] border border-[#000000]/10 w-fit shadow-md`}>
                              {t.special}
                            </div>
                          )}
                          {item.isNew && (
                            <div className={`px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-[#28A745] text-white w-fit shadow-md`}>
                              {t.new}
                            </div>
                          )}
                        </div>
                    </div>

                    {/* Symmetrical Structured Frame Layer */}
                    <div className={`w-full h-full ${tm.cardFrameBg} rounded-3xl border ${tm.cardFrameBorder} ${tm.cardFrameHoverBorder} pl-40 md:pl-56 pr-4 md:pr-12 py-3 md:py-6 flex flex-col items-center justify-between text-center relative overflow-hidden ${tm.cardFrameShadow} ${tm.cardFrameHoverShadow} transition-all duration-500`}>
                      {/* Top: Name & Price */}
                      <div className="flex-shrink-0 w-full max-w-[200px] md:max-w-[300px]">
                        <h3 className={`text-lg md:text-3xl font-serif font-black ${tm.cardTitleColor} transition-colors leading-tight break-words line-clamp-1`}>{lang === 'en' ? item.name_en : item.name_am}</h3>
                        <span className={`${tm.cardPriceColor} font-black text-base md:text-2xl whitespace-nowrap`}>{item.price} ETB</span>
                      </div>

                      {/* Middle: Description (clamped, click to expand) */}
                      <div className="flex-1 flex items-center w-full max-w-[200px] md:max-w-[300px] min-h-0 overflow-hidden py-1">
                        <p
                          onClick={() => handleItemClick(item.id)}
                          className={`${tm.cardDescColor} text-[10px] md:text-sm italic font-light leading-relaxed transition-colors cursor-pointer hover:opacity-80 w-full line-clamp-2 overflow-hidden`}
                          title="Tap to read more"
                        >{lang === 'en' ? item.description_en : item.description_am}</p>
                      </div>

                      {/* Bottom: ADD button (always anchored) */}
                      <div className={`flex-shrink-0 flex items-center justify-center pt-2 border-t ${tm.cardDivider} w-full max-w-[200px] md:max-w-[300px]`}>
                        <div className="flex items-center gap-2">
                          {cart[item.id] > 0 && !item.isSoldOut && (
                            <div className={`flex items-center gap-2 border ${isLightMode ? 'border-[#D4AF37]/20 bg-gray-50' : 'border-[#D4AF37]/30 bg-black/20'} rounded-full px-1.5 py-1 shadow-md`}>
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className={`w-6 h-6 flex items-center justify-center rounded-full text-xs transition-colors bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] ${isLightMode ? 'hover:text-white' : 'hover:text-black'}`}
                              >
                                -
                              </button>
                              <span className={`text-[11px] font-black px-1 ${isLightMode ? 'text-[#1A1A1A]' : 'text-[#D4AF37]'}`}>{cart[item.id]}</span>
                              <button 
                                onClick={(e) => addToCart(item.id, e)}
                                className={`px-3 h-6 flex items-center justify-center rounded-md text-[10px] font-black border border-[#D4AF37] bg-[#D4AF37] text-black hover:scale-110 transition-transform uppercase tracking-tighter`}
                              >
                                ADD
                              </button>
                            </div>
                          )}
                          {!cart[item.id] && (
                            <button 
                              disabled={item.isSoldOut}
                              onClick={(e) => addToCart(item.id, e)}
                              className={`flex items-center justify-center gap-2 px-5 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                                item.isSoldOut ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-[#D4AF37] text-black hover:scale-105 active:scale-95 shadow-lg shadow-[#D4AF37]/20'
                              }`}
                            >
                              <svg className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                              <span>ADD</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Fly-to-Cart Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-[2000] overflow-hidden">
        {flyingItems.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full overflow-hidden border-2 border-[#D4AF37] bg-black shadow-xl"
            style={{
              width: '80px',
              height: '80px',
              left: 0,
              top: 0,
              willChange: 'transform, opacity',
              transition: f.active ? 'all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none',
              opacity: f.active ? 0 : 0.7,
              transform: f.active 
                ? `translate(${f.endX - 40}px, ${f.endY - 40}px) scale(0.2)` 
                : `translate(${f.startX - 40}px, ${f.startY - 40}px) scale(1)`,
            }}
          >
            <img src={f.image} className="w-full h-full object-cover" alt="Flying item" />
          </div>
        ))}
      </div>

      {/* Expanded Description Popup */}
      {expandedDesc !== null && (() => {
        const allItems = menuData.flatMap(s => s.items);
        const found = allItems.find(i => i.id === expandedDesc);
        if (!found) return null;
        return (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center px-4" onClick={() => setExpandedDesc(null)}>
            <div className={`absolute inset-0 ${tm.modalOverlay} backdrop-blur-sm`} />
            <div
              className={`relative z-10 ${tm.modalBg} border border-[#D4AF37]/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fade-in-up`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedDesc(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <h3 className={`text-xl font-serif font-black ${tm.cardTitleColor} mb-1`}>{lang === 'en' ? found.name_en : found.name_am}</h3>
              <span className={`${tm.cardPriceColor} font-black text-lg`}>{found.price} ETB</span>
              <div className={`mt-3 pt-3 border-t border-[#D4AF37]/10`}>
                <p className={`${tm.cardDescColor} text-sm italic font-light leading-relaxed`}>{lang === 'en' ? found.description_en : found.description_am}</p>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Floating Cart Button (Mobile Optimized) */}
      <div className={`fixed bottom-0 left-0 right-0 p-6 z-[950] transition-all duration-700 pointer-events-none lg:px-12 ${cartItemCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <button 
          id="cart-btn"
          onClick={() => setShowModal("cart")}
          className={`mx-auto bg-[#D4AF37] text-black px-8 py-4 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-[0_12px_40px_rgba(0,0,0,0.8)] border-2 border-[#D4AF37] hover:scale-105 active:scale-95 flex items-center justify-center gap-3 pointer-events-auto w-full max-w-md md:w-auto relative overflow-hidden group ${cartPulse ? 'scale-110 shadow-[0_0_40px_rgba(212,175,55,0.8)]' : 'transition-all'}`}
        >
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="flex-1 text-center font-black">View Order - {cartTotal.toFixed(2)} ETB</span>
        </button>
      </div>

      {/* Modals & Bottom Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-[1100] flex items-end lg:items-center justify-center">
          <div className={`absolute inset-0 ${tm.modalOverlay} backdrop-blur-md transition-opacity duration-500`} onClick={() => setShowModal(null)} />
          
          <div className={`
            ${tm.modalBg} relative z-10 w-full lg:max-w-xl transition-all duration-500
            ${showModal === "cart" 
              ? "h-[65vh] lg:h-auto lg:max-h-[85vh] rounded-t-[32px] lg:rounded-2xl border-t-2 border-[#D4AF37] lg:border-2" 
              : "p-8 max-h-[90vh] rounded-t-[32px] lg:rounded-2xl lg:m-4"
            }
            flex flex-col overflow-hidden animate-slide-up lg:animate-fade-in-up
          `}>
            {/* Top Indicator for Bottom Sheet */}
            <div className="lg:hidden w-full flex justify-center pt-3 pb-1" onClick={() => setShowModal(null)}>
              <div className="w-12 h-1.5 bg-[#D4AF37]/40 rounded-full" />
            </div>

            {showModal === "cart" ? (
              <div className="flex flex-col h-full uppercase tracking-tight">
                <div className="px-6 py-4 border-b border-[#D4AF37]/10 flex items-center justify-between">
                  <h2 className={`text-xl font-serif text-[#D4AF37] font-black tracking-[0.2em]`}>My Order</h2>
                  <button onClick={() => setShowModal(null)} className="h-10 w-10 flex items-center justify-center rounded-full bg-white/5 text-[#D4AF37]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                  {cartItemsData.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 group">
                      <div className="w-16 h-16 relative flex-shrink-0 rounded-xl overflow-hidden border border-[#D4AF37]/20 bg-black">
                        {item.image ? <Image src={item.image} alt={lang === 'en' ? item.name_en : item.name_am} fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-serif text-2xl">{(lang === 'en' ? item.name_en : item.name_am)[0]}</div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-serif text-[#D4AF37] font-bold text-lg truncate pr-2">{lang === 'en' ? item.name_en : item.name_am}</h4>
                          <span className="font-black text-[#D4AF37] whitespace-nowrap">{item.price} ETB</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                           <div className="flex items-center gap-1">
                              <button 
                                onClick={() => removeFromCart(item.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#D4AF37]/40 text-[#D4AF37] bg-white/5 active:scale-90 transition-transform"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M20 12H4" /></svg>
                              </button>
                              <span className={`w-10 text-center font-black ${isLightMode ? 'text-black' : 'text-white'} text-lg`}>{item.quantity}</span>
                              <button 
                                onClick={() => addToCart(item.id)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#D4AF37] text-black active:scale-90 transition-transform"
                                style={{ minHeight: '44px' }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                              </button>
                           </div>
                           <span className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Subtotal: {(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cartItemsData.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                      <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                      <p className="font-serif uppercase tracking-[0.3em] text-sm">Your cart is empty</p>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-black border-t border-[#D4AF37]/20">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-black">Grand Total</span>
                    <span className="text-4xl font-serif font-black text-[#D4AF37]">{cartTotal.toFixed(2)} <small className="text-xs">ETB</small></span>
                  </div>
                  <button 
                    onClick={() => setShowModal(null)}
                    className="w-full bg-[#D4AF37] text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-sm shadow-xl active:scale-95 transition-all"
                  >
                    Close & Browse
                  </button>
                </div>
              </div>
            ) : showModal === "story" ? (
              <div className="p-8 text-center bg-[#000000]">
                <h2 className="text-3xl font-serif text-[#D4AF37] uppercase tracking-widest mb-6">{t.ourStory}</h2>
                <div className="w-12 h-[1px] border-b border-[#D4AF37]/50 mx-auto mb-6" />
                <h3 className="text-lg text-white mb-4 italic leading-tight">{siteContent.storyTitle}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-8 whitespace-pre-wrap">{siteContent.storyText}</p>
                <button onClick={() => setShowModal(null)} className="w-full py-4 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full uppercase tracking-widest font-black text-xs hover:bg-[#D4AF37] hover:text-black transition-all">Close</button>
              </div>
            ) : (
              <div className="p-8 text-center bg-[#000000]">
                <h2 className="text-3xl font-serif text-[#D4AF37] uppercase tracking-widest mb-6">{t.contactInfo}</h2>
                <div className="w-12 h-[1px] border-b border-[#D4AF37]/50 mx-auto mb-6" />
                <div className="space-y-8 mb-8 text-white">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-2">{t.address}</p>
                    <p className="text-sm font-medium">{siteContent.address}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-2">{t.phone}</p>
                    <p className="text-2xl font-serif font-bold text-[#D4AF37]">{siteContent.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-2">Email</p>
                    <p className="text-sm font-medium font-mono">{siteContent.email}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(null)} className="w-full py-4 border border-[#D4AF37]/30 text-[#D4AF37] rounded-full uppercase tracking-widest font-black text-xs hover:bg-[#D4AF37] hover:text-black transition-all">Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className={`mt-32 py-20 border-t ${tm.borderMain} relative overflow-hidden ${tm.footerBg} transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 
            onPointerDown={handleLongPressStart}
            onPointerUp={handleLongPressEnd}
            onPointerLeave={handleLongPressEnd}
            className={`text-3xl font-serif ${tm.textAcc} mb-6 tracking-tighter font-bold uppercase select-none cursor-default`}
          >
            {siteContent.hotelName}
          </h2>
          <div className={`flex justify-center gap-6 ${tm.textMuted} text-[9px] tracking-[0.3em] uppercase font-black`}>
            <button onClick={() => setShowModal("story")} className={`hover:${tm.textAcc} transition-all`}>Our Story</button>
            <button onClick={() => setShowModal("contact")} className={`hover:${tm.textAcc} transition-all`}>Contact</button>
          </div>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none tilet-pattern" />
      </footer>
    </div>
  );
}
