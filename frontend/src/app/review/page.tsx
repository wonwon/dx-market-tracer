"use client";

import { useEffect, useState } from "react";
import LeftRail from "@/components/dashboard/LeftRail";
import { CheckCircle2, Circle, AlertCircle, Send, CheckCircle } from "lucide-react";

interface ReviewItem {
  id: string;
  category: string;
  title: string;
  description: string;
  is_checked: boolean;
  comment: string;
}

interface ReviewStatus {
  items: ReviewItem[];
  overall_status: string;
}

export default function ReviewPage() {
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/review")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      });
  }, []);

  const toggleCheck = (id: string) => {
    if (!status) return;
    const newItems = status.items.map((item) =>
      item.id === id ? { ...item, is_checked: !item.is_checked } : item
    );
    setStatus({ ...status, items: newItems });
  };

  const updateComment = (id: string, comment: string) => {
    if (!status) return;
    const newItems = status.items.map((item) =>
      item.id === id ? { ...item, comment } : item
    );
    setStatus({ ...status, items: newItems });
  };

  const saveFeedback = async () => {
    if (!status) return;
    setSaving(true);
    try {
      await fetch("http://127.0.0.1:8000/review/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(status.items),
      });
      alert("フィードバックを保存しました。エージェントが確認します。");
    } finally {
      setSaving(false);
    }
  };

  const approveAll = async () => {
    if (!status) return;
    if (!confirm("すべての機能が合格であることを確認しましたか？これ以上修正がない場合、GitHubへのプッシュを許可します。")) return;
    
    setSaving(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/review/approve", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        alert("合格！おめでとうございます。エージェントが次のデプロイ工程に進みます。");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  const checkedCount = status?.items.filter(i => i.is_checked).length || 0;
  const totalCount = status?.items.length || 0;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
      <LeftRail />
      
      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Review Dashboard</h1>
              <p className="text-slate-500 font-medium">実装機能のデザインと安定性をチェックしてください</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</div>
              <div className="text-3xl font-mono font-black text-blue-600">{Math.round(progress)}%</div>
            </div>
          </header>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <AlertCircle size={20} className="text-blue-500" />
                現在のレビュー項目
              </h2>
              {status?.overall_status === 'approved' && (
                <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold">
                  <CheckCircle size={16} />
                  ALL APPROVED
                </div>
              )}
            </div>

            <div className="divide-y divide-slate-50">
              {status?.items.map((item) => (
                <div key={item.id} className={`p-8 transition-colors ${item.is_checked ? 'bg-blue-50/10' : ''}`}>
                  <div className="flex gap-6">
                    <button 
                      onClick={() => toggleCheck(item.id)}
                      className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        item.is_checked ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {item.is_checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                    </button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <h3 className={`font-bold text-lg ${item.is_checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="relative group">
                        <textarea 
                          placeholder="修正点や気になったことがあれば記入してください..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all resize-none h-24"
                          value={item.comment}
                          onChange={(e) => updateComment(item.id, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 bg-slate-50/30 flex justify-between items-center">
              <button 
                onClick={saveFeedback}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-md transition-all disabled:opacity-50"
              >
                <Send size={18} />
                フィードバックを保存
              </button>

              <button 
                onClick={approveAll}
                disabled={saving || status?.overall_status === 'approved' || progress < 100}
                className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black tracking-tight text-white transition-all shadow-xl ${
                  progress === 100 && status?.overall_status !== 'approved'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 scale-105' 
                    : 'bg-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                <CheckCircle2 size={20} />
                合格（COMPLETE）
              </button>
            </div>
          </div>
          
          <p className="text-center text-slate-400 text-xs">
            ※「合格」をクリックすると、すべての作業が完了したとみなされ、必要に応じて最終的なデプロイ工程に進みます。
          </p>
        </div>
      </main>
    </div>
  );
}
