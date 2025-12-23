"use client";

import { useStockStore } from "@/store/useStockStore";
import { Plus, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

export default function CategoryRail() {
  const { categories, activeCategoryId, setActiveCategory, renameCategory, addCategory } = useStockStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditName(currentName);
  };

  const handleSaveEdit = (id: string) => {
    if (editName.trim()) {
      renameCategory(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="w-44 flex-shrink-0 border-r border-slate-200 bg-[#F1F5F9] flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ジャンル</h2>
        <button 
          onClick={() => addCategory("新カテゴリ")}
          className="p-1 hover:bg-slate-200 rounded text-slate-500"
          title="カテゴリ追加"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-2.5 cursor-pointer flex items-center group transition-colors ${
              activeCategoryId === cat.id 
                ? "bg-white text-blue-600 border-r-2 border-blue-600 shadow-sm" 
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            {editingId === cat.id ? (
              <div className="flex items-center w-full gap-1" onClick={e => e.stopPropagation()}>
                <input
                  autoFocus
                  className="w-full text-sm py-0.5 px-1 border border-blue-400 rounded outline-none"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(cat.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <button onClick={() => handleSaveEdit(cat.id)} className="text-green-600">
                  <Check size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className={`text-sm font-medium truncate ${activeCategoryId === cat.id ? "font-bold" : ""}`}>
                  {cat.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(cat.id, cat.name);
                  }}
                  className={`p-1 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity ${activeCategoryId === cat.id ? "opacity-100" : ""}`}
                >
                  <Edit2 size={12} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 bg-slate-100/50">
        <p className="text-[10px] text-slate-400 leading-tight">
          ※各ジャンル最大10銘柄まで登録可能です
        </p>
      </div>
    </aside>
  );
}
