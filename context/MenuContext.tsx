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

interface MenuContextType {
  menuData: MenuSection[];
  siteContent: SiteContent;
  updateMenuItem: (itemId: number, updates: Partial<MenuItem>) => Promise<boolean>;
  bulkUpdateItems: (itemIds: number[], updates: Partial<MenuItem>) => Promise<boolean>;
  addMenuItem: (categoryId: string, item: Omit<MenuItem, "id">) => Promise<boolean>;
  deleteMenuItem: (itemId: number) => Promise<boolean>;
  addCategory: (categoryName: string) => Promise<boolean>;
  renameCategory: (categoryId: string, newName: string) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
  updateSiteContent: (updates: Partial<SiteContent>) => Promise<boolean>;
  refreshData: () => Promise<void>;
  language: 'en' | 'am';
  setLanguage: (lang: 'en' | 'am') => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const initialSiteContent: SiteContent = {
  hotelName: "ABAY INTERNATIONAL HOTEL",
  hotelSlogan: "THE ESSENCE OF ETHIOPIA",
  storyTitle: "The Essence of Addis",
  storyText: "Established in 1998, Addis Culinary brings the rich heritage of Ethiopian hospitality to your table. Every dish is prepared with love and authentic spices imported directly from the highlands. Our mission is to share the vibrant flavors and communal dining traditions of our motherland with the world.",
  address: "123 Cultural Way, Addis Ababa, Ethiopia",
  phone: "+251 11 123 4567",
  email: "info@abayhotel.com",
  logo: "/logo.png"
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use empty array initially to stop auto-seeds from appearing before fetch
  const [menuData, setMenuData] = useState<MenuSection[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent>(initialSiteContent);
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
      const menuRes = await fetch(`/api/menu?t=${timestamp}`, { cache: 'no-store' });
      const data = await menuRes.json();
      if (Array.isArray(data)) {
        setMenuData(data);
      }

      const settingsRes = await fetch(`/api/settings?t=${timestamp}`, { cache: 'no-store' });
      const settingsData = await settingsRes.json();
      if (!settingsData.error) {
        setSiteContent(settingsData);
      }
    } catch (err) {
      console.error("Failed to refresh data", err);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

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
      updateMenuItem, 
      bulkUpdateItems, 
      addMenuItem, 
      deleteMenuItem, 
      addCategory, 
      renameCategory, 
      deleteCategory,
      updateSiteContent,
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
