"use client";

import { useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MarketTicker() {
  const { marketIndices, updateMarketIndices } = useStockStore();

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const resp = await fetch("http://127.0.0.1:8000/stocks/market");
        if (resp.ok) {
          const data = await resp.json();
          updateMarketIndices(data);
        }
      } catch (e) {
        console.error("Failed to fetch market indices", e);
      }
    };

    fetchMarket();
    // 1分ごとの更新はユーザー要望により停止。必要なら手動リロードや特定のアクションで。
  }, [updateMarketIndices]);

  if (!marketIndices) {
    return (
      <div className="h-full w-full bg-slate-50 border-b border-slate-200 flex items-center justify-center">
        <div className="text-slate-400 font-mono text-xs animate-pulse tracking-widest">INITIALIZING MARKET DATA...</div>
      </div>
    );
  }

  const IndexCard = ({ data, label }: { data: any, label: string }) => {
    const isUp = data.change.includes("+");
    const isDown = data.change.includes("-");

    return (
      <div className="flex-1 border-r border-slate-200 last:border-r-0 flex flex-col justify-center px-8 transition-colors hover:bg-white group">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-mono font-black text-slate-900 tracking-tighter">
            {data.price}
          </span>
          <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isUp ? "text-red-500" : isDown ? "text-blue-500" : "text-slate-400"}`}>
            {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
            <span>{data.change}</span>
            <span className="text-[11px] opacity-80">({data.change_percent}%)</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="h-full w-full bg-slate-50 border-b border-slate-200 flex z-20">
      <IndexCard data={marketIndices.nikkei225} label="Nikkei 225" />
      <IndexCard data={marketIndices.topix} label="TOPIX" />
      <IndexCard data={marketIndices.futures} label="Nikkei Futures" />
    </header>
  );
}
