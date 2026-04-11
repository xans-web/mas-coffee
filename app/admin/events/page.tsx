"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { Plus, Edit2, Trash2, Calendar, Loader2, X, Upload, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { uploadMainSiteImage } from "@/lib/cloudinaryUpload";

interface Event {
  _id: string;
  name: string;
  date: string;
  description: string;
  image: string;
  createdAt: string;
}

export default function EventManager() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    } else {
      fetchEvents();
    }
  }, [router]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
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
        toast.success("Event image uploaded.");
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
    console.log("Saving event with data:", formData);
    
    if (!formData.image) {
      toast.error("Upload an image first.");
      return;
    }

    const method = editingEvent ? 'PUT' : 'POST';
    const body = editingEvent ? { ...formData, _id: editingEvent._id } : formData;

    try {
      console.log(`Sending ${method} request to /api/admin/events...`);
      const res = await fetch('/api/admin/events', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const responseData = await res.json();
      console.log("Event API Response:", responseData);

      if (res.ok) {
        toast.success(editingEvent ? "Event updated." : "Event saved.");
        setIsModalOpen(false);
        setEditingEvent(null);
        setFormData({ name: "", date: "", description: "", image: "" });
        fetchEvents();
      } else {
        toast.error(responseData.error || "Failed to save event");
      }
    } catch (error) {
      console.error("Event Submit Error:", error);
      toast.error("Error saving event.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Event deleted.");
        fetchEvents();
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Error deleting event.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2421] text-[#F5EFE0] flex font-inter">
      <AdminSidebar />
      
      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-12 border-b border-[#C5A367]/20 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-[#C5A367] uppercase tracking-widest mb-4">
              Event Manager
            </h1>
            <p className="text-[#F5EFE0]/60 font-inter uppercase tracking-[0.2em] text-xs">
              Manage upcoming events and special announcements.
            </p>
          </div>
          <button 
            onClick={() => {
              setEditingEvent(null);
              setFormData({ name: "", date: "", description: "", image: "" });
              setIsModalOpen(true);
            }}
            className="bg-[#C5A367] text-[#0B2421] px-6 py-3 rounded-lg font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-[#F3E5AB] transition-all shadow-xl"
          >
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-[#C5A367] animate-spin" />
              <p className="text-[#C5A367] font-black uppercase tracking-widest text-xs">Loading Events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="col-span-full p-20 text-center bg-[#C5A367]/5 rounded-3xl border border-[#C5A367]/10">
              <p className="text-[#F5EFE0]/40 italic font-serif text-xl">No upcoming events scheduled.</p>
            </div>
          ) : (
            events.map((event) => (
              <div key={event._id} className="group bg-[#0B2421] border border-[#C5A367]/20 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-[#C5A367]/40">
                <div className="aspect-video relative overflow-hidden">
                  <img src={event.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={event.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2421] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingEvent(event);
                        setFormData({ ...event });
                        setIsModalOpen(true);
                      }}
                      className="p-3 bg-[#0B2421]/80 backdrop-blur-md text-[#C5A367] rounded-full border border-[#C5A367]/30 hover:bg-[#C5A367] hover:text-[#0B2421] transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      className="p-3 bg-red-500/80 backdrop-blur-md text-white rounded-full border border-red-500/30 hover:bg-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A367]" />
                      <span className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">{event.date}</span>
                    </div>
                    <h3 className="text-2xl font-playfair font-black text-white uppercase tracking-wider">{event.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-[#F5EFE0]/60 italic font-inter line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#08120F]/90 backdrop-blur-sm z-[2100]" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-[2110] w-full max-w-2xl bg-[#0B2421] border border-[#C5A367]/30 rounded-[32px] shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="p-8 border-b border-[#C5A367]/10 flex items-center justify-between">
              <h2 className="text-2xl font-playfair font-black text-[#C5A367] uppercase tracking-widest">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#C5A367] hover:rotate-90 transition-transform">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Event Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Date & Time</label>
                  <input 
                    required
                    type="text" 
                    value={formData.date}
                    onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                    placeholder="e.g. June 15, 2024 at 7:00 PM"
                    className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest">Event Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={4}
                  className="w-full bg-[#0B2421] border border-[#C5A367]/20 rounded-xl px-4 py-3 text-[#F5EFE0] focus:border-[#C5A367] outline-none transition-all resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#C5A367] uppercase tracking-widest block">Event Image</label>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 relative z-[110]">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden" 
                      id="event-upload"
                    />
                    <label 
                      htmlFor="event-upload"
                      className="flex items-center justify-center gap-2 w-full bg-[#C5A367]/10 border-2 border-[#C5A367] border-dashed rounded-xl px-4 py-4 text-[#C5A367] cursor-pointer hover:bg-[#C5A367]/20 transition-all opacity-100 visible z-[120]"
                      style={{ display: 'flex', opacity: 1, visibility: 'visible' }}
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">Upload Image</span>
                    </label>
                  </div>
                  {formData.image && (
                    <div className="w-16 h-16 rounded-lg border-2 border-[#C5A367] overflow-hidden shadow-lg flex-shrink-0">
                      <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                disabled={uploading}
                className="w-full py-5 bg-[#C5A367] text-[#0B2421] font-black uppercase tracking-[0.3em] text-xs rounded-xl hover:bg-[#F3E5AB] transition-all shadow-2xl opacity-100 visible z-[120] border-2 border-[#C5A367] disabled:opacity-50"
                style={{ display: 'block', opacity: 1, visibility: 'visible' }}
              >
                {editingEvent ? "Update Event" : "Save Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
