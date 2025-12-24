import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WatchlistItem {
  code: string;
  name?: string;
  price?: string;
  change?: string;
  industry?: string;
  vwap?: string;
  ma25_diff?: string;
  settlement_date?: string;
  ex_dividend_date?: string;
  benefit_date?: string;
}

export interface IndexInfo {
  name: string;
  price: string;
  change: string;
  change_percent: string;
}

export interface MarketIndices {
  nikkei225: IndexInfo;
  topix: IndexInfo;
  futures: IndexInfo;
}

export interface WatchlistCategory {
  id: string;
  name: string;
  items: WatchlistItem[];
}

interface StockState {
  selectedTicker: string;
  currentPrice: string;
  categories: WatchlistCategory[];
  activeCategoryId: string;
  marketIndices: MarketIndices | null;
  
  setSelectedTicker: (ticker: string) => void;
  setCurrentPrice: (price: string) => void;
  setActiveCategory: (id: string) => void;
  updateMarketIndices: (indices: MarketIndices) => void;
  
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  
  addToWatchlist: (ticker: string) => void;
  addTickers: (tickers: string[]) => void;
  removeFromWatchlist: (ticker: string) => void;
  updateWatchlistItem: (ticker: string, data: Partial<WatchlistItem>) => void;
  reorderWatchlist: (categoryId: string, startIndex: number, endIndex: number) => void;
  clearWatchlist: () => void;
}

const DEFAULT_CATEGORIES: WatchlistCategory[] = [
  { id: 'cat-1', name: '主要銘柄', items: [{ code: '7203', name: 'トヨタ', industry: '輸送用機器' }, { code: '9434', name: 'ソフトバンク', industry: '情報・通信業' }] },
  { id: 'cat-2', name: '監視銘柄A', items: [] },
  { id: 'cat-3', name: '監視銘柄B', items: [] },
  { id: 'cat-4', name: '高配当銘柄', items: [] },
  { id: 'cat-5', name: 'グロース', items: [] },
  { id: 'cat-6', name: 'カテゴリ6', items: [] },
  { id: 'cat-7', name: 'カテゴリ7', items: [] },
  { id: 'cat-8', name: 'カテゴリ8', items: [] },
  { id: 'cat-9', name: 'カテゴリ9', items: [] },
  { id: 'cat-10', name: 'カテゴリ10', items: [] },
];

export const useStockStore = create<StockState>()(
  persist(
    (set) => ({
      selectedTicker: '7203',
      currentPrice: '',
      categories: DEFAULT_CATEGORIES,
      activeCategoryId: 'cat-1',
      marketIndices: null,

      setSelectedTicker: (ticker) => set({ selectedTicker: ticker, currentPrice: '' }),
      setCurrentPrice: (price) => set({ currentPrice: price }),
      setActiveCategory: (id) => set({ activeCategoryId: id }),
      updateMarketIndices: (indices) => set({ marketIndices: indices }),

      addCategory: (name) => set((state) => ({
        categories: [...state.categories, { id: `cat-${Date.now()}`, name, items: [] }]
      })),

      renameCategory: (id, name) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, name } : c)
      })),

      deleteCategory: (id) => set((state) => {
        const newCategories = state.categories.filter(c => c.id !== id);
        return {
          categories: newCategories,
          activeCategoryId: state.activeCategoryId === id ? (newCategories[0]?.id || '') : state.activeCategoryId
        };
      }),

      addToWatchlist: (ticker) =>
        set((state) => ({
          categories: state.categories.map(c => 
            c.id === state.activeCategoryId 
              ? { 
                  ...c, 
                  items: c.items.some(i => i.code === ticker) || c.items.length >= 10
                    ? c.items 
                    : [...c.items, { code: ticker }]
                }
              : c
          )
        })),

      addTickers: (tickers) =>
        set((state) => ({
          categories: state.categories.map(c => {
            if (c.id !== state.activeCategoryId) return c;
            const existingCodes = new Set(c.items.map(i => i.code));
            const newCodes = tickers.filter(t => t && !existingCodes.has(t));
            const availableSlots = 10 - c.items.length;
            if (availableSlots <= 0) return c;
            
            const itemsToAdd = newCodes.slice(0, availableSlots).map(code => ({ code }));
            return { ...c, items: [...c.items, ...itemsToAdd] };
          })
        })),

      removeFromWatchlist: (ticker) =>
        set((state) => ({
          categories: state.categories.map(c =>
            c.id === state.activeCategoryId
              ? { ...c, items: c.items.filter(i => i.code !== ticker) }
              : c
          )
        })),

      updateWatchlistItem: (ticker, data) =>
        set((state) => ({
          categories: state.categories.map(c => ({
            ...c,
            items: c.items.map(i => i.code === ticker ? { ...i, ...data } : i)
          }))
        })),

      reorderWatchlist: (categoryId, startIndex, endIndex) =>
        set((state) => ({
          categories: state.categories.map(c => {
            if (c.id !== categoryId) return c;
            const newItems = Array.from(c.items);
            const [removed] = newItems.splice(startIndex, 1);
            newItems.splice(endIndex, 0, removed);
            return { ...c, items: newItems };
          })
        })),

      clearWatchlist: () =>
        set((state) => ({
          categories: state.categories.map(c =>
            c.id === state.activeCategoryId ? { ...c, items: [] } : c
          )
        })),
    }),
    {
      name: 'trade-info-v3-storage',
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (!persistedState) return persistedState;
        
        // 旧バージョン (watchlist配列) からの新バージョン (categories) への移行
        if (persistedState.watchlist && !persistedState.categories) {
          persistedState.categories = [
            { id: 'cat-1', name: 'インポート', items: persistedState.watchlist.slice(0, 10) },
            ...DEFAULT_CATEGORIES.slice(1)
          ];
          persistedState.activeCategoryId = 'cat-1';
          delete persistedState.watchlist;
        }

        // 不備がある場合のガード
        if (persistedState.categories) {
          persistedState.categories = persistedState.categories.map((c: any) => ({
            ...c,
            items: Array.isArray(c.items) ? c.items.map((i: any) => 
              typeof i === 'string' ? { code: i } : i
            ).filter((i: any) => i && i.code) : []
          }));
        }

        return persistedState;
      },
    }
  )
);
