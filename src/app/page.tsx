"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 min-h-screen bg-gradient-to-b from-slate-50 via-white to-indigo-50/30">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo / Brand */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-xl shadow-indigo-200/50 mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 12l2 2 4-4" />
              <rect x="3" y="3" width="18" height="18" rx="4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Ballot Binge
          </h1>
          <p className="text-lg text-slate-500 mt-2 font-medium">
            Know your ballot
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-base text-slate-600 leading-relaxed mb-10 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Swipe through candidates and ballot measures to build your personalized
          voter guide. Quick, easy, and non-partisan.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => router.push("/swipe")}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-base shadow-lg shadow-indigo-300/40 hover:shadow-xl hover:shadow-indigo-300/50 active:scale-[0.98] transition-all"
          >
            Start swiping
          </button>
          <p className="text-xs text-slate-400 mt-4">
            No sign-up required &middot; Takes about 2 minutes
          </p>
        </motion.div>

        {/* How it works */}
        <motion.div
          className="mt-14 grid grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-xs font-medium text-slate-600">Read the card</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
            <p className="text-xs font-medium text-slate-600">Swipe your choice</p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <p className="text-xs font-medium text-slate-600">Get your guide</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
