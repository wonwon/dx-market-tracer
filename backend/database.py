import sqlite3
import json
import os
from typing import List, Dict

DATABASE_PATH = os.path.join(os.path.dirname(__file__), "watchlist.db")
WATCHLIST_JSON = os.path.join(os.path.dirname(__file__), "watchlist.json")

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # カテゴリテーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            display_order INTEGER
        )
    ''')
    
    # 銘柄テーブル
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS watchlist_items (
            category_id TEXT,
            code TEXT,
            name TEXT,
            industry TEXT,
            price TEXT,
            change TEXT,
            vwap TEXT,
            ma25_diff TEXT,
            settlement_date TEXT,
            ex_dividend_date TEXT,
            benefit_date TEXT,
            display_order INTEGER,
            PRIMARY KEY (category_id, code),
            FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    
    # JSONからの移行チェック
    if os.path.exists(WATCHLIST_JSON):
        # 既にデータがあるか確認
        cursor.execute('SELECT COUNT(*) FROM categories')
        if cursor.fetchone()[0] == 0:
            print("Migrating data from watchlist.json to SQLite...")
            try:
                with open(WATCHLIST_JSON, "r", encoding="utf-8") as f:
                    categories = json.load(f)
                    for idx, cat in enumerate(categories):
                        cursor.execute(
                            'INSERT INTO categories (id, name, display_order) VALUES (?, ?, ?)',
                            (cat['id'], cat['name'], idx)
                        )
                        for item_idx, item in enumerate(cat.get('items', [])):
                            cursor.execute('''
                                INSERT INTO watchlist_items (
                                    category_id, code, name, industry, price, change, vwap,
                                    ma25_diff, settlement_date, ex_dividend_date, benefit_date, display_order
                                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                            ''', (
                                cat['id'], item['code'], item.get('name'), item.get('industry'),
                                item.get('price'), item.get('change'), item.get('vwap'),
                                item.get('ma25_diff'), item.get('settlement_date'),
                                item.get('ex_dividend_date'), item.get('benefit_date'), item_idx
                            ))
                conn.commit()
                print("Migration successful.")
            except Exception as e:
                print(f"Migration failed: {e}")
                conn.rollback()

    conn.close()

def get_watchlist() -> List[Dict]:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM categories ORDER BY display_order')
    categories = [dict(row) for row in cursor.fetchall()]
    
    for cat in categories:
        cursor.execute('SELECT * FROM watchlist_items WHERE category_id = ? ORDER BY display_order', (cat['id'],))
        cat['items'] = [dict(row) for row in cursor.fetchall()]
        
    conn.close()
    return categories

def save_watchlist(categories: List[Dict]):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # トランザクション処理
        cursor.execute('DELETE FROM watchlist_items')
        cursor.execute('DELETE FROM categories')
        
        for idx, cat in enumerate(categories):
            cursor.execute(
                'INSERT INTO categories (id, name, display_order) VALUES (?, ?, ?)',
                (cat['id'], cat['name'], idx)
            )
            for item_idx, item in enumerate(cat.get('items', [])):
                cursor.execute('''
                    INSERT INTO watchlist_items (
                        category_id, code, name, industry, price, change, vwap,
                        ma25_diff, settlement_date, ex_dividend_date, benefit_date, display_order
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    cat['id'], item['code'], item.get('name'), item.get('industry'),
                    item.get('price'), item.get('change'), item.get('vwap'),
                    item.get('ma25_diff'), item.get('settlement_date'),
                    item.get('ex_dividend_date'), item.get('benefit_date'), item_idx
                ))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

# 初期化実行
if __name__ == "__main__":
    init_db()
