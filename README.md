# TradeInfo v3 - Market Speed Style Dashboard

株探 (Kabutan) の詳細データ、および TradingView のチャートライブラリを活用した、プロフェッショナルな株価分析ダッシュボードです。

## 主な機能

- **高性能チャート**: TradingView Lightweight Charts を採用。
- **詳細指標の可視化**: 株探から VWAP、出来高、信用残、乖離率、利回り、決算予定日を自動取得。
- **マルチカテゴリ・ウォッチリスト**: 分類可能なウォッチリスト管理。バックエンドによるデータの永続化。
- **統合レビューダッシュボード**: 開発状況や品質をアプリ内で確認可能。

## クイックスタート (One-Click)

macOS をお使いの場合は、フォルダ内の **`start.command`** をダブルクリックするだけで、全てのサービスが起動し、ブラウザが自動的に開きます。

## 手動での起動方法

1. **バックエンドの起動**:

   ```bash
   cd backend
   source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **フロントエンドの起動**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 技術スタック

- **Backend**: Python / FastAPI
- **Frontend**: Next.js (TypeScript), Tailwind CSS
- **State Management**: Zustand (Persist)
- **Data Source**: Beautiful Soup (株探 / Kabutan)

## 免責事項

本アプリケーションは個人利用を目的としています。投資判断は自己責任でお願いいたします。
