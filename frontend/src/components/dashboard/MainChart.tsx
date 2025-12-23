"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries, IChartApi, ISeriesApi } from "lightweight-charts";
import { useStockStore } from "@/store/useStockStore";
import { useQuery } from "@tanstack/react-query";

export default function MainChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const vwapSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const { selectedTicker } = useStockStore();

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', selectedTicker],
    queryFn: async () => {
      const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
      if (!resp.ok) throw new Error('Failed to fetch stock data');
      return resp.json();
    },
    enabled: !!selectedTicker
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#FFFFFF" },
        textColor: "#64748B",
      },
      grid: {
        vertLines: { color: "#F8FAFC" },
        horzLines: { color: "#F8FAFC" },
      },
      timeScale: {
        rightOffset: 12,
        barSpacing: 8,
        timeVisible: false,
        borderVisible: false,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.3, // 出来高用のスペースを空ける
        },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    // 1. Candles
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#EF4444",
      downColor: "#3B82F6",
      borderVisible: false,
      wickUpColor: "#EF4444",
      wickDownColor: "#3B82F6",
    });

    // 2. VWAP Line (Overlay on Candles)
    const vwapSeries = chart.addSeries(LineSeries, {
      color: "#FACC15",
      lineWidth: 2,
      priceFormat: { type: 'price' },
      priceScaleId: 'right', // キャンドルと同じスケール
    });

    // 3. Volume Histogram (Bottom Pane)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#94A3B844",
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });

    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    vwapSeriesRef.current = vwapSeries;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !vwapSeriesRef.current || !stockData?.history || stockData.history.length === 0) return;

    const candleData = stockData.history.map((item: any) => ({
      time: item.date,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    const vwapData = stockData.history.map((item: any) => ({
      time: item.date,
      value: item.vwap,
    }));

    const volumeData = stockData.history.map((item: any) => ({
      time: item.date,
      value: item.volume,
      color: item.close >= item.open ? "#EF444422" : "#3B82F622",
    }));

    candleSeriesRef.current.setData(candleData);
    vwapSeriesRef.current.setData(vwapData);
    volumeSeriesRef.current.setData(volumeData);
    chartRef.current?.timeScale().fitContent();
  }, [stockData]);

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
          <div className="text-slate-400 font-bold animate-pulse">Loading real chart data...</div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
