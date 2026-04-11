"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verifyLogin", password })
      });

      if (res.ok) {
        localStorage.setItem("admin_authenticated", "true");
        router.push("/admin/products");
      } else {
        const data = await res.json();
        setError(data.error || "Incorrect Password. Please try again.");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B2421] flex flex-col items-center justify-center p-4 tilet-pattern">
      <div className="max-w-md w-full bg-[#0B2421]/95 backdrop-blur-xl p-8 rounded-2xl border border-[#C5A367]/20 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none tilet-pattern" />

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-4xl font-serif text-[#C5A367] mb-2 uppercase tracking-widest">Mas Coffee</h1>
          <p className="text-[#C5A367]/60 text-xs uppercase tracking-[0.3em]">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#C5A367]/60 font-bold mb-2 ml-4">Enter Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0B2421] border border-[#C5A367]/30 rounded-full py-4 px-6 text-center text-2xl tracking-[0.5em] text-[#F5EFE0] focus:outline-none focus:border-[#C5A367] transition-all placeholder:text-[#F5EFE0]/30"
            />
          </div>

          {error && <p className="text-red-500 text-center text-[10px] uppercase tracking-widest font-bold">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C5A367] text-[#0B2421] py-4 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(197,163,103,0.3)] flex justify-center items-center"
          >
            {isLoading ? "Authenticating..." : "Authenticate"}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col items-center gap-4">
        <p className="text-[#F5EFE0]/40 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:text-[#C5A367] transition-colors" onClick={() => router.push("/admin/forgot-password")}>
          Forgot Password?
        </p>
        <p className="text-[#F5EFE0]/30 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:text-[#C5A367] transition-colors" onClick={() => router.push("/")}>
          ← Back to Restaurant Menu
        </p>
      </div>
    </div>
  );
}
