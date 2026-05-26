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
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const theme = stored === "light" ? "light" : "dark";
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
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] transition-all duration-1000 p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 manuscript-grid pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full flex bg-[var(--color-surface)] shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Left Side: Editorial Branding */}
        <div className="hidden md:flex w-1/3 bg-[var(--color-ink-wash)] border-r border-[var(--color-border)] p-8 flex-col justify-between items-center relative">
           <div className="vertical-text text-2xl font-['Noto_Serif_SC'] font-black tracking-[0.5em] text-[var(--color-text)] opacity-80 pt-4">
             潮际好麦 · 智能写作
           </div>

           <div className="seal w-12 h-12 text-sm leading-tight">
             潮际<br/>好麦
           </div>

           <div className="section-label vertical-text opacity-40">
             SINCE 2026 / EDITION 01
           </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-8 md:p-12 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-['JetBrains_Mono'] text-[80px] leading-none pointer-events-none select-none">
            AIT
          </div>

          <div className="mb-12">
            <motion.div
              variants={STAGGER_CONTAINER}
              initial="initial"
              animate="animate"
              className="space-y-1"
            >
              <motion.div variants={FADE_UP} className="flex items-center space-x-3">
                <div className="w-8 h-[2px] bg-[var(--color-accent)]" />
                <span className="section-label">SYSTEM ACCESS</span>
              </motion.div>
              <motion.h1 variants={FADE_UP} className="text-4xl font-['Noto_Serif_SC'] font-bold text-[var(--color-text)]">
                登录 <span className="text-[var(--color-accent)] font-['JetBrains_Mono']">SIGN IN</span>
              </motion.h1>
            </motion.div>
          </div>

          <form className="space-y-6 relative" onSubmit={handleLogin}>
            <motion.div variants={STAGGER_CONTAINER} initial="initial" animate="animate" className="space-y-5">
              <motion.div variants={FADE_UP}>
                <label htmlFor="username" className="section-label mb-2 block">
                  USER IDENTIFIER
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                    <User size={16} className="text-[var(--color-accent)]" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none block w-full pl-7 py-3 placeholder-[var(--color-text-dim)] transition-all bg-transparent border-b border-[var(--color-border-2)] focus:border-[var(--color-accent)] rounded-none"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <label htmlFor="password" className="section-label mb-2 block">
                  ACCESS CREDENTIAL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-0 flex items-center pointer-events-none">
                    <Lock size={16} className="text-[var(--color-accent)]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none block w-full pl-7 py-3 placeholder-[var(--color-text-dim)] transition-all bg-transparent border-b border-[var(--color-border-2)] focus:border-[var(--color-accent)] rounded-none"
                    placeholder="Password"
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
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center space-x-2 text-[var(--color-accent)] text-xs font-['JetBrains_Mono'] bg-[var(--color-ink-wash)] p-3 border-l-2 border-[var(--color-accent)]"
                >
                  <AlertCircle size={14} className="flex-shrink-0" />
                  <span>{error.toUpperCase()}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-4">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ x: 4 }}
                className="group relative w-full flex items-center justify-between py-4 px-6 bg-[var(--color-text)] text-[var(--color-bg)] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] outline-none"
              >
                <span className="font-['JetBrains_Mono'] tracking-tighter">AUTHENTICATE_SESSION</span>
                {loading ? (
                  <RotateCcw size={20} className="animate-spin" />
                ) : (
                  <div className="flex items-center">
                    <div className="w-12 h-[1px] bg-[var(--color-bg)] opacity-30 mr-4" />
                    <span className="text-xl">→</span>
                  </div>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-16 flex justify-between items-end">
            <div className="section-label opacity-30">
              EST. 2026
            </div>
            <div className="font-['JetBrains_Mono'] text-[10px] text-[var(--color-text-dim)] tracking-widest text-right">
              CHAOJI HAOMAI<br/>
              SECURE ACCESS NODE
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
