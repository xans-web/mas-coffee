"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { Plus, Edit2, Trash2, Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadMainSiteImage } from "@/lib/cloudinaryUpload";

interface LookbookItem {
  _id: string;
  title: string;
  image: string;
}

export default function LookbookManager() {
  const router = useRouter();
  const [items, setItems] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LookbookItem | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    image: ""
  });

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    } else {
      fetchItems();
    }
  }, [router]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/lookbook');
      const data = await res.json();
      setItems(data);
    } catch (error) {
      console.error("Failed to fetch lookbook:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadMainSiteImage(file);
      if (result.ok) {
        setFormData((prev) => ({ ...prev, image: result.secure_url }));
        toast.success("Gallery image uploaded.");
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload Failed:", error);
      toast.error("Network error during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving lookbook item with data:", formData);
    
    if (!formData.image) {
      toast.error("Upload an image first.");
      return;
    }

    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem ? { ...formData, _id: editingItem._id } : formData;

    try {
      console.log(`Sending ${method} request to /api/admin/lookbook...`);
      const res = await fetch('/api/admin/lookbook', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const responseData = await res.json();
      console.log("Lookbook API Response:", responseData);

      if (res.ok) {
        toast.success(editingItem ? "Gallery item updated." : "Gallery item saved.");
        setIsModalOpen(false);
        setEditingItem(null);
        setFormData({ title: "", image: "" });
        fetchItems();
      } else {
        toast.error(responseData.error || "Failed to save item");
      }
    } catch (error) {
      console.error("Lookbook Submit Error:", error);
      toast.error("Error saving gallery item.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lookbook item?")) return;
    
    try {
      const res = await fetch(`/api/admin/lookbook?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Gallery item removed.");
        fetchItems();
      } else {
        toast.error("Failed to delete item.");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Error deleting gallery item.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2421] text-[#F5EFE0] flex font-sans">
      <AdminSidebar />
      
      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-12 border-b border-[#C5A367]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#C5A367] uppercase tracking-widest mb-4">
              Lookbook
            </h1>
            <p className="text-[#F5EFE0]/60 font-sans uppercase tracking-[0.2em] text-xs">
              Manage the luxury gallery and lookbook content.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingItem(null);
              setFormData({ title: "", image: "" });
              setIsModalOpen(true);
            }}
            className="bg-[#C5A367] text-[#0B2421] px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#F3E5AB] transition-all shadow-xl"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </header>

        {/* Lookbook Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-[#C5A367] animate-spin" />
              <p className="text-[#C5A367] font-black uppercase tracking-widest text-xs">Loading Lookbook...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full p-20 text-center bg-[#C5A367]/5 rounded-3xl border border-[#C5A367]/10">
              <p className="text-[#F5EFE0]/40 italic font-serif text-xl">No items found. Add your first gallery item above.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="group relative bg-[#0B2421] border border-[#C5A367]/20 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-[#C5A367]/40 aspect-square">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                <div className="absolute inset-0 bg-linear-to-t from-[#0B2421] via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300" />
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => {
                      setEditingItem(item);
                      setFormData({ ...item });
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-[#0B2421]/80 backdrop-blur-md text-[#C5A367] rounded-lg border border-[#C5A367]/30 hover:bg-[#C5A367] hover:text-[#0B2421] transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item._id)}
                    className="p-2 bg-red-500/80 backdrop-blur-md text-white rounded-lg border border-red-500/30 hover:bg-red-500 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-xs font-black text-white uppercase tracking-widest truncate">{item.title}</h3>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-2100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#08120F]/90 backdrop-blur-sm z-2100" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-2110 w-full max-w-md bg-[#0B2421] border border-[#C5A367]/30 rounded-4xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-[#C5A367]/10 flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-black text-[#C5A367] uppercase tracking-widest">
                {editingItem ? "Edit Item" : "Add Gallery Item"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#C5A367] hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Item Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none transition-all"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest block">Gallery Image</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative z-110">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="lookbook-upload"
                    />
                    <label 
                      htmlFor="lookbook-upload"
                      className="flex items-center justify-center gap-2 w-full bg-[#C5A367]/10 border-2 border-[#C5A367] border-dashed rounded-xl px-4 py-4 text-[#C5A367] cursor-pointer hover:bg-[#C5A367]/20 transition-all opacity-100 visible z-120"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible' }}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="w-16 h-16 rounded-lg border-2 border-[#C5A367] overflow-hidden shadow-lg shrink-0">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full py-5 bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-xs rounded-xl hover:bg-[#F3E5AB] transition-all shadow-2xl opacity-100 visible z-120 border-2 border-[#C5A367] disabled:opacity-50"
                style={{ display: 'block', opacity: 1, visibility: 'visible' }}
              >
                {editingItem ? "Update Item" : "Save Item"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
