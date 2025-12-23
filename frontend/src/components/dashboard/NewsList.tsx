"use client";

import { useStockStore } from "@/store/useStockStore";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, FileText, BarChart2, Globe, TrendingDown, Search } from "lucide-react";

export default function NewsList() {
  const { selectedTicker } = useStockStore();

  const { data, isLoading } = useQuery({
    queryKey: ['news', selectedTicker],
    queryFn: async () => {
      const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
      if (!resp.ok) throw new Error('Failed to fetch news');
      const json = await resp.json();
      return json.news;
    },
    enabled: !!selectedTicker
  });

  const analysisLinks = [
    { label: "バフェットコード", url: `https://www.buffett-code.com/company/${selectedTicker}`, icon: BarChart2 },
    { label: "適時開示", url: `https://kabutan.jp/stock/news?code=${selectedTicker}&category=cf`, icon: FileText },
    { label: "日経新聞", url: `https://www.nikkei.com/nkd/company/?scode=${selectedTicker}`, icon: Globe },
    { label: "空売り情報", url: `https://karauri.net/${selectedTicker}/`, icon: TrendingDown },
    { label: "Yahooファイナンス", url: `https://finance.yahoo.co.jp/quote/${selectedTicker}.T`, icon: Search },
  ];

  return (
    <div className="flex flex-row h-full bg-white divide-x divide-slate-100 overflow-hidden">
      {/* Left side: News List (2 Columns) */}
      <div className="flex-[3] flex flex-col p-4 overflow-hidden">
        <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-slate-900 pl-2 uppercase tracking-tight">
          最新のニュース & 出来事
        </h3>
        <div className="flex-1 overflow-y-auto pr-2">
          {isLoading && <div className="p-4 text-center text-slate-400 animate-pulse">Loading news...</div>}
          <div className="grid grid-cols-2 gap-3">
            {data && data.length > 0 ? (
              data.map((item: any, idx: number) => (
                <a 
                  key={idx} 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 border rounded-xl border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="text-[10px] text-slate-400 font-mono mb-1">{item.date || "TODAY"}</div>
                  <div className="text-xs text-slate-800 line-clamp-2 leading-snug font-bold group-hover:text-blue-700">
                    {item.title}
                  </div>
                </a>
              ))
            ) : (
              !isLoading && <div className="col-span-2 p-4 text-center text-slate-400">No news found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Vertical Link Panel */}
      <div className="flex-1 flex flex-col p-4 bg-slate-50/50">
        <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-tight">
          外部分析リンク
        </h3>
        <div className="flex flex-col gap-2">
          {analysisLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-slate-700 transition-all group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600">
                  <Icon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold leading-none">{link.label}</span>
                  <span className="text-[9px] text-slate-400 font-mono">EXTERNAL</span>
                </div>
                <ExternalLink size={10} className="ml-auto text-slate-300 group-hover:text-blue-400" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
