"use client";

import { AnimatePresence } from "framer-motion";
import { SwipeCard } from "./SwipeCard";
import { ActionButtons } from "./ActionButtons";
import { ProgressBar } from "./ProgressBar";
import { DetailModal } from "./DetailModal";
import { useSwipeStore } from "@/store/swipeStore";
import { useState } from "react";
import type { SwipeChoice } from "@/lib/types";

export function SwipeDeck() {
  const { items, currentIndex, isComplete, recordSwipe } = useSwipeStore();
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  function handleSwipe(direction: "left" | "right") {
    const choice: SwipeChoice = direction === "right" ? "yes" : "no";
    recordSwipe(choice);
  }

  function handleAction(choice: SwipeChoice) {
    recordSwipe(choice);
  }

  if (isComplete || !currentItem) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <ProgressBar current={currentIndex} total={items.length} />

      <div className="flex-1 relative px-4 py-4 min-h-0">
        <div className="relative w-full h-full max-w-md mx-auto" style={{ maxHeight: "70vh" }}>
          <AnimatePresence mode="popLayout">
            {nextItem && (
              <SwipeCard
                key={`card-${currentIndex + 1}`}
                item={nextItem}
                onSwipe={() => {}}
                onExpand={() => {}}
                isTop={false}
              />
            )}
            <SwipeCard
              key={`card-${currentIndex}`}
              item={currentItem}
              onSwipe={handleSwipe}
              onExpand={() => setExpandedItem(currentIndex)}
              isTop={true}
            />
          </AnimatePresence>
        </div>
      </div>

      <ActionButtons onAction={handleAction} />

      <AnimatePresence>
        {expandedItem !== null && items[expandedItem] && (
          <DetailModal
            item={items[expandedItem]}
            onClose={() => setExpandedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
