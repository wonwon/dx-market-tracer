"use client";

import { useState, useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import Watchlist from "@/components/dashboard/Watchlist";
import IntelligenceGrid from "@/components/dashboard/IntelligenceGrid";
import MainChart from "@/components/dashboard/MainChart";
import NewsList from "@/components/dashboard/NewsList";
import LeftRail from "@/components/dashboard/LeftRail";
import CommandPalette from "@/components/dashboard/CommandPalette";
import CategoryRail from "@/components/dashboard/CategoryRail";

export default function DashboardPage() {
  const { selectedTicker } = useStockStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      <CommandPalette />
      
      {/* 0. Left Rail (72px) - Global Nav */}
      <LeftRail />

      {/* 0.5 Category Rail (Genre Menu) */}
      <CategoryRail />

      {/* 1. Left Column: Watchlist (Fixed Width) */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
        <Watchlist />
      </aside>

      {/* 2. Middle Column: Market Intelligence */}
      <aside className="w-80 flex-shrink-0 border-r border-slate-200 overflow-y-auto bg-white flex flex-col">
        <IntelligenceGrid />
      </aside>

      {/* 3. Right Column: Chart & News (Remaining Space flex-1) */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Pane 3: Main Chart (60%) */}
        <div className="h-[60%] border-b border-slate-200 shadow-sm relative z-0">
          <MainChart />
        </div>
        {/* Pane 4: News & Links (40%) */}
        <div className="h-[40%] overflow-y-auto">
          <NewsList />
        </div>
      </main>
    </div>
  );
}
