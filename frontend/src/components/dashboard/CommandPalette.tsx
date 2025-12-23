"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useStockStore } from "@/store/useStockStore";

export default function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const { setSelectedTicker, addToWatchlist } = useStockStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.match(/^\d{4}$/)) {
      setSelectedTicker(query);
      addToWatchlist(query);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
        <form onSubmit={handleSearch} className="flex items-center p-4 gap-3 border-b border-slate-100">
          <Search className="text-slate-400" size={20} />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-lg"
            placeholder="Search stock code (e.g. 7203)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </form>
        <div className="p-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
          Press ESC to close
        </div>
      </div>
    </div>
  );
}
