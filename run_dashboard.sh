#!/bin/bash

# このスクリプトのあるディレクトリに移動
cd "$(dirname "$0")"

echo "🚀 株ニュースダッシュボードを起動しています..."

# 仮想環境の作成と有効化
if [ ! -d "venv" ]; then
    echo "📦 仮想環境を作成しています..."
    python3 -m venv venv
fi
source venv/bin/activate

# 必要なライブラリのインストール確認
if ! pip freeze | grep -q "Flask"; then
    echo "📦 必要なライブラリをインストールしています..."
    pip install flask flask-cors beautifulsoup4 requests
fi

# 必要なライブラリのインストール確認
if ! pip freeze | grep -q "Flask"; then
    echo "📦 必要なライブラリをインストールしています..."
    pip install flask flask-cors beautifulsoup4 requests
fi

# Flaskアプリの起動
echo "✅ ブラウザで http://127.0.0.1:5001 を開いてください"
export PORT=5001
python3 app.py
