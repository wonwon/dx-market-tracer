"use client";

import { useState, useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import { X, Plus, ListPlus, Trash2 } from "lucide-react";

export default function Watchlist() {
  const { 
    categories,
    activeCategoryId,
    selectedTicker, 
    setSelectedTicker, 
    addTickers, 
    removeFromWatchlist, 
    updateWatchlistItem,
    clearWatchlist 
  } = useStockStore();
  
  const [input, setInput] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];
  const watchlist = activeCategory.items;
  const watchlistCodes = watchlist.map(i => i.code).join(',');

  // Fetch missing metadata for active category items
  useEffect(() => {
    watchlist.forEach(async (item) => {
      if (!item.code) return;
      if (!item.name || !item.price) {
        try {
          const resp = await fetch(`http://127.0.0.1:8000/stocks/${item.code}`);
          if (resp.ok) {
            const data = await resp.json();
            updateWatchlistItem(item.code, {
              name: data.name,
              price: data.current_price,
              change: `${data.change} (${data.change_percent}%)`,
              industry: data.industry || "市場情報",
              vwap: data.vwap
            });
          }
        } catch (e) {
          console.error(`Failed to fetch metadata for ${item.code}`, e);
        }
      }
    });
  }, [watchlistCodes, updateWatchlistItem]);

  const handleBulkAdd = () => {
    const tickers = input
      .split(/[\s,、\n]+/)
      .map(t => t.trim())
      .filter(t => /^\d{4}$/.test(t) || /^[A-Z]{1,5}$/.test(t));
    
    if (tickers.length > 0) {
      addTickers(tickers);
      setInput("");
      setShowBulk(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-slate-700 uppercase tracking-tighter truncate max-w-[120px]">
            {activeCategory.name}
          </h2>
          <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
            {watchlist.length}/10
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setShowBulk(!showBulk)}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
            title="一括追加"
          >
            <ListPlus size={18} />
          </button>
          <button 
            onClick={() => {
              if(confirm("このカテゴリーの銘柄をすべて削除しますか？")) clearWatchlist();
            }}
            className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
            title="すべて削除"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showBulk && (
        <div className="p-3 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="銘柄コードをご入力ください"
            className="w-full text-sm font-mono p-2 border border-slate-200 rounded-lg h-24 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowBulk(false)} className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700">Cancel</button>
            <button onClick={handleBulkAdd} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 font-bold">
              <Plus size={14} /> 追加
            </button>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        {watchlist.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            銘柄が登録されていません。<br/>「+」から追加してください。
          </div>
        ) : (
          watchlist.map((item) => {
            if (!item.code) return null;
            return (
              <div
                key={item.code}
                className={`group p-3 border-b border-slate-100 cursor-pointer transition-colors relative ${
                  selectedTicker === item.code ? "bg-blue-50 border-l-4 border-blue-600 shadow-inner" : "hover:bg-slate-50"
                }`}
                onClick={() => setSelectedTicker(item.code)}
              >
                <div className="flex justify-between items-start mb-0.5">
                  <span className="font-mono font-bold text-slate-400 text-[10px] tracking-tight">{item.code}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded uppercase font-bold tracking-tighter">
                      {item.industry || "---"}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(item.code);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 hover:text-red-600 rounded text-slate-400 transition-all ml-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                </div>
                <div className="text-sm font-black text-slate-800 truncate mb-1">
                  {item.name || <span className="text-slate-300 font-normal italic">Loading...</span>}
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono font-bold text-slate-900">{item.price || "¥ ---"}</span>
                  <span className={`font-mono text-[10px] font-bold ${item.change?.includes('+') ? 'text-red-500' : 'text-blue-500'}`}>
                    {item.change || "---"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span className="font-medium">VWAP</span>
                  <span className="font-mono font-bold">{item.vwap || "---"}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
