"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { SwipeItem } from "@/lib/types";
import { useState } from "react";

interface SwipeCardProps {
  item: SwipeItem;
  onSwipe: (direction: "left" | "right") => void;
  onExpand: () => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;

export function SwipeCard({ item, onSwipe, onExpand, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const opacity = useTransform(x, [-300, -100, 0, 100, 300], [0.5, 1, 1, 1, 0.5]);
  const yesOpacity = useTransform(x, [0, 80], [0, 1]);
  const noOpacity = useTransform(x, [-80, 0], [1, 0]);
  const [isDragging, setIsDragging] = useState(false);

  const isCandidate = item.type === "candidate";

  function handleDragEnd(_: unknown, info: PanInfo) {
    setIsDragging(false);
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe("right");
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe("left");
    }
  }

  const topics = item.data.topics.slice(0, 3);
  const title = isCandidate ? item.data.name : item.data.title;
  const subtitle = isCandidate
    ? `${item.data.office} · ${item.data.jurisdiction.name}`
    : `${item.data.jurisdiction.name}${item.type === "measure" && item.data.category ? ` · ${item.data.category}` : ""}`;
  const badge = isCandidate ? item.data.party : item.type === "measure" ? item.data.measureCode : undefined;

  return (
    <motion.div
      className={`absolute inset-0 ${isTop ? "z-10" : "z-0"}`}
      style={{ x, rotate, opacity }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
      initial={isTop ? { scale: 1 } : { scale: 0.95, y: 12 }}
      animate={isTop ? { scale: 1, y: 0 } : { scale: 0.95, y: 12 }}
      exit={{
        x: x.get() > 0 ? 400 : -400,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      {/* Swipe indicator overlays */}
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-emerald-500/20 pointer-events-none"
        style={{ opacity: yesOpacity }}
      >
        <div className="rounded-xl border-4 border-emerald-500 px-6 py-3 rotate-[-12deg]">
          <span className="text-4xl font-bold text-emerald-500">YES</span>
        </div>
      </motion.div>
      <motion.div
        className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-rose-500/20 pointer-events-none"
        style={{ opacity: noOpacity }}
      >
        <div className="rounded-xl border-4 border-rose-500 px-6 py-3 rotate-[12deg]">
          <span className="text-4xl font-bold text-rose-500">NOPE</span>
        </div>
      </motion.div>

      {/* Card content */}
      <div
        className="h-full w-full rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden flex flex-col cursor-grab active:cursor-grabbing select-none"
        onClick={() => { if (!isDragging) onExpand(); }}
      >
        {/* Header accent */}
        <div className={`h-2 w-full ${isCandidate ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-gradient-to-r from-amber-400 to-orange-500"}`} />

        {/* Type badge */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2">
          <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${isCandidate ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-700"}`}>
            {isCandidate ? "Candidate" : "Measure"}
          </span>
          {badge && <span className="text-xs font-medium text-slate-400">{badge}</span>}
        </div>

        {/* Title */}
        <div className="px-5 pb-2">
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        {/* Summary */}
        <div className="px-5 pb-4 flex-1">
          <p className="text-base text-slate-700 leading-relaxed">{item.data.shortSummary}</p>

          {/* Yes/No framing for measures */}
          {item.type === "measure" && (item.data.yesMeans || item.data.noMeans) && (
            <div className="mt-4 space-y-2">
              {item.data.yesMeans && (
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">Y</span>
                  <p className="text-sm text-slate-600">{item.data.yesMeans}</p>
                </div>
              )}
              {item.data.noMeans && (
                <div className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">N</span>
                  <p className="text-sm text-slate-600">{item.data.noMeans}</p>
                </div>
              )}
            </div>
          )}

          {/* Stances for candidates */}
          {item.type === "candidate" && item.data.stances.length > 0 && (
            <div className="mt-4 space-y-2">
              {item.data.stances.slice(0, 2).map((stance) => (
                <div key={stance.id} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <p className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700">{stance.topic}:</span> {stance.summary}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topics */}
        {topics.length > 0 && (
          <div className="px-5 pb-4 flex flex-wrap gap-1.5">
            {topics.map((topic) => (
              <span key={topic.id} className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
                {topic.icon && `${topic.icon} `}{topic.name}
              </span>
            ))}
          </div>
        )}

        <div className="px-5 pb-4 flex items-center justify-center">
          <span className="text-xs text-slate-400">Tap for details</span>
        </div>
      </div>
    </motion.div>
  );
}
