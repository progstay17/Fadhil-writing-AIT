"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, AlertCircle, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FADE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35 }
};

const STAGGER_CONTAINER = {
  animate: { transition: { staggerChildren: 0.07 } }
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");

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
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] transition-colors p-4">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-[var(--color-surface)] p-8 rounded-sm border border-[var(--color-border)] border-l-2 border-l-[#cc2200]"
      >
        <div className="text-center">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="initial"
            animate="animate"
            className="text-3xl font-extrabold text-white tracking-tight"
          >
            <motion.span variants={FADE_UP} className="font-['Noto_Serif_SC']">潮际好麦</motion.span>
            <motion.span variants={FADE_UP} className="font-['JetBrains_Mono'] text-[#cc2200]"> AIT 写作</motion.span>
          </motion.div>
          <p className="mt-2 text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">
            Please sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="space-y-4">
            <motion.div variants={FADE_UP}>
              <label htmlFor="username" className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1 font-['JetBrains_Mono']">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-[var(--color-text-dim)]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-[var(--color-border)] rounded-sm placeholder-[var(--color-text-dim)] text-white bg-[var(--color-surface-2)] focus:outline-none focus:border-[#cc2200] focus:ring-1 focus:ring-[#cc2200] transition-all sm:text-sm"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </motion.div>

            <motion.div variants={FADE_UP}>
              <label htmlFor="password" className="block text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-1 font-['JetBrains_Mono']">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-[var(--color-text-dim)]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-3 border border-[var(--color-border)] rounded-sm placeholder-[var(--color-text-dim)] text-white bg-[var(--color-surface-2)] focus:outline-none focus:border-[#cc2200] focus:ring-1 focus:ring-[#cc2200] transition-all sm:text-sm"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center space-x-2 text-[#ff6b6b] text-sm bg-[#1a0000] p-3 rounded-sm border border-[#cc2200] overflow-hidden"
              >
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-sm text-white bg-[#cc2200] hover:bg-[#991a00] focus:outline-none focus:ring-1 focus:ring-[#cc2200] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_#cc220033]"
            >
              {loading ? (
                <RotateCcw size={18} className="animate-spin text-white" />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </div>
        </form>

        <hr className="border-[var(--color-border)]" />

        <div className="pt-4 text-center">
          <p className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-['JetBrains_Mono']">
            © 2026 潮际好麦 AIT
          </p>
        </div>
      </motion.div>
    </div>
  );
}
