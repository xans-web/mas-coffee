"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MenuSection, MenuItem } from '@/lib/menu-data';

interface SiteContent {
  hotelName: string;
  hotelSlogan: string;
  storyTitle: string;
  storyText: string;
  address: string;
  phone: string;
  email: string;
  logo: string;
  totalViews?: number;
  dailyViews?: number;
}

export interface MainHero {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

export interface MainSiteEvent {
  _id: string;
  name: string;
  date: string;
  description: string;
  image: string;
  createdAt: Date;
}

export interface LookbookCategory {
  id: string;
  name: string;
}

export interface LookbookItem {
  _id: string;
  title: string;
  image: string;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  text: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
}

export interface MainSiteProduct {
  _id: string;
  name: string;
  category: 'Coffee' | 'Cake';
  price: number;
  description: string;
  image: string;
  createdAt: Date;
}

export interface SubCategory {
  _id: string;
  name: string;
  parentSection: 'Coffee' | 'Cake';
  coverImage: string;
  createdAt: Date;
}

export interface SiteSettings {
  mapLatitude: string;
  mapLongitude: string;
}

interface MenuContextType {
  menuData: MenuSection[];
  siteContent: SiteContent;
  websiteContent: {
    heroes: MainHero[];
    lookbookCategories: LookbookCategory[];
    lookbookItems: LookbookItem[];
    events: MainSiteEvent[];
    announcements: Announcement[];
    inquiries: Inquiry[];
    mainSiteProducts: MainSiteProduct[];
    subCategories: SubCategory[];
    siteSettings: SiteSettings;
  };
  updateMenuItem: (itemId: number, updates: Partial<MenuItem>) => Promise<boolean>;
  bulkUpdateItems: (itemIds: number[], updates: Partial<MenuItem>) => Promise<boolean>;
  addMenuItem: (categoryId: string, item: Omit<MenuItem, "id">) => Promise<boolean>;
  deleteMenuItem: (itemId: number) => Promise<boolean>;
  addCategory: (categoryName: string) => Promise<boolean>;
  renameCategory: (categoryId: string, newName: string) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  updateSiteContent: (updates: Partial<SiteContent>) => Promise<boolean>;
  
  // Website Manager Methods
  updateHero: (action: 'add' | 'update' | 'delete' | 'reorder', payload: any) => Promise<boolean>;
  updateLookbookCategory: (action: 'add' | 'delete', payload: any) => Promise<boolean>;
  updateLookbookItem: (action: 'add' | 'update' | 'delete', payload: any) => Promise<boolean>;
  updateAnnouncement: (action: 'add' | 'update' | 'delete' | 'toggle', payload: any) => Promise<boolean>;
  updateInquiry: (action: 'updateStatus' | 'delete', payload: any) => Promise<boolean>;

  refreshData: () => Promise<void>;
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const initialSiteContent: SiteContent = {
  hotelName: "MAS COFFEE",
  hotelSlogan: "WHERE EVERY SIP TELLS A STORY",
  storyTitle: "A Legacy of Flavor",
  storyText: "At Mas Coffee, we believe that coffee is more than just a drink—it's a journey. Founded on the principles of quality, community, and heritage, we source the finest beans from the heart of Ethiopia. Our 'Midnight Forest' experience is designed to transport you to the lush highlands where every bean is nurtured with care.",
  address: "Mas Coffee Plaza, Addis Ababa, Ethiopia",
  phone: "+251 911 234 567",
  email: "info@mascoffee.com",
  logo: "/logo.svg"
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use empty array initially to stop auto-seeds from appearing before fetch
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
  const [websiteContent, setWebsiteContent] = useState({
    heroes: [] as MainHero[],
    lookbookCategories: [] as LookbookCategory[],
    lookbookItems: [] as LookbookItem[],
    events: [] as MainSiteEvent[],
    announcements: [] as Announcement[],
    inquiries: [] as Inquiry[],
    mainSiteProducts: [] as MainSiteProduct[],
    subCategories: [] as SubCategory[],
    siteSettings: { mapLatitude: "9.0227", mapLongitude: "38.7460" } as SiteSettings,
  });
  const [language, setLanguageState] = useState<'en' | 'am'>('en');

  // Load language preference from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      if (savedLang === 'am' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: 'en' | 'am') => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, []);

  const refreshData = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const [menuRes, settingsRes, heroRes, lookCatRes, lookItemRes, annRes, inqRes, productsRes, eventsRes, webSettingsRes, subCatRes] = await Promise.all([
        fetch(`/api/menu?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/settings?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/hero?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/lookbook/categories?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/lookbook/items?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/announcements?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/inquiries?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/products?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/events?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/settings?t=${timestamp}`, { cache: 'no-store' }),
        fetch(`/api/website/subcategories?t=${timestamp}`, { cache: 'no-store' })
      ]);

      const [menuData, settingsData, heroData, lookCatData, lookItemData, annData, inqData, productsData, eventsData, webSettingsData, subCatData] = await Promise.all([
        menuRes.json(),
        settingsRes.json(),
        heroRes.json(),
        lookCatRes.json(),
        lookItemRes.json(),
        annRes.json(),
        inqRes.json(),
        productsRes.json(),
        eventsRes.json(),
        webSettingsRes.json(),
        subCatRes.json()
      ]);

      if (Array.isArray(menuData)) setMenuData(menuData);
      if (!settingsData.error) setSiteContent(settingsData);
      
      setWebsiteContent({
        heroes: Array.isArray(heroData) ? heroData : [],
        lookbookCategories: Array.isArray(lookCatData) ? lookCatData : [],
        lookbookItems: Array.isArray(lookItemData) ? lookItemData : [],
        events: Array.isArray(eventsData) ? eventsData : [],
        announcements: Array.isArray(annData) ? annData : [],
        inquiries: Array.isArray(inqData) ? inqData : [],
        mainSiteProducts: Array.isArray(productsData) ? productsData : [],
        subCategories: Array.isArray(subCatData) ? subCatData : [],
        siteSettings: webSettingsData && !webSettingsData.error ? webSettingsData : { mapLatitude: "9.0227", mapLongitude: "38.7460" },
      });
    } catch (err) {
      console.error("Failed to refresh data", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Website Manager Methods Implementation
  const updateHero = async (action: 'add' | 'update' | 'delete' | 'reorder', payload: any) => {
    try {
      const res = await fetch('/api/website/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        cache: 'no-store'
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update hero", err);
      return false;
    }
  };

  const updateLookbookCategory = async (action: 'add' | 'delete', payload: any) => {
    try {
      const res = await fetch('/api/website/lookbook/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        cache: 'no-store'
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update lookbook category", err);
      return false;
    }
  };

  const updateLookbookItem = async (action: 'add' | 'update' | 'delete', payload: any) => {
    try {
      const res = await fetch('/api/website/lookbook/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        cache: 'no-store'
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update lookbook item", err);
      return false;
    }
  };

  const updateAnnouncement = async (action: 'add' | 'update' | 'delete' | 'toggle', payload: any) => {
    try {
      const res = await fetch('/api/website/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        cache: 'no-store'
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update announcement", err);
      return false;
    }
  };

  const updateInquiry = async (action: 'updateStatus' | 'delete', payload: any) => {
    try {
      const res = await fetch('/api/website/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, payload }),
        cache: 'no-store'
      });
      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update inquiry", err);
      return false;
    }
  };

  // NEW ATOMIC INTERACTION METHODS
  
  const updateMenuItem = async (itemId: number, updates: Partial<MenuItem>) => {
    try {
      // Find the categoryId for the item
      const section = menuData.find(s => s.items.some(i => i.id === itemId));
      if (!section) return false;

      const currentItem = section.items.find(i => i.id === itemId);
      const updatedItem = { ...currentItem, ...updates };

      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'upsertItem', 
          payload: { categoryId: section.id, item: updatedItem } 
        }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update item", err);
      return false;
    }
  };

  const bulkUpdateItems = async (itemIds: number[], updates: Partial<MenuItem>) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'bulkUpdate', 
          payload: { itemIds, updates } 
        }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed bulk update", err);
      return false;
    }
  };

  const addMenuItem = async (categoryId: string, item: Omit<MenuItem, "id">) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'upsertItem', 
          payload: { categoryId, item } 
        }), // No ID means server will generate one
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add item", err);
      return false;
    }
  };

  const deleteMenuItem = async (itemId: number) => {
    try {
      const section = menuData.find(s => s.items.some(i => i.id === itemId));
      if (!section) return false;

      const res = await fetch('/api/menu', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, categoryId: section.id }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete item", err);
      return false;
    }
  };

  const addCategory = async (categoryName: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'addCategory', 
          payload: { categoryName } 
        }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add category", err);
      return false;
    }
  };

  const renameCategory = async (categoryId: string, newName: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'renameCategory', 
          payload: { categoryId, newName } 
        }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to rename category", err);
      return false;
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST', // Using POST for category actions switcher
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'deleteCategory', 
          payload: { categoryId } 
        }),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to delete category", err);
      return false;
    }
  };

  const updateSiteContent = async (updates: Partial<SiteContent>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        cache: 'no-store'
      });

      if (res.ok) {
        await refreshData();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update settings", err);
      return false;
    }
  };

  return (
    <MenuContext.Provider value={{ 
      menuData, 
      siteContent,
      websiteContent,
      updateMenuItem, 
      bulkUpdateItems, 
      addMenuItem, 
      deleteMenuItem, 
      addCategory, 
      renameCategory, 
      deleteCategory,
      updateSiteContent,
      updateHero,
      updateLookbookCategory,
      updateLookbookItem,
      updateAnnouncement,
      updateInquiry,
      refreshData,
      language,
      setLanguage
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
