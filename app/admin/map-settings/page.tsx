"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { toast } from "sonner";

export default function MapSettings() {
  const router = useRouter();
  const [coords, setCoords] = useState({ mapLatitude: "", mapLongitude: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    } else {
      fetchSettings();
    }
  }, [router]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/map-settings');
      const data = await res.json();
      if (data) {
        setCoords({
          mapLatitude: data.mapLatitude || "",
          mapLongitude: data.mapLongitude || ""
        });
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving map settings:", coords);
      setSaving(true);
      const res = await fetch('/api/admin/map-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords)
      });
      
      const responseData = await res.json();
      console.log("Map settings API response:", responseData);

      if (res.ok) {
        toast.success("Map settings saved.");
      } else {
        toast.error(responseData.error || "Failed to save map settings");
      }
    } catch (error) {
      console.error("Map Settings Save Error:", error);
      toast.error("Something went wrong. Check your connection.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2421] text-[#F5EFE0] flex font-inter">
      <AdminSidebar />
      
      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-12 border-b border-[#C5A367]/20 pb-8">
          <h1 className="text-4xl md:text-5xl font-playfair font-black text-[#C5A367] uppercase tracking-widest mb-4">
            Map Settings
          </h1>
          <p className="text-[#F5EFE0]/60 font-inter uppercase tracking-[0.2em] text-xs">
            Configure the geographical location for the restaurant map.
          </p>
        </header>

        <div className="max-w-2xl">
          <div className="bg-[#0B2421] border border-[#C5A367]/20 rounded-2xl p-8 shadow-2xl space-y-8">
            <h2 className="text-xl font-playfair font-bold text-[#C5A367] uppercase tracking-widest border-b border-[#C5A367]/10 pb-4">
              Location Coordinates
            </h2>
            
            {loading ? (
              <div className="py-10 flex justify-center">
                <div className="w-8 h-8 border-4 border-[#C5A367] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">
                    Latitude
                  </label>
                  <input 
                    type="text" 
                    value={coords.mapLatitude}
                    onChange={(e) => setCoords(prev => ({ ...prev, mapLatitude: e.target.value }))}
                    placeholder="e.g. 9.0227"
                    className="w-full bg-[#0B2421] border border-[#C5A367]/30 rounded-lg px-4 py-3 text-[#F5EFE0] focus:outline-none focus:border-[#C5A367] transition-all font-inter"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">
                    Longitude
                  </label>
                  <input 
                    type="text" 
                    value={coords.mapLongitude}
                    onChange={(e) => setCoords(prev => ({ ...prev, mapLongitude: e.target.value }))}
                    placeholder="e.g. 38.7460"
                    className="w-full bg-[#0B2421] border border-[#C5A367]/30 rounded-lg px-4 py-3 text-[#F5EFE0] focus:outline-none focus:border-[#C5A367] transition-all font-inter"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={handleSave}
              disabled={loading || saving}
              className="relative z-[120] w-full py-4 bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-xs rounded-lg hover:bg-[#F3E5AB] transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Map Settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
