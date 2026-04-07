"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMenu } from "@/context/MenuContext";
import { MenuItem } from "@/lib/menu-data";
import { Sun, Moon, Upload, Link, Trash2, Printer } from "lucide-react";

type Tab = "dashboard" | "menu" | "categories" | "settings";

export default function AdminDashboard() {
  const { 
    menuData, 
    siteContent,
    updateMenuItem, 
    bulkUpdateItems, 
    addMenuItem, 
    deleteMenuItem, 
    addCategory, 
    renameCategory, 
    deleteCategory,
    updateSiteContent,
    refreshData
  } = useMenu();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Existing states needed
  const [searchQuery, setSearchQuery] = useState("");
  // SELECTED ITEMS REMOVED TO ELIMINATE BULK CORRUPTION
  const [selectedItems, setSelectedItems] = useState<number[]>([]); 
  const [showSuccess, setShowSuccess] = useState(false);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name_en: "", name_am: "", description_en: "", description_am: "", price: "", categoryId: "", image: "", isSpecial: false, isNew: true
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [editingImageUrlId, setEditingImageUrlId] = useState<number | null>(null);
  const [tempUrl, setTempUrl] = useState("");

  // ── Batch Save State ────────────────────────────────────────────
  // Accumulated local edits per menu item (id → partial updates)
  const [pendingEdits, setPendingEdits] = useState<Record<number, Partial<MenuItem>>>({});
  // Accumulated local edits for site settings
  const [pendingSettings, setPendingSettings] = useState<Partial<typeof siteContent>>({});
  // Track which item ids have unsaved changes for highlighting
  const [dirtyItemIds, setDirtyItemIds] = useState<Set<number>>(new Set());

  const hasPendingChanges =
    Object.keys(pendingEdits).length > 0 || Object.keys(pendingSettings).length > 0;
  // ────────────────────────────────────────────────────────────────

  // Security Settings State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const router = useRouter();

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

  const tm = isLightMode ? {
    bgApp: "bg-[#F9F9F9]",
    textApp: "text-[#1A1A1A]",
    bgSidebar: "bg-white",
    borderMain: "border-[#D4AF37]/30",
    textAcc: "text-[#D4AF37]",
    bgStats: "bg-[#FFFBEB] border-[#D4AF37]/40",
    textStats: "text-[#D4AF37]",
    tableBg: "bg-white border-gray-100 shadow-sm",
    tableHeader: "bg-[#FFFBEB] text-[#D4AF37] font-bold uppercase tracking-widest",
    tableRowHover: "hover:bg-[#FFFBEB]",
    tableRowActive: "bg-[#FFFBEB]/50",
    activeTab: "bg-[#D4AF37] text-white shadow-md",
    inactiveTab: "text-[#4A4A4A] hover:bg-[#FFFBEB] hover:text-[#D4AF37]",
    formBg: "bg-white border-gray-100 shadow-md",
    inputBg: "bg-[#F9F9F9] border-gray-200 text-[#1A1A1A]",
    sidebarBtnHover: "hover:bg-[#FFFBEB]",
    sidebarBorder: "border-[#D4AF37]/20",
    bulkMarkActive: "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white",
    bulkMarkInactive: "border-gray-300 text-gray-500 hover:bg-gray-100",
    deleteBtn: "text-gray-400 hover:text-red-500",
    tableText: "text-[#1A1A1A] font-bold",
    tableSubtext: "text-[#4A4A4A]",
    textMuted: "text-[#4A4A4A]/60",
    modalOverlay: "bg-black/40",
    modalBg: "bg-white shadow-2xl border border-[#D4AF37]/30"
  } : {
    bgApp: "bg-[#000000]",
    textApp: "text-white",
    bgSidebar: "bg-[#000000]",
    borderMain: "border-[#D4AF37]/30",
    textAcc: "text-[#D4AF37]",
    bgStats: "bg-zinc-900 border-[#D4AF37]/20",
    textStats: "text-[#D4AF37]",
    tableBg: "bg-zinc-900 border-[#D4AF37]/20",
    tableHeader: "bg-zinc-950 text-[#D4AF37]",
    tableRowHover: "hover:bg-zinc-950",
    tableRowActive: "bg-zinc-950/70",
    activeTab: "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]",
    inactiveTab: "text-white/60 hover:bg-zinc-900 hover:text-white",
    formBg: "bg-zinc-900/50 border-[#D4AF37]/20 shadow-xl",
    inputBg: "bg-black border-zinc-800 text-white",
    sidebarBtnHover: "hover:bg-zinc-900",
    sidebarBorder: "border-[#D4AF37]/20",
    bulkMarkActive: "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black",
    bulkMarkInactive: "border-zinc-700 text-zinc-500 hover:bg-zinc-800",
    deleteBtn: "text-zinc-600 hover:text-red-500",
    tableText: "text-white",
    tableSubtext: "text-zinc-500",
    textMuted: "text-white/40",
    modalOverlay: "bg-black/80",
    modalBg: "bg-zinc-950 shadow-[0_0_50px_rgba(212,175,55,0.15)] border border-[#D4AF37]/30"
  };

  // Real-time polling for analytics (10 seconds)
  useEffect(() => {
    if (activeTab === "dashboard") {
      const interval = setInterval(() => {
        refreshData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [activeTab, refreshData]);

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "abay_preset");
    
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dxxcicope/image/upload", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) throw new Error("Cloudinary upload failed");
      
      const data = await res.json();
      setIsUploading(false);
      return data.secure_url;
    } catch (e) {
      console.error("Upload failed", e);
      setIsUploading(false);
      return "";
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };


  const triggerSuccess = () => {
    setShowSuccess(true);
    router.refresh(); // Signal to Next.js that server data has changed
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsChangingPassword(true);
    setPasswordError("");
    
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "changePassword", currentPassword, newPassword })
      });
      
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        triggerSuccess();
      } else {
        const data = await res.json();
        setPasswordError(data.error || "Failed to change password. Please try again.");
      }
    } catch (err) {
      setPasswordError("An error occurred. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  /** Accumulate changes locally — no API call until DONE is clicked */
  const handleUpdateItem = (id: number, updates: Partial<MenuItem>) => {
    setPendingEdits(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }));
    setDirtyItemIds(prev => new Set(prev).add(id));
  };

  const handlePriceChange = (id: number, priceStr: string) => {
    const price = parseFloat(priceStr);
    if (!isNaN(price)) handleUpdateItem(id, { price });
  };

  /** Immediately persist an item (used for image upload / delete since those fire on click) */
  const handleUpdateItemNow = async (id: number, updates: Partial<MenuItem>) => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const success = await updateMenuItem(id, updates);
    setIsSaving(false);
    if (success) triggerSuccess();
  };

  /** Instantly update the soldOut toggle and show a mini toast */
  const handleToggleNow = async (id: number, updates: Partial<MenuItem>) => {
    const success = await updateMenuItem(id, updates);
    if (success) {
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 2000);
      router.refresh();
    }
  };

  /** Save all accumulated pending changes to MongoDB in one go */
  const handleSaveAll = async () => {
    if (!hasPendingChanges) return;
    setIsSaving(true);
    const promises: Promise<unknown>[] = [];

    // Save pending menu item edits
    for (const [idStr, updates] of Object.entries(pendingEdits)) {
      const id = Number(idStr);
      // Merge pending edits with the live item data
      const liveItem = menuData.flatMap(s => s.items).find(i => i.id === id);
      if (liveItem) promises.push(updateMenuItem(id, { ...liveItem, ...updates }));
    }

    // Save pending settings
    if (Object.keys(pendingSettings).length > 0) {
      promises.push(updateSiteContent(pendingSettings));
    }

    await Promise.all(promises);

    // Clear pending state
    setPendingEdits({});
    setPendingSettings({});
    setDirtyItemIds(new Set());
    setIsSaving(false);
    triggerSuccess();
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name_en || !newItem.price || !newItem.categoryId) return;
    
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = await addMenuItem(newItem.categoryId, {
      name_en: newItem.name_en,
      name_am: newItem.name_am || newItem.name_en,
      description_en: newItem.description_en,
      description_am: newItem.description_am || newItem.description_en,
      price: parseFloat(newItem.price),
      image: newItem.image,
      isSpecial: newItem.isSpecial,
      isSoldOut: false,
      isNew: newItem.isNew
    });
    
    setNewItem({ name_en: "", name_am: "", description_en: "", description_am: "", price: "", categoryId: "", image: "", isSpecial: false, isNew: true });
    setShowAddForm(false);
    setIsSaving(false);
    if (success) triggerSuccess();
  };

  const handleDeleteItem = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      const success = await deleteMenuItem(id);
      if (success) triggerSuccess();
    }
  };

  const totalCategories = menuData?.length || 0;
  const totalItems = (menuData || []).reduce((acc, cat) => acc + (cat.items?.length || 0), 0);

  const flatItems = (menuData || []).flatMap(cat => (cat.items || []).map(item => ({...item, categoryName: (cat.category_en || "Uncategorized")})));
  const filteredItems = flatItems.filter(item => 
    (item.name_en || "").toLowerCase().includes((searchQuery || "").toLowerCase()) || 
    (item.name_am || "").toLowerCase().includes((searchQuery || "").toLowerCase())
  );

  return (
    <div className={`min-h-screen ${tm.bgApp} ${tm.textApp} flex font-sans selection:bg-[#D4AF37]/30 transition-colors duration-500`}>
      
      {/* Mobile Top Bar */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 h-[70px] ${tm.bgSidebar} border-b ${tm.sidebarBorder} z-[1100] flex items-center justify-between px-4 shadow-md transition-colors duration-500`}>
        <h1 className="text-lg font-serif text-[#D4AF37] uppercase tracking-widest font-black truncate max-w-[140px]">
          {activeTab === "dashboard" ? "Dashboard" : activeTab === "menu" ? "Manage Menu" : activeTab === "categories" ? "Categories" : "Settings"}
        </h1>
        <div className="flex items-center gap-2">
          {hasPendingChanges && (
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              className="px-4 py-2 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-md active:scale-95 transition-all flex items-center gap-1.5 animate-pulse"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              DONE
            </button>
          )}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-3 ${tm.textAcc} focus:outline-none h-11 w-11 flex items-center justify-center`}
          >
            {isMobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile Overlay Menu */}
      {isMobileMenuOpen && (
        <div className={`lg:hidden fixed inset-0 z-[1050] ${tm.bgSidebar} flex flex-col items-center justify-center p-8 transition-colors duration-500`}>
          <div className="flex flex-col gap-8 w-full max-w-sm">
            {[
              { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "menu", label: "Menu Items", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
              { id: "categories", label: "Categories", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
              { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as Tab); setIsMobileMenuOpen(false); }}
                className={`flex items-center gap-6 px-8 py-5 rounded-2xl transition-all h-20 shadow-lg ${activeTab === tab.id ? tm.activeTab : tm.inactiveTab}`}
              >
                <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}/></svg>
                <span className="font-black uppercase tracking-[0.2em] text-lg">{tab.label}</span>
              </button>
            ))}
            <button 
              onClick={() => { localStorage.removeItem("admin_authenticated"); router.push("/admin"); }} 
              className={`flex items-center gap-6 px-8 py-5 mt-4 rounded-2xl text-red-400 h-20 border border-red-500/30 ${isLightMode ? 'bg-red-50' : 'bg-red-500/10'}`}
            >
              <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              <span className="font-black uppercase tracking-[0.2em] text-lg">Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Sidebar - Desktop Only */}
      <aside className={`hidden lg:flex fixed inset-y-0 left-0 ${tm.bgSidebar} border-r ${tm.sidebarBorder} shadow-sm transition-all duration-300 z-50 flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className={`h-[70px] flex items-center justify-between px-4 border-b ${tm.sidebarBorder} gap-2`}>
          {isSidebarOpen && <h1 className="text-xl font-serif text-[#D4AF37] uppercase tracking-widest truncate flex-1">Admin Panel</h1>}
          {/* Global DONE / Save All Button */}
          {hasPendingChanges && (
            <button
              onClick={handleSaveAll}
              disabled={isSaving}
              title="Save all pending changes"
              className="px-3 py-1.5 bg-[#D4AF37] text-black text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 animate-pulse flex-shrink-0"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              {isSidebarOpen ? 'SAVE ALL' : ''}
            </button>
          )}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className={`p-2 ${tm.sidebarBtnHover} text-[#D4AF37] rounded-full transition-colors`}
              title="Toggle Theme"
            >
              {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 text-[#D4AF37] ${tm.sidebarBtnHover} rounded-full transition-colors flex-shrink-0`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "menu", label: "Menu Items", icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" },
            { id: "categories", label: "Categories", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
            { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${activeTab === tab.id ? tm.activeTab : tm.inactiveTab}`}
              title={tab.label}
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon}/></svg>
              {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-xs truncate">{tab.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className={`p-4 border-t ${tm.sidebarBorder}`}>
          <button onClick={() => { localStorage.removeItem("admin_authenticated"); router.push("/admin"); }} className={`flex items-center gap-4 px-4 py-3 w-full rounded-lg text-red-400 ${isLightMode ? 'hover:bg-red-50 hover:text-red-500' : 'hover:bg-red-500/10 hover:text-red-500'} transition-colors`}>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-xs">Logout</span>}
          </button>
          <button onClick={() => router.push("/")} className={`flex items-center gap-4 px-4 py-3 mt-2 w-full rounded-lg transition-colors ${tm.inactiveTab}`}>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[10px]">Store</span>}
          </button>
        </div>
      </aside>

      {/* === FIXED DONE BANNER (appears when pending changes exist) === */}
      {hasPendingChanges && (
        <div className="fixed top-0 left-0 right-0 z-[1200] flex items-center justify-between px-4 md:px-8 h-[50px] bg-[#D4AF37] shadow-[0_4px_24px_rgba(212,175,55,0.5)] animate-slide-down">
          <div className="flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-black">
              {Object.keys(pendingEdits).length > 0 && `${Object.keys(pendingEdits).length} item${Object.keys(pendingEdits).length > 1 ? 's' : ''} edited`}
              {Object.keys(pendingEdits).length > 0 && Object.keys(pendingSettings).length > 0 && ' · '}
              {Object.keys(pendingSettings).length > 0 && 'Settings changed'}
            </span>
          </div>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-1.5 bg-black text-[#D4AF37] text-[10px] md:text-xs font-black uppercase tracking-widest rounded-full shadow-md hover:bg-black/80 active:scale-95 transition-all flex items-center gap-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            DONE — Save All
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-h-[100vh] lg:${isSidebarOpen ? 'ml-64' : 'ml-20'} ${
        hasPendingChanges ? 'pt-[120px] lg:pt-[50px]' : 'pt-[70px] lg:pt-0'
      }`}>
        <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (() => {
            const totalViews = siteContent?.totalViews || 0;
            const dailyViews = siteContent?.dailyViews || 0;
            
            // STRICT ARRAY SAFETY: Ensure cat.items exists before flattening
            const allItemsFlat = (menuData || []).flatMap(cat => cat.items || []);
            
            const totalClicks = allItemsFlat.reduce((acc, item) => acc + (item.clicks || 0), 0);
            const totalCartAdds = allItemsFlat.reduce((acc, item) => acc + (item.cartAdds || 0), 0);
            
            const topClickedItems = [...allItemsFlat].sort((a, b) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 3);
            const topCartItems = [...allItemsFlat].sort((a, b) => (b.cartAdds || 0) - (a.cartAdds || 0)).slice(0, 3);

            return (
            <div className="animate-fade-in-up">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 border-b border-[#D4AF37]/20 pb-4 gap-4">
                <div className="flex flex-col">
                  <h2 className={`text-xl md:text-3xl font-serif ${tm.textAcc} uppercase tracking-widest`}>Analytics & Overview</h2>
                  <div className="flex items-center gap-2 mt-2 px-3 py-1 w-fit rounded-full bg-green-500/10 border border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Updates</span>
                  </div>
                </div>
                
                <button
                  onClick={() => window.open('/admin/print-menu', '_blank')}
                  className={`px-6 py-3 bg-[#D4AF37] ${isLightMode ? 'text-white' : 'text-black'} text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-[#D4AF37]`}
                >
                  <Printer className="w-4 h-4" />
                  Generate Print Menu
                </button>
              </div>
              
              {/* REAL-TIME TRAFFIC COUNTERS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                <div className={`${tm.bgStats} p-8 rounded-3xl border border-[#D4AF37]/20 flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                  <div className="flex flex-col items-center gap-1 mb-4 text-center">
                    <span className={`${tm.textAcc} text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]`}>Daily Menu Views</span>
                    <span className={`${tm.textMuted} text-[10px] md:text-xs font-serif italic`}>(የዛሬ የሜኑ እይታዎች)</span>
                  </div>
                  <span className={`text-5xl md:text-7xl font-serif ${tm.textStats} font-black`}>{dailyViews}</span>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                  </div>
                </div>

                <div className={`${tm.bgStats} p-8 rounded-3xl border border-[#D4AF37]/20 flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                  <div className="flex flex-col items-center gap-1 mb-4 text-center">
                    <span className={`${tm.textAcc} text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]`}>Total Lifetime Views</span>
                    <span className={`${tm.textMuted} text-[10px] md:text-xs font-serif italic`}>(ጠቅላላ የሜኑ እይታዎች)</span>
                  </div>
                  <span className={`text-5xl md:text-7xl font-serif ${tm.textStats} font-black`}>{totalViews}</span>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.36 8-6.64 8-11.5C20 5.81 16.19 2 11.5 2zm0 14.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" /></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
                <div className={`${tm.bgStats} p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                  <span className={`${tm.textAcc} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center`}>Menu Items</span>
                  <span className={`text-2xl md:text-4xl font-serif ${tm.textStats} font-black`}>{totalItems}</span>
                </div>
                <div className={`${tm.bgStats} p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                  <span className={`${tm.textAcc} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center`}>Categories</span>
                  <span className={`text-2xl md:text-4xl font-serif ${tm.textStats} font-black`}>{totalCategories}</span>
                </div>
                <div className={`${tm.bgStats} p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all`}>
                  <span className={`${tm.textAcc} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center`}>Item Clicks</span>
                  <span className={`text-2xl md:text-4xl font-serif ${tm.textStats} font-black`}>{totalClicks}</span>
                </div>
                <div className={`${tm.bgStats} p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all md:col-span-2 lg:col-span-1`}>
                  <span className={`${tm.textAcc} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center`}>Cart Intents</span>
                  <span className={`text-2xl md:text-4xl font-serif ${tm.textStats} font-black`}>{totalCartAdds}</span>
                </div>
                <div className={`${tm.bgStats} p-4 md:p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group transition-all md:col-span-2 lg:col-span-1`}>
                  <span className={`${tm.textAcc} text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] mb-1 md:mb-2 text-center`}>Active Tab</span>
                  <span className={`text-xs md:text-sm font-serif ${tm.textStats} font-black uppercase text-center`}>Dashboard</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className={`${tm.bgStats} p-6 md:p-8 rounded-2xl`}>
                  <h3 className={`text-sm md:text-base font-bold uppercase tracking-[0.2em] ${tm.textAcc} mb-6 border-b border-[#D4AF37]/20 pb-2`}>Top Clicked Items</h3>
                  <div className="space-y-4">
                    {topClickedItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`${tm.textAcc} font-bold opacity-50`}>#{idx + 1}</span>
                          <span className={`font-serif ${tm.tableText}`}>{item.name_en}</span>
                        </div>
                        <span className={`px-2 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black`}>{item.clicks || 0} CLICKS</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${tm.bgStats} p-6 md:p-8 rounded-2xl`}>
                  <h3 className={`text-sm md:text-base font-bold uppercase tracking-[0.2em] ${tm.textAcc} mb-6 border-b border-[#D4AF37]/20 pb-2`}>Top Cart Adds</h3>
                  <div className="space-y-4">
                    {topCartItems.map((item, idx) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`${tm.textAcc} font-bold opacity-50`}>#{idx + 1}</span>
                          <span className={`font-serif ${tm.tableText}`}>{item.name_en}</span>
                        </div>
                        <span className={`px-2 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black`}>{item.cartAdds || 0} ADDS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
            );
          })()}

          {/* TAB 2: MENU ITEMS */}
          {activeTab === "menu" && (
            <div className="animate-fade-in-up space-y-8">
              <div className={`flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4 border-b ${tm.sidebarBorder} pb-4`}>
                <h2 className={`text-2xl md:text-3xl font-serif ${tm.textAcc} uppercase tracking-widest`}>Menu Management</h2>
                <button 
                  onClick={() => { setShowAddForm(!showAddForm); if(!showAddForm) window.scrollTo({top: 0, behavior: 'smooth'}); }} 
                  className={`w-full md:w-auto px-6 py-4 md:py-2 bg-[#D4AF37] ${isLightMode ? 'text-white' : 'text-black'} rounded-full text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-2`}
                  style={{ minHeight: '44px' }}
                >
                  {showAddForm ? (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg> Close Form</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg> Add Item</>
                  )}
                </button>
              </div>

              {/* Add form */}
              {showAddForm && (
                <div className={`${tm.formBg} p-8 rounded-2xl`}>
                   <form onSubmit={handleAddFood} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Food Name (En)</label>
                        <input type="text" required value={newItem.name_en} onChange={e => setNewItem({...newItem, name_en: e.target.value})} className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50`} />
                      </div>
                      <div>
                        <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Food Name (Am)</label>
                        <input type="text" value={newItem.name_am} onChange={e => setNewItem({...newItem, name_am: e.target.value})} className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50`} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Price</label>
                          <input type="number" step="0.01" required value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50`} />
                        </div>
                        <div>
                          <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Category</label>
                          <select required value={newItem.categoryId} onChange={e => setNewItem({...newItem, categoryId: e.target.value})} className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50`}>
                            <option value="">Select...</option>
                            {menuData.map(cat => <option key={cat.id} value={cat.id}>{cat.category_en}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Food Image</label>
                        <div className={`flex flex-col gap-4 p-4 border ${tm.sidebarBorder} ${tm.inputBg} rounded-2xl relative overflow-hidden`}>
                          <label className={`w-full flex flex-col items-center justify-center border-2 border-dashed ${tm.sidebarBorder} rounded-xl p-8 cursor-pointer hover:border-[#D4AF37]/50 transition-all group bg-[#D4AF37]/5 border-[#D4AF37]/30`}>
                            <Upload className={`w-10 h-10 mb-2 text-[#D4AF37] group-hover:scale-110 transition-transform`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest text-[#D4AF37]`}>
                              {isUploading ? "Uploading to Cloudinary..." : "Click to Upload Photo"}
                            </span>
                            <input 
                              type="file" 
                              accept="image/*"
                              disabled={isUploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) setNewItem({...newItem, image: url});
                                }
                              }} 
                              className="hidden" 
                            />
                          </label>

                          {newItem.image && (
                            <div className="flex items-center justify-between bg-[#D4AF37]/5 p-3 rounded-xl border border-[#D4AF37]/20 animate-fade-in-up">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D4AF37]/30">
                                  <img src={newItem.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">Active Selection</span>
                                  <span className="text-[8px] font-mono text-zinc-500 truncate max-w-[120px]">{newItem.image}</span>
                                </div>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => setNewItem({...newItem, image: ""})}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className={`block text-xs uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Description</label>
                          <textarea rows={2} value={newItem.description_en} onChange={e => setNewItem({...newItem, description_en: e.target.value})} className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50 resize-none`} />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <label className={`flex items-center gap-2 cursor-pointer border ${tm.sidebarBorder} ${isLightMode ? 'bg-[#FFFBEB]' : 'bg-zinc-800'} px-3 py-2 rounded flex-1`}>
                          <input type="checkbox" checked={newItem.isSpecial} onChange={e => setNewItem({...newItem, isSpecial: e.target.checked})} className="accent-[#D4AF37]" />
                          <span className={`${tm.textAcc} text-[10px] font-bold uppercase tracking-widest`}>Special Item</span>
                        </label>
                        <label className={`flex items-center gap-2 cursor-pointer border ${tm.sidebarBorder} ${isLightMode ? 'bg-gray-50' : 'bg-zinc-800'} px-3 py-2 rounded flex-1`}>
                          <input type="checkbox" checked={newItem.isNew} onChange={e => setNewItem({...newItem, isNew: e.target.checked})} className="accent-green-500" />
                          <span className={`${tm.tableSubtext} text-[10px] font-bold uppercase tracking-widest`}>New Item</span>
                        </label>
                      </div>
                      <button type="submit" disabled={isSaving || isUploading} className={`w-full bg-[#D4AF37] ${isLightMode ? 'text-white' : 'text-black'} py-4 rounded-lg font-black uppercase tracking-[0.2em] text-sm shadow-md active:scale-95 disabled:opacity-50 mt-2 transition-all`}>
                        {isSaving ? "Saving..." : "Save Item"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Tools row (Sticky Search on Mobile) */}
              <div className={`sticky top-[70px] lg:static z-[900] ${tm.bgApp} py-2 lg:py-0`}>
                <div className={`flex flex-col lg:flex-row gap-4 md:gap-6 border ${tm.sidebarBorder} ${tm.sidebarBtnHover} shadow-lg p-4 rounded-xl items-center ${isLightMode ? 'bg-white' : 'bg-black/50'} backdrop-blur-md`}>
                  <div className="relative group flex-1 w-full">
                    <input 
                      type="text" 
                      placeholder="Search items by name..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full ${tm.inputBg} border rounded-full py-4 lg:py-3 px-12 focus:outline-none focus:border-[#D4AF37] placeholder:${tm.tableSubtext} text-sm`}
                      style={{ minHeight: '44px' }}
                    />
                    <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${tm.tableSubtext} group-focus-within:${tm.textAcc}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>

                </div>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 mt-6">
                {filteredItems.map(item => (
                  <div key={item.id} className={`rounded-2xl p-5 border shadow-sm relative group overflow-hidden transition-all duration-300 ${
                    dirtyItemIds.has(item.id)
                      ? 'border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)] ' + tm.tableBg
                      : `${tm.tableBg} ${tm.sidebarBorder}`
                  }`}>
                    {/* RESTORED: Single Item Delete Icon (Mobile) */}
                    <button 
                      onClick={() => handleDeleteItem(item.id, item.name_en)}
                      className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 active:scale-90 transition-all shadow-sm"
                      title="Delete Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex gap-6 mb-4">
                      {/* Item Image & Actions */}
                      <div className="flex flex-col gap-3 flex-shrink-0">
                        <div className="relative w-24 h-24 group">
                          {item.image ? (
                            <img src={item.image} className="w-full h-full object-cover rounded-2xl border-2 border-[#D4AF37]/30 shadow-lg" />
                          ) : (
                            <div className={`w-full h-full ${tm.inputBg} border-2 border-dashed ${tm.sidebarBorder} rounded-2xl flex items-center justify-center opacity-40`}>
                              <span className={`${tm.textAcc} font-serif text-3xl`}>{(item.name_en || "?")[0]}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Primary Image Controls (Touch Centered) */}
                        <div className="flex gap-2">
                          <label className={`h-11 w-11 flex items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 active:scale-95 transition-all shadow-sm ${isUploading ? 'opacity-50 animate-pulse cursor-wait' : ''}`}>
                            <Upload className="w-5 h-5" />
                            <input 
                              type="file" accept="image/*" className="hidden"
                              disabled={isUploading}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) handleUpdateItemNow(item.id, { image: url });
                                }
                              }}
                            />
                          </label>
                          {item.image && (
                            <button 
                              onClick={() => handleUpdateItemNow(item.id, { image: "" })}
                              className="h-11 w-11 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 active:scale-95 transition-all shadow-sm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
 
                      {/* Details View/Edit */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            value={(pendingEdits[item.id] as {name_en?: string} | undefined)?.name_en ?? item.name_en}
                            onChange={(e) => handleUpdateItem(item.id, { name_en: e.target.value })}
                            className={`bg-transparent border-b text-2xl font-serif ${tm.tableText} font-black focus:outline-none w-full truncate placeholder:opacity-30 ${
                              dirtyItemIds.has(item.id) ? 'border-[#D4AF37]' : 'border-transparent'
                            } transition-colors`}
                            placeholder="Menu name..."
                          />
                          <p className={`${tm.tableSubtext} text-[10px] uppercase tracking-[0.1em] font-black opacity-60`}>{item.categoryName}</p>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                           <span className={`${tm.textAcc} font-black text-xl`}>ETB</span>
                           <input 
                            type="number" step="0.01" 
                            value={pendingEdits[item.id]?.price ?? item.price}
                            onChange={(e) => handlePriceChange(item.id, e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className={`bg-transparent border-b text-[#D4AF37] font-black w-24 focus:outline-none text-2xl ${
                              dirtyItemIds.has(item.id) ? 'border-[#D4AF37]' : 'border-transparent'
                            } transition-colors`}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Status & Tags Toggles */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-800/10 dark:border-zinc-800/50 pt-4 mb-4">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" className="sr-only" 
                            checked={!item.isSoldOut}
                            onChange={() => handleToggleNow(item.id, { isSoldOut: !item.isSoldOut })}
                          />
                          <div className={`w-12 h-6 rounded-full border ${tm.sidebarBorder} relative transition-colors ${!item.isSoldOut ? 'bg-[#D4AF37]' : (isLightMode ? 'bg-gray-200' : 'bg-zinc-800')}`}>
                            <div className={`w-4 h-4 rounded-full absolute top-[3px] transition-transform ${!item.isSoldOut ? 'translate-x-7 bg-white' : 'translate-x-1 bg-white'}`}></div>
                          </div>
                          <span className="ml-2 text-[10px] uppercase tracking-widest text-[#D4AF37] font-black">
                            {!item.isSoldOut ? "Active" : "Inactive"}
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateItem(item.id, { isSpecial: !item.isSpecial })}
                          className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors h-11 flex items-center justify-center ${item.isSpecial ? (isLightMode ? 'bg-[#D4AF37] text-white' : 'bg-[#D4AF37] text-black') : `border ${tm.sidebarBorder} ${tm.textAcc}`}`}
                        >
                          Special
                        </button>
                        <button 
                          onClick={() => handleUpdateItem(item.id, { isNew: !item.isNew })}
                          className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors h-11 flex items-center justify-center ${item.isNew ? 'bg-green-500 text-white' : `border ${tm.sidebarBorder} ${tm.tableSubtext}`}`}
                        >
                          New
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className={`${tm.tableBg} rounded-2xl p-12 text-center border ${tm.sidebarBorder} shadow-sm`}>
                    <p className={`${tm.textAcc} font-serif italic`}>No items found matching your search.</p>
                  </div>
                )}
              </div>

              {/* Table (Desktop Only) */}
              <div className={`hidden lg:block ${tm.tableBg} shadow-sm rounded-2xl overflow-hidden mt-4`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className={`${tm.tableHeader} text-xs uppercase tracking-widest font-bold border-b ${tm.sidebarBorder}`}>
                        <th className="p-4 w-12 text-center"></th>
                        <th className="p-4 w-24">Image</th>
                        <th className="p-4">Item Details (Edit)</th>
                        <th className="p-4 w-24">Price</th>
                        <th className="p-4 w-40 text-center">Status & Tags</th>
                        <th className="p-4 w-20 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isLightMode ? 'divide-gray-100' : 'divide-zinc-800'}`}>
                      {filteredItems.map(item => (
                        <tr key={item.id} className={`transition-colors ${
                          dirtyItemIds.has(item.id)
                            ? (isLightMode ? 'bg-[#FFFBEB] border-l-2 border-l-[#D4AF37]' : 'bg-[#D4AF37]/5 border-l-2 border-l-[#D4AF37]')
                            : `${tm.tableRowHover} ${selectedItems.includes(item.id) ? tm.tableRowActive : ''}`
                        }`}>
                          <td className="p-4 text-center"></td>
                          <td className="p-4">
                            <div className="relative group w-14 h-14">
                              {item.image ? (
                                <img src={item.image} className="w-14 h-14 object-cover rounded border border-[#D4AF37]/40 shadow-sm" />
                              ) : (
                                <div className={`w-14 h-14 ${tm.inputBg} border ${tm.sidebarBorder} rounded flex items-center justify-center`}>
                                  <span className={`${tm.textAcc} font-serif text-xl opacity-40`}>{(item.name_en || "?")[0]}</span>
                                </div>
                              )}
                              <div className={`absolute inset-0 ${isLightMode ? 'bg-white/90' : 'bg-black/90'} backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded flex flex-col items-center justify-center border ${tm.sidebarBorder} gap-1 shadow-xl z-20`}>
                                <label className="cursor-pointer hover:bg-[#D4AF37] hover:text-black w-full flex items-center justify-center py-2 transition-all border-b border-[#D4AF37]/10 group/sub">
                                  <Upload className="w-4 h-4" />
                                  <input 
                                    type="file" accept="image/*" className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const url = await handleImageUpload(file);
                                        if (url) handleUpdateItem(item.id, { image: url });
                                      }
                                    }}
                                  />
                                </label>
                                <button 
                                  onClick={() => {
                                    const url = prompt("Paste Image URL:", item.image || "");
                                    if (url !== null) handleUpdateItem(item.id, { image: url });
                                  }}
                                  className="hover:bg-[#D4AF37] hover:text-black w-full flex items-center justify-center py-2 transition-all border-b border-[#D4AF37]/10"
                                >
                                  <Link className="w-4 h-4" />
                                </button>
                                {item.image && (
                                  <button 
                                    onClick={() => handleUpdateItemNow(item.id, { image: "" })}
                                    className="text-red-500 hover:bg-red-500 hover:text-white w-full flex items-center justify-center py-2 transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4 flex flex-col gap-1">
                            <input 
                              type="text"
                              value={(pendingEdits[item.id] as {name_en?: string} | undefined)?.name_en ?? item.name_en}
                              onChange={(e) => handleUpdateItem(item.id, { name_en: e.target.value })}
                              className={`bg-transparent border-b text-base font-serif ${tm.tableText} font-bold focus:outline-none w-full ${
                                dirtyItemIds.has(item.id) ? 'border-[#D4AF37]' : 'border-transparent'
                              } transition-colors`}
                            />
                            <span className={`${tm.tableSubtext} text-xs font-serif italic ml-1`}>{item.categoryName}</span>
                          </td>
                          <td className="p-4">
                             <div className="flex items-center gap-1">
                               <span className={`${tm.textAcc} font-bold text-xs`}>ETB</span>
                               <input 
                                type="number" step="0.01"
                                value={pendingEdits[item.id]?.price ?? item.price}
                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                onFocus={(e) => e.target.select()}
                                className={`bg-transparent border-b ${tm.textAcc} font-black w-20 focus:outline-none text-base ${
                                  dirtyItemIds.has(item.id) ? 'border-[#D4AF37]' : 'border-transparent'
                                } transition-colors`}
                              />
                             </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              {/* Active/Inactive Toggle */}
                              <div className="flex flex-col items-center">
                                <label className="flex items-center justify-center cursor-pointer">
                                  <input 
                                    type="checkbox" className="sr-only" 
                                    checked={!item.isSoldOut}
                                    onChange={() => handleToggleNow(item.id, { isSoldOut: !item.isSoldOut })}
                                  />
                                  <div className={`w-10 h-5 rounded-full transition-colors border ${tm.sidebarBorder} relative ${!item.isSoldOut ? 'bg-[#D4AF37]' : (isLightMode ? 'bg-gray-200' : 'bg-zinc-800')}`}>
                                    <div className={`w-3 h-3 rounded-full absolute top-[3px] transition-transform ${!item.isSoldOut ? 'translate-x-[22px] bg-white' : 'translate-x-1 bg-white'}`}></div>
                                  </div>
                                </label>
                                <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] mt-1 block font-bold">
                                  {!item.isSoldOut ? "Active" : "Inactive"}
                                </span>
                              </div>
                              {/* Tags Grid */}
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => handleUpdateItem(item.id, { isSpecial: !(pendingEdits[item.id]?.isSpecial ?? item.isSpecial) })}
                                  className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase tracking-widest transition-colors ${(pendingEdits[item.id]?.isSpecial ?? item.isSpecial) ? (isLightMode ? 'bg-[#D4AF37] text-white' : 'bg-[#D4AF37] text-black') : `border ${tm.sidebarBorder} ${tm.textAcc} ${tm.sidebarBtnHover}`}`}
                                >
                                  Special
                                </button>
                                <button 
                                  onClick={() => handleUpdateItem(item.id, { isNew: !(pendingEdits[item.id]?.isNew ?? item.isNew) })}
                                  className={`px-2 py-0.5 rounded text-[7.5px] font-black uppercase tracking-widest transition-colors ${(pendingEdits[item.id]?.isNew ?? item.isNew) ? 'bg-green-500 text-white' : `border ${tm.sidebarBorder} ${tm.tableSubtext}`}`}
                                >
                                  New
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                             <button 
                               onClick={() => handleDeleteItem(item.id, item.name_en)} 
                               className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all ${isLightMode ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white'} border border-red-500/20 shadow-sm active:scale-95`}
                               title="Delete Item"
                             >
                               <Trash2 className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES */}
          {activeTab === "categories" && (
            <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div className={`${tm.formBg} p-8 rounded-2xl h-fit`}>
                <h3 className={`text-xl font-serif ${tm.textAcc} uppercase tracking-widest mb-6 border-b ${tm.sidebarBorder} pb-4`}>Add Category</h3>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category Name"
                    className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50`}
                  />
                  <button 
                    onClick={async () => { if(newCategoryName){ const success = await addCategory(newCategoryName); if(success) { setNewCategoryName(""); triggerSuccess(); }}}}
                    className={`bg-[#D4AF37] ${isLightMode ? 'text-white' : 'text-black'} px-8 py-3 rounded-lg font-black uppercase tracking-widest shadow-md transition-all active:scale-95`}
                  >Add</button>
                </div>
              </div>

              <div className={`${tm.formBg} p-8 rounded-2xl`}>
                <h3 className={`text-xl font-serif ${tm.textAcc} uppercase tracking-widest mb-6 border-b ${tm.sidebarBorder} pb-4`}>Existing Categories</h3>
                <div className="space-y-4">
                  {menuData.map(cat => (
                    <div key={cat.id} className={`flex items-center justify-between border ${tm.sidebarBorder} ${tm.sidebarBtnHover} p-4 rounded-lg`}>
                      <div className="flex-grow">
                        <input 
                          type="text" 
                          value={cat.category_en}
                          onChange={async (e) => {
                            const success = await renameCategory(cat.id, e.target.value);
                            if (success) window.location.reload();
                          }}
                          className={`bg-transparent border-none font-serif ${tm.tableText} font-bold text-lg focus:outline-none w-full`}
                        />
                        <span className={`text-xs ${tm.tableSubtext} uppercase tracking-widest`}>{(cat.items?.length || 0)} items</span>
                      </div>
                      <button 
                        onClick={async () => { if(confirm(`Delete category "${cat.category_en}"?`)){ const success = await deleteCategory(cat.id); if(success) { window.location.reload(); }}}}
                        className={`${tm.deleteBtn} transition-colors`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))}
                  {menuData.length === 0 && <p className={`${tm.tableSubtext}`}>No categories exist.</p>}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="animate-fade-in-up space-y-8 max-w-4xl mx-auto">
              <div className={`border-b ${tm.sidebarBorder} pb-4`}>
                <h2 className={`text-3xl font-serif ${tm.textAcc} uppercase tracking-widest`}>Storefront Settings</h2>
                <p className={`${tm.tableSubtext} text-xs mt-2 uppercase tracking-widest`}>Manage global content for the user storefront</p>
              </div>
              {/* Restored settings container div */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-8">
                {/* Hotel Branding */}
                <div className={`${tm.formBg} p-6 md:p-8 rounded-2xl space-y-6`}>
                  <h3 className={`text-xl font-serif ${tm.textAcc} uppercase tracking-widest border-b ${tm.sidebarBorder} pb-3`}>Hotel Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Hotel Name</label>
                      <input 
                        type="text" 
                        value={pendingSettings.hotelName ?? siteContent.hotelName} 
                        onChange={(e) => setPendingSettings(p => ({ ...p, hotelName: e.target.value }))}
                        className={`w-full border rounded py-3 px-4 focus:outline-none transition-all font-serif text-xl ${pendingSettings.hotelName !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Hotel Slogan</label>
                      <input 
                        type="text" 
                        value={pendingSettings.hotelSlogan ?? siteContent.hotelSlogan} 
                        onChange={(e) => setPendingSettings(p => ({ ...p, hotelSlogan: e.target.value }))}
                        className={`w-full border rounded py-3 px-4 focus:outline-none transition-all font-serif italic ${pendingSettings.hotelSlogan !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Hotel Logo</label>
                       <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                          <div className="w-24 h-24 relative border border-[#D4AF37]/30 rounded-lg overflow-hidden bg-black flex-shrink-0">
                            <img src={siteContent.logo || "/logo.png"} alt="Current Logo" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <input 
                             type="file" 
                             accept="image/*"
                             disabled={isUploading}
                             onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const url = await handleImageUpload(file);
                               if (url) {
                                 await updateSiteContent({ logo: url });
                                 triggerSuccess();
                               }
                             }}
                             className={`block w-full text-xs ${tm.textMuted}
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-full file:border-0
                               file:text-[10px] file:font-semibold
                               file:bg-[#D4AF37]/10 file:text-[#D4AF37]
                               hover:file:bg-[#D4AF37]/20 transition-all cursor-pointer`}
                            />
                            <p className="text-[9px] text-gray-500 mt-2 uppercase tracking-tight">Recommended: Square PNG with transparent background. Uploads to Cloudinary.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
                {/* Contact Information */}
                <div className={`${tm.formBg} p-8 rounded-2xl space-y-6`}>
                  <h3 className={`text-xl font-serif ${tm.textAcc} uppercase tracking-widest border-b ${tm.sidebarBorder} pb-3`}>Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Phone Number</label>
                      <input 
                        type="text" 
                        value={pendingSettings.phone ?? siteContent.phone} 
                        onChange={(e) => setPendingSettings(p => ({ ...p, phone: e.target.value }))}
                        className={`w-full border rounded py-3 px-4 focus:outline-none transition-all font-mono ${pendingSettings.phone !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Email Address</label>
                      <input 
                        type="email" 
                        value={pendingSettings.email ?? siteContent.email} 
                        onChange={(e) => setPendingSettings(p => ({ ...p, email: e.target.value }))}
                        className={`w-full border rounded py-3 px-4 focus:outline-none transition-all font-mono ${pendingSettings.email !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Physical Address</label>
                      <input 
                        type="text" 
                        value={pendingSettings.address ?? siteContent.address} 
                        onChange={(e) => setPendingSettings(p => ({ ...p, address: e.target.value }))}
                        className={`w-full border rounded py-3 px-4 focus:outline-none transition-all ${pendingSettings.address !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                      />
                    </div>
                  </div>
                </div>

                {/* About Story */}
                <div className={`${tm.formBg} p-8 rounded-2xl space-y-6`}>
                  <h3 className={`text-xl font-serif ${tm.textAcc} uppercase tracking-widest border-b ${tm.sidebarBorder} pb-3`}>Our Story Content</h3>
                  <div>
                    <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Story Title</label>
                    <input 
                      type="text" 
                      value={pendingSettings.storyTitle ?? siteContent.storyTitle} 
                      onChange={(e) => setPendingSettings(p => ({ ...p, storyTitle: e.target.value }))}
                      className={`w-full border rounded py-3 px-4 focus:outline-none transition-all font-serif text-lg ${pendingSettings.storyTitle !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Full Story Text</label>
                    <textarea 
                      rows={6} 
                      value={pendingSettings.storyText ?? siteContent.storyText} 
                      onChange={(e) => setPendingSettings(p => ({ ...p, storyText: e.target.value }))}
                      className={`w-full border rounded py-4 px-4 focus:outline-none transition-all resize-none leading-relaxed ${pendingSettings.storyText !== undefined ? `${tm.inputBg} border-[#D4AF37]` : `${tm.inputBg} border-[#D4AF37]/30 focus:border-[#D4AF37]/50`}`} 
                    />
                  </div>
                </div>

                {/* Security Settings */}
                <div className={`${tm.formBg} p-8 rounded-2xl space-y-6`}>
                  <h3 className={`text-xl font-serif text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-3 flex items-center gap-3`}>
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Security Settings
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Current Password</label>
                      <input 
                        type="password" 
                        required
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50 transition-all font-mono placeholder:text-zinc-600`} 
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>New Password</label>
                      <input 
                        type="password" 
                        required
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50 transition-all font-mono placeholder:text-zinc-600`} 
                        placeholder="••••••••"
                      />
                    </div>
                    <div>
                      <label className={`block text-[10px] uppercase tracking-widest ${tm.textAcc} font-bold mb-2`}>Confirm New Password</label>
                      <input 
                        type="password" 
                        required
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full ${tm.inputBg} border rounded py-3 px-4 focus:outline-none focus:border-[#D4AF37]/50 transition-all font-mono placeholder:text-zinc-600`} 
                        placeholder="••••••••"
                      />
                    </div>
                    
                    {passwordError && <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold my-2">{passwordError}</p>}
                    
                    <button 
                      type="submit" 
                      disabled={isChangingPassword}
                      className={`w-full bg-[#D4AF37] ${isLightMode ? 'text-white' : 'text-black'} py-4 rounded-lg font-black uppercase tracking-[0.2em] text-xs shadow-md active:scale-95 disabled:opacity-50 mt-4 transition-all flex justify-center items-center`}
                    >
                      {isChangingPassword ? "Updating Password..." : "Update Password"}
                    </button>
                  </form>
                </div>

              </div>

              {hasPendingChanges && (
                <div className="flex justify-center p-4">
                  <button
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#D4AF37] text-black font-black uppercase tracking-[0.2em] text-xs rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 animate-pulse"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                    Save All Changes
                  </button>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </main>

      {/* Global Saving Overlay */}
      {isSaving && (
        <div className={`fixed inset-0 z-[2000] ${tm.modalOverlay} backdrop-blur-sm flex items-center justify-center cursor-wait`}>
          <div className={`${tm.modalBg} px-10 py-6 rounded-xl flex items-center gap-6 shadow-2xl`}>
            <div className="w-8 h-8 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
            <p className={`${tm.tableText} font-serif uppercase tracking-[0.3em] text-sm`}>Processing all changes...</p>
          </div>
        </div>
      )}

      {/* Global Success Toast */}
      {showSuccess && (
        <div className={`fixed bottom-8 right-8 z-[2000] ${tm.bgSidebar} px-8 py-4 border-l-4 border-[#D4AF37] shadow-2xl rounded-r animate-fade-in-up`}>
          <p className={`${tm.textAcc} font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3`}>
            <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            All changes synced successfully!
          </p>
        </div>
      )}

      {/* Mini Status Toast */}
      {showStatusToast && (
        <div className={`fixed bottom-6 inset-x-0 mx-auto w-max z-[2000] bg-[#D4AF37] text-black px-6 py-2 rounded-full shadow-lg animate-fade-in-up flex items-center gap-2`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          <span className="font-black uppercase tracking-widest text-[10px]">Status Updated</span>
        </div>
      )}
    </div>
  );
}
