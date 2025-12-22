# TradeInfo - Market Speed Style Dashboard

株探 (Kabutan) と Yahoo Finance のデータ、および TradingView のチャートライブラリを活用した、プロフェッショナルな株価分析ダッシュボードです。

## 主な機能

- **高性能チャート**: TradingView Lightweight Charts を採用。ローソク足、ライン、エリア切り替え、MA5/MA25 表示に対応。
- **詳細指標の可視化**: 株探から VWAP、出来高、信用買残・売残、貸借倍率、25/75 日移動平均乖離率、利回り、決算予定日を自動取得。
- **高速な UI**: HTMX を採用し、ページ単位のリロードなしで銘柄切り替えやウォッチリスト管理が可能。
- **ウォッチリスト管理**: 複数銘柄の一括インポート、削除、お気に入り保存に対応。

## セットアップ手順

### 1. 環境構築

Python 3.10 以上がインストールされていることを確認してください。

```bash
# 仮想環境の作成
python3 -m venv venv
source venv/bin/activate  # Windowsの場合は venv\Scripts\activate

# 依存ライブラリのインストール
pip install -r requirements.txt
```

### 2. アプリケーションの起動

```bash
python3 app.py
```

起動後、ブラウザで `http://127.0.0.1:5001` にアクセスしてください。

## 技術スタック

- **Backend**: Python / Flask
- **Frontend**: HTMX, Tailwind CSS, JavaScript (Lightweight Charts v3.8)
- **Data Source**: yfinance (株価履歴), Beautiful Soup (株探スクレイピング)

## 免責事項

本アプリケーションは個人利用を目的としており、取得したデータの再配布や商用利用は各データ提供元の規約を確認してください。投資判断は自己責任でお願いいたします。
