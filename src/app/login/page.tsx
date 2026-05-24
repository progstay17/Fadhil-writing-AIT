"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, RotateCcw } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Apply theme on mount
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (stored === "dark" || (!stored && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Check if already logged in
    fetch("/api/auth/me")
      .then(res => { if (res.ok) router.push("/"); });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/");
      } else {
        setError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (_err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] transition-colors p-4">
      <div className="max-w-md w-full space-y-8 bg-[#111111] p-8 rounded-sm border border-[#2a2a2a] border-l-2 border-l-[#cc2200]">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            <span className="font-['Noto_Serif_SC']">潮际好麦</span> <span className="font-['JetBrains_Mono'] text-[#cc2200]">AIT 写作</span>
          </h1>
          <p className="mt-2 text-[10px] text-[#888888] uppercase tracking-widest">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1 font-['JetBrains_Mono']">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[#555555]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-[#2a2a2a] rounded-sm placeholder-[#555555] text-white bg-[#1a1a1a] focus:outline-none focus:border-[#cc2200] focus:ring-1 focus:ring-[#cc2200] transition-all sm:text-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1 font-['JetBrains_Mono']">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[#555555]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-[#2a2a2a] rounded-sm placeholder-[#555555] text-white bg-[#1a1a1a] focus:outline-none focus:border-[#cc2200] focus:ring-1 focus:ring-[#cc2200] transition-all sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-[#ff6b6b] text-sm bg-[#1a0000] p-3 rounded-sm border border-[#cc2200]">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-sm text-white bg-[#cc2200] hover:bg-[#991a00] focus:outline-none focus:ring-1 focus:ring-[#cc2200] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_#cc220033]"
            >
              {loading ? (
                <RotateCcw size={18} className="animate-spin text-white" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <hr className="border-[#2a2a2a]" />

        <div className="pt-4 text-center">
          <p className="text-[10px] text-[#555555] uppercase tracking-widest font-['JetBrains_Mono']">
            © 2026 潮际好麦 AIT
          </p>
        </div>
      </div>
    </div>
  );
}
