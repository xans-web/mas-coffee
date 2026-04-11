"use client";

// Force dynamic rendering to ensure real-time updates for users
export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import { useMenu } from "@/context/MenuContext";
import { MainHero } from "@/context/MenuContext";
import { Sun, Moon, MapPin, Clock, Phone, ChefHat, Info, Search, SlidersHorizontal, Menu, X, Globe, Package, Calendar, ChevronLeft, Plus } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const translations = {
  en: {
    title: "MAS COFFEE",
    subtitle: "Where Every Sip Tells a Story",
    search: "Search...",
    specials: "Chef's Recommendations",
    menu: "Cafe Menu",
    home: "Home",
    aboutUs: "About Us",
    gallery: "Gallery",
    events: "Events",
    contactUs: "Contact Us",
    products: "Products",
    coffee: "Coffee",
    cake: "Cake",
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
    menu: "ካፌ ሜኑ",
    home: "መነሻ",
    aboutUs: "ስለ እኛ",
    gallery: "ጋለሪ",
    events: "ክስተቶች",
    contactUs: "አድራሻ",
    products: "ምርቶች",
    coffee: "ቡና",
    cake: "ኬክ",
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

const PUBLIC_LOGO = "/logo.svg";
const PUBLIC_STORY_IMAGE = "/story-image.svg";

const SafeImage = ({ src, alt, fill, ...props }: any) => {
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  if (!imgSrc) return <div className="w-full h-full bg-[#C5A367]/5 animate-pulse" />;

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
  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  const { menuData, siteContent, websiteContent, refreshData, language: lang, setLanguage: setLang } = useMenu();
  const [isLightMode, setIsLightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(30);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [expandedDesc, setExpandedDesc] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"home" | "menu" | "about" | "gallery" | "events" | "contact" | "products">("home");
  const [activeProductCategory, setActiveProductCategory] = useState<"coffee" | "cake" | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [selectedProductView, setSelectedProductView] = useState<any | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);

  const [directHeroes, setDirectHeroes] = useState<MainHero[]>([]);

  // Website Manager Frontend States
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [activeLookbookCategory, setActiveLookbookCategory] = useState("All");
  const [lookbookSearch, setLookbookSearch] = useState("");
  
  // Contact Form State
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingInquiry) return;
    
    setIsSubmittingInquiry(true);
    try {
      const res = await fetch('/api/website/submit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      
      if (res.ok) {
        alert("Thank you! Your message has been received.");
        setContactForm({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error("Inquiry Submit Error:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsSubmittingInquiry(false);
    }
  };
  
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
    if (typeof window === "undefined") return;
    const raw = window.location.hash.replace(/^#/, "").toLowerCase();
    const allowed: Array<"home" | "menu" | "about" | "gallery" | "events" | "contact" | "products"> = [
      "home", "menu", "products", "about", "gallery", "events", "contact",
    ];
    if (raw && allowed.includes(raw as (typeof allowed)[number])) {
      setActiveSection(raw as typeof activeSection);
    }
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

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const res = await fetch('/api/website/hero');
        if (res.ok) {
          const data = await res.json();
          setDirectHeroes(data);
        }
      } catch (error) {
        console.error('Failed to fetch heroes', error);
      }
    };
    fetchHeroes();
  }, []);

  const filteredLookbookItems = useMemo(() => {
    return websiteContent.lookbookItems.filter(item => {
      const matchesSearch = (item.title || "").toLowerCase().includes(lookbookSearch.toLowerCase());
      return matchesSearch;
    });
  }, [websiteContent.lookbookItems, lookbookSearch]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<{ [key: string | number]: number }>({});
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

  const cartItems = useMemo(() => {
    const list: any[] = [];
    menuData.forEach(cat => cat.items.forEach(item => {
      if (cart[item.id]) list.push({ 
        ...item, 
        cartId: item.id, 
        displayName: lang === 'en' ? item.name_en : item.name_am 
      });
    }));
    websiteContent.mainSiteProducts.forEach(item => {
      if (cart[item._id]) list.push({ 
        ...item, 
        cartId: item._id, 
        displayName: item.name 
      });
    });
    return list;
  }, [cart, menuData, websiteContent.mainSiteProducts, lang]);

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

  // Theme variables - Updated Brand Theme
  const tm = {
    bgApp: isLightMode ? "bg-[#F5EFE0]" : "bg-[#0B2421]",
    textApp: isLightMode ? "text-[#0B2421]" : "text-[#F5EFE0]",
    bgHeader: isLightMode ? "bg-[#F5EFE0]/95" : "bg-[#0B2421]/95",
    borderMain: isLightMode ? "border-[#0B2421]/10" : "border-[#C5A367]/10",
    textAcc: "text-[#C5A367]",
    textMuted: isLightMode ? "text-[#0B2421]/60" : "text-[#F5EFE0]/60",
    searchBg: isLightMode ? "bg-[#F5EFE0]/80" : "bg-[#0B2421]/80",
    searchIcon: isLightMode ? "text-[#0B2421]" : "text-[#C5A367]",
    switchBtn: isLightMode ? "bg-[#F5EFE0] border-[#0B2421]/10 text-[#0B2421]" : "bg-[#0B2421] border-[#C5A367]/10 text-[#F5EFE0]",
    catBgActive: "bg-[#C5A367] text-[#0B2421] shadow-[0_0_20px_rgba(197,163,103,0.4)] scale-105 border-[#C5A367]",
    catBgInactive: isLightMode ? "bg-[#F5EFE0]/80 text-[#0B2421]/70 border-[#0B2421]/10 hover:border-[#0B2421]/40 hover:scale-105" : "bg-[#0B2421]/80 text-[#F5EFE0]/70 border-[#C5A367]/10 hover:border-[#C5A367]/40 hover:scale-105",
    cardBg: isLightMode ? "bg-[#F5EFE0]/80 backdrop-blur-md border-[#0B2421]/10 shadow-xl" : "bg-[#0B2421]/80 backdrop-blur-md border-[#C5A367]/10 shadow-xl",
    modalOverlay: "bg-[#0B2421]/60 backdrop-blur-sm",
    modalBg: isLightMode ? "bg-[#F5EFE0] backdrop-blur-xl border border-[#0B2421]/10" : "bg-[#0B2421] backdrop-blur-xl border border-[#C5A367]/10",
    // Food card specifics
    cardFrameBg: isLightMode ? "bg-[#F5EFE0]/85 backdrop-blur-md" : "bg-[#0B2421]/85 backdrop-blur-md",
    cardFrameBorder: isLightMode ? "border-[#0B2421]/10" : "border-[#C5A367]/10",
    cardTitleColor: isLightMode ? "text-[#0B2421]" : "text-[#C5A367]",
    cardDescColor: isLightMode ? "text-[#0B2421]/70" : "text-[#F5EFE0]/70",
    cardPriceColor: isLightMode ? "text-[#0B2421]" : "text-[#C5A367]",
    cardDivider: isLightMode ? "border-[#0B2421]/10" : "border-[#C5A367]/10"
  };

  const addToCart = (id: number | string, e?: React.MouseEvent) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    if (e && typeof window !== "undefined") {
      // Try to find image in both menuData and websiteContent
      const allItems = [
        ...menuData.flatMap(c => c.items),
        ...websiteContent.mainSiteProducts.map(p => ({ id: p._id, image: p.image }))
      ];
      const item = allItems.find(i => String(i.id) === String(id));
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
    websiteContent.mainSiteProducts.forEach(item => { if (cart[item._id]) total += item.price * cart[item._id]; });
    return total;
  }, [cart, menuData, websiteContent.mainSiteProducts]);

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
    <div className={`min-h-screen ${tm.bgApp} ${tm.textApp} transition-colors duration-500 font-sans selection:bg-[#C5A367] selection:text-[#0B2421] overflow-x-hidden touch-pan-y`}>
      <div className={`fixed inset-0 ${tm.bgApp} tilet-pattern -z-20 transition-colors duration-500 opacity-20`} />
      
      {/* Global Header - Strictly Fixed */}
      <header className={`fixed top-0 left-0 right-0 z-1000 ${activeSection === 'home' ? 'bg-transparent border-none' : `${tm.bgHeader} backdrop-blur-xl border-b ${tm.borderMain}`} px-4 md:px-12 w-full h-14 md:h-17.5 flex items-center transition-all duration-500`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full relative">
          
          {/* Mobile Header Row (Visible only on mobile/tablet < 768px) */}
          <div className="flex lg:hidden items-center justify-between w-full h-full gap-2">
            {/* Left: Logo & Company Name (Hidden on Home Page) */}
            <div className={`flex items-center gap-1.5 shrink-0 cursor-pointer ${activeSection === 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={handleLogoClick}>
              <div className="w-7 h-7 relative rounded-lg overflow-hidden border border-[#C5A367]/20">
                <img
                  src={siteContent.logo || PUBLIC_LOGO}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.src.endsWith(PUBLIC_LOGO)) el.src = PUBLIC_LOGO;
                  }}
                />
              </div>
              <h1 className="text-[10px] font-serif font-black tracking-tighter uppercase text-[#C5A367] whitespace-nowrap">Mas Coffee</h1>
            </div>

            {/* Icons Group: Search, Filter, Lang, Hamburger */}
            <div className="flex items-center gap-1 grow justify-end">
              {/* Other Icons (Hidden on Home Page) */}
              <div className={`flex items-center gap-1 ${activeSection === 'home' ? 'hidden' : 'flex'}`}>
                <button 
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95 ${showSearchInput ? 'bg-[#C5A367] text-[#0B2421]' : 'text-[#C5A367]'}`}
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setShowPriceFilter(!showPriceFilter)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[#C5A367] transition-all active:scale-95 ${showPriceFilter ? 'bg-[#C5A367] text-[#0B2421]' : ''}`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                  className={`w-8 h-8 rounded-full border border-[#C5A367]/10 flex items-center justify-center text-[9px] font-bold text-[#C5A367] transition-all active:scale-95`}
                >
                  {lang === 'en' ? 'አማ' : 'EN'}
                </button>
              </div>

              {/* Hamburger Menu Icon (Always Visible) */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[#C5A367] transition-all active:scale-95 ${isMobileMenuOpen ? 'bg-[#C5A367] text-[#0B2421]' : ''}`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Header Content (Hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-between w-full">
            {/* Logo */}
            <div className="flex items-center gap-3 md:gap-6 cursor-pointer group" onClick={handleLogoClick}>
              <div className="w-10 h-10 md:w-14 md:h-14 relative rounded-xl overflow-hidden border border-[#C5A367]/30 shadow-2xl transition-transform group-hover:scale-105">
                <img
                  src={siteContent.logo || PUBLIC_LOGO}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.src.endsWith(PUBLIC_LOGO)) el.src = PUBLIC_LOGO;
                  }}
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <h1 className="text-xl md:text-2xl font-serif font-black tracking-tighter uppercase text-[#C5A367]">Mas Coffee</h1>
                <p className={`text-[10px] uppercase tracking-[0.3em] font-medium opacity-60`}>Premium Coffee Experience</p>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="hidden lg:flex items-center gap-8">
              {[
                { id: 'home', label: t.home },
                { id: 'menu', label: t.menu },
                { id: 'products', label: t.products, dropdown: [
                  { id: 'coffee', label: t.coffee },
                  { id: 'cake', label: t.cake }
                ]},
                { id: 'about', label: t.aboutUs },
                { id: 'gallery', label: t.gallery },
                { id: 'events', label: t.events },
                { id: 'contact', label: t.contactUs }
              ].map((link) => (
                <div key={link.id} className="relative group">
                  <button
                    onClick={() => {
                      if (!link.dropdown) {
                        setActiveSection(link.id as any);
                        setActiveProductCategory(null);
                        if (typeof window !== "undefined") {
                          window.history.replaceState(null, "", `#${link.id}`);
                        }
                      }
                    }}
                    className={`text-xs font-serif font-black uppercase tracking-[0.2em] transition-all relative py-2 ${
                      activeSection === link.id ? 'text-[#C5A367]' : 'text-[#F5EFE0]/70 hover:text-[#C5A367]'
                    }`}
                  >
                    {link.label}
                    {activeSection === link.id && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C5A367] rounded-full animate-scale-x" />
                    )}
                  </button>
                  
                  {link.dropdown && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#0B2421] border border-[#C5A367]/20 rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-2xl z-1100">
                      {link.dropdown.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setActiveSection('products');
                            setActiveProductCategory(sub.id as any);
                            setActiveSubCategory(null);
                            if (typeof window !== "undefined") {
                              window.history.replaceState(null, "", `#products`);
                            }
                          }}
                          className={`w-full text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#C5A367]/10 transition-colors ${
                            activeSection === 'products' && activeProductCategory === sub.id ? 'text-[#C5A367]' : 'text-[#F5EFE0]/60'
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              <button 
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center text-[10px] md:text-xs font-bold transition-all hover:bg-[#C5A367] hover:text-[#0B2421] active:scale-95 ${tm.switchBtn}`}
              >
                {lang === 'en' ? 'አማ' : 'EN'}
              </button>
              <button 
                onClick={() => setIsLightMode(!isLightMode)}
                className={`w-9 h-9 md:w-11 md:h-11 rounded-full border ${tm.borderMain} flex items-center justify-center transition-all hover:bg-[#C5A367] hover:text-[#0B2421] active:scale-95 ${tm.switchBtn}`}
              >
                {isLightMode ? <Moon className="w-4 h-4 md:w-5 md:h-5" /> : <Sun className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Input Overlay */}
        {showSearchInput && (
          <div className="lg:hidden absolute top-14 left-0 w-full p-3 bg-[#0B2421] border-b border-[#C5A367]/10 animate-fade-in z-900">
            <div className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder={t.search} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${tm.searchBg} border border-[#C5A367]/30 rounded-full py-2 px-10 focus:outline-none focus:border-[#C5A367] transition-all text-xs text-[#F5EFE0]`}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#C5A367]/50" />
              <button onClick={() => { setSearchQuery(""); setShowSearchInput(false); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-[#C5A367]/50" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Price Filter Overlay */}
        {showPriceFilter && (
          <div className="lg:hidden absolute top-14 left-0 w-full p-4 bg-[#0B2421] border-b border-[#C5A367]/10 animate-fade-in z-900">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Price Limit</span>
              <span className="font-serif font-black text-[#C5A367] text-sm">{priceLimit} ETB</span>
            </div>
            <input 
              type="range" 
              min={minPrice} 
              max={maxPrice} 
              value={priceLimit}
              onChange={(e) => setPriceLimit(Number(e.target.value))}
              className="w-full h-1 bg-[#C5A367]/10 rounded-full appearance-none accent-[#C5A367]"
            />
          </div>
        )}
      </header>

      {/* Mobile Hamburger Menu Overlay (Right Slide-In) */}
      <div 
        className={`fixed inset-0 z-1500 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-[#0B2421]/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)} />
        <div 
          className={`absolute top-0 right-0 h-full w-[80%] max-w-sm bg-[#0B2421] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col p-6 md:p-12 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative rounded-xl overflow-hidden border border-[#C5A367]/20">
                <img
                  src={siteContent.logo || PUBLIC_LOGO}
                  alt="Logo"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (!el.src.endsWith(PUBLIC_LOGO)) el.src = PUBLIC_LOGO;
                  }}
                />
              </div>
              <h2 className={`text-lg font-serif font-black text-[#C5A367]`}>Mas Coffee</h2>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className={`w-8 h-8 rounded-full border border-[#C5A367]/20 flex items-center justify-center text-[#C5A367]`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 flex-1 overflow-y-auto">
            {[
              { id: 'home', label: t.home },
              { id: 'menu', label: t.menu },
              { id: 'products', label: t.products, dropdown: [
                { id: 'coffee', label: t.coffee },
                { id: 'cake', label: t.cake }
              ]},
              { id: 'about', label: t.aboutUs },
              { id: 'gallery', label: t.gallery },
              { id: 'events', label: t.events },
              { id: 'contact', label: t.contactUs }
            ].map((link) => (
              <div key={link.id} className="flex flex-col">
                <button
                  onClick={() => {
                    if (!link.dropdown) {
                      setActiveSection(link.id as any);
                      setActiveProductCategory(null);
                      setIsMobileMenuOpen(false);
                      if (typeof window !== "undefined") {
                        window.history.replaceState(null, "", `#${link.id}`);
                      }
                    } else {
                      setIsProductsDropdownOpen(!isProductsDropdownOpen);
                    }
                  }}
                  className={`text-sm font-serif font-normal uppercase tracking-widest text-left transition-all py-2 ${
                    activeSection === link.id ? 'text-[#C5A367]' : 'text-[#F5EFE0]/85 hover:text-[#C5A367]'
                  } flex justify-between items-center`}
                >
                  {link.label}
                  {link.dropdown && (
                    <span className={`transition-transform duration-300 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  )}
                </button>
                
                {link.dropdown && isProductsDropdownOpen && (
                  <div className="flex flex-col pl-6 mt-2 gap-2 animate-fade-in">
                    {link.dropdown.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setActiveSection('products');
                          setActiveProductCategory(sub.id as any);
                          setActiveSubCategory(null);
                          setIsMobileMenuOpen(false);
                          if (typeof window !== "undefined") {
                            window.history.replaceState(null, "", `#products`);
                          }
                        }}
                        className={`text-left py-1 text-[10px] sm:text-xs font-serif font-normal uppercase tracking-widest ${
                          activeSection === 'products' && activeProductCategory === sub.id ? 'text-[#C5A367]' : 'text-[#F5EFE0]/60'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-[#C5A367]/10 space-y-3">
             <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className={`flex items-center gap-3 w-full py-3 px-5 rounded-2xl border ${tm.borderMain} bg-[#0B2421] text-[#C5A367] font-normal uppercase tracking-widest text-[9px]`}
            >
              {isLightMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{isLightMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className={`flex items-center gap-3 w-full py-3 px-5 rounded-2xl border ${tm.borderMain} bg-[#0B2421] text-[#C5A367] font-black uppercase tracking-widest text-[10px]`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Switch to Amharic' : 'ወደ እንግሊዝኛ ቀይር'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sections - Offset by header height (Removed offset for Home Section) */}
      <div className={`relative overflow-hidden ${activeSection === 'home' ? 'pt-0' : 'pt-14 md:pt-17.5'} transition-all duration-500`}>
        
        {/* Home Section (Dynamic Hero & Lookbook) */}
        {activeSection === 'home' && (
          <div className="animate-fade-in">
            {isWebsiteLoading ? (
              <div className="h-[calc(100vh-56px)] md:h-[calc(100vh-70px)] flex flex-col items-center justify-center space-y-8">
                <div className="w-20 h-20 border-2 border-[#C5A367]/20 border-t-[#C5A367] rounded-full animate-spin" />
                <p className="text-[#C5A367] font-serif italic uppercase tracking-widest opacity-40">Loading Premium Experience...</p>
              </div>
            ) : (
              <>
                {/* Modern Showstopper Hero - Full Background Curve */}
                <motion.section 
                  style={{ scale: heroScale, opacity: heroOpacity }}
                  className="relative h-[70vh] w-full bg-[#0B2421] overflow-hidden shadow-2xl"
                >
                  {directHeroes.length > 0 ? (
                    <Swiper
                      modules={[Autoplay, EffectFade, Pagination]}
                      effect="fade"
                      fadeEffect={{ crossFade: true }}
                      autoplay={{ delay: 6000, disableOnInteraction: false }}
                      pagination={{ 
                        clickable: true,
                        el: '.hero-pagination-container',
                        bulletClass: 'swiper-pagination-bullet',
                        bulletActiveClass: 'swiper-pagination-bullet-active'
                      }}
                      loop={true}
                      speed={1500}
                      className="w-full h-full relative"
                    >
                      {directHeroes.map((hero) => (
                        <SwiperSlide key={hero.id} className="w-full h-full">
                          <div className="absolute inset-0 w-full h-full">
                            {/* Subtle Continuous Ken Burns Zoom per slide */}
                            <motion.img 
                              animate={{ scale: [1.02, 1.08, 1.02] }} 
                              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                              src={hero.image} 
                              alt={hero.title} 
                              className="w-full h-full object-cover" 
                            />
                            {/* Dark Gradient Overlay for typography readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421]/90 via-black/40 to-black/30 pointer-events-none" />
                            {/* Top Gradient for Navigation Visibility */}
                            <div className="absolute top-0 left-0 right-0 h-[25%] bg-gradient-to-b from-black/95 to-transparent pointer-events-none z-10" />
                          </div>
                          
                          {/* Typography positioned in the lower part */}
                          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[12vh] md:pb-[15vh] z-10 px-6 text-center">
                            <motion.h2 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 1, delay: 0.3 }}
                              className="text-4xl md:text-6xl lg:text-[4.5rem] font-sans font-light text-white tracking-wide mb-4 drop-shadow-2xl text-balance"
                            >
                              {hero.title}
                            </motion.h2>
                            <motion.p 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="text-sm md:text-xl text-white font-sans font-light tracking-widest opacity-90 max-w-2xl text-balance drop-shadow-xl"
                            >
                              {hero.subtitle}
                            </motion.p>
                          </div>
                        </SwiperSlide>
                      ))}
                      
                      {/* Custom Pagination Container */}
                      <div className="hero-pagination-container absolute bottom-6 md:bottom-10 left-0 right-0 z-20 flex justify-center items-center gap-2" />
                      
                      <style jsx global>{`
                        .hero-pagination-container .swiper-pagination-bullet {
                          background: rgba(245, 239, 224, 0.5);
                          opacity: 1;
                          width: 8px;
                          height: 8px;
                          border-radius: 50%;
                          margin: 0 4px !important;
                          transition: all 0.4s ease;
                          cursor: pointer;
                        }
                        .hero-pagination-container .swiper-pagination-bullet-active {
                          background: #C5A367 !important;
                          width: 24px !important;
                          border-radius: 8px !important;
                          box-shadow: 0 0 10px rgba(197, 163, 103, 0.8);
                        }
                      `}</style>
                    </Swiper>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-8 relative z-10">
                      <div className="absolute inset-0 w-full h-full bg-[#08120F]">
                         <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421] to-transparent pointer-events-none" />
                      </div>
                      <div className="relative flex flex-col items-center">
                         <span className="text-6xl md:text-8xl opacity-50 mb-8 animate-pulse text-[#C5A367]">☕</span>
                         <h2 className="text-4xl md:text-7xl font-serif font-black text-[#C5A367] tracking-[0.05em] mb-4 drop-shadow-2xl">
                           Mas Coffee
                         </h2>
                         <p className="text-base md:text-xl text-[#F5EFE0] font-sans font-light tracking-widest opacity-80">
                           Where Every Sip Tells a Story
                         </p>
                      </div>
                    </div>
                  )}
                </motion.section>

                {/* Signature Collection (Coffee & Cakes) */}
                <section className="py-12 md:py-24 px-6 md:px-12 max-w-7xl mx-auto animate-fade-in-up">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-black text-[#C5A367] uppercase tracking-[0.3em] mb-4">SPECIALTY COFFEE ROASTER</h2>
                    <p className="text-[#C5A367]/60 text-xs md:text-sm uppercase tracking-widest font-medium">explore ethiopian origin coffee and artisanal cakes</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                    {/* Coffee Section */}
                    <div className="space-y-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-[#C5A367]/30" />
                        <h3 className="text-xl md:text-2xl font-serif font-black text-[#C5A367] uppercase tracking-widest">Premium Coffee</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                        {websiteContent.mainSiteProducts.filter(p => p.category === 'Coffee').length > 0 ? (
                          websiteContent.mainSiteProducts.filter(p => p.category === 'Coffee').map(product => (
                            <div 
                              key={product._id} 
                              onClick={() => setSelectedProductView(product)}
                              className="flex flex-col group p-2 rounded-3xl border border-[#C5A367]/30 bg-[#0B2421]/20 transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(197,163,103,0.1)] cursor-pointer"
                            >
                              <div className="mb-3 px-1 flex flex-col">
                                <h4 className="text-[10px] md:text-sm font-bold text-[#C5A367] uppercase tracking-widest line-clamp-1">{product.name}</h4>
                                <span className="text-[10px] md:text-xs text-[#F5EFE0] font-medium opacity-80">{product.price} ETB</span>
                              </div>
                              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0B2421] border border-[#C5A367]/10">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                {/* Quick Add Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); addToCart(product._id, e); }}
                                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#C5A367] flex items-center justify-center text-[#0B2421] shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#F5EFE0]/20 italic text-sm col-span-full">Our coffee collection is being curated...</p>
                        )}
                      </div>
                    </div>

                    {/* Cakes Section */}
                    <div className="space-y-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-px bg-[#C5A367]/30" />
                        <h3 className="text-xl md:text-2xl font-serif font-black text-[#C5A367] uppercase tracking-widest">Artisanal Cakes</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-16">
                        {websiteContent.mainSiteProducts.filter(p => p.category === 'Cake').length > 0 ? (
                          websiteContent.mainSiteProducts.filter(p => p.category === 'Cake').map(product => (
                            <div 
                              key={product._id} 
                              onClick={() => setSelectedProductView(product)}
                              className="flex flex-col group p-2 rounded-3xl border border-[#C5A367]/30 bg-[#0B2421]/20 transition-all duration-300 active:scale-[0.98] hover:shadow-[0_0_20px_rgba(197,163,103,0.1)] cursor-pointer"
                            >
                              <div className="mb-3 px-1 flex flex-col">
                                <h4 className="text-[10px] md:text-sm font-bold text-[#C5A367] uppercase tracking-widest line-clamp-1">{product.name}</h4>
                                <span className="text-[10px] md:text-xs text-[#F5EFE0] font-medium opacity-80">{product.price} ETB</span>
                              </div>
                              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#0B2421] border border-[#C5A367]/10">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                {/* Quick Add Button */}
                                <button 
                                  onClick={(e) => { e.stopPropagation(); addToCart(product._id, e); }}
                                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#C5A367] flex items-center justify-center text-[#0B2421] shadow-lg hover:scale-110 active:scale-95 transition-all z-10"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#F5EFE0]/20 italic text-sm col-span-full">Our artisanal cakes are being prepared...</p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Divider line */}
                <div className="w-full h-px bg-[#C5A367]/20" />

                {/* Lookbook (Gallery) Section */}
                <section className="py-6 md:py-10 px-4 md:px-12 max-w-7xl mx-auto space-y-6">
                  {/* Lookbook List - Full Width & Vertical Scroll */}
                  <div className="w-full max-h-[85vh] overflow-y-auto no-scrollbar space-y-12 py-10 px-4 md:px-12">
                    {filteredLookbookItems.map((item, idx) => (
                      <div 
                        key={item._id} 
                        className="group relative w-full h-[50vh] md:h-[60vh] bg-[#0B2421] rounded-4xl md:rounded-[56px] border border-[#C5A367]/10 shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#C5A367]/30"
                      >
                        {/* Image Layer - 100% Width & Height Cover */}
                        <div className="absolute inset-0 z-0">
                          <img 
                            src={item.image} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt={item.title} 
                          />
                          {/* Dark Overlay for Text Readability */}
                          <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] via-[#0B2421]/20 to-transparent opacity-80" />
                        </div>

                        {/* Card Body Content - Positioned at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col items-start text-left">
                          <h3 className="text-xl md:text-4xl font-serif font-black text-[#C5A367] mb-2 md:mb-4 tracking-tight drop-shadow-2xl">
                            {item.title}
                          </h3>
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
            <div className={`section-2-hero-header lg:hidden my-4 mx-auto w-[53%] h-[19vh] flex items-center justify-center bg-cover bg-center overflow-visible ${isLightMode ? 'bg-[#F5EFE0]' : 'bg-[#0B2421]'}`}>
              <div className="w-full h-full relative">
                <Swiper
                  slidesPerView="auto"
                  centeredSlides={true}
                  spaceBetween={12}
                  loop={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  modules={[Autoplay]}
                  className="w-full h-full overflow-visible!"
                >
                  {specials.map((item) => (
                    <SwiperSlide key={item.id} className="h-full w-full">
                      <div 
                        className={`w-full h-full rounded-[1.25rem] border ${isLightMode ? 'border-[#0B2421]/10' : 'border-[#C5A367]/30'} overflow-hidden relative group cursor-pointer shadow-lg transition-all duration-500 hover:scale-105 hover:border-[#C5A367]/60`}
                        onClick={() => setExpandedDesc(item.id)}
                      >
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-102" alt="" />
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <h4 className={`text-[10px] md:text-xs font-serif font-black text-[#C5A367] line-clamp-1 tracking-widest uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]`}>{lang === 'en' ? item.name_en : item.name_am}</h4>
                        </div>
                      </div>
                    </SwiperSlide>

                  ))}
                </Swiper>
              </div>
            </div>
            
            {/* Categories Row - Sticky to the very top */}
            <div className={`sticky top-0 z-50 ${isLightMode ? 'bg-[#F5EFE0]/95' : 'bg-[#0B2421]/95'} backdrop-blur-md my-5`}>
              {/* Top Frame Divider */}
              <div className="w-full h-px bg-[#C5A367]/40" />

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
                        className={`px-6 sm:px-8 py-2 md:py-3 rounded-full text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all shrink-0 border shadow-md ${
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
              <div className="w-full h-px bg-[#C5A367]/40" />
            </div>

            <main className="max-w-7xl mx-auto px-2 md:px-12 pt-0 md:pt-2 pb-32 min-h-[70vh]">
              <div className="space-y-4 md:space-y-8">
                {/* Section 4 Heading - Centered and Separated */}
                <div className="flex flex-col items-center mb-4 md:mb-6 pt-0">
                  <h2 className="text-center text-lg md:text-2xl font-serif font-black text-[#C5A367] uppercase tracking-[0.5em]">
                    MENU
                  </h2>
                  <div className="w-16 md:w-24 h-px bg-[#C5A367]/40 mt-1 md:mt-2 mb-1" />
                </div>
                
                {filteredMenuData.map((section) => (
                  <section key={section.category_en} className="scroll-mt-25 relative mt-12 md:mt-16 first:mt-0">
                    {/* Functional Header (Category Indicator) */}
                    <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8 relative z-20 px-4 md:px-0">
                      <CategoryIcon name={section.category_en} className="w-4 h-4 md:w-5 md:h-5 text-[#C5A367]/40" />
                      <h4 className="text-xs md:text-sm font-bold text-[#C5A367]/40 uppercase tracking-[0.2em] whitespace-nowrap">
                        {lang === 'en' ? section.category_en : section.category_am}
                      </h4>
                      <div className="w-12 md:w-20 h-px bg-[#C5A367]/50" />
                    </div>

                    <div className="grid grid-cols-1 gap-12 md:gap-20 relative z-10 pt-2 md:pt-4">
                      {section.items.map((item) => (
                        <article 
                          key={item.id} 
                          className={`relative flex items-center w-full h-45 md:h-70 group mx-auto ${item.isSoldOut ? 'opacity-40 grayscale' : ''}`}
                        >
                          {/* Symmetrical Left Margin - Image */}
                          <div className="absolute left-[6%] z-20 w-[42%] md:w-[32%] max-w-45 md:max-w-75 aspect-square flex items-center">
                            <div className="w-full h-full rounded-full overflow-hidden border border-[#C5A367]/60 shadow-[0_15px_40px_rgba(0,0,0,0.8)] bg-[#0B2421]">
                              {item.image ? (
                                <SafeImage src={item.image} alt={item.name_en} fill className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl font-serif text-[#C5A367] opacity-40">
                                  {item.name_en[0]}
                                </div>
                              )}
                            </div>
                            {/* Badges */}
                            {(item.isSpecial || item.isNew) && (
                              <div className="absolute top-[10%] right-[10%] bg-[#C5A367] text-[#0B2421] px-3 py-0.5 rounded-full text-[8px] md:text-xs font-black uppercase tracking-widest shadow-lg z-20 animate-pulse">
                                {item.isSpecial ? 'Special' : 'New'}
                              </div>
                            )}
                          </div>

                          {/* Symmetrical Right Margin - Card */}
                          <div className="absolute right-[6%] w-[70%] md:w-[68%] h-[85%] md:h-[90%] bg-[#0B2421]/95 backdrop-blur-md rounded-3xl md:rounded-[40px] flex flex-col items-center justify-center pl-[36%] sm:pl-[30%] md:pl-[20%] pr-4 md:pr-10 shadow-[0_15px_50px_rgba(0,0,0,0.6)] border border-[#C5A367]/30 transition-all duration-500 hover:border-[#C5A367]/60 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:scale-[1.01] text-center">
                            {/* Vibrant Visibility: Name -> Price -> Description */}
                            <div className="flex flex-col gap-1 md:gap-2 mb-2 items-center w-full min-w-0">
                              <h4 className="text-lg sm:text-xl md:text-3xl font-black text-[#C5A367] leading-tight line-clamp-1 uppercase tracking-widest px-2 w-full">
                                {lang === 'en' ? item.name_en : item.name_am}
                              </h4>
                              <span className="text-[#C5A367] font-black text-xl sm:text-2xl md:text-4xl leading-none">
                                {item.price} ETB
                              </span>
                            </div>

                            {/* Crisp Elegant Description Card */}
                            <p className="text-[10px] sm:text-xs md:text-base text-[#F5EFE0]/70 line-clamp-2 italic font-medium max-w-[90%] mb-2.5 md:mb-4 px-2 overflow-hidden w-full">
                              {lang === 'en' ? item.description_en : item.description_am}
                            </p>

                            {/* LINE C: Inside Food Item Cards - Full Width Divider Above ADD Button */}
                            <div className="w-[90%] md:w-[95%] h-px bg-[#C5A367]/30 mb-2.5 md:mb-4" />

                            {/* Action Button (Gold Pill) */}
                            <div className="w-fit pb-1 relative z-10">
                              {cart[item.id] > 0 ? (
                                <div className="flex items-center gap-3 md:gap-4 bg-[#C5A367]/10 rounded-full px-3 py-1.5 md:py-2 border border-[#C5A367]/20 backdrop-blur-sm">
                                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center text-[#C5A367] hover:bg-[#C5A367] hover:text-[#0B2421] transition-all text-sm md:text-xl font-bold">-</button>
                                  <span className="font-black text-sm md:text-2xl text-[#C5A367] w-6 md:w-10 text-center">{cart[item.id]}</span>
                                  <button onClick={(e) => addToCart(item.id, e)} className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-[#C5A367] text-[#0B2421] flex items-center justify-center font-black hover:scale-105 transition-all text-sm md:text-xl">+</button>
                                </div>
                              ) : (
                                <button 
                                  disabled={item.isSoldOut}
                                  onClick={(e) => addToCart(item.id, e)}
                                  className="bg-[#C5A367] text-[#0B2421] px-6 md:px-14 py-2 md:py-4 rounded-full text-xs md:text-lg font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_5px_20px_rgba(197,163,103,0.3)] disabled:opacity-50"
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

        {/* About Us Section */}
        {activeSection === 'about' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-6 md:px-12 animate-fade-in">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.aboutUs}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#C5A367] mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative mx-auto w-[80%] max-w-sm aspect-square rounded-full overflow-hidden border border-[#C5A367]/20 shadow-2xl bg-[#0B2421] md:mx-0 md:rounded-[40px] md:aspect-[4/5]">
                  <img
                    src={PUBLIC_STORY_IMAGE}
                    alt=""
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => {
                      const el = e.currentTarget;
                      if (!el.src.endsWith(PUBLIC_LOGO)) el.src = PUBLIC_LOGO;
                    }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] to-transparent pointer-events-none" aria-hidden />
                </div>

                <div className={`${tm.cardBg} p-8 md:p-12 rounded-3xl border border-[#C5A367]/10 backdrop-blur-2xl`}>
                  <h3 className="text-2xl md:text-3xl font-serif font-black mb-6 text-[#C5A367]">{siteContent.storyTitle}</h3>
                  <p className="text-base md:text-lg leading-relaxed opacity-70 whitespace-pre-wrap">
                    {siteContent.storyText}
                  </p>

                  <div className="mt-8 md:mt-12 flex flex-col gap-6 md:flex-row md:gap-8">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-serif font-black text-[#C5A367]">25+</div>
                      <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Years of Heritage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-serif font-black text-[#C5A367]">100%</div>
                      <div className="text-[8px] md:text-[10px] uppercase tracking-widest opacity-40">Organic Beans</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Gallery (Lookbook) Section */}
        {activeSection === 'gallery' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.gallery}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#C5A367] mx-auto rounded-full" />
              </div>

              <div className="w-full max-h-[85vh] overflow-y-auto no-scrollbar space-y-12 py-10">
                {websiteContent.lookbookItems.map((item) => (
                  <div 
                    key={item._id} 
                    className="group relative w-full h-[50vh] md:h-[60vh] bg-[#0B2421] rounded-4xl md:rounded-[56px] border border-[#C5A367]/10 shadow-2xl overflow-hidden transition-all duration-500 hover:border-[#C5A367]/30"
                  >
                    <div className="absolute inset-0 z-0">
                      <img 
                        src={item.image} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={item.title} 
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] via-[#0B2421]/20 to-transparent opacity-80" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 flex flex-col items-start text-left">
                      <h3 className="text-xl md:text-4xl font-serif font-black text-[#C5A367] mb-2 md:mb-4 tracking-tight drop-shadow-2xl">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Events Section */}
        {activeSection === 'events' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.events}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#C5A367] mx-auto rounded-full" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {websiteContent.events.map((event) => (
                  <div key={event._id} className="group bg-[#0B2421] border border-[#C5A367]/20 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-[#C5A367]/40">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={event.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={event.name} />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-3.5 h-3.5 text-[#C5A367]" />
                          <span className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">{event.date}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-black text-white uppercase tracking-wider">{event.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-sm text-[#F5EFE0]/60 italic font-serif line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Section */}
        {activeSection === 'products' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20 animate-fade-in-up">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">
                  {activeSubCategory ? activeSubCategory : (activeProductCategory === 'coffee' ? t.coffee : t.cake)}
                </h2>
                <div className="w-16 md:w-24 h-1 bg-[#C5A367] mx-auto rounded-full" />
                {activeSubCategory && (
                  <button 
                    onClick={() => setActiveSubCategory(null)}
                    className="mt-6 text-xs md:text-sm font-black text-[#C5A367] uppercase tracking-widest hover:text-[#F3E5AB] transition-colors inline-flex items-center gap-2 border border-[#C5A367]/30 px-6 py-2.5 rounded-full hover:bg-[#C5A367]/10"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back to Categories
                  </button>
                )}
              </div>

              {!activeSubCategory ? (
                // Level 1: Sub-Categories Drill Down
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {websiteContent.subCategories
                    .filter(sc => sc.parentSection.toLowerCase() === activeProductCategory)
                    .map(sc => (
                      <div 
                        key={sc._id} 
                        onClick={() => setActiveSubCategory(sc.name)}
                        className="group bg-[#0B2421] border border-[#C5A367]/20 rounded-3xl overflow-hidden shadow-xl hover:border-[#C5A367]/60 cursor-pointer transition-all hover:scale-[1.03] animate-fade-in-up mx-auto w-[85%] sm:w-full"
                      >
                        <div className="aspect-[4/3] w-full relative overflow-hidden bg-[#08120f]">
                          <img src={sc.coverImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={sc.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421] via-transparent to-transparent opacity-90" />
                          <div className="absolute bottom-6 left-0 right-0 text-center px-4">
                            <h3 className="text-xl md:text-2xl font-serif font-black text-[#C5A367] uppercase tracking-wider drop-shadow-2xl">{sc.name}</h3>
                          </div>
                        </div>
                      </div>
                  ))}
                  {websiteContent.subCategories.filter(sc => sc.parentSection.toLowerCase() === activeProductCategory).length === 0 && (
                    <div className="col-span-full py-12 text-center text-[#F5EFE0]/40 italic font-serif text-xl border border-[#C5A367]/10 rounded-2xl bg-[#0B2421]/50">
                      Categories are being updated.
                    </div>
                  )}
                </div>
              ) : (
                // Level 2: Products List
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 animate-fade-in-up">
                  {websiteContent.mainSiteProducts
                    .filter(p => p.category.toLowerCase() === activeProductCategory && p.subCategory === activeSubCategory)
                    .map((product) => (
                      <div 
                        key={product._id} 
                        onClick={() => setSelectedProductView(product)}
                        className="flex flex-col md:flex-row gap-6 group cursor-pointer bg-[#0B2421] border border-[#C5A367]/10 p-5 md:p-6 rounded-3xl hover:border-[#C5A367]/40 transition-all hover:shadow-2xl w-[90%] md:w-full mx-auto hover:bg-[#C5A367]/5"
                      >
                        <div className="w-full aspect-square md:w-32 md:h-32 rounded-2xl overflow-hidden border border-[#C5A367]/20 shrink-0 shadow-xl bg-black/20">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex flex-col md:flex-row justify-between items-start mb-3 md:mb-2 gap-2">
                            <h4 className="text-xl md:text-xl font-serif font-black text-[#F5EFE0] uppercase tracking-tight">{product.name}</h4>
                            <span className="text-[#C5A367] font-black shrink-0 text-lg md:text-base">{product.price} ETB</span>
                          </div>
                          <p className="text-sm text-[#F5EFE0]/50 italic leading-relaxed line-clamp-2 md:line-clamp-3 mb-3">{product.description}</p>
                          {(product.sizeWeight || product.leadTime) && (
                             <div className="flex flex-wrap gap-2 mt-auto">
                                {product.sizeWeight && <span className="text-[10px] font-black text-[#0B2421] bg-[#C5A367] px-3 py-1 rounded-full uppercase">{product.sizeWeight}</span>}
                                {product.leadTime && <span className="text-[10px] font-black text-[#C5A367] bg-[#C5A367]/10 border border-[#C5A367]/20 px-3 py-1 rounded-full uppercase truncate max-w-[200px]">{product.leadTime}</span>}
                             </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {websiteContent.mainSiteProducts.filter(p => p.category.toLowerCase() === activeProductCategory && p.subCategory === activeSubCategory).length === 0 && (
                      <div className="col-span-full py-12 text-center text-[#F5EFE0]/40 italic font-serif text-xl border border-[#C5A367]/10 rounded-2xl bg-[#0B2421]/50">
                        Products are coming soon...
                      </div>
                    )}
                </div>
              )}
            </div>
            
            {/* Detailed Product Modal */}
            {selectedProductView && (
              <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 md:p-6">
                <div className="absolute inset-0 bg-[#08120F]/95 backdrop-blur-md" onClick={() => setSelectedProductView(null)} />
                <div className="relative z-10 w-full max-w-2xl bg-[#0B2421] border border-[#C5A367]/30 rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                  <button onClick={() => setSelectedProductView(null)} className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 bg-black/50 text-[#C5A367] rounded-full flex items-center justify-center backdrop-blur-md hover:scale-110 hover:bg-[#C5A367] hover:text-[#0B2421] transition-all border border-[#C5A367]/30 shadow-lg">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="overflow-y-auto w-full flex-1">
                    <div className="w-[85%] md:w-[75%] mx-auto mt-8 md:mt-10 aspect-square rounded-3xl md:rounded-[32px] overflow-hidden border border-[#C5A367]/20 shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative">
                      <img src={selectedProductView.image} className="w-full h-full object-cover" alt={selectedProductView.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421] to-transparent opacity-80" />
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col md:flex-row md:items-end justify-between gap-3">
                        <span className="bg-[#0B2421]/90 backdrop-blur-md text-[#C5A367] border border-[#C5A367]/30 text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full w-fit">
                          {selectedProductView.subCategory}
                        </span>
                        <span className="text-3xl md:text-4xl font-black text-[#F5EFE0] drop-shadow-2xl">{selectedProductView.price} ETB</span>
                      </div>
                    </div>

                    <div className="p-6 md:p-10 text-center md:text-left">
                      <h3 className="text-2xl md:text-4xl font-serif font-black text-[#C5A367] uppercase tracking-[0.2em] mb-4 leading-tight">{selectedProductView.name}</h3>
                      <p className="text-sm md:text-base text-[#F5EFE0]/70 italic leading-relaxed mb-8 md:mb-10 max-w-prose mx-auto md:mx-0">{selectedProductView.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {selectedProductView.sizeWeight && (
                          <div className="bg-[#C5A367]/5 border border-[#C5A367]/10 p-4 md:p-5 rounded-2xl flex items-center gap-4 hover:border-[#C5A367]/30 transition-colors">
                            <div className="bg-[#C5A367]/10 p-2 rounded-xl shrink-0">
                                <Package className="w-5 h-5 text-[#C5A367]" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-[10px] text-[#C5A367]/60 font-black uppercase tracking-widest mb-1 mt-0">Size/Weight</span>
                              <span className="text-sm md:text-base font-bold text-[#F5EFE0] leading-none uppercase">{selectedProductView.sizeWeight}</span>
                            </div>
                          </div>
                        )}
                        {selectedProductView.leadTime && (
                          <div className="bg-[#C5A367]/5 border border-[#C5A367]/10 p-4 md:p-5 rounded-2xl flex items-center gap-4 hover:border-[#C5A367]/30 transition-colors">
                            <div className="bg-[#C5A367]/10 p-2 rounded-xl shrink-0">
                                <Clock className="w-5 h-5 text-[#C5A367]" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-[10px] text-[#C5A367]/60 font-black uppercase tracking-widest mb-1 mt-0">Pre-Order Time</span>
                              <span className="text-sm md:text-base font-bold text-[#F5EFE0] leading-none uppercase">{selectedProductView.leadTime}</span>
                            </div>
                          </div>
                        )}
                        {selectedProductView.shelfLife && (
                          <div className="bg-[#C5A367]/5 border border-[#C5A367]/10 p-4 md:p-5 rounded-2xl flex items-center gap-4 hover:border-[#C5A367]/30 transition-colors">
                            <div className="bg-[#C5A367]/10 p-2 rounded-xl shrink-0">
                                <Calendar className="w-5 h-5 text-[#C5A367]" />
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-[10px] text-[#C5A367]/60 font-black uppercase tracking-widest mb-1 mt-0">Shelf Life</span>
                              <span className="text-sm md:text-base font-bold text-[#F5EFE0] leading-none uppercase">{selectedProductView.shelfLife}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {selectedProductView.ingredients && (
                        <div className="bg-[#08120f] border border-[#C5A367]/20 p-6 md:p-8 rounded-3xl mb-4 text-left">
                          <h4 className="text-xs md:text-sm font-black text-[#C5A367] uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
                             <div className="w-4 md:w-6 h-px bg-[#C5A367]/40" /> Ingredients
                          </h4>
                          <p className="text-sm md:text-base text-[#F5EFE0]/60 italic leading-relaxed whitespace-pre-wrap">{selectedProductView.ingredients}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 border-t border-[#C5A367]/10 bg-[#08120F]/80 backdrop-blur-3xl shrink-0">
                    <a 
                      href={`tel:+251911234567`}
                      className="w-full min-h-[64px] bg-[#C5A367] text-[#0B2421] rounded-2xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-sm shadow-[0_10px_30px_rgba(197,163,103,0.3)] hover:scale-[1.02] hover:bg-[#F3E5AB] transition-all"
                    >
                      <Phone className="w-5 h-5" />
                      Click to Call
                    </a>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Contact Us Section */}
        {activeSection === 'contact' && (
          <section className="min-h-[calc(100vh-80px)] py-20 px-4 md:px-12 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12 md:mb-20">
                <h2 className="text-3xl md:text-6xl font-serif font-black uppercase tracking-widest mb-4">{t.contactUs}</h2>
                <div className="w-16 md:w-24 h-1 bg-[#C5A367] mx-auto rounded-full" />
              </div>

              <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
                {/* Contact Cards */}
                <div className="lg:col-span-1 space-y-4 md:space-y-6">
                  {[
                    { icon: MapPin, label: t.address, val: siteContent.address },
                    { icon: Clock, label: t.hours, val: t.hoursVal },
                    { icon: Phone, label: t.phone, val: siteContent.phone }
                  ].map((info, idx) => (
                    <div key={idx} className={`${tm.cardBg} p-6 md:p-8 rounded-3xl border border-[#C5A367]/10 flex items-start gap-4 md:gap-6 transition-all duration-500 hover:border-[#C5A367]/30 hover:shadow-xl hover:scale-[1.02]`}>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#C5A367]/10 flex items-center justify-center shrink-0">
                        <info.icon className="w-5 h-5 md:w-6 md:h-6 text-[#C5A367]" />
                      </div>
                      <div>
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{info.label}</p>
                        <p className="text-base md:text-lg font-medium">{info.val}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Contact Form */}
                  <div className={`${tm.cardBg} p-8 rounded-3xl border border-[#C5A367]/10 shadow-2xl mt-8`}>
                    <h3 className="text-xl font-serif font-black text-[#C5A367] uppercase tracking-widest mb-6">Send a Message</h3>
                    <form onSubmit={handleInquirySubmit} className="space-y-4">
                      <input 
                        required
                        type="text" 
                        placeholder="Your Name" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-[#0B2421]/50 border border-[#C5A367]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C5A367] outline-none transition-all"
                      />
                      <input 
                        required
                        type="email" 
                        placeholder="Email Address" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-[#0B2421]/50 border border-[#C5A367]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C5A367] outline-none transition-all"
                      />
                      <textarea 
                        required
                        placeholder="Your Message" 
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full bg-[#0B2421]/50 border border-[#C5A367]/20 rounded-xl px-4 py-3 text-sm focus:border-[#C5A367] outline-none transition-all resize-none"
                      />
                      <button 
                        disabled={isSubmittingInquiry}
                        className="w-full bg-[#C5A367] text-[#0B2421] py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-[#F3E5AB] transition-all disabled:opacity-50"
                      >
                        {isSubmittingInquiry ? "Sending..." : "Submit Inquiry"}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Dynamic Map Integration */}
                <div className="lg:col-span-2 relative h-100 md:h-175 rounded-[40px] overflow-hidden border border-[#C5A367]/20 bg-[#0B2421] group shadow-2xl">
                  {/* Using OpenStreetMap iframe for dynamic functionality without API keys */}
                  <iframe 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight={0} 
                    marginWidth={0} 
                    style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2) brightness(0.8)' }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(websiteContent.siteSettings.mapLongitude || "38.7460")-0.01}%2C${parseFloat(websiteContent.siteSettings.mapLatitude || "9.0227")-0.01}%2C${parseFloat(websiteContent.siteSettings.mapLongitude || "38.7460")+0.01}%2C${parseFloat(websiteContent.siteSettings.mapLatitude || "9.0227")+0.01}&layer=mapnik&marker=${websiteContent.siteSettings.mapLatitude || "9.0227"}%2C${websiteContent.siteSettings.mapLongitude || "38.7460"}`}
                  ></iframe>

                  <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] via-[#0B2421]/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 pointer-events-none">
                    <h4 className="text-2xl md:text-4xl font-serif font-black text-[#C5A367] mb-2 uppercase tracking-tighter">Mas Coffee Plaza</h4>
                    <p className="text-xs md:text-sm text-[#C5A367]/60 font-black uppercase tracking-[0.3em]">The heart of luxury coffee in Addis Ababa</p>
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
          <div className="fixed inset-0 z-2000 flex items-center justify-center px-4" onClick={() => setExpandedDesc(null)}>
          <div className="absolute inset-0 bg-[#0B2421]/95 backdrop-blur-md" />
            <div className={`${tm.modalBg} relative z-10 p-8 max-w-lg w-full rounded-3xl shadow-2xl animate-fade-in-up`} onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setExpandedDesc(null)} className="absolute top-6 right-6 opacity-40 hover:opacity-100 hover:scale-110 transition-all">
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-2xl md:text-3xl font-serif font-black mb-2 text-[#C5A367]">{lang === 'en' ? found.name_en : found.name_am}</h3>
              <p className="text-lg md:text-xl font-black mb-6 md:mb-8 opacity-60">{found.price} ETB</p>
              <p className="text-base md:text-lg leading-relaxed italic opacity-80">{lang === 'en' ? found.description_en : found.description_am}</p>
            </div>
          </div>
        );
      })()}

      {/* Floating Cart Button */}
      <div className={`fixed bottom-8 left-0 right-0 px-6 z-950 pointer-events-none transition-all duration-700 ${cartItemCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'}`}>
        <button 
          id="cart-btn"
          onClick={() => setShowModal("cart")}
          className={`mx-auto bg-[#C5A367] text-[#0B2421] px-8 md:px-12 py-4 md:py-5 rounded-full font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-xs md:text-sm shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-4 pointer-events-auto relative overflow-hidden group ${cartPulse ? 'scale-110' : ''}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          <span>View Order ({cartTotal.toFixed(0)} ETB)</span>
        </button>
      </div>

      {/* Cart Modal (Bottom Slide-Up Drawer) */}
      <div className={`fixed inset-0 z-2000 lg:hidden transition-opacity duration-300 ${showModal === "cart" ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#0B2421]/60 backdrop-blur-md" onClick={() => setShowModal(null)} />
        <div 
          className={`absolute bottom-0 left-0 w-full ${tm.modalBg} rounded-t-[40px] flex flex-col overflow-hidden transition-transform duration-500 ease-in-out ${showModal === "cart" ? 'translate-y-0' : 'translate-y-full'}`}
          style={{ maxHeight: '90vh', willChange: 'transform' }}
        >
          {/* Drag Handle / Close Header */}
          <div className="pt-4 pb-2 flex flex-col items-center gap-4 border-b border-[#C5A367]/10">
            <div className="w-12 h-1.5 bg-[#C5A367]/20 rounded-full" onClick={() => setShowModal(null)} />
            <div className="w-full px-8 flex items-center justify-between">
              <h2 className={`text-2xl font-serif font-black uppercase tracking-widest ${tm.textApp}`}>My Order</h2>
              <button onClick={() => setShowModal(null)} className={`w-10 h-10 rounded-full border ${tm.borderMain} flex items-center justify-center ${tm.textApp}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.map(item => (
              <div key={item.cartId} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#C5A367]/10 shrink-0">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-lg font-serif font-black mb-1 truncate ${tm.textApp}`}>{item.displayName}</h4>
                  <p className="font-black text-[#C5A367] opacity-60 text-sm">{item.price} ETB</p>
                </div>
                <div className="flex items-center gap-2 bg-[#C5A367]/10 rounded-full px-2 py-1">
                  <button onClick={() => removeFromCart(item.cartId)} className={`w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#C5A367] hover:text-[#0B2421] transition-all hover:scale-110 ${tm.textApp}`}>-</button>
                  <span className={`font-black text-sm ${tm.textApp}`}>{cart[item.cartId]}</span>
                  <button onClick={() => addToCart(item.cartId)} className="w-8 h-8 rounded-full bg-[#C5A367] text-[#0B2421] flex items-center justify-center font-black transition-all hover:scale-110">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-8 bg-[#0B2421]/50 border-t ${tm.borderMain}`}>
            <div className="flex justify-between items-center mb-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] opacity-40 ${tm.textApp}`}>Total Amount</span>
              <span className="text-3xl font-serif font-black text-[#C5A367]">{cartTotal.toFixed(0)} ETB</span>
            </div>
            <button className="w-full bg-[#C5A367] text-[#0B2421] py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:scale-[1.02] transition-all">
              Complete Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Product Quick View Modal (Website Products) */}
      {selectedProductView && selectedProductView._id && (
        <div className="fixed inset-0 z-2000 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setSelectedProductView(null)} />
          <div className="relative w-full max-w-2xl bg-[#0B2421] rounded-t-[2.5rem] lg:rounded-[2.5rem] flex flex-col max-h-[92vh] lg:max-h-[85vh] overflow-hidden animate-slide-up shadow-2xl border border-[#C5A367]/20">
            {/* Modal Header */}
            <div className="absolute top-6 right-6 z-20">
              <button 
                onClick={() => setSelectedProductView(null)}
                className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#C5A367] transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {/* Image Area */}
              <div className="relative aspect-[4/3] w-full bg-black/20">
                <img src={selectedProductView.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421] via-transparent to-transparent " />
              </div>

              {/* Content Area */}
              <div className="px-6 lg:px-10 pb-10 -mt-10 relative z-10">
                <div className="bg-[#0B2421] rounded-t-3xl pt-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl lg:text-4xl font-serif font-black text-[#C5A367] uppercase tracking-wider mb-2">{selectedProductView.name}</h3>
                      <p className="text-[#F5EFE0] text-xl font-bold">{selectedProductView.price} ETB</p>
                    </div>
                  </div>

                  <p className="text-[#F5EFE0]/70 text-base leading-relaxed mb-10 italic">
                    {selectedProductView.description}
                  </p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-6 mb-10 p-6 rounded-3xl bg-black/20 border border-[#C5A367]/10">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A367] opacity-60">Lead Time</span>
                      <p className="text-sm font-bold text-[#F5EFE0]">{selectedProductView.leadTime || 'Immediate'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A367] opacity-60">Size / Weight</span>
                      <p className="text-sm font-bold text-[#F5EFE0]">{selectedProductView.sizeWeight || 'Standard'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A367] opacity-60">Shelf Life</span>
                      <p className="text-sm font-bold text-[#F5EFE0]">{selectedProductView.shelfLife || 'Fresh'}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-widest text-[#C5A367] opacity-60">Ingredients</span>
                      <p className="text-sm font-bold text-[#F5EFE0] line-clamp-2" title={selectedProductView.ingredients}>
                        {selectedProductView.ingredients || 'Secret Recipe'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="p-6 lg:p-8 bg-[#0B2421] border-t border-[#C5A367]/10">
              <button 
                onClick={(e) => { addToCart(selectedProductView._id, e); setSelectedProductView(null); }}
                className="w-full py-5 rounded-2xl bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-xs shadow-xl active:scale-95 transition-all"
              >
                Add to Cart • {selectedProductView.price} ETB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Menu Item Modal (selectedProductView with id instead of _id) */}
      {selectedProductView && selectedProductView.id && (
        <div className="fixed inset-0 z-2000 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setSelectedProductView(null)} />
          <div className={`relative w-full max-w-2xl ${tm.modalBg} rounded-t-3xl lg:rounded-3xl flex flex-col max-h-[92vh] lg:max-h-[85vh] overflow-hidden animate-slide-up shadow-2xl`}>
            <div className="absolute top-6 right-6 z-10">
              <button onClick={() => setSelectedProductView(null)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <div className="relative aspect-[4/3] w-full">
                <img src={selectedProductView.image} className="w-full h-full object-cover" />
                <div className={`absolute inset-0 bg-gradient-to-t ${isLightMode ? 'from-white via-transparent to-transparent' : 'from-[#0B2421] via-transparent to-transparent'}`} />
              </div>
              <div className="px-8 pb-10 -mt-8 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-serif font-black mb-1">{lang === 'en' ? selectedProductView.name_en : selectedProductView.name_am}</h3>
                    <p className="text-[#C5A367] text-2xl font-black">{selectedProductView.price} ETB</p>
                  </div>
                </div>
                <p className={`text-lg italic leading-relaxed mb-8 ${tm.textMuted}`}>
                  {lang === 'en' ? selectedProductView.description_en : selectedProductView.description_am}
                </p>
                <div className={`flex items-center gap-6 p-6 rounded-2xl ${isLightMode ? 'bg-[#0B2421]/5' : 'bg-[#C5A367]/5'} border border-[#C5A367]/10`}>
                  <p className="text-xs font-black uppercase tracking-widest opacity-40">Ready to serve</p>
                </div>
              </div>
            </div>
            
            <div className={`p-8 border-t ${tm.borderMain} ${tm.modalBg}`}>
              <button 
                onClick={(e) => { addToCart(selectedProductView.id, e); setSelectedProductView(null); }}
                className="w-full py-5 rounded-2xl bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-xs shadow-xl active:scale-95 transition-all"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className={`py-20 border-t ${tm.borderMain} relative overflow-hidden transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-serif font-black mb-8 tracking-widest uppercase text-[#C5A367]">Mas Coffee</h2>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-3 max-w-4xl mx-auto text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] md:tracking-[0.35em] text-[#F5EFE0]/70">
            {[
              { id: "home" as const, label: t.home },
              { id: "menu" as const, label: t.menu },
              { id: "products" as const, label: t.products },
              { id: "about" as const, label: t.aboutUs },
              { id: "gallery" as const, label: t.gallery },
              { id: "events" as const, label: t.events },
              { id: "contact" as const, label: t.contactUs },
            ].map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  setActiveSection(link.id);
                  setActiveProductCategory(null);
                  if (typeof window !== "undefined") {
                    window.history.replaceState(null, "", `#${link.id}`);
                  }
                }}
                className="hover:text-[#C5A367] hover:opacity-100 transition-all px-1 py-1"
              >
                {link.label}
              </button>
            ))}
          </nav>
          <p className="mt-12 text-[8px] md:text-[10px] opacity-20 tracking-widest uppercase">© 2026 MAS COFFEE - PREMIUM COFFEE EXPERIENCE</p>
        </div>
      </footer >

      {/* Fly-to-Cart Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-3000 overflow-hidden">
        {flyingItems.map((f) => (
          <div
            key={f.id}
            className="absolute rounded-full overflow-hidden border-2 border-[#C5A367] bg-[#0B2421] shadow-2xl"
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
