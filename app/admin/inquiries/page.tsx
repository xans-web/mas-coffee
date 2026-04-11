"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/Sidebar";
import { Trash2, Mail, User, Phone, Calendar, Loader2, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read';
  createdAt: string;
}

export default function InquiryManager() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin");
    } else {
      fetchInquiries();
    }
  }, [router]);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/inquiries');
      const data = await res.json();
      setInquiries(data);
    } catch (error) {
      console.error("Failed to fetch inquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (inquiry: Inquiry) => {
    const newStatus = inquiry.status === 'new' ? 'read' : 'new';
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: inquiry._id, status: newStatus })
      });
      if (res.ok) {
        toast.success("Status updated.");
        fetchInquiries();
      } else {
        toast.error("Could not update status.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Could not update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      const res = await fetch(`/api/admin/inquiries?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Inquiry deleted.");
        fetchInquiries();
      } else {
        toast.error("Could not delete inquiry.");
      }
    } catch (error) {
      console.error("Failed to delete inquiry:", error);
      toast.error("Could not delete inquiry.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2421] text-[#F5EFE0] flex font-inter">
      <AdminSidebar />
      
      <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto">
        <header className="mb-12 border-b border-[#C5A367]/20 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-black text-[#C5A367] uppercase tracking-widest mb-4">
              Inquiries
            </h1>
            <p className="text-[#F5EFE0]/60 font-inter uppercase tracking-[0.2em] text-xs">
              Review and manage customer inquiries from the website.
            </p>
          </div>
          <div className="text-right">
            <span className="text-[#C5A367] font-black text-3xl">{inquiries.filter(i => i.status === 'new').length}</span>
            <p className="text-[10px] font-black text-[#C5A367]/60 uppercase tracking-widest">New Messages</p>
          </div>
        </header>

        <div className="space-y-6">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-10 h-10 text-[#C5A367] animate-spin" />
              <p className="text-[#C5A367] font-black uppercase tracking-widest text-xs">Fetching Inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-20 text-center bg-[#C5A367]/5 rounded-3xl border border-[#C5A367]/10">
              <p className="text-[#F5EFE0]/40 italic font-serif text-xl">No inquiries found yet.</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div 
                key={inquiry._id} 
                className={`bg-[#0B2421] border transition-all rounded-2xl overflow-hidden shadow-xl ${
                  inquiry.status === 'new' ? 'border-[#C5A367]' : 'border-[#C5A367]/20 opacity-80'
                }`}
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {inquiry.status === 'new' ? (
                          <div className="bg-[#C5A367] text-[#0B2421] px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">NEW</div>
                        ) : null}
                        <h3 className="text-xl font-playfair font-black text-[#C5A367] uppercase tracking-wider">
                          {inquiry.subject || "No Subject"}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div className="flex items-center gap-2 text-xs text-[#F5EFE0]/60">
                          <User className="w-3 h-3 text-[#C5A367]" />
                          <span className="font-bold">{inquiry.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#F5EFE0]/60">
                          <Mail className="w-3 h-3 text-[#C5A367]" />
                          <span>{inquiry.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#F5EFE0]/60">
                          <Phone className="w-3 h-3 text-[#C5A367]" />
                          <span>{inquiry.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#F5EFE0]/60">
                          <Calendar className="w-3 h-3 text-[#C5A367]" />
                          <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button 
                        onClick={() => toggleStatus(inquiry)}
                        className={`p-3 rounded-xl border transition-all ${
                          inquiry.status === 'new' 
                          ? 'bg-[#C5A367] text-[#0B2421] border-[#C5A367]' 
                          : 'bg-[#C5A367]/10 text-[#C5A367] border-[#C5A367]/20 hover:bg-[#C5A367]/20'
                        }`}
                        title={inquiry.status === 'new' ? "Mark as Read" : "Mark as Unread"}
                      >
                        {inquiry.status === 'new' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </button>
                      <button 
                        onClick={() => handleDelete(inquiry._id)}
                        className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-black/20 rounded-xl p-6 border border-[#C5A367]/10">
                    <p className="text-sm text-[#F5EFE0]/80 leading-relaxed italic whitespace-pre-wrap">
                      "{inquiry.message}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
