"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { Plus, Edit2, Trash2, Coffee as CoffeeIcon, Cake as CakeIcon, Loader2, X, Upload, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { uploadMainSiteImage } from "@/lib/cloudinaryUpload";

interface Product {
  _id: string;
  name: string;
  category: 'Coffee' | 'Cake';
  subCategory: string;
  price: number;
  description: string;
  image: string;
  leadTime: string;
  ingredients: string;
  sizeWeight: string;
  shelfLife: string;
}

interface SubCategory {
  _id: string;
  name: string;
  parentSection: 'Coffee' | 'Cake';
  coverImage: string;
}

export default function ProductManager() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Coffee' | 'Cake'>('Coffee');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [isSubCatModalOpen, setIsSubCatModalOpen] = useState(false);
  const [editingSubCat, setEditingSubCat] = useState<SubCategory | null>(null);

  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Coffee" as 'Coffee' | 'Cake',
    subCategory: "",
    price: 0,
    description: "",
    image: "",
    leadTime: "",
    ingredients: "",
    sizeWeight: "",
    shelfLife: ""
  });

  const [subCatFormData, setSubCatFormData] = useState({
    name: "",
    parentSection: "Coffee" as 'Coffee' | 'Cake',
    coverImage: ""
  });

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    } else {
      fetchData();
    }
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, subCatRes] = await Promise.all([
        fetch('/api/admin/products'),
        fetch('/api/admin/subcategories')
      ]);
      const prodData = await prodRes.json();
      const subCatData = await subCatRes.json();
      setProducts(prodData);
      setSubCategories(subCatData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isSubCat: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadMainSiteImage(file);
      if (result.ok) {
        if (isSubCat) {
          setSubCatFormData((prev) => ({ ...prev, coverImage: result.secure_url }));
        } else {
          setFormData((prev) => ({ ...prev, image: result.secure_url }));
        }
        toast.success("Image uploaded successfully.");
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

  // --- PRODUCT SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Upload an image first.");
      return;
    }
    if (!formData.subCategory) {
      toast.error("Please select a sub-category.");
      return;
    }

    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct ? { ...formData, _id: editingProduct._id } : formData;

    try {
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingProduct ? "Product updated." : "Product saved.");
        setIsModalOpen(false);
        setEditingProduct(null);
        fetchData();
      } else {
        toast.error(responseData.error || "Failed to save product");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Product deleted.");
        fetchData();
      } else {
        toast.error("Failed to delete product.");
      }
    } catch (error) {
      toast.error("Error deleting product.");
    }
  };

  // --- SUBCATEGORY SUBMIT ---
  const handleSubCatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subCatFormData.coverImage) {
      toast.error("Upload a cover image first.");
      return;
    }

    const method = editingSubCat ? 'PUT' : 'POST';
    const body = editingSubCat ? { ...subCatFormData, _id: editingSubCat._id } : subCatFormData;

    try {
      const res = await fetch('/api/admin/subcategories', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const responseData = await res.json();

      if (res.ok) {
        toast.success(editingSubCat ? "Sub-category updated." : "Sub-category saved.");
        setIsSubCatModalOpen(false);
        setEditingSubCat(null);
        fetchData();
      } else {
        toast.error(responseData.error || "Failed to save sub-category");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleSubCatDelete = async (id: string) => {
    if (!confirm("Delete this sub-category? Products assigned to it might lose reference.")) return;
    try {
      const res = await fetch(`/api/admin/subcategories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Sub-category deleted.");
        fetchData();
      } else {
        toast.error("Failed to delete sub-category.");
      }
    } catch (error) {
      toast.error("Error deleting sub-category.");
    }
  };

  const filteredProducts = products.filter(p => p.category === activeTab);
  const availableSubCatsForForm = subCategories.filter(sc => sc.parentSection === formData.category);

  return (
    <div className="min-h-screen bg-[#0B2421] text-[#F5EFE0] flex font-sans">
      <AdminSidebar />
      
      <main className="flex-1 pt-17.5 p-12 lg:p-16 max-w-7xl mx-auto">
        <header className="mb-16 border-b border-[#C5A367]/20 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-[#C5A367] uppercase tracking-widest mb-4">
              Product & Category Manager
            </h1>
            <p className="text-[#F5EFE0]/60 font-sans uppercase tracking-[0.2em] text-sm">
              Manage luxury coffee, packed goods, cakes, and sub-categories.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => {
                setEditingSubCat(null);
                setSubCatFormData({ name: "", parentSection: activeTab, coverImage: "" });
                setIsSubCatModalOpen(true);
              }}
              className="px-6 py-4 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 border border-[#C5A367]/30 text-[#C5A367] hover:bg-[#C5A367]/10 transition-all shadow-xl"
            >
              <LayoutList className="w-4 h-4" /> Category Editor
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setFormData({ 
                  name: "", category: activeTab, subCategory: "", price: 0, description: "", image: "",
                  leadTime: "", ingredients: "", sizeWeight: "", shelfLife: ""
                });
                setIsModalOpen(true);
              }}
              className="bg-[#C5A367] text-[#0B2421] px-6 py-4 rounded-lg font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-[#F3E5AB] transition-all shadow-xl"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex flex-row gap-4 mb-8 md:mb-12 w-full max-w-full overflow-x-auto no-scrollbar">
          {[
            { id: 'Coffee', icon: CoffeeIcon },
            { id: 'Cake', icon: CakeIcon }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex flex-1 md:flex-none justify-center items-center gap-2 px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase tracking-widest text-xs md:text-sm border transition-all ${
                activeTab === tab.id 
                ? "bg-[#C5A367] text-[#0B2421] border-[#C5A367]" 
                : "border-[#C5A367]/30 text-[#C5A367]/60 hover:border-[#C5A367]/60"
              }`}
            >
              <tab.icon className="w-4 h-4 shrink-0" />
              {tab.id}s
            </button>
          ))}
        </div>

        {/* Sub-Categories Quick View */}
        <div className="mb-12">
            <h3 className="text-xl font-serif font-black text-[#C5A367] uppercase tracking-widest mb-6">Sub-Categories ({activeTab})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {subCategories.filter(sc => sc.parentSection === activeTab).map(sc => (
                <div key={sc._id} className="bg-[#08120F] border border-[#C5A367]/20 rounded-2xl p-4 flex flex-col items-center gap-3 relative group">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-[#C5A367]/40">
                    <img src={sc.coverImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className="text-xs font-black text-[#F5EFE0] uppercase tracking-widest text-center leading-tight">{sc.name}</span>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button onClick={() => { setEditingSubCat(sc); setSubCatFormData({...sc}); setIsSubCatModalOpen(true); }} className="text-[#C5A367] hover:scale-110"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleSubCatDelete(sc._id)} className="text-red-400 hover:scale-110"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => {
                  setEditingSubCat(null);
                  setSubCatFormData({ name: "", parentSection: activeTab, coverImage: "" });
                  setIsSubCatModalOpen(true);
                }}
                className="bg-[#C5A367]/5 border-2 border-dashed border-[#C5A367]/30 rounded-2xl flex flex-col items-center justify-center p-4 hover:border-[#C5A367] hover:bg-[#C5A367]/10 transition-all text-[#C5A367] gap-2 min-h-[120px]"
              >
                <Plus className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase tracking-widest">Add New</span>
              </button>
            </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#0B2421] border border-[#C5A367]/20 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-24 flex flex-col items-center justify-center gap-6">
              <Loader2 className="w-12 h-12 text-[#C5A367] animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-24 text-center">
              <p className="text-[#F5EFE0]/40 italic font-serif text-xl">No products found in this category.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#C5A367]/10 border-b border-[#C5A367]/20">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Image</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Name & Sub-Category</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Lead Time</th>
                      <th className="px-6 py-4 text-[10px] font-black text-[#C5A367] uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#C5A367]/10">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-[#C5A367]/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-[#C5A367]/20 bg-black/20">
                            <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-serif font-bold text-[#F5EFE0] tracking-wide">{product.name}</span>
                            <span className="text-[10px] text-[#C5A367] px-2 py-0.5 rounded-full border border-[#C5A367]/30 bg-[#C5A367]/5 w-fit uppercase font-black">{product.subCategory}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[#C5A367] font-black">{product.price} ETB</td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-[#F5EFE0]/60 italic">{product.leadTime || "-"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => {
                                setEditingProduct(product);
                                setFormData({ ...product });
                                setIsModalOpen(true);
                              }}
                              className="p-3 hover:bg-[#C5A367] hover:text-[#0B2421] text-[#C5A367] rounded-lg transition-all"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-3 hover:bg-red-500 hover:text-white text-red-500/60 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden flex flex-col gap-4 p-4 items-center">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="w-[95%] bg-[#08120F] border border-[#C5A367]/20 rounded-3xl p-5 shadow-xl flex flex-col gap-4">
                    <div className="flex gap-4 items-start border-b border-[#C5A367]/10 pb-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#C5A367]/20 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-start">
                        <h4 className="text-lg font-serif font-black text-[#F5EFE0] leading-tight mb-1">{product.name}</h4>
                        <span className="text-[10px] text-[#C5A367] px-2 py-0.5 rounded-full border border-[#C5A367]/30 bg-[#C5A367]/5 w-fit uppercase font-black mb-1">{product.subCategory}</span>
                        <span className="text-[#C5A367] font-black">{product.price} ETB</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center bg-[#C5A367]/5 p-3 rounded-2xl">
                       <div className="flex flex-col">
                           <span className="text-[9px] font-black text-[#C5A367]/60 uppercase tracking-widest">Lead Time</span>
                           <span className="text-xs font-bold text-[#F5EFE0]">{product.leadTime || "N/A"}</span>
                       </div>
                       <div className="flex flex-col text-right">
                           <span className="text-[9px] font-black text-[#C5A367]/60 uppercase tracking-widest">Size</span>
                           <span className="text-xs font-bold text-[#F5EFE0]">{product.sizeWeight || "N/A"}</span>
                       </div>
                    </div>

                    <div className="flex gap-3 w-full">
                       <button
                         onClick={() => {
                           setEditingProduct(product);
                           setFormData({ ...product });
                           setIsModalOpen(true);
                         }}
                         className="flex-1 rounded-xl bg-[#C5A367]/10 text-[#C5A367] hover:bg-[#C5A367] hover:text-[#0B2421] font-black uppercase tracking-widest py-3 text-xs flex items-center justify-center gap-2 transition-all border border-[#C5A367]/30"
                       >
                         <Edit2 className="w-4 h-4" /> Edit
                       </button>
                       <button
                         onClick={() => handleDelete(product._id)}
                         className="flex-1 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white font-black uppercase tracking-widest py-3 text-xs flex items-center justify-center gap-2 transition-all border border-red-500/30"
                       >
                         <Trash2 className="w-4 h-4" /> Delete
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* --- SUBCATEGORY MODAL --- */}
      {isSubCatModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#08120F]/90 backdrop-blur-sm" onClick={() => setIsSubCatModalOpen(false)} />
          <div className="relative z-[2110] w-full max-w-xl bg-[#0B2421] border border-[#C5A367]/30 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-[#C5A367]/10 flex items-center justify-between">
              <h2 className="text-2xl font-serif font-black text-[#C5A367] uppercase tracking-widest">
                {editingSubCat ? "Edit Category" : "New Category"}
              </h2>
              <button onClick={() => setIsSubCatModalOpen(false)} className="text-[#C5A367] hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubCatSubmit} className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Category Name</label>
                <input required type="text" value={subCatFormData.name} onChange={(e) => setSubCatFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Parent Section</label>
                <select value={subCatFormData.parentSection} onChange={(e) => setSubCatFormData(p => ({ ...p, parentSection: e.target.value as any }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none">
                  <option value="Coffee">Coffee</option>
                  <option value="Cake">Cake</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest block">Cover Image</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} className="hidden" id="sub-image-upload" />
                    <label htmlFor="sub-image-upload" className="flex items-center justify-center gap-3 w-full bg-[#C5A367]/10 border border-[#C5A367] border-dashed rounded-xl px-4 py-4 text-[#C5A367] cursor-pointer hover:bg-[#C5A367]/20 transition-all">
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="text-xs font-black uppercase tracking-widest">Upload Cover</span>
                    </label>
                  </div>
                  {subCatFormData.coverImage && (
                    <div className="w-16 h-16 rounded-xl border border-[#C5A367] overflow-hidden shrink-0">
                      <img src={subCatFormData.coverImage} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>
              <button type="submit" disabled={uploading} className="w-full py-4 bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-[#F3E5AB]">
                {editingSubCat ? "Update Category" : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- PRODUCT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6 mt-16 overflow-y-auto">
          <div className="fixed inset-0 bg-[#08120F]/90 backdrop-blur-sm pointer-events-auto" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-[2110] w-full max-w-4xl bg-[#0B2421] border border-[#C5A367]/30 rounded-[32px] shadow-2xl overflow-hidden my-auto animate-fade-in-up">
            <div className="sticky top-0 p-8 border-b border-[#C5A367]/10 flex items-center justify-between bg-[#0B2421] z-10">
              <h2 className="text-2xl font-serif font-black text-[#C5A367] uppercase tracking-widest">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#C5A367] hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="max-h-[75vh] overflow-y-auto w-full no-scrollbar">
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                        <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Product Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Parent Category</label>
                                <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any, subCategory: "" }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none">
                                <option value="Coffee">Coffee</option>
                                <option value="Cake">Cake</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Sub-Category</label>
                                <select required value={formData.subCategory} onChange={(e) => setFormData(p => ({ ...p, subCategory: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none">
                                    <option value="" disabled>Select...</option>
                                    {availableSubCatsForForm.map(sc => (
                                        <option key={sc._id} value={sc.name}>{sc.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Price (ETB)</label>
                                <input required type="number" value={formData.price} onChange={(e) => setFormData(p => ({ ...p, price: Number(e.target.value) }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0]" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Size/Weight</label>
                                <input type="text" placeholder="e.g. 500g, 12 Slices" value={formData.sizeWeight} onChange={(e) => setFormData(p => ({ ...p, sizeWeight: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0]" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Lead Time</label>
                                <input type="text" placeholder="e.g. Order 3 days in adv." value={formData.leadTime} onChange={(e) => setFormData(p => ({ ...p, leadTime: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0]" />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Shelf Life</label>
                                <input type="text" placeholder="e.g. 1 Month" value={formData.shelfLife} onChange={(e) => setFormData(p => ({ ...p, shelfLife: e.target.value }))} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0]" />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Info & Upload */}
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Product Image</label>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1 relative z-10">
                                <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, false)} className="hidden" id="prod-image-upload" />
                                <label htmlFor="prod-image-upload" className="flex items-center justify-center gap-3 w-full bg-[#C5A367]/5 border border-[#C5A367]/50 border-dashed rounded-xl px-4 py-6 text-[#C5A367] cursor-pointer hover:bg-[#C5A367]/20 transition-all">
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                    <span className="text-xs font-black uppercase tracking-widest">Upload Image</span>
                                </label>
                                </div>
                                {formData.image && (
                                <div className="w-24 h-24 rounded-xl border border-[#C5A367] overflow-hidden shrink-0">
                                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Short Description</label>
                            <textarea maxLength={200} value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] resize-none text-sm" />
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-[#C5A367] uppercase tracking-widest">Ingredients (Detailed)</label>
                            <textarea value={formData.ingredients} onChange={(e) => setFormData(p => ({ ...p, ingredients: e.target.value }))} rows={4} className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] resize-none text-sm" />
                        </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-[#C5A367]/10 sticky bottom-0 bg-[#0B2421] z-10 mt-8">
                    <button type="submit" disabled={uploading} className="w-full py-5 bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-sm rounded-xl hover:bg-[#F3E5AB]">
                        {editingProduct ? "Update Product" : "Save Product"}
                    </button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
