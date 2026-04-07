"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      
      if (res.ok) {
        // Redirect to reset password regardless of actual email existence
        // to prevent email enumeration
        router.push(`/admin/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        const data = await res.json();
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 tilet-pattern">
      <div className="max-w-md w-full bg-zinc-900/80 backdrop-blur-xl p-8 rounded-2xl border border-accent-gold/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none tilet-pattern" />
        
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-serif text-accent-gold mb-2 uppercase tracking-widest">Forgot Password</h1>
          <p className="text-accent-gold/60 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
            Enter your admin email. If it exists in our system, we will send you a 6-digit OTP.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-accent-gold/60 font-bold mb-2 ml-4">Admin Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abayhotel.com"
              className="w-full bg-zinc-950 border border-accent-gold/20 rounded-full py-4 px-6 text-center text-sm md:text-lg tracking-widest text-accent-gold focus:outline-none focus:border-accent-gold transition-all placeholder:text-zinc-800"
            />
          </div>

          {error && <p className="text-red-500 text-center text-[10px] uppercase tracking-widest font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-accent-gold text-zinc-950 py-4 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex justify-center items-center"
          >
            {isLoading ? "Sending OTP..." : "Request Reset"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-zinc-600 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:text-accent-gold transition-colors" onClick={() => router.push("/admin")}>
        ← Back to Login
      </p>
    </div>
  );
}
