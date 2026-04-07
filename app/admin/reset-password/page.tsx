"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const defaultEmail = searchParams.get("email");
    if (defaultEmail) setEmail(defaultEmail);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Password reset successfully. You may now log in.");
        router.push("/admin");
      } else {
        setError(data.error || "Failed to reset password. The OTP might be expired.");
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
          <h1 className="text-3xl font-serif text-accent-gold mb-2 uppercase tracking-widest">Verify OTP</h1>
          <p className="text-accent-gold/60 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
            Enter the 6-digit code sent to your email to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-accent-gold/60 font-bold mb-2 ml-4">Email</label>
            <input
              type="email"
              required
              readOnly
              value={email}
              className="w-full bg-zinc-950/50 border border-accent-gold/10 rounded-full py-3 px-6 text-center text-sm tracking-widest text-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-accent-gold/60 font-bold mb-2 ml-4">6-Digit OTP</label>
            <input
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="123456"
              className="w-full bg-zinc-950 border border-accent-gold/20 rounded-full py-4 px-6 text-center text-2xl tracking-[1em] text-accent-gold focus:outline-none focus:border-accent-gold transition-all placeholder:text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-accent-gold/60 font-bold mb-2 ml-4">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-accent-gold/20 rounded-full py-3 px-6 text-center text-lg tracking-widest text-accent-gold focus:outline-none focus:border-accent-gold transition-all placeholder:text-zinc-800"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-accent-gold/60 font-bold mb-2 ml-4">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-zinc-950 border border-accent-gold/20 rounded-full py-3 px-6 text-center text-lg tracking-widest text-accent-gold focus:outline-none focus:border-accent-gold transition-all placeholder:text-zinc-800"
            />
          </div>

          {error && <p className="text-red-500 text-center text-[10px] uppercase tracking-widest font-bold pt-2">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6 || !newPassword}
            className="w-full bg-accent-gold text-zinc-950 py-4 rounded-full font-black uppercase tracking-[0.3em] text-xs hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(212,175,55,0.3)] flex justify-center items-center mt-4"
          >
            {isLoading ? "Verifying..." : "Reset Password"}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-zinc-600 text-[10px] uppercase tracking-widest font-bold cursor-pointer hover:text-accent-gold transition-colors" onClick={() => router.push("/admin/forgot-password")}>
        ← Back to Email Input
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1a1a1a] text-accent-gold flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
