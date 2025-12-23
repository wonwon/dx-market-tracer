"use client";

import { useEffect } from "react";
import { useStockStore } from "@/store/useStockStore";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, TrendingUp, Info, Activity, Database, FileText } from "lucide-react";

export default function IntelligenceGrid() {
  const { selectedTicker, setCurrentPrice } = useStockStore();

  const { data, isLoading } = useQuery({
    queryKey: ['stock', selectedTicker],
    queryFn: async () => {
      const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
      if (!resp.ok) throw new Error('Failed to fetch stock data');
      return resp.json();
    },
    enabled: !!selectedTicker
  });

  useEffect(() => {
    if (data?.current_price) {
      setCurrentPrice(data.current_price);
    }
  }, [data, setCurrentPrice]);

  if (isLoading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading intelligence...</div>;
  if (!data) return <div className="p-8 text-center text-slate-400">Select a ticker to see analysis</div>;

  const MetricItem = ({ label, value, icon: Icon, subValue }: any) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
        {Icon && <Icon size={12} />}
        {label}
      </div>
      <div className="font-mono text-xl font-bold text-slate-900">{value || "-"}</div>
      {subValue && <div className="font-mono text-[11px] text-slate-500">{subValue}</div>}
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header Section: 3-line layout */}
      <div className="border-b border-slate-200 pb-4 flex flex-col items-center text-center">
        <div className="text-sm font-mono font-bold text-slate-400 mb-1">{data.code}</div>
        <div className="text-xl font-black text-slate-900 mb-2">{data.name}</div>
        <div className="flex flex-col items-center mb-3">
          <div className={`text-4xl font-mono font-black ${data.change && data.change.startsWith('+') ? 'text-red-600' : 'text-blue-600'}`}>
            {data.current_price}
          </div>
          <div className={`text-sm font-mono font-bold ${data.change && data.change.startsWith('+') ? 'text-red-600' : 'text-blue-600'}`}>
            {data.change} ({data.change_percent}%)
          </div>
        </div>
        {data.dividend_yield && (
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
            <TrendingUp size={10} />
            利回り {data.dividend_yield}
          </div>
        )}
      </div>

      {/* Pane 2: Market Intelligence - Core Metrics */}
      <div className="flex flex-col gap-8">
        
        {/* 1. 主要指標 */}
        <section>
          <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-blue-600 pl-2 uppercase tracking-tight">主要指標</h3>
          <div className="flex flex-col gap-6">
            <MetricItem label="VWAP" value={data.vwap} icon={Activity} />
            <MetricItem label="出来高" value={data.volume} icon={Info} />
            <MetricItem label="25日乖離" value={data.ma25_diff} icon={TrendingUp} />
            <MetricItem label="75日乖離" value={data.ma75_diff} icon={TrendingUp} />
          </div>
        </section>

        {/* 2. 需給 */}
        <section>
          <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-indigo-600 pl-2 uppercase tracking-tight">需給コンディション</h3>
          <div className="flex flex-col gap-6">
            <MetricItem label="信用買残" value={data.margin_buy} icon={Database} />
            <MetricItem label="信用売残" value={data.margin_sell} icon={Database} />
            <MetricItem label="貸借倍率" value={data.margin_ratio} icon={Database} />
          </div>
        </section>

        {/* 3. ファンダメンタル */}
        <section>
          <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-emerald-600 pl-2 uppercase tracking-tight">ファンダメンタル</h3>
          <div className="flex flex-col gap-6">
            <MetricItem label="配当利回り" value={data.dividend_yield} icon={TrendingUp} />
            <MetricItem label="決算発表予定日" value={data.settlement_date} icon={FileText} />
          </div>
        </section>

        {/* 4. アクションリング */}
        <section className="pt-4 border-t border-slate-50">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "四季報", url: `https://shikiho.toyokeizai.net/stocks/${data.code}` },
              { label: "適時開示", url: `https://kabutan.jp/stock/news?code=${data.code}&category=cf` },
              { label: "バフェット・コード", url: `https://www.buffett-code.com/company/${data.code}` },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 text-[11px] font-bold rounded-full transition-all"
              >
                {link.label}
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
