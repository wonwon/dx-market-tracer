This file is a merged representation of a subset of the codebase, containing specifically included files and files not matching ignore patterns, combined into a single document by Repomix.
The content has been processed where line numbers have been added.

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: **/*
- Files matching these patterns are excluded: **/node_modules/**, **/venv/**, **/__pycache__/**, **/dist/**, **/build/**, **/*.pyc, **/*.pyo, **/*.pyd, **/.git/**, **/.DS_Store, **/package-lock.json, **/yarn.lock, repomix-output.md, backend/review_status.json
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Line numbers have been added to the beginning of each line
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
```
.agent/
  workflows/
    review.md
.antigravity-images/
  vital_study_health_mockup_1766570774798.png
.github/
  workflows/
    ai-review.yml
backend/
  api/
    review.py
    stocks.py
  schemas/
    stock.py
  services/
    kabutan.py
  main.py
  requirements.txt
frontend/
  public/
    file.svg
    globe.svg
    next.svg
    vercel.svg
    window.svg
  src/
    app/
      review/
        page.tsx
      favicon.ico
      globals.css
      layout.tsx
      page.tsx
      providers.tsx
    components/
      dashboard/
        CategoryRail.tsx
        CommandPalette.tsx
        IntelligenceGrid.tsx
        LeftRail.tsx
        MainChart.tsx
        MarketTicker.tsx
        NewsList.tsx
        Watchlist.tsx
    lib/
      utils.ts
    store/
      useStockStore.ts
  .gitignore
  components.json
  eslint.config.mjs
  next.config.ts
  package.json
  postcss.config.mjs
  README.md
  tsconfig.json
public/
  vite.svg
scripts/
  prompts/
    design.md
    performance.md
    vulnerability.md
  ai_review.py
src/
  assets/
    react.svg
  components/
    AnalysisLinks.tsx
    Header.tsx
    Layout.tsx
    Notepad.tsx
  App.tsx
  index.css
  main.tsx
templates/
  partials/
    stock_panel.html
    watchlist.html
  base.html
  index.html
.gitignore
app_v2.py
app.py
development_standard.md
eslint.config.js
evolution_history.md
index.html
package.json
postcss.config.js
README.md
repomix.config.json
requirements.txt
run_dashboard.sh
run_flask.sh
run_v3.sh
tailwind.config.js
tsconfig.app.json
tsconfig.json
tsconfig.node.json
vite.config.ts
```

# Files

## File: .agent/workflows/review.md
````markdown
 1: ---
 2: description: レビューダッシュボードの項目生成ルール
 3: ---
 4: 
 5: # レビュー項目生成フロー
 6: 
 7: エージェント（私）が実装を完了した際、このルールに従って `backend/review_status.json` を更新し、ユーザーへの確認を依頼します。
 8: 
 9: ## 1. 項目生成の基準
10: 
11: - **機能追加・修正**: 実装した機能ごとに 1 つ以上の項目を作成する。
12: - **バグ修正**: 重大なバグ修正が完了した際、再現の有無を確認する項目を作成する。
13: - **デザイン変更**: 全体のトーンや特定のコンポーネントの見た目を変更した際に作成する。
14: 
15: ## 2. カテゴリ定義
16: 
17: - `Watchlist`: 銘柄リスト、並び替え、リスト表示関連。
18: - `Market`: 株価データ、指標スクレイピング、ティッカー、チャート関連。
19: - `Design`: レイアウト、配色、UI コンポーネントの見た目。
20: - `Stability`: データ永続化（保存）、API の安定性、エラーハンドリング。
21: 
22: ## 3. JSON フォーマット
23: 
24: `backend/review_status.json` の `items` 配列に以下を追加する。
25: 
26: ```json
27: {
28:   "id": "独自ID（日付+連番または機能名）",
29:   "category": "上記カテゴリから選択",
30:   "title": "15文字以内のタイトル",
31:   "description": "「〇〇をして××になること」といった具体的な確認手順",
32:   "is_checked": false,
33:   "comment": ""
34: }
35: ```
36: 
37: ## 4. エージェントの行動指針
38: 
39: - 実装が完了し「合格」を求める前に、必ずこのルールに沿ってチェックリストを最新化すること。
40: - 修正後のコメントには、必ず `【修正済】` というプレフィックスを付けること。
41: - ユーザーのフィードバックがあった場合は、それを即座に次のタスクのインプットとして読み込むこと。
````

## File: .github/workflows/ai-review.yml
````yaml
 1: name: AI Code Review
 2: 
 3: on:
 4:   pull_request:
 5:     branches:
 6:       - main
 7:       - develop
 8:     types: [opened, synchronize, reopened]
 9: 
10: jobs:
11:   review:
12:     runs-on: ubuntu-latest
13:     permissions:
14:       contents: read
15:       pull-requests: write
16: 
17:     steps:
18:       - name: Checkout repository
19:         uses: actions/checkout@v4
20:         with:
21:           fetch-depth: 0
22: 
23:       - name: Set up Python
24:         uses: actions/setup-python@v4
25:         with:
26:           python-version: "3.10"
27: 
28:       - name: Set up Node.js
29:         uses: actions/setup-node@v3
30:         with:
31:           node-version: "18"
32: 
33:       - name: Install dependencies
34:         run: |
35:           pip install -r requirements.txt
36:           npm install -g repomix
37: 
38:       - name: Run AI Review
39:         env:
40:           GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
41:         run: |
42:           # すべての観点でレビューを実行
43:           python scripts/ai_review.py --all
44: 
45:       - name: Read review report
46:         id: review_report
47:         run: |
48:           REPORT=$(cat ai-review-report.md)
49:           echo "report<<EOF" >> $GITHUB_OUTPUT
50:           echo "$REPORT" >> $GITHUB_OUTPUT
51:           echo "EOF" >> $GITHUB_OUTPUT
52: 
53:       - name: Post comment to PR
54:         uses: peter-evans/create-or-update-comment@v3
55:         with:
56:           issue-number: ${{ github.event.pull_request.number }}
57:           body: |
58:             ## 🤖 AI Code Review Results
59: 
60:             ${{ steps.review_report.outputs.report }}
61: 
62:             ---
63:             *This review was generated by Gemini 2.5 Pro via GitHub Actions.*
````

## File: scripts/prompts/design.md
````markdown
 1: あなたはソフトウェアアーキテクトです。提供されたコードベースを設計の観点から評価し、保守性や拡張性に欠ける箇所を特定してください。
 2: 
 3: 特に『development_standard.md』に記載された開発標準に照らし合わせ、以下の点を確認してください：
 4: 
 5: - **アーキテクチャの整合性**: 定義されたレイヤー（Frontend, Backend, API 等）の境界が守られているか？
 6: - **依存関係の方向**: 上位レイヤーが下位レイヤーに不適切に依存していないか？循環参照はないか？
 7: - **クリーンレベル**: 関数の責務が単一であるか？「神クラス」や「巨大な関数」になっていないか？
 8: - **DRY 原則**: 同様のロジックが複数のファイルに散在していないか？共通化できる部品はないか？
 9: - **命名と可読性**: 意図が不明確な変数名や、コメントが必要な複雑なロジックはないか？
10: 
11: 指摘事項がある場合は、ファイル名、該当箇所、設計上の懸念点、および推奨されるリファクタリング案を日本語で回答してください。
````

## File: scripts/prompts/performance.md
````markdown
 1: あなたはパフォーマンス最適化のスペシャリストです。提供されたコードベースを分析し、実行効率やリソース消費に関する問題を特定してください。
 2: 
 3: 特に以下の点に注意してください：
 4: 
 5: - **データベース効率**: N+1 問題が発生している箇所はないか？インデックスが効かないクエリや不要な全件取得はないか？
 6: - **冗長な処理**: リポジトリ全体で重複している重い計算や、不必要な API コールはないか？
 7: - **メモリ管理**: 大量のデータを一括でメモリに読み込んでいる箇所はないか（ストリーミングやページネーションの検討）？
 8: - **アルゴリズム**: より効率的なデータ構造やアルゴリズムに置き換えられる箇所はないか？
 9: 
10: 指摘事項がある場合は、ファイル名、該当行、パフォーマンへの影響、および具体的な改善方法を日本語で提示してください。
````

## File: scripts/prompts/vulnerability.md
````markdown
 1: あなたはシニアセキュリティエンジニアです。提供されたコードベースをスキャンし、重大な脆弱性やセキュリティリスクを特定してください。
 2: 
 3: 特に以下の点に注意してください：
 4: 
 5: - **認証と認可**: すべての API エンドポイントで一貫した認証チェックが行われているか？認可の不備（BOLA/IDOR）はないか？
 6: - **インジェクション**: SQL インジェクション、OS コマンドインジェクション、クロスサイトスクリプティング (XSS) のリスクはないか？
 7: - **機密データの扱い**: 環境変数ではなくハードコードされたシークレット（API キー、パスワード等）はないか？
 8: - **副作用**: 最近の変更が既存のセキュリティバリデーションを無効化していないか？
 9: 
10: 指摘事項がある場合は、ファイル名、該当行、問題の内容、および修正案を具体的かつ日本語で報告してください。問題がない場合は「重大な脆弱性は検出されませんでした」と回答してください。
````

## File: scripts/ai_review.py
````python
  1: import os
  2: import sys
  3: import argparse
  4: import subprocess
  5: import google.generativeai as genai
  6: from dotenv import load_dotenv
  7: 
  8: # .env ファイルの読み込み（ローカル実行用）
  9: load_dotenv()
 10: 
 11: def run_repomix():
 12:     """repomix を実行してコードをバンドルする"""
 13:     print("📦 コードの梱包を開始します...")
 14:     try:
 15:         # npx repomix を実行（repomix.config.json がカレントディレクトリにある想定）
 16:         subprocess.run(["npx", "repomix"], check=True)
 17:         print("✅ コードの梱包が完了しました: repomix-output.md")
 18:     except subprocess.CalledProcessError as e:
 19:         print(f"❌ repomix の実行に失敗しました: {e}")
 20:         sys.exit(1)
 21: 
 22: def get_bundle_content():
 23:     """バンドルされたファイルの内容を読み込む"""
 24:     output_path = "repomix-output.md"
 25:     if not os.path.exists(output_path):
 26:         print(f"❌ バンドルファイルが見つかりません: {output_path}")
 27:         sys.exit(1)
 28:     with open(output_path, "r", encoding="utf-8") as f:
 29:         return f.read()
 30: 
 31: def get_prompt_template(review_type):
 32:     """レビュー項目に応じたプロンプトテンプレートを読み込む"""
 33:     prompt_path = f"scripts/prompts/{review_type}.md"
 34:     if not os.path.exists(prompt_path):
 35:         print(f"❌ プロンプトテンプレートが見つかりません: {prompt_path}")
 36:         sys.exit(1)
 37:     with open(prompt_path, "r", encoding="utf-8") as f:
 38:         return f.read()
 39: 
 40: def run_ai_review(review_type, bundle_content):
 41:     """Gemini API を呼び出してレビューを実行する"""
 42:     api_key = os.getenv("GEMINI_API_KEY")
 43:     if not api_key:
 44:         print("❌ GEMINI_API_KEY が設定されていません。")
 45:         sys.exit(1)
 46: 
 47:     genai.configure(api_key=api_key)
 48:     
 49:     # 2.5 Pro モデルを使用（コンテキストウィンドウが広いため）
 50:     # 注意: 環境によってモデル名が異なる場合があります
 51:     model = genai.GenerativeModel('gemini-2.0-flash-exp') # 最新のFlash/Pro モデルを指定
 52:     
 53:     prompt = get_prompt_template(review_type)
 54:     
 55:     full_prompt = f"""
 56: 以下にリポジトリ全体のコードとドキュメントをまとめたファイルを提供します。
 57: これに基づいて、指定された観点でレビューを行ってください。
 58: 
 59: 【レビュー観点】
 60: {prompt}
 61: 
 62: 【梱包されたコード】
 63: {bundle_content}
 64: """
 65: 
 66:     print(f"🔍 {review_type} レビューを実行中...")
 67:     try:
 68:         response = model.generate_content(full_prompt)
 69:         return response.text
 70:     except Exception as e:
 71:         print(f"❌ API呼び出し中にエラーが発生しました: {e}")
 72:         return None
 73: 
 74: def main():
 75:     parser = argparse.ArgumentParser(description="Gemini 2.5 Pro による AI コードレビュー")
 76:     parser.add_argument("--type", choices=["vulnerability", "performance", "design"], help="レビューの種類を選択")
 77:     parser.add_argument("--all", action="store_true", help="すべての観点でレビューを実行")
 78:     
 79:     args = parser.parse_args()
 80:     
 81:     if not args.type and not args.all:
 82:         parser.print_help()
 83:         sys.exit(1)
 84: 
 85:     # 1. コードの梱包
 86:     run_repomix()
 87:     bundle_content = get_bundle_content()
 88:     
 89:     review_types = ["vulnerability", "performance", "design"] if args.all else [args.type]
 90:     
 91:     results = []
 92:     for r_type in review_types:
 93:         result = run_ai_review(r_type, bundle_content)
 94:         if result:
 95:             results.append(f"## {r_type.capitalize()} Review Results\n\n{result}")
 96:     
 97:     # 結果の出力
 98:     final_output = "\n\n---\n\n".join(results)
 99:     print("\n" + "="*50 + "\n")
100:     print(final_output)
101:     print("\n" + "="*50 + "\n")
102:     
103:     # 結果をファイルにも保存
104:     with open("ai-review-report.md", "w", encoding="utf-8") as f:
105:         f.write("# Project AI Review Report\n\n")
106:         f.write(final_output)
107:     print("📄 レビューレポートを保存しました: ai-review-report.md")
108: 
109: if __name__ == "__main__":
110:     main()
````

## File: development_standard.md
````markdown
 1: # AI 駆動開発：標準化と再発防止のベストプラクティス (SOP)
 2: 
 3: AI エージェントと共に、高品質なアプリケーションを爆速で開発、保守するための標準ガイドラインです。
 4: 
 5: ## 1. プロジェクトの「型」の標準化
 6: 
 7: 新しいプロジェクトを立ち上げる際、以下の 3 つのドキュメントを必須コンポーネントとして配置します。
 8: 
 9: ### ① `.agent/workflows/` (行動ルールの辞書)
10: 
11: プロジェクト固有のルーティンをワークフローとして定義します。
12: 
13: - `review.md`: レビューダッシュボードの更新基準と項目生成ルール。
14: - `coding_style.md`: 使用するフレームワーク、命名規則、コンポーネント設計指針。
15: - `deploy.md`: テスト、ビルド、デプロイの具体的な手順。
16: 
17: ### ② `evolution_history.md` (進化の系譜)
18: 
19: 単なるコミットログではなく、「意思決定の意図」を記録します。
20: 
21: - `[P]`: Planning（背景・意図）
22: - `[D]`: Design/Decision（設計判断・採択した技術）
23: - `[C]`: Challenge/Constraint（直面した課題・制約）
24: - `[A]`: Action/Achievement（実施内容・成果）
25:   **目的**: AI の「先祖返り」を防ぎ、過去の失敗を文脈として共有する。
26: 
27: ### ③ `implementation_plan.md` (事前承認プロトコル)
28: 
29: 大規模な変更を行う前に、必ずエージェントに詳細な計画を作成させ、ユーザーの承認を得るルーティンを徹底します。
30: 
31: ---
32: 
33: ## 2. 誤りの是正（Correction）ルーティン
34: 
35: 誤りが発生した際は、感情的な指示ではなく「システム的な是正」を行います。
36: 
37: 1.  **レビュー・ダッシュボードの活用**: チャットでの「直しました」報告を禁止し、必ずアプリ内の `/review` ページにチェック項目を生成させ、実機でのエビデンスを元に会話する。
38: 2.  **型とテストによる拘束**: 誤りが起きた箇所に対して、TypeScript の型定義を厳格化する、あるいはバリデーション（Pydantic 等）を追加し、プログラム的に誤りを検知できる構造に書き換える。
39: 
40: ---
41: 
42: ## 3. 再発防止（Prevention）の 3 ステップ
43: 
44: 同じミスを二度起こさないためのポストモーテル（事後分析）手順です。
45: 
46: 1.  **原因の記述**: 何が原因だったか（例：CSS セレクタの指定が広すぎた）を明確にする。
47: 2.  **ガードレールの設置**:
48:     - **技術的**: 共通関数化、Linter ルールの追加。
49:     - **行動的**: `.agent/workflows/` への追記（「〇〇を編集する際は必ず XX を確認すること」）。
50: 3.  **記憶の定着**: `evolution_history.md` に再発防止策を明記し、次回以降のプロンプト・コンテキストに含める。
51: 
52: ---
53: 
54: ## 4. 開発サイクルの標準フロー
55: 
56: 1.  **要求**: ユーザーが要望を伝える。
57: 2.  **計画**: エージェントが `implementation_plan.md` を提案。
58: 3.  **承認**: ユーザーが計画をレビュー・承認。
59: 4.  **実行**: エージェントがコードを書き、`/review` 項目を生成。
60: 5.  **検証**: ユーザーがダッシュボードでチェックし「合格」を出す。
61: 6.  **完了**: `evolution_history.md` を更新し、GitHub へプッシュ。
62: 
63: ---
64: 
65: ## 5. 品質管理（QC）サマリー
66: 
67: AI 開発を「製造現場」と捉えた、品質保証の全体像です。
68: 
69: | フェーズ   | ツール / 手法                | 目的 (QC 視点)                     | 具体的アクション                                  |
70: | :--------- | :--------------------------- | :--------------------------------- | :------------------------------------------------ |
71: | **開始前** | `.agent/workflows/`          | **標準化**: 現場のルールを教え込む | コーディング規約、デプロイ手順の読み込み。        |
72: | **設計時** | `implementation_plan.md`     | **安全**: 作業前のリスク予知 (KY)  | AI が設計図を提示。人間が「デグレの有無」を承認。 |
73: | **開発中** | 厳格な型 & 自動テスト        | **品質**: 工程内検査 (自働化)      | AI が書いたコードがテストをパスするか自動検証。   |
74: | **完了時** | **レビュー・ダッシュボード** | **品質**: 最終検品 (**三現主義**)  | UI 上のチェックボックスと証拠画像で動作を確認。   |
75: | **終了後** | `evolution_history.md`       | **再発防止**: 知見の標準化と横展開 | 失敗事例を「事故記録」として残し、全社展開。      |
76: 
77: ---
78: 
79: > [!IMPORTANT]
80: > このドキュメント自体も「常に変化する」ものです。新しい教訓が得られるたびに更新し、プロジェクトの「知恵」を蓄積してください。
````

## File: repomix.config.json
````json
 1: {
 2:   "output": {
 3:     "filePath": "repomix-output.md",
 4:     "style": "markdown",
 5:     "removeComments": false,
 6:     "removeEmptyLines": false,
 7:     "topFilesLength": 5,
 8:     "showLineNumbers": true,
 9:     "copyToClipboard": false
10:   },
11:   "include": ["**/*"],
12:   "ignore": {
13:     "useGitignore": true,
14:     "useDefaultPatterns": true,
15:     "customPatterns": [
16:       "**/node_modules/**",
17:       "**/venv/**",
18:       "**/__pycache__/**",
19:       "**/dist/**",
20:       "**/build/**",
21:       "**/*.pyc",
22:       "**/*.pyo",
23:       "**/*.pyd",
24:       "**/.git/**",
25:       "**/.DS_Store",
26:       "**/package-lock.json",
27:       "**/yarn.lock",
28:       "repomix-output.md",
29:       "backend/review_status.json"
30:     ]
31:   }
32: }
````

## File: backend/api/review.py
````python
 1: from fastapi import APIRouter, HTTPException
 2: from pydantic import BaseModel
 3: from typing import List, Optional
 4: import json
 5: import os
 6: 
 7: router = APIRouter(prefix="/review", tags=["review"])
 8: 
 9: DATA_FILE = "review_status.json"
10: 
11: class ReviewItem(BaseModel):
12:     id: str
13:     category: str
14:     title: str
15:     description: str
16:     is_checked: bool = False
17:     comment: Optional[str] = ""
18: 
19: class ReviewStatus(BaseModel):
20:     items: List[ReviewItem]
21:     overall_status: str = "pending"  # pending, fixed, approved
22: 
23: def load_status() -> ReviewStatus:
24:     if not os.path.exists(DATA_FILE):
25:         return ReviewStatus(items=[])
26:     try:
27:         with open(DATA_FILE, "r", encoding="utf-8") as f:
28:             data = json.load(f)
29:             return ReviewStatus(**data)
30:     except Exception:
31:         return ReviewStatus(items=[])
32: 
33: def save_status(status: ReviewStatus):
34:     with open(DATA_FILE, "w", encoding="utf-8") as f:
35:         json.dump(status.model_dump(), f, ensure_ascii=False, indent=2)
36: 
37: @router.get("", response_model=ReviewStatus)
38: async def get_review_status():
39:     return load_status()
40: 
41: @router.post("/items", response_model=ReviewStatus)
42: async def update_items(items: List[ReviewItem]):
43:     status = load_status()
44:     status.items = items
45:     save_status(status)
46:     return status
47: 
48: @router.post("/item/{item_id}", response_model=ReviewStatus)
49: async def update_item(item_id: str, updated_item: ReviewItem):
50:     status = load_status()
51:     for i, item in enumerate(status.items):
52:         if item.id == item_id:
53:             status.items[i] = updated_item
54:             break
55:     else:
56:         status.items.append(updated_item)
57:     save_status(status)
58:     return status
59: 
60: @router.post("/approve", response_model=ReviewStatus)
61: async def approve_all():
62:     status = load_status()
63:     status.overall_status = "approved"
64:     save_status(status)
65:     # Here we could trigger a git push or other actions in the future
66:     return status
````

## File: backend/requirements.txt
````
 1: fastapi
 2: uvicorn[standard]
 3: httpx
 4: beautifulsoup4
 5: pydantic
 6: pydantic-settings
 7: python-dotenv
 8: jinja2
 9: yfinance
10: flask-cors
````

## File: frontend/public/file.svg
````xml
1: <svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

## File: frontend/public/globe.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

## File: frontend/public/next.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

## File: frontend/public/vercel.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

## File: frontend/public/window.svg
````xml
1: <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

## File: frontend/src/app/review/page.tsx
````typescript
  1: "use client";
  2: 
  3: import { useEffect, useState } from "react";
  4: import LeftRail from "@/components/dashboard/LeftRail";
  5: import { CheckCircle2, Circle, AlertCircle, Send, CheckCircle } from "lucide-react";
  6: 
  7: interface ReviewItem {
  8:   id: string;
  9:   category: string;
 10:   title: string;
 11:   description: string;
 12:   is_checked: boolean;
 13:   comment: string;
 14: }
 15: 
 16: interface ReviewStatus {
 17:   items: ReviewItem[];
 18:   overall_status: string;
 19: }
 20: 
 21: export default function ReviewPage() {
 22:   const [status, setStatus] = useState<ReviewStatus | null>(null);
 23:   const [loading, setLoading] = useState(true);
 24:   const [saving, setSaving] = useState(false);
 25: 
 26:   useEffect(() => {
 27:     fetch("http://127.0.0.1:8000/review")
 28:       .then((res) => res.json())
 29:       .then((data) => {
 30:         setStatus(data);
 31:         setLoading(false);
 32:       });
 33:   }, []);
 34: 
 35:   const toggleCheck = (id: string) => {
 36:     if (!status) return;
 37:     const newItems = status.items.map((item) =>
 38:       item.id === id ? { ...item, is_checked: !item.is_checked } : item
 39:     );
 40:     setStatus({ ...status, items: newItems });
 41:   };
 42: 
 43:   const updateComment = (id: string, comment: string) => {
 44:     if (!status) return;
 45:     const newItems = status.items.map((item) =>
 46:       item.id === id ? { ...item, comment } : item
 47:     );
 48:     setStatus({ ...status, items: newItems });
 49:   };
 50: 
 51:   const saveFeedback = async () => {
 52:     if (!status) return;
 53:     setSaving(true);
 54:     try {
 55:       await fetch("http://127.0.0.1:8000/review/items", {
 56:         method: "POST",
 57:         headers: { "Content-Type": "application/json" },
 58:         body: JSON.stringify(status.items),
 59:       });
 60:       alert("フィードバックを保存しました。エージェントが確認します。");
 61:     } finally {
 62:       setSaving(false);
 63:     }
 64:   };
 65: 
 66:   const approveAll = async () => {
 67:     if (!status) return;
 68:     if (!confirm("すべての機能が合格であることを確認しましたか？これ以上修正がない場合、GitHubへのプッシュを許可します。")) return;
 69:     
 70:     setSaving(true);
 71:     try {
 72:       const res = await fetch("http://127.0.0.1:8000/review/approve", {
 73:         method: "POST",
 74:       });
 75:       if (res.ok) {
 76:         const data = await res.json();
 77:         setStatus(data);
 78:         alert("合格！おめでとうございます。エージェントが次のデプロイ工程に進みます。");
 79:       }
 80:     } finally {
 81:       setSaving(false);
 82:     }
 83:   };
 84: 
 85:   if (loading) return (
 86:     <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
 87:       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
 88:     </div>
 89:   );
 90: 
 91:   const checkedCount = status?.items.filter(i => i.is_checked).length || 0;
 92:   const totalCount = status?.items.length || 0;
 93:   const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
 94: 
 95:   return (
 96:     <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
 97:       <LeftRail />
 98:       
 99:       <main className="flex-1 overflow-y-auto p-12">
100:         <div className="max-w-4xl mx-auto">
101:           <header className="mb-12 flex justify-between items-end">
102:             <div>
103:               <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">Review Dashboard</h1>
104:               <p className="text-slate-500 font-medium">実装機能のデザインと安定性をチェックしてください</p>
105:             </div>
106:             <div className="text-right">
107:               <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Progress</div>
108:               <div className="text-3xl font-mono font-black text-blue-600">{Math.round(progress)}%</div>
109:             </div>
110:           </header>
111: 
112:           <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-8">
113:             <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
114:               <h2 className="font-bold text-lg flex items-center gap-2">
115:                 <AlertCircle size={20} className="text-blue-500" />
116:                 現在のレビュー項目
117:               </h2>
118:               {status?.overall_status === 'approved' && (
119:                 <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold">
120:                   <CheckCircle size={16} />
121:                   ALL APPROVED
122:                 </div>
123:               )}
124:             </div>
125: 
126:             <div className="divide-y divide-slate-50">
127:               {status?.items.map((item) => (
128:                 <div key={item.id} className={`p-8 transition-colors ${item.is_checked ? 'bg-blue-50/10' : ''}`}>
129:                   <div className="flex gap-6">
130:                     <button 
131:                       onClick={() => toggleCheck(item.id)}
132:                       className={`mt-1 flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
133:                         item.is_checked ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
134:                       }`}
135:                     >
136:                       {item.is_checked ? <CheckCircle2 size={20} /> : <Circle size={20} />}
137:                     </button>
138:                     
139:                     <div className="flex-1">
140:                       <div className="flex items-center gap-3 mb-1">
141:                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
142:                           {item.category}
143:                         </span>
144:                         <h3 className={`font-bold text-lg ${item.is_checked ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
145:                           {item.title}
146:                         </h3>
147:                       </div>
148:                       <p className="text-slate-500 text-sm mb-4 leading-relaxed">
149:                         {item.description}
150:                       </p>
151:                       
152:                       <div className="relative group">
153:                         <textarea 
154:                           placeholder="修正点や気になったことがあれば記入してください..."
155:                           className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all resize-none h-24"
156:                           value={item.comment}
157:                           onChange={(e) => updateComment(item.id, e.target.value)}
158:                         />
159:                       </div>
160:                     </div>
161:                   </div>
162:                 </div>
163:               ))}
164:             </div>
165: 
166:             <div className="p-8 bg-slate-50/30 flex justify-between items-center">
167:               <button 
168:                 onClick={saveFeedback}
169:                 disabled={saving}
170:                 className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-white hover:shadow-md transition-all disabled:opacity-50"
171:               >
172:                 <Send size={18} />
173:                 フィードバックを保存
174:               </button>
175: 
176:               <button 
177:                 onClick={approveAll}
178:                 disabled={saving || status?.overall_status === 'approved' || progress < 100}
179:                 className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black tracking-tight text-white transition-all shadow-xl ${
180:                   progress === 100 && status?.overall_status !== 'approved'
181:                     ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200 scale-105' 
182:                     : 'bg-slate-300 cursor-not-allowed shadow-none'
183:                 }`}
184:               >
185:                 <CheckCircle2 size={20} />
186:                 合格（COMPLETE）
187:               </button>
188:             </div>
189:           </div>
190:           
191:           <p className="text-center text-slate-400 text-xs">
192:             ※「合格」をクリックすると、すべての作業が完了したとみなされ、必要に応じて最終的なデプロイ工程に進みます。
193:           </p>
194:         </div>
195:       </main>
196:     </div>
197:   );
198: }
````

## File: frontend/src/app/globals.css
````css
  1: @import "tailwindcss";
  2: 
  3: @theme {
  4:   --font-sans: var(--font-noto-sans), ui-sans-serif, system-ui;
  5:   --font-mono: var(--font-jetbrains-mono), ui-monospace, SFMono-Regular;
  6: 
  7:   --color-background: var(--background);
  8:   --color-foreground: var(--foreground);
  9:   --color-sidebar-ring: var(--sidebar-ring);
 10:   --color-sidebar-border: var(--sidebar-border);
 11:   --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
 12:   --color-sidebar-accent: var(--sidebar-accent);
 13:   --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
 14:   --color-sidebar-primary: var(--sidebar-primary);
 15:   --color-sidebar-foreground: var(--sidebar-foreground);
 16:   --color-sidebar: var(--sidebar);
 17:   --color-chart-5: var(--chart-5);
 18:   --color-chart-4: var(--chart-4);
 19:   --color-chart-3: var(--chart-3);
 20:   --color-chart-2: var(--chart-2);
 21:   --color-chart-1: var(--chart-1);
 22:   --color-ring: var(--ring);
 23:   --color-input: var(--input);
 24:   --color-border: var(--border);
 25:   --color-destructive: var(--destructive);
 26:   --color-accent-foreground: var(--accent-foreground);
 27:   --color-accent: var(--accent);
 28:   --color-muted-foreground: var(--muted-foreground);
 29:   --color-muted: var(--muted);
 30:   --color-secondary-foreground: var(--secondary-foreground);
 31:   --color-secondary: var(--secondary);
 32:   --color-primary-foreground: var(--primary-foreground);
 33:   --color-primary: var(--primary);
 34:   --color-popover-foreground: var(--popover-foreground);
 35:   --color-popover: var(--popover);
 36:   --color-card-foreground: var(--card-foreground);
 37:   --color-card: var(--card);
 38: 
 39:   --radius-sm: calc(var(--radius) - 4px);
 40:   --radius-md: calc(var(--radius) - 2px);
 41:   --radius-lg: var(--radius);
 42:   --radius-xl: calc(var(--radius) + 4px);
 43:   --radius-2xl: calc(var(--radius) + 8px);
 44:   --radius-3xl: calc(var(--radius) + 12px);
 45:   --radius-4xl: calc(var(--radius) + 16px);
 46: }
 47: 
 48: :root {
 49:   --radius: 0.625rem;
 50:   --background: oklch(1 0 0);
 51:   --foreground: oklch(0.145 0 0);
 52:   --card: oklch(1 0 0);
 53:   --card-foreground: oklch(0.145 0 0);
 54:   --popover: oklch(1 0 0);
 55:   --popover-foreground: oklch(0.145 0 0);
 56:   --primary: oklch(0.205 0 0);
 57:   --primary-foreground: oklch(0.985 0 0);
 58:   --secondary: oklch(0.97 0 0);
 59:   --secondary-foreground: oklch(0.205 0 0);
 60:   --muted: oklch(0.97 0 0);
 61:   --muted-foreground: oklch(0.556 0 0);
 62:   --accent: oklch(0.97 0 0);
 63:   --accent-foreground: oklch(0.205 0 0);
 64:   --destructive: oklch(0.577 0.245 27.325);
 65:   --border: oklch(0.922 0 0);
 66:   --input: oklch(0.922 0 0);
 67:   --ring: oklch(0.708 0 0);
 68:   --chart-1: oklch(0.646 0.222 41.116);
 69:   --chart-2: oklch(0.6 0.118 184.704);
 70:   --chart-3: oklch(0.398 0.07 227.392);
 71:   --chart-4: oklch(0.828 0.189 84.429);
 72:   --chart-5: oklch(0.769 0.188 70.08);
 73:   --sidebar: oklch(0.985 0 0);
 74:   --sidebar-foreground: oklch(0.145 0 0);
 75:   --sidebar-primary: oklch(0.205 0 0);
 76:   --sidebar-primary-foreground: oklch(0.985 0 0);
 77:   --sidebar-accent: oklch(0.97 0 0);
 78:   --sidebar-accent-foreground: oklch(0.205 0 0);
 79:   --sidebar-border: oklch(0.922 0 0);
 80:   --sidebar-ring: oklch(0.708 0 0);
 81: }
 82: 
 83: .dark {
 84:   --background: oklch(0.145 0 0);
 85:   --foreground: oklch(0.985 0 0);
 86:   --card: oklch(0.205 0 0);
 87:   --card-foreground: oklch(0.985 0 0);
 88:   --popover: oklch(0.205 0 0);
 89:   --popover-foreground: oklch(0.985 0 0);
 90:   --primary: oklch(0.922 0 0);
 91:   --primary-foreground: oklch(0.205 0 0);
 92:   --secondary: oklch(0.269 0 0);
 93:   --secondary-foreground: oklch(0.985 0 0);
 94:   --muted: oklch(0.269 0 0);
 95:   --muted-foreground: oklch(0.708 0 0);
 96:   --accent: oklch(0.269 0 0);
 97:   --accent-foreground: oklch(0.985 0 0);
 98:   --destructive: oklch(0.704 0.191 22.216);
 99:   --border: oklch(1 0 0 / 10%);
100:   --input: oklch(1 0 0 / 15%);
101:   --ring: oklch(0.556 0 0);
102:   --chart-1: oklch(0.488 0.243 264.376);
103:   --chart-2: oklch(0.696 0.17 162.48);
104:   --chart-3: oklch(0.769 0.188 70.08);
105:   --chart-4: oklch(0.627 0.265 303.9);
106:   --chart-5: oklch(0.645 0.246 16.439);
107:   --sidebar: oklch(0.205 0 0);
108:   --sidebar-foreground: oklch(0.985 0 0);
109:   --sidebar-primary: oklch(0.488 0.243 264.376);
110:   --sidebar-primary-foreground: oklch(0.985 0 0);
111:   --sidebar-accent: oklch(0.269 0 0);
112:   --sidebar-accent-foreground: oklch(0.985 0 0);
113:   --sidebar-border: oklch(1 0 0 / 10%);
114:   --sidebar-ring: oklch(0.556 0 0);
115: }
116: 
117: @layer base {
118:   * {
119:     border-color: var(--border);
120:   }
121:   body {
122:     background-color: var(--background);
123:     color: var(--foreground);
124:     margin: 0;
125:     padding: 0;
126:   }
127: }
````

## File: frontend/src/app/layout.tsx
````typescript
 1: import type { Metadata } from "next";
 2: import { Noto_Sans_JP, JetBrains_Mono } from "next/font/google";
 3: import "./globals.css";
 4: import Providers from "./providers";
 5: 
 6: const notoSansJP = Noto_Sans_JP({
 7:   subsets: ["latin"],
 8:   variable: "--font-noto-sans",
 9: });
10: 
11: const jetBrainsMono = JetBrains_Mono({
12:   subsets: ["latin"],
13:   variable: "--font-jetbrains-mono",
14: });
15: 
16: export const metadata: Metadata = {
17:   title: "TradeInfo v3",
18:   description: "Professional Stock Analysis Dashboard",
19: };
20: 
21: export default function RootLayout({
22:   children,
23: }: Readonly<{
24:   children: React.ReactNode;
25: }>) {
26:   return (
27:     <html lang="ja">
28:       <body className={`${notoSansJP.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
29:         <Providers>{children}</Providers>
30:       </body>
31:     </html>
32:   );
33: }
````

## File: frontend/src/app/providers.tsx
````typescript
 1: "use client";
 2: 
 3: import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 4: import { useState } from "react";
 5: 
 6: export default function Providers({ children }: { children: React.ReactNode }) {
 7:   const [queryClient] = useState(() => new QueryClient({
 8:     defaultOptions: {
 9:       queries: {
10:         staleTime: 60 * 1000,
11:       },
12:     },
13:   }));
14: 
15:   return (
16:     <QueryClientProvider client={queryClient}>
17:       {children}
18:     </QueryClientProvider>
19:   );
20: }
````

## File: frontend/src/components/dashboard/CategoryRail.tsx
````typescript
 1: "use client";
 2: 
 3: import { useStockStore } from "@/store/useStockStore";
 4: import { Plus, Edit2, Check, X } from "lucide-react";
 5: import { useState } from "react";
 6: 
 7: export default function CategoryRail() {
 8:   const { categories, activeCategoryId, setActiveCategory, renameCategory, addCategory } = useStockStore();
 9:   const [editingId, setEditingId] = useState<string | null>(null);
10:   const [editName, setEditName] = useState("");
11: 
12:   const handleStartEdit = (id: string, currentName: string) => {
13:     setEditingId(id);
14:     setEditName(currentName);
15:   };
16: 
17:   const handleSaveEdit = (id: string) => {
18:     if (editName.trim()) {
19:       renameCategory(id, editName.trim());
20:     }
21:     setEditingId(null);
22:   };
23: 
24:   return (
25:     <aside className="w-44 flex-shrink-0 border-r border-slate-200 bg-[#F1F5F9] flex flex-col h-full overflow-hidden">
26:       <div className="p-4 border-b border-slate-200 flex items-center justify-between">
27:         <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">ジャンル</h2>
28:         <button 
29:           onClick={() => addCategory("新カテゴリ")}
30:           className="p-1 hover:bg-slate-200 rounded text-slate-500"
31:           title="カテゴリ追加"
32:         >
33:           <Plus size={14} />
34:         </button>
35:       </div>
36: 
37:       <div className="flex-1 overflow-y-auto py-2">
38:         {categories.map((cat) => (
39:           <div 
40:             key={cat.id}
41:             onClick={() => setActiveCategory(cat.id)}
42:             className={`px-3 py-2.5 cursor-pointer flex items-center group transition-colors ${
43:               activeCategoryId === cat.id 
44:                 ? "bg-white text-blue-600 border-r-2 border-blue-600 shadow-sm" 
45:                 : "text-slate-600 hover:bg-slate-200"
46:             }`}
47:           >
48:             {editingId === cat.id ? (
49:               <div className="flex items-center w-full gap-1" onClick={e => e.stopPropagation()}>
50:                 <input
51:                   autoFocus
52:                   className="w-full text-sm py-0.5 px-1 border border-blue-400 rounded outline-none"
53:                   value={editName}
54:                   onChange={(e) => setEditName(e.target.value)}
55:                   onKeyDown={(e) => {
56:                     if (e.key === 'Enter') handleSaveEdit(cat.id);
57:                     if (e.key === 'Escape') setEditingId(null);
58:                   }}
59:                 />
60:                 <button onClick={() => handleSaveEdit(cat.id)} className="text-green-600">
61:                   <Check size={14} />
62:                 </button>
63:               </div>
64:             ) : (
65:               <div className="flex items-center justify-between w-full">
66:                 <span className={`text-sm font-medium truncate ${activeCategoryId === cat.id ? "font-bold" : ""}`}>
67:                   {cat.name}
68:                 </span>
69:                 <button
70:                   onClick={(e) => {
71:                     e.stopPropagation();
72:                     handleStartEdit(cat.id, cat.name);
73:                   }}
74:                   className={`p-1 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity ${activeCategoryId === cat.id ? "opacity-100" : ""}`}
75:                 >
76:                   <Edit2 size={12} />
77:                 </button>
78:               </div>
79:             )}
80:           </div>
81:         ))}
82:       </div>
83:       
84:       <div className="p-3 border-t border-slate-200 bg-slate-100/50">
85:         <p className="text-[10px] text-slate-400 leading-tight">
86:           ※各ジャンル最大10銘柄まで登録可能です
87:         </p>
88:       </div>
89:     </aside>
90:   );
91: }
````

## File: frontend/src/components/dashboard/CommandPalette.tsx
````typescript
 1: "use client";
 2: 
 3: import * as React from "react";
 4: import { Search } from "lucide-react";
 5: import { useStockStore } from "@/store/useStockStore";
 6: 
 7: export default function CommandPalette() {
 8:   const [open, setOpen] = React.useState(false);
 9:   const [query, setQuery] = React.useState("");
10:   const { setSelectedTicker, addToWatchlist } = useStockStore();
11: 
12:   React.useEffect(() => {
13:     const down = (e: KeyboardEvent) => {
14:       if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
15:         e.preventDefault();
16:         setOpen((open) => !open);
17:       }
18:     };
19:     document.addEventListener("keydown", down);
20:     return () => document.removeEventListener("keydown", down);
21:   }, []);
22: 
23:   if (!open) return null;
24: 
25:   const handleSearch = (e: React.FormEvent) => {
26:     e.preventDefault();
27:     if (query.match(/^\d{4}$/)) {
28:       setSelectedTicker(query);
29:       addToWatchlist(query);
30:       setOpen(false);
31:       setQuery("");
32:     }
33:   };
34: 
35:   return (
36:     <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-slate-900/50 backdrop-blur-sm">
37:       <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
38:         <form onSubmit={handleSearch} className="flex items-center p-4 gap-3 border-b border-slate-100">
39:           <Search className="text-slate-400" size={20} />
40:           <input
41:             autoFocus
42:             className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-lg"
43:             placeholder="Search stock code (e.g. 7203)..."
44:             value={query}
45:             onChange={(e) => setQuery(e.target.value)}
46:           />
47:           <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100 sm:flex">
48:             <span className="text-xs">⌘</span>K
49:           </kbd>
50:         </form>
51:         <div className="p-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
52:           Press ESC to close
53:         </div>
54:       </div>
55:     </div>
56:   );
57: }
````

## File: frontend/src/components/dashboard/MainChart.tsx
````typescript
  1: "use client";
  2: 
  3: import { useEffect, useRef } from "react";
  4: import { createChart, ColorType, CandlestickSeries, HistogramSeries, LineSeries, IChartApi, ISeriesApi } from "lightweight-charts";
  5: import { useStockStore } from "@/store/useStockStore";
  6: import { useQuery } from "@tanstack/react-query";
  7: 
  8: export default function MainChart() {
  9:   const chartContainerRef = useRef<HTMLDivElement>(null);
 10:   const chartRef = useRef<IChartApi | null>(null);
 11:   const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
 12:   const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
 13:   const vwapSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
 14:   const { selectedTicker } = useStockStore();
 15: 
 16:   const { data: stockData, isLoading } = useQuery({
 17:     queryKey: ['stock', selectedTicker],
 18:     queryFn: async () => {
 19:       const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
 20:       if (!resp.ok) throw new Error('Failed to fetch stock data');
 21:       return resp.json();
 22:     },
 23:     enabled: !!selectedTicker
 24:   });
 25: 
 26:   useEffect(() => {
 27:     if (!chartContainerRef.current) return;
 28: 
 29:     const chart = createChart(chartContainerRef.current, {
 30:       layout: {
 31:         background: { type: ColorType.Solid, color: "#FFFFFF" },
 32:         textColor: "#64748B",
 33:       },
 34:       grid: {
 35:         vertLines: { color: "#F8FAFC" },
 36:         horzLines: { color: "#F8FAFC" },
 37:       },
 38:       timeScale: {
 39:         rightOffset: 12,
 40:         barSpacing: 8,
 41:         timeVisible: false,
 42:         borderVisible: false,
 43:       },
 44:       rightPriceScale: {
 45:         borderVisible: false,
 46:         scaleMargins: {
 47:           top: 0.1,
 48:           bottom: 0.3, // 出来高用のスペースを空ける
 49:         },
 50:       },
 51:       width: chartContainerRef.current.clientWidth,
 52:       height: chartContainerRef.current.clientHeight,
 53:     });
 54: 
 55:     // 1. Candles
 56:     const candleSeries = chart.addSeries(CandlestickSeries, {
 57:       upColor: "#EF4444",
 58:       downColor: "#3B82F6",
 59:       borderVisible: false,
 60:       wickUpColor: "#EF4444",
 61:       wickDownColor: "#3B82F6",
 62:     });
 63: 
 64:     // 2. VWAP Line (Overlay on Candles)
 65:     const vwapSeries = chart.addSeries(LineSeries, {
 66:       color: "#FACC15",
 67:       lineWidth: 2,
 68:       priceFormat: { type: 'price' },
 69:       priceScaleId: 'right', // キャンドルと同じスケール
 70:     });
 71: 
 72:     // 3. Volume Histogram (Bottom Pane)
 73:     const volumeSeries = chart.addSeries(HistogramSeries, {
 74:       color: "#94A3B844",
 75:       priceFormat: { type: 'volume' },
 76:       priceScaleId: 'volume',
 77:     });
 78: 
 79:     chart.priceScale('volume').applyOptions({
 80:       scaleMargins: {
 81:         top: 0.8,
 82:         bottom: 0,
 83:       },
 84:     });
 85: 
 86:     chartRef.current = chart;
 87:     candleSeriesRef.current = candleSeries;
 88:     volumeSeriesRef.current = volumeSeries;
 89:     vwapSeriesRef.current = vwapSeries;
 90: 
 91:     const handleResize = () => {
 92:       if (chartContainerRef.current) {
 93:         chart.applyOptions({
 94:           width: chartContainerRef.current.clientWidth,
 95:           height: chartContainerRef.current.clientHeight,
 96:         });
 97:       }
 98:     };
 99:     window.addEventListener("resize", handleResize);
100: 
101:     return () => {
102:       window.removeEventListener("resize", handleResize);
103:       chart.remove();
104:     };
105:   }, []);
106: 
107:   useEffect(() => {
108:     if (!candleSeriesRef.current || !volumeSeriesRef.current || !vwapSeriesRef.current || !stockData?.history || stockData.history.length === 0) return;
109: 
110:     const candleData = stockData.history.map((item: any) => ({
111:       time: item.date,
112:       open: item.open,
113:       high: item.high,
114:       low: item.low,
115:       close: item.close,
116:     }));
117: 
118:     const vwapData = stockData.history.map((item: any) => ({
119:       time: item.date,
120:       value: item.vwap,
121:     }));
122: 
123:     const volumeData = stockData.history.map((item: any) => ({
124:       time: item.date,
125:       value: item.volume,
126:       color: item.close >= item.open ? "#EF444422" : "#3B82F622",
127:     }));
128: 
129:     candleSeriesRef.current.setData(candleData);
130:     vwapSeriesRef.current.setData(vwapData);
131:     volumeSeriesRef.current.setData(volumeData);
132:     chartRef.current?.timeScale().fitContent();
133:   }, [stockData]);
134: 
135:   return (
136:     <div className="w-full h-full relative">
137:       {isLoading && (
138:         <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
139:           <div className="text-slate-400 font-bold animate-pulse">Loading real chart data...</div>
140:         </div>
141:       )}
142:       <div ref={chartContainerRef} className="w-full h-full" />
143:     </div>
144:   );
145: }
````

## File: frontend/src/components/dashboard/MarketTicker.tsx
````typescript
 1: "use client";
 2: 
 3: import { useEffect } from "react";
 4: import { useStockStore } from "@/store/useStockStore";
 5: import { TrendingUp, TrendingDown, Minus } from "lucide-react";
 6: 
 7: export default function MarketTicker() {
 8:   const { marketIndices, updateMarketIndices } = useStockStore();
 9: 
10:   useEffect(() => {
11:     const fetchMarket = async () => {
12:       try {
13:         const resp = await fetch("http://127.0.0.1:8000/stocks/market");
14:         if (resp.ok) {
15:           const data = await resp.json();
16:           updateMarketIndices(data);
17:         }
18:       } catch (e) {
19:         console.error("Failed to fetch market indices", e);
20:       }
21:     };
22: 
23:     fetchMarket();
24:     // 1分ごとの更新はユーザー要望により停止。必要なら手動リロードや特定のアクションで。
25:   }, [updateMarketIndices]);
26: 
27:   if (!marketIndices) {
28:     return (
29:       <div className="h-full w-full bg-slate-50 border-b border-slate-200 flex items-center justify-center">
30:         <div className="text-slate-400 font-mono text-xs animate-pulse tracking-widest">INITIALIZING MARKET DATA...</div>
31:       </div>
32:     );
33:   }
34: 
35:   const IndexCard = ({ data, label }: { data: any, label: string }) => {
36:     const isUp = data.change.includes("+");
37:     const isDown = data.change.includes("-");
38: 
39:     return (
40:       <div className="flex-1 border-r border-slate-200 last:border-r-0 flex flex-col justify-center px-8 transition-colors hover:bg-white group">
41:         <div className="flex items-center gap-2 mb-0.5">
42:           <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">
43:             {label}
44:           </span>
45:         </div>
46:         <div className="flex items-baseline gap-3">
47:           <span className="text-2xl font-mono font-black text-slate-900 tracking-tighter">
48:             {data.price}
49:           </span>
50:           <div className={`flex items-center gap-1 text-sm font-mono font-bold ${isUp ? "text-red-500" : isDown ? "text-blue-500" : "text-slate-400"}`}>
51:             {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
52:             <span>{data.change}</span>
53:             <span className="text-[11px] opacity-80">({data.change_percent}%)</span>
54:           </div>
55:         </div>
56:       </div>
57:     );
58:   };
59: 
60:   return (
61:     <header className="h-full w-full bg-slate-50 border-b border-slate-200 flex z-20">
62:       <IndexCard data={marketIndices.nikkei225} label="Nikkei 225" />
63:       <IndexCard data={marketIndices.topix} label="TOPIX" />
64:       <IndexCard data={marketIndices.futures} label="Nikkei Futures" />
65:     </header>
66:   );
67: }
````

## File: frontend/src/components/dashboard/NewsList.tsx
````typescript
 1: "use client";
 2: 
 3: import { useStockStore } from "@/store/useStockStore";
 4: import { useQuery } from "@tanstack/react-query";
 5: import { ExternalLink, FileText, BarChart2, Globe, TrendingDown, Search } from "lucide-react";
 6: 
 7: export default function NewsList() {
 8:   const { selectedTicker } = useStockStore();
 9: 
10:   const { data, isLoading } = useQuery({
11:     queryKey: ['news', selectedTicker],
12:     queryFn: async () => {
13:       const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
14:       if (!resp.ok) throw new Error('Failed to fetch news');
15:       const json = await resp.json();
16:       return json.news;
17:     },
18:     enabled: !!selectedTicker
19:   });
20: 
21:   const analysisLinks = [
22:     { label: "バフェットコード", url: `https://www.buffett-code.com/company/${selectedTicker}`, icon: BarChart2 },
23:     { label: "適時開示", url: `https://kabutan.jp/stock/news?code=${selectedTicker}&category=cf`, icon: FileText },
24:     { label: "日経新聞", url: `https://www.nikkei.com/nkd/company/?scode=${selectedTicker}`, icon: Globe },
25:     { label: "空売り情報", url: `https://karauri.net/${selectedTicker}/`, icon: TrendingDown },
26:     { label: "Yahooファイナンス", url: `https://finance.yahoo.co.jp/quote/${selectedTicker}.T`, icon: Search },
27:   ];
28: 
29:   return (
30:     <div className="flex flex-row h-full bg-white divide-x divide-slate-100 overflow-hidden">
31:       {/* Left side: News List (2 Columns) */}
32:       <div className="flex-[3] flex flex-col p-4 overflow-hidden">
33:         <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-slate-900 pl-2 uppercase tracking-tight">
34:           最新のニュース & 出来事
35:         </h3>
36:         <div className="flex-1 overflow-y-auto pr-2">
37:           {isLoading && <div className="p-4 text-center text-slate-400 animate-pulse">Loading news...</div>}
38:           <div className="grid grid-cols-2 gap-3">
39:             {data && data.length > 0 ? (
40:               data.map((item: any, idx: number) => (
41:                 <a 
42:                   key={idx} 
43:                   href={item.url} 
44:                   target="_blank" 
45:                   rel="noopener noreferrer"
46:                   className="block p-3 border rounded-xl border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
47:                 >
48:                   <div className="text-[10px] text-slate-400 font-mono mb-1">{item.date || "TODAY"}</div>
49:                   <div className="text-xs text-slate-800 line-clamp-2 leading-snug font-bold group-hover:text-blue-700">
50:                     {item.title}
51:                   </div>
52:                 </a>
53:               ))
54:             ) : (
55:               !isLoading && <div className="col-span-2 p-4 text-center text-slate-400">No news found.</div>
56:             )}
57:           </div>
58:         </div>
59:       </div>
60: 
61:       {/* Right side: Vertical Link Panel */}
62:       <div className="flex-1 flex flex-col p-4 bg-slate-50/50">
63:         <h3 className="text-xs font-black text-slate-900 mb-4 uppercase tracking-tight">
64:           外部分析リンク
65:         </h3>
66:         <div className="flex flex-col gap-2">
67:           {analysisLinks.map((link) => {
68:             const Icon = link.icon;
69:             return (
70:               <a
71:                 key={link.label}
72:                 href={link.url}
73:                 target="_blank"
74:                 rel="noopener noreferrer"
75:                 className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-slate-700 transition-all group"
76:               >
77:                 <div className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600">
78:                   <Icon size={16} />
79:                 </div>
80:                 <div className="flex flex-col">
81:                   <span className="text-[11px] font-bold leading-none">{link.label}</span>
82:                   <span className="text-[9px] text-slate-400 font-mono">EXTERNAL</span>
83:                 </div>
84:                 <ExternalLink size={10} className="ml-auto text-slate-300 group-hover:text-blue-400" />
85:               </a>
86:             );
87:           })}
88:         </div>
89:       </div>
90:     </div>
91:   );
92: }
````

## File: frontend/src/lib/utils.ts
````typescript
1: import { clsx, type ClassValue } from "clsx"
2: import { twMerge } from "tailwind-merge"
3: 
4: export function cn(...inputs: ClassValue[]) {
5:   return twMerge(clsx(inputs))
6: }
````

## File: frontend/.gitignore
````
 1: # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2: 
 3: # dependencies
 4: /node_modules
 5: /.pnp
 6: .pnp.*
 7: .yarn/*
 8: !.yarn/patches
 9: !.yarn/plugins
10: !.yarn/releases
11: !.yarn/versions
12: 
13: # testing
14: /coverage
15: 
16: # next.js
17: /.next/
18: /out/
19: 
20: # production
21: /build
22: 
23: # misc
24: .DS_Store
25: *.pem
26: 
27: # debug
28: npm-debug.log*
29: yarn-debug.log*
30: yarn-error.log*
31: .pnpm-debug.log*
32: 
33: # env files (can opt-in for committing if needed)
34: .env*
35: 
36: # vercel
37: .vercel
38: 
39: # typescript
40: *.tsbuildinfo
41: next-env.d.ts
````

## File: frontend/components.json
````json
 1: {
 2:   "$schema": "https://ui.shadcn.com/schema.json",
 3:   "style": "new-york",
 4:   "rsc": true,
 5:   "tsx": true,
 6:   "tailwind": {
 7:     "config": "",
 8:     "css": "src/app/globals.css",
 9:     "baseColor": "neutral",
10:     "cssVariables": true,
11:     "prefix": ""
12:   },
13:   "iconLibrary": "lucide",
14:   "aliases": {
15:     "components": "@/components",
16:     "utils": "@/lib/utils",
17:     "ui": "@/components/ui",
18:     "lib": "@/lib",
19:     "hooks": "@/hooks"
20:   },
21:   "registries": {}
22: }
````

## File: frontend/eslint.config.mjs
````javascript
 1: import { defineConfig, globalIgnores } from "eslint/config";
 2: import nextVitals from "eslint-config-next/core-web-vitals";
 3: import nextTs from "eslint-config-next/typescript";
 4: 
 5: const eslintConfig = defineConfig([
 6:   ...nextVitals,
 7:   ...nextTs,
 8:   // Override default ignores of eslint-config-next.
 9:   globalIgnores([
10:     // Default ignores of eslint-config-next:
11:     ".next/**",
12:     "out/**",
13:     "build/**",
14:     "next-env.d.ts",
15:   ]),
16: ]);
17: 
18: export default eslintConfig;
````

## File: frontend/next.config.ts
````typescript
1: import type { NextConfig } from "next";
2: 
3: const nextConfig: NextConfig = {
4:   /* config options here */
5: };
6: 
7: export default nextConfig;
````

## File: frontend/postcss.config.mjs
````javascript
1: const config = {
2:   plugins: {
3:     "@tailwindcss/postcss": {},
4:   },
5: };
6: 
7: export default config;
````

## File: frontend/README.md
````markdown
 1: This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
 2: 
 3: ## Getting Started
 4: 
 5: First, run the development server:
 6: 
 7: ```bash
 8: npm run dev
 9: # or
10: yarn dev
11: # or
12: pnpm dev
13: # or
14: bun dev
15: ```
16: 
17: Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
18: 
19: You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
20: 
21: This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
22: 
23: ## Learn More
24: 
25: To learn more about Next.js, take a look at the following resources:
26: 
27: - [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
28: - [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
29: 
30: You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
31: 
32: ## Deploy on Vercel
33: 
34: The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
35: 
36: Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
````

## File: frontend/tsconfig.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "target": "ES2017",
 4:     "lib": ["dom", "dom.iterable", "esnext"],
 5:     "allowJs": true,
 6:     "skipLibCheck": true,
 7:     "strict": true,
 8:     "noEmit": true,
 9:     "esModuleInterop": true,
10:     "module": "esnext",
11:     "moduleResolution": "bundler",
12:     "resolveJsonModule": true,
13:     "isolatedModules": true,
14:     "jsx": "react-jsx",
15:     "incremental": true,
16:     "plugins": [
17:       {
18:         "name": "next"
19:       }
20:     ],
21:     "paths": {
22:       "@/*": ["./src/*"]
23:     }
24:   },
25:   "include": [
26:     "next-env.d.ts",
27:     "**/*.ts",
28:     "**/*.tsx",
29:     ".next/types/**/*.ts",
30:     ".next/dev/types/**/*.ts",
31:     "**/*.mts"
32:   ],
33:   "exclude": ["node_modules"]
34: }
````

## File: public/vite.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"></stop><stop offset="8.333%" stop-color="#FFDD35"></stop><stop offset="100%" stop-color="#FFA800"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>
````

## File: src/assets/react.svg
````xml
1: <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
````

## File: src/components/AnalysisLinks.tsx
````typescript
 1: import React from 'react';
 2: 
 3: type Props = {
 4:   code: string;
 5: };
 6: 
 7: const AnalysisLinks: React.FC<Props> = ({ code }) => {
 8:   const links = [
 9:     {
10:       name: "Yahoo!ファイナンス（日本）",
11:       url: `https://finance.yahoo.co.jp/quote/${code}.T`,
12:       color: "bg-red-700 hover:bg-red-800",
13:       description: "株価詳細・チャート・ニュース"
14:     },
15:     {
16:       name: "Yahoo!掲示板",
17:       url: `https://finance.yahoo.co.jp/quote/${code}.T/bbs`,
18:       color: "bg-red-800 hover:bg-red-900",
19:       description: "投資家の反応・口コミ"
20:     },
21:     {
22:       name: "株探（ニュース・特集）",
23:       url: `https://kabutan.jp/stock/?code=${code}`,
24:       color: "bg-red-600 hover:bg-red-700",
25:       description: "速報ニュースと決算情報"
26:     },
27:     {
28:       name: "空売りネット（機関の動き）",
29:       url: `https://karauri.net/${code}/`,
30:       color: "bg-yellow-600 hover:bg-yellow-700", // オレンジ寄りの黄色
31:       description: "機関投資家の空売り残高"
32:     },
33:     {
34:       name: "IR BANK（信用需給・業績）",
35:       url: `https://irbank.net/${code}/`,
36:       color: "bg-blue-600 hover:bg-blue-700",
37:       description: "財務状況と信用倍率"
38:     },
39:     {
40:       name: "Yahoo Finance US (ニュース)",
41:       url: `https://finance.yahoo.com/quote/${code}.T/news`,
42:       color: "bg-purple-600 hover:bg-purple-700",
43:       description: "米国版Yahooのニュース（英語）"
44:     },
45:     {
46:       name: "Google ファイナンス",
47:       url: `https://www.google.com/finance/quote/${code}:TYO`,
48:       color: "bg-blue-500 hover:bg-blue-600",
49:       description: "Googleの株価・ニュース"
50:     }
51:   ];
52: 
53:   return (
54:     <div className="flex flex-col space-y-4">
55:       <h2 className="text-lg font-semibold text-gray-200 mb-2 border-l-4 border-blue-500 pl-3">
56:         分析ツール
57:       </h2>
58:       <div className="grid grid-cols-1 gap-3">
59:         {links.map((link) => (
60:           <a
61:             key={link.name}
62:             href={link.url}
63:             target="_blank"
64:             rel="noopener noreferrer"
65:             className={`${link.color} text-white p-4 rounded-lg shadow transition-transform transform hover:scale-102 flex flex-col items-start justify-center group`}
66:           >
67:             <span className="font-bold text-lg flex items-center">
68:                 {link.name}
69:                  <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
70:             </span>
71:             <span className="text-xs opacity-80 mt-1">{link.description}</span>
72:           </a>
73:         ))}
74:       </div>
75:     </div>
76:   );
77: };
78: 
79: export default AnalysisLinks;
````

## File: src/components/Header.tsx
````typescript
 1: import React, { useState, type FormEvent } from 'react';
 2: 
 3: type Props = {
 4:   currentCode: string;
 5:   onCodeChange: (code: string) => void;
 6: };
 7: 
 8: const Header: React.FC<Props> = ({ currentCode, onCodeChange }) => {
 9:   const [input, setInput] = useState(currentCode);
10: 
11:   const handleSubmit = (e: FormEvent) => {
12:     e.preventDefault();
13:     // 4桁の数字のみ許可
14:     if (/^\d{4}$/.test(input)) {
15:         onCodeChange(input);
16:     } else {
17:         alert("銘柄コードは4桁の半角数字で入力してください");
18:     }
19:   };
20: 
21:   return (
22:     <header className="bg-gray-800 p-4 border-b border-gray-700 flex items-center justify-between shadow-md">
23:       <div className="flex items-center space-x-4">
24:         <h1 className="text-xl font-bold text-white tracking-wide">
25:           📈 株情報分析
26:         </h1>
27:         <form onSubmit={handleSubmit} className="flex items-center">
28:             <input
29:                 type="text"
30:                 value={input}
31:                 onChange={(e) => setInput(e.target.value)}
32:                 placeholder="銘柄コード (例: 7203)"
33:                 className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 font-mono text-lg"
34:                 maxLength={4}
35:             />
36:             <button
37:                 type="submit"
38:                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
39:             >
40:                 分析
41:             </button>
42:         </form>
43:       </div>
44:       <div className="text-gray-400 text-sm">
45:         市場: 東証 | データ: 遅延
46:       </div>
47:     </header>
48:   );
49: };
50: 
51: export default Header;
````

## File: src/components/Layout.tsx
````typescript
 1: import React, { type ReactNode } from 'react';
 2: 
 3: type Props = {
 4:   header: ReactNode;
 5:   chart: ReactNode;
 6:   sidebar: ReactNode;
 7: };
 8: 
 9: const Layout: React.FC<Props> = ({ header, chart, sidebar }) => {
10:   return (
11:     <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
12:       {/* Header Area */}
13:       <div className="flex-none z-10">
14:         {header}
15:       </div>
16: 
17:       {/* Main Content Area */}
18:       <div className="flex-1 flex overflow-hidden p-4 gap-4">
19:         {/* Chart Area (Only render if chart is provided) */}
20:         {chart && (
21:           <div className="flex-[7] bg-gray-800 rounded-xl shadow-inner border border-gray-700 overflow-hidden relative">
22:             {chart}
23:           </div>
24:         )}
25: 
26:         {/* Sidebar Area (Expand if chart is missing) */}
27:         <div className={`flex flex-col min-w-[300px] overflow-y-auto pr-2 ${chart ? 'flex-[3]' : 'flex-1 max-w-4xl mx-auto w-full'}`}>
28:           {sidebar}
29:         </div>
30:       </div>
31:     </div>
32:   );
33: };
34: 
35: export default Layout;
````

## File: src/components/Notepad.tsx
````typescript
 1: import React, { useState, useEffect } from 'react';
 2: 
 3: const Notepad: React.FC = () => {
 4:   const [note, setNote] = useState("");
 5: 
 6:   useEffect(() => {
 7:     const savedNote = localStorage.getItem("dashboard_note");
 8:     if (savedNote) {
 9:       setNote(savedNote);
10:     }
11:   }, []);
12: 
13:   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
14:     const newVal = e.target.value;
15:     setNote(newVal);
16:     localStorage.setItem("dashboard_note", newVal);
17:   };
18: 
19:   return (
20:     <div className="flex flex-col h-full mt-6">
21:       <h2 className="text-lg font-semibold text-gray-200 mb-2 border-l-4 border-green-500 pl-3">
22:         メモ帳 <span className="text-xs font-normal text-gray-500 ml-2">(自動保存)</span>
23:       </h2>
24:       <textarea
25:         className="flex-1 w-full bg-gray-800 text-gray-200 p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-green-500 resize-none font-sans leading-relaxed"
26:         placeholder="ここに分析メモを残せます..."
27:         value={note}
28:         onChange={handleChange}
29:       />
30:     </div>
31:   );
32: };
33: 
34: export default Notepad;
````

## File: src/App.tsx
````typescript
 1: import { useState } from 'react';
 2: import Layout from './components/Layout';
 3: import Header from './components/Header';
 4: import AnalysisLinks from './components/AnalysisLinks';
 5: import Notepad from './components/Notepad';
 6: 
 7: function App() {
 8:   const [stockCode, setStockCode] = useState("7203"); // Default: Toyota
 9: 
10:   return (
11:     <Layout
12:       header={
13:         <Header 
14:           currentCode={stockCode} 
15:           onCodeChange={setStockCode} 
16:         />
17:       }
18:       chart={null}
19:       sidebar={
20:         <div className="flex flex-col h-full">
21:             <AnalysisLinks code={stockCode} />
22:             <div className="flex-1 min-h-[300px]">
23:                 <Notepad />
24:             </div>
25:         </div>
26:       }
27:     />
28:   );
29: }
30: 
31: export default App;
````

## File: src/index.css
````css
 1: @tailwind base;
 2: @tailwind components;
 3: @tailwind utilities;
 4: 
 5: :root {
 6:   font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
 7:   line-height: 1.5;
 8:   font-weight: 400;
 9: 
10:   color-scheme: light dark;
11:   color: rgba(255, 255, 255, 0.87);
12:   background-color: #242424;
13: 
14:   font-synthesis: none;
15:   text-rendering: optimizeLegibility;
16:   -webkit-font-smoothing: antialiased;
17:   -moz-osx-font-smoothing: grayscale;
18: }
19: 
20: body {
21:   margin: 0;
22:   display: flex;
23:   place-items: center;
24:   min-width: 320px;
25:   min-height: 100vh;
26: }
27: 
28: h1 {
29:   font-size: 3.2em;
30:   line-height: 1.1;
31: }
32: 
33: /* Reset for our full width app */
34: body {
35:   display: block;
36:   place-items: initial;
37:   background-color: #111827; /* gray-900 */
38: }
````

## File: src/main.tsx
````typescript
 1: import { StrictMode } from 'react'
 2: import { createRoot } from 'react-dom/client'
 3: import './index.css'
 4: import App from './App.tsx'
 5: 
 6: createRoot(document.getElementById('root')!).render(
 7:   <StrictMode>
 8:     <App />
 9:   </StrictMode>,
10: )
````

## File: templates/partials/stock_panel.html
````html
  1: <!-- Header Info Grid (Multi-row for Rich Data) -->
  2:     <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-x-6 gap-y-4 border-b-2 border-[#30363d] pb-6 mb-6">
  3:         <div class="col-span-2">
  4:             <div class="flex items-center gap-2 mb-1">
  5:                 <span class="text-[10px] bg-blue-900 text-blue-200 px-1 rounded">{{ stock.market }}</span>
  6:                 <span class="text-[10px] text-gray-400">#{{ current_code }}</span>
  7:             </div>
  8:             <h2 id="ticker-code-display" data-stock-code="{{ current_code }}" class="text-xl font-bold text-[#f0f6fc]">{{ stock.name }}</h2>
  9:         </div>
 10:         
 11:         <!-- Price & Change -->
 12:         <div class="border-l border-[#30363d] pl-4">
 13:             <div class="text-[10px] text-gray-500 uppercase">現在値 ({{ stock.time }})</div>
 14:             <div class="text-xl font-bold {{ 'text-red-500' if '+' in stock.change else 'text-green-500' if '-' in stock.change else 'text-white' }}">
 15:                 {{ stock.price }}
 16:             </div>
 17:             <div class="text-[10px] {{ 'text-red-500' if '+' in stock.change else 'text-green-500' if '-' in stock.change else 'text-white' }}">
 18:                 {{ stock.change }} ({{ stock.change_pct }})
 19:             </div>
 20:         </div>
 21: 
 22:         <!-- VWAP & Volume -->
 23:         <div class="border-l border-[#30363d] pl-4">
 24:             <div class="text-[10px] text-gray-500 uppercase">VWAP</div>
 25:             <div class="text-md font-semibold text-gray-300">{{ stock.vwap }}</div>
 26:             <div class="text-[10px] text-gray-500 mt-1 uppercase">出来高</div>
 27:             <div class="text-md font-semibold text-gray-300">{{ stock.volume }}</div>
 28:         </div>
 29: 
 30:         <!-- Margin Balance -->
 31:         <div class="border-l border-[#30363d] pl-4">
 32:             <div class="text-[10px] text-gray-500 uppercase">信用買残</div>
 33:             <div class="text-md font-semibold text-gray-300">{{ stock.margin_buy }}</div>
 34:             <div class="text-[10px] text-gray-500 mt-1 uppercase">信用売残</div>
 35:             <div class="text-md font-semibold text-gray-300">{{ stock.margin_sell }}</div>
 36:         </div>
 37: 
 38:         <!-- Margin Ratio & Kairi -->
 39:         <div class="border-l border-[#30363d] pl-4">
 40:             <div class="text-[10px] text-gray-500 uppercase">貸借倍率</div>
 41:             <div class="text-md font-semibold text-gray-300">{{ stock.margin_ratio }}</div>
 42:             <div class="text-[10px] text-gray-500 mt-1 uppercase">25日乖離</div>
 43:             <div class="text-md font-semibold {{ 'text-red-400' if '+' in stock.kairi_25 else 'text-green-400' }}">{{ stock.kairi_25 }}</div>
 44:         </div>
 45: 
 46:         <!-- Yield & Earnings -->
 47:         <div class="border-l border-[#30363d] pl-4">
 48:             <div class="text-[10px] text-gray-500 uppercase">配当利回り</div>
 49:             <div class="text-md font-semibold text-gray-300">{{ stock.yield }}</div>
 50:             <div class="text-[10px] text-gray-500 mt-1 uppercase">75日乖離</div>
 51:             <div class="text-md font-semibold {{ 'text-red-400' if '+' in stock.kairi_75 else 'text-green-400' }}">{{ stock.kairi_75 }}</div>
 52:         </div>
 53: 
 54:         <!-- Earnings Plan -->
 55:         <div class="border-l border-[#30363d] pl-4">
 56:             <div class="text-[10px] text-gray-500 uppercase">決算発表日</div>
 57:             <div class="text-xs font-semibold text-gray-300 mt-1">{{ stock.earnings_date }}</div>
 58:             <a href="https://finance.yahoo.co.jp/quote/{{ current_code }}.T/bbs" target="_blank" class="block mt-2 text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-center">
 59:                 掲示板
 60:             </a>
 61:         </div>
 62:     </div>
 63: 
 64:     <!-- Layout Grid -->
 65:     <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
 66:         <!-- Left Column: Chart & News -->
 67:         <div class="lg:col-span-3 space-y-6">
 68:             <div class="flex justify-between items-center bg-[#161b22] border border-[#30363d] p-2 rounded-lg">
 69:                 <div class="flex gap-4 items-center pl-2">
 70:                     <label class="flex items-center gap-2 cursor-pointer group">
 71:                         <input type="checkbox" checked onchange="window.toggleMA()" class="w-3 h-3 accent-blue-500">
 72:                         <span class="text-[10px] font-bold text-gray-400 group-hover:text-white transition">MOVING AVERAGES</span>
 73:                     </label>
 74:                     <div class="flex gap-2 text-[10px] font-bold opacity-60">
 75:                         <span class="text-yellow-400">● MA5</span>
 76:                         <span class="text-pink-400">● MA25</span>
 77:                     </div>
 78:                 </div>
 79:                 <div class="flex bg-[#0d1117] border border-[#30363d] rounded p-1 gap-1">
 80:                     <button onclick="window.initStockChart('chart-container', 'candle')" class="px-3 py-1 text-[10px] btn-speed">Candle</button>
 81:                     <button onclick="window.initStockChart('chart-container', 'line')" class="px-3 py-1 text-[10px] btn-speed">Line</button>
 82:                     <button onclick="window.initStockChart('chart-container', 'area')" class="px-3 py-1 text-[10px] btn-speed">Area</button>
 83:                 </div>
 84:             </div>
 85:             
 86:             <!-- Chart Container -->
 87:             <div id="chart-container" 
 88:                  class="w-full bg-[#161b22] border border-[#30363d] rounded-lg" 
 89:                  style="height: 400px; display: block;">
 90:             </div>
 91: 
 92:             <div>
 93:                 <p class="section-header">LATEST NEWS (KABUTAN)</p>
 94:                 <div class="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
 95:                     {% if news %}
 96:                         {% for item in news %}
 97:                         <div class="p-3 border-b border-[#21262d] last:border-0 hover:bg-[#21262d] transition">
 98:                             <a href="{{ item.url }}" target="_blank" class="text-sm text-[#c9d1d9] hover:text-[#58a6ff] flex justify-between">
 99:                                 <span>{{ item.title }}</span>
100:                                 <svg class="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
101:                             </a>
102:                         </div>
103:                         {% endfor %}
104:                     {% else %}
105:                         <div class="p-6 text-center text-gray-500 text-sm italic">No data available.</div>
106:                     {% endif %}
107:                 </div>
108:             </div>
109:         </div>
110: 
111:         <!-- Right: Analysis Links -->
112:         <div class="space-y-4">
113:             <p class="section-header">ANALYSIS TOOLS</p>
114:             <div class="flex flex-col gap-2">
115:                 {% set tools = [
116:                     ('Nikkei', 'https://www.nikkei.com/nkd/company/chart/?scode=' ~ current_code, 'Smart Chart'),
117:                     ('Yahoo JP', 'https://finance.yahoo.co.jp/quote/' ~ current_code ~ '.T', 'Stock Details'),
118:                     ('BBS', 'https://finance.yahoo.co.jp/quote/' ~ current_code ~ '.T/bbs', 'Comments'),
119:                     ('Karauri', 'https://karauri.net/' ~ current_code ~ '/', 'Short Sell'),
120:                     ('IR BANK', 'https://irbank.net/' ~ current_code ~ '/', 'Financials'),
121:                     ('Buffett', 'https://www.buffett-code.com/company/' ~ current_code ~ '/', 'Analysis')
122:                 ] %}
123:                 {% for name, url, desc in tools %}
124:                     <a href="{{ url }}" target="_blank" class="p-4 bg-[#161b22] border border-[#30363d] rounded-lg hover:border-blue-500 transition group">
125:                         <div class="font-bold text-[#58a6ff] group-hover:text-blue-400">{{ name }}</div>
126:                         <div class="text-[10px] text-gray-500 uppercase tracking-wider">{{ desc }}</div>
127:                     </a>
128:                 {% endfor %}
129:             </div>
130:         </div>
131:     </div>
132: </div>
````

## File: templates/partials/watchlist.html
````html
 1: <p class="section-header">WATCH LIST</p>
 2: <div class="space-y-[1px]">
 3:     {% for code, name in favorites.items() %}
 4:     <div class="watchlist-item p-2 flex justify-between items-center group cursor-pointer" 
 5:          hx-get="/stock/{{ code }}" hx-target="#main-panel" hx-push-url="true">
 6:         <div class="flex flex-col overflow-hidden">
 7:             <span class="ticker-link text-xs">{{ code }}</span>
 8:             <span class="text-[10px] text-gray-400 truncate">{{ name }}</span>
 9:         </div>
10:         <button hx-post="/favorites/remove" hx-vals='{"code": "{{ code }}"}' hx-target="#watchlist-container" 
11:                 class="hidden group-hover:block text-gray-500 hover:text-red-500 text-xs">×</button>
12:     </div>
13:     {% endfor %}
14: </div>
````

## File: templates/base.html
````html
  1: <!DOCTYPE html>
  2: <html lang="ja">
  3: <head>
  4:     <meta charset="UTF-8">
  5:     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  6:     <title>Market Speed Web</title>
  7:     <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  8:     <script src="https://cdn.tailwindcss.com"></script>
  9:     <script src="https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js"></script>
 10:     <style>
 11:         body { background-color: #0d1117; color: #e6edf3; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
 12:         .sidebar { background-color: #161b22; border-right: 1px solid #30363d; }
 13:         .section-header { font-size: 0.75rem; font-weight: 600; color: #8b949e; border-left: 3px solid #1f6feb; padding-left: 8px; margin: 16px 0 8px 0; text-transform: uppercase; }
 14:         .btn-speed { background-color: #21262d; border: 1px solid #30363d; color: #c9d1d9; border-radius: 4px; transition: 0.2s; }
 15:         .btn-speed:hover { background-color: #30363d; border-color: #8b949e; color: #fff; }
 16:         .watchlist-item { border-bottom: 1px solid #21262d; }
 17:         .watchlist-item:hover { background-color: #1f242c; }
 18:         .ticker-link { color: #58a6ff; font-weight: bold; }
 19:         ::-webkit-scrollbar { width: 8px; }
 20:         ::-webkit-scrollbar-track { background: #0d1117; }
 21:         ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 4px; }
 22:         ::-webkit-scrollbar-thumb:hover { background: #484f58; }
 23:     </style>
 24: </head>
 25: <body class="bg-[#0d1117] text-[#e6edf3]">
 26:     {% block content %}{% endblock %}
 27: 
 28:     <script>
 29:         // Global State
 30:         window.currentChartType = 'candle';
 31:         window.showMA = true;
 32: 
 33:         window.toggleMA = function() {
 34:             window.showMA = !window.showMA;
 35:             window.initStockChart('chart-container', window.currentChartType, window.showMA);
 36:         };
 37: 
 38:         window.initStockChart = async function(containerId, chartType = null, showMA = null) {
 39:             const container = document.getElementById(containerId);
 40:             if (!container) return;
 41:             
 42:             if (chartType !== null) window.currentChartType = chartType;
 43:             if (showMA !== null) window.showMA = showMA;
 44: 
 45:             const codeHeader = document.querySelector('[data-stock-code]');
 46:             const code = codeHeader ? codeHeader.getAttribute('data-stock-code') : null;
 47:             if (!code) return;
 48: 
 49:             container.innerHTML = '<div class="p-10 text-center text-gray-500 text-sm italic">Loading Chart...</div>';
 50:             
 51:             if (typeof LightweightCharts === 'undefined') {
 52:                 container.innerHTML = '<div class="p-4 text-red-500 text-xs">Library not loaded</div>';
 53:                 return;
 54:             }
 55:             
 56:             try {
 57:                 const response = await fetch(`/api/stock_data/${code}`);
 58:                 const candleData = await response.json();
 59:                 
 60:                 if (candleData.error) {
 61:                     container.innerHTML = `<div class="p-10 text-center text-orange-500 text-sm">Error: ${candleData.error}</div>`;
 62:                     return;
 63:                 }
 64: 
 65:                 container.innerHTML = '';
 66: 
 67:                 const chart = LightweightCharts.createChart(container, {
 68:                     width: container.clientWidth,
 69:                     height: 400,
 70:                     layout: { background: { type: 'solid', color: '#161b22' }, textColor: '#d1d4dc' },
 71:                     grid: {
 72:                         vertLines: { color: 'rgba(42, 46, 57, 0.05)' },
 73:                         horzLines: { color: 'rgba(42, 46, 57, 0.05)' },
 74:                     },
 75:                     rightPriceScale: { borderColor: 'rgba(197, 203, 206, 0.1)' },
 76:                     timeScale: { 
 77:                         borderColor: 'rgba(197, 203, 206, 0.1)',
 78:                         rightOffset: 50, // 右側に余白（約1cm分）
 79:                         barSpacing: 6,
 80:                     },
 81:                 });
 82: 
 83:                 // --- SERIES SETUP ---
 84:                 let mainSeries;
 85:                 if (window.currentChartType === 'line') {
 86:                     mainSeries = chart.addLineSeries({ color: '#58a6ff', lineWidth: 2 });
 87:                     mainSeries.setData(candleData.map(d => ({ time: d.time, value: d.close })));
 88:                 } else if (window.currentChartType === 'area') {
 89:                     mainSeries = chart.addAreaSeries({ 
 90:                         lineColor: '#58a6ff', topColor: 'rgba(88, 166, 255, 0.4)', bottomColor: 'rgba(88, 166, 255, 0.0)' 
 91:                     });
 92:                     mainSeries.setData(candleData.map(d => ({ time: d.time, value: d.close })));
 93:                 } else {
 94:                     mainSeries = chart.addCandlestickSeries({
 95:                         upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
 96:                         wickUpColor: '#26a69a', wickDownColor: '#ef5350'
 97:                     });
 98:                     mainSeries.setData(candleData);
 99:                 }
100: 
101:                 // Moving Averages (Conditional)
102:                 if (window.showMA) {
103:                     const ma5Data = [];
104:                     const ma25Data = [];
105:                     const prices = candleData.map(d => d.close);
106:                     
107:                     candleData.forEach((d, i) => {
108:                         if (i >= 4) {
109:                             const sum = prices.slice(i-4, i+1).reduce((a, b) => a + b, 0);
110:                             ma5Data.push({ time: d.time, value: sum/5 });
111:                         }
112:                         if (i >= 24) {
113:                             const sum = prices.slice(i-24, i+1).reduce((a, b) => a + b, 0);
114:                             ma25Data.push({ time: d.time, value: sum/25 });
115:                         }
116:                     });
117: 
118:                     const ma5Series = chart.addLineSeries({ color: 'rgba(255, 255, 0, 0.5)', lineWidth: 1, title: 'MA5' });
119:                     ma5Series.setData(ma5Data);
120:                     const ma25Series = chart.addLineSeries({ color: 'rgba(255, 0, 255, 0.5)', lineWidth: 1, title: 'MA25' });
121:                     ma25Series.setData(ma25Data);
122:                 }
123: 
124:                 window.addEventListener('resize', () => {
125:                     if (container && container.clientWidth > 0) {
126:                         chart.applyOptions({ width: container.clientWidth });
127:                     }
128:                 });
129: 
130:                 console.log(`Chart Rendered (${code}): ${window.currentChartType} (MA: ${window.showMA})`);
131:             } catch (e) {
132:                 console.error("Chart Error:", e);
133:                 container.innerHTML = '<div class="p-4 text-orange-500 text-xs text-center">Rendering Error: ' + e.message + '</div>';
134:             }
135:         };
136: 
137:         // Handle HTMX swaps
138:         window.addEventListener('load', () => window.initStockChart('chart-container'));
139:         document.body.addEventListener('htmx:afterSettle', (evt) => {
140:             if (evt.detail.target.id === 'main-panel' || document.getElementById('chart-container')) {
141:                 window.initStockChart('chart-container');
142:             }
143:         });
144:     </script>
145: </body>
146: </html>
````

## File: templates/index.html
````html
 1: {% extends "base.html" %}
 2: 
 3: {% block content %}
 4: <div class="flex flex-row min-h-screen">
 5:     <!-- Sidebar -->
 6:     <aside class="sidebar w-64 flex flex-col">
 7:         <div class="p-4 border-bottom border-gray-700 flex justify-between items-center bg-[#0d1117]">
 8:             <h1 class="text-lg font-bold text-blue-500">MARKET SPEED</h1>
 9:         </div>
10: 
11:         <div class="flex-1 overflow-y-auto p-2">
12:             <div id="watchlist-container">
13:                 {% include "partials/watchlist.html" %}
14:             </div>
15: 
16:             <div class="mt-4 p-2">
17:                 <form hx-post="/favorites/add" hx-target="#watchlist-container" class="flex gap-1">
18:                     <input type="text" name="code" placeholder="ADD" class="bg-[#0d1117] border border-[#30363d] rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-blue-500">
19:                     <button type="submit" class="btn-speed px-3 py-1">＋</button>
20:                 </form>
21:             </div>
22: 
23:             <div class="mt-2">
24:                 <details class="text-[10px] text-gray-500 cursor-pointer">
25:                     <summary class="hover:text-gray-300">BATCH IMPORT</summary>
26:                     <form hx-post="/favorites/import" hx-target="#watchlist-container" class="mt-2">
27:                         <textarea name="text" rows="3" class="bg-[#0d1117] border border-[#30363d] rounded w-full p-1 text-[10px] focus:outline-none" placeholder="Paste text..."></textarea>
28:                         <button type="submit" class="btn-speed w-full mt-1 py-1">IMPORT</button>
29:                     </form>
30:                 </details>
31:             </div>
32:         </div>
33: 
34:         <div class="p-4 border-t border-[#30363d] text-[10px] text-gray-500">
35:             GOOGLE CLOUD READY V1.0
36:         </div>
37:     </aside>
38: 
39:     <!-- Main Content -->
40:     <main class="flex-1 flex flex-col overflow-hidden">
41:         <div id="main-panel" class="flex-1 overflow-y-auto">
42:             {% include "partials/stock_panel.html" %}
43:         </div>
44:     </main>
45: </div>
46: {% endblock %}
````

## File: .gitignore
````
 1: # Python
 2: venv/
 3: __pycache__/
 4: *.pyc
 5: .env
 6: 
 7: # Data
 8: favorites.json
 9: 
10: # IDE
11: .vscode/
12: .idea/
13: .DS_Store
14: 
15: # Frontend
16: node_modules/
17: dist/
````

## File: app_v2.py
````python
  1: import os
  2: import json
  3: import re
  4: import requests
  5: from bs4 import BeautifulSoup
  6: from flask import Flask, render_template, request, jsonify
  7: from flask_cors import CORS
  8: 
  9: app = Flask(__name__)
 10: CORS(app)
 11: 
 12: FAVORITES_FILE = "favorites.json"
 13: 
 14: # ---------------------------------------------------------
 15: # 1. データの永続化と取得
 16: # ---------------------------------------------------------
 17: def load_favorites():
 18:     if os.path.exists(FAVORITES_FILE):
 19:         try:
 20:             with open(FAVORITES_FILE, "r") as f:
 21:                 data = json.load(f)
 22:                 if isinstance(data, list):
 23:                     return {c: "" for c in data}
 24:                 return data
 25:         except:
 26:             return {"6752": "パナソニック", "9434": "ソフトバンク"}
 27:     return {"6752": "パナソニック", "9434": "ソフトバンク"}
 28: 
 29: def save_favorites(favs):
 30:     with open(FAVORITES_FILE, "w") as f:
 31:         json.dump(favs, f, ensure_ascii=False)
 32: 
 33: def get_stock_name(stock_code):
 34:     if not stock_code or not re.match(r'^\d{4}$', stock_code):
 35:         return ""
 36:     url = f"https://kabutan.jp/stock/?code={stock_code}"
 37:     headers = {"User-Agent": "Mozilla/5.0"}
 38:     try:
 39:         response = requests.get(url, headers=headers, timeout=5)
 40:         soup = BeautifulSoup(response.text, 'html.parser')
 41:         title = soup.find('div', class_='company_block')
 42:         if title:
 43:             h3 = title.find('h3')
 44:             if h3:
 45:                 name = h3.get_text(strip=True)
 46:                 name = re.sub(r'^\d{4}\s*', '', name)
 47:                 return name
 48:         return ""
 49:     except:
 50:         return ""
 51: 
 52: def get_kabutan_news(stock_code):
 53:     url = f"https://kabutan.jp/stock/news?code={stock_code}"
 54:     headers = {"User-Agent": "Mozilla/5.0"}
 55:     try:
 56:         response = requests.get(url, headers=headers, timeout=5)
 57:         soup = BeautifulSoup(response.text, 'html.parser')
 58:         news_items = []
 59:         table = soup.find('table', class_='s_news_list')
 60:         if table:
 61:             rows = table.find_all('tr')
 62:             for row in rows:
 63:                 time_td = row.find('td', class_='date')
 64:                 time_str = time_td.get_text(strip=True) if time_td else ""
 65:                 link_tag = row.find('a')
 66:                 if link_tag:
 67:                     title = link_tag.get_text(strip=True)
 68:                     href = link_tag.get('href')
 69:                     if not href.startswith('http'):
 70:                         href = f"https://kabutan.jp{href}"
 71:                     news_items.append({"title": f"[{time_str}] {title}", "url": href})
 72:                 if len(news_items) >= 15: break
 73:         return news_items
 74:     except:
 75:         return []
 76: 
 77: # ---------------------------------------------------------
 78: # 2. ルート定義
 79: # ---------------------------------------------------------
 80: @app.route("/")
 81: def index():
 82:     favs = load_favorites()
 83:     current_code = request.args.get("code")
 84:     if not current_code:
 85:         current_code = list(favs.keys())[0] if favs else "7203"
 86:     
 87:     stock_name = favs.get(current_code, "")
 88:     if not stock_name:
 89:         stock_name = get_stock_name(current_code)
 90:     
 91:     news = get_kabutan_news(current_code)
 92:     
 93:     return render_template("index.html", 
 94:                            favorites=favs, 
 95:                            current_code=current_code, 
 96:                            stock_name=stock_name,
 97:                            news=news)
 98: 
 99: @app.route("/stock/<codeSegment>")
100: def stock_panel(codeSegment):
101:     """HTMX用：銘柄詳細パネルのみを返す"""
102:     favs = load_favorites()
103:     name = favs.get(codeSegment, "")
104:     if not name:
105:         name = get_stock_name(codeSegment)
106:     news = get_kabutan_news(codeSegment)
107:     return render_template("partials/stock_panel.html", 
108:                            current_code=codeSegment, 
109:                            stock_name=name, 
110:                            news=news)
111: 
112: @app.route("/favorites/add", methods=["POST"])
113: def add_favorite():
114:     code = request.form.get("code")
115:     if code and re.match(r'^\d{4}$', code):
116:         favs = load_favorites()
117:         if code not in favs:
118:             name = get_stock_name(code)
119:             favs[code] = name
120:             save_favorites(favs)
121:     return render_template("partials/watchlist.html", favorites=load_favorites())
122: 
123: @app.route("/favorites/remove", methods=["POST"])
124: def remove_favorite():
125:     code = request.form.get("code")
126:     favs = load_favorites()
127:     if code in favs:
128:         del favs[code]
129:         save_favorites(favs)
130:     return render_template("partials/watchlist.html", favorites=load_favorites())
131: 
132: @app.route("/favorites/import", methods=["POST"])
133: def import_favorites():
134:     text = request.form.get("text")
135:     codes = re.findall(r'\b(\d{4})\b', text)
136:     favs = load_favorites()
137:     for c in codes:
138:         if c not in favs:
139:             favs[c] = get_stock_name(c)
140:     save_favorites(favs)
141:     return render_template("partials/watchlist.html", favorites=load_favorites())
142: 
143: if __name__ == "__main__":
144:     app.run(debug=True, port=5001)
````

## File: app.py
````python
  1: import os
  2: import json
  3: import re
  4: import requests
  5: from bs4 import BeautifulSoup
  6: import yfinance as yf
  7: from flask import Flask, render_template, request, jsonify
  8: from flask_cors import CORS
  9: 
 10: app = Flask(__name__)
 11: CORS(app)
 12: 
 13: @app.route("/test")
 14: def test():
 15:     return "Flask is working!"
 16: 
 17: FAVORITES_FILE = "favorites.json"
 18: 
 19: # ---------------------------------------------------------
 20: # 1. データの永続化と取得
 21: # ---------------------------------------------------------
 22: def load_favorites():
 23:     if os.path.exists(FAVORITES_FILE):
 24:         try:
 25:             with open(FAVORITES_FILE, "r") as f:
 26:                 data = json.load(f)
 27:                 if isinstance(data, list):
 28:                     # 旧形式を新形式に変換
 29:                     return {c: "" for c in data}
 30:                 return data
 31:         except:
 32:             return {"6752": "パナソニック", "9434": "ソフトバンク"}
 33:     return {"6752": "パナソニック", "9434": "ソフトバンク"}
 34: 
 35: def save_favorites(favs):
 36:     with open(FAVORITES_FILE, "w") as f:
 37:         json.dump(favs, f, ensure_ascii=False)
 38: 
 39: def get_stock_details(stock_code):
 40:     if not stock_code or not re.match(r'^\d{4}$', stock_code):
 41:         return {}
 42:     url = f"https://kabutan.jp/stock/?code={stock_code}"
 43:     headers = {"User-Agent": "Mozilla/5.0"}
 44:     try:
 45:         response = requests.get(url, headers=headers, timeout=5)
 46:         soup = BeautifulSoup(response.text, 'html.parser')
 47:         
 48:         details = {"code": stock_code}
 49:         
 50:         # 1. 銘柄名と市場
 51:         company_block = soup.find('div', class_='company_block')
 52:         if company_block:
 53:             h3 = company_block.find('h3')
 54:             if h3:
 55:                 name = h3.get_text(strip=True)
 56:                 details["name"] = re.sub(r'^\d{4}\s*', '', name)
 57:             market = company_block.find('span', class_='market')
 58:             details["market"] = market.get_text(strip=True) if market else "---"
 59: 
 60:         # 2. 株価・前日比
 61:         kabuka_table = soup.find('table', class_='kabuka')
 62:         if kabuka_table:
 63:             tds = kabuka_table.find_all('td')
 64:             if len(tds) >= 4:
 65:                 details["price"] = tds[0].get_text(strip=True)
 66:                 details["change"] = tds[1].get_text(strip=True)
 67:                 details["change_pct"] = tds[2].get_text(strip=True)
 68:                 details["time"] = tds[3].get_text(strip=True)
 69: 
 70:         # 3. 投資指標 (VWAP, 出来高, 利回り)
 71:         # stockinfo_i1, i2, i3 あたりから取得
 72:         for info_id in ['stockinfo_i1', 'stockinfo_i2', 'stockinfo_i3']:
 73:             info_div = soup.find('div', id=info_id)
 74:             if info_div:
 75:                 dls = info_div.find_all('dl')
 76:                 for dl in dls:
 77:                     dt = dl.find('dt').get_text(strip=True)
 78:                     dd = dl.find('dd').get_text(strip=True)
 79:                     if "VWAP" in dt: details["vwap"] = dd
 80:                     if "出来高" in dt: details["volume"] = dd
 81:                     if "利回り" in dt: details["yield"] = dd
 82:                     if "決算発表日" in dt or "決算日" in dt: details["earnings_date"] = dd
 83: 
 84:         # 4. 信用残・乖離率 (さらに下のテーブル)
 85:         # 信用残テーブルを探す
 86:         margin_table = soup.find('table', class_='margin_table')
 87:         if margin_table:
 88:             rows = margin_table.find_all('tr')
 89:             for row in rows:
 90:                 if "売残" in row.get_text():
 91:                     details["margin_sell"] = row.find_all('td')[1].get_text(strip=True)
 92:                 if "買残" in row.get_text():
 93:                     details["margin_buy"] = row.find_all('td')[1].get_text(strip=True)
 94:                 if "倍率" in row.get_text():
 95:                     details["margin_ratio"] = row.find_all('td')[1].get_text(strip=True)
 96: 
 97:         # 5. 移動平均乖離率
 98:         kairi_table = soup.find('table', class_='kairi_table')
 99:         if kairi_table:
100:             rows = kairi_table.find_all('tr')
101:             for row in rows:
102:                 if "25日" in row.get_text():
103:                     details["kairi_25"] = row.find_all('td')[1].get_text(strip=True)
104:                 if "75日" in row.get_text():
105:                     details["kairi_75"] = row.find_all('td')[1].get_text(strip=True)
106: 
107:         # 欠損値の埋め合わせ
108:         placeholders = {
109:             "name": "---", "market": "---", "price": "---", "change": "---", 
110:             "change_pct": "---", "time": "---", "vwap": "---", "volume": "---",
111:             "yield": "---", "earnings_date": "---", "margin_buy": "---", 
112:             "margin_sell": "---", "margin_ratio": "---", "kairi_25": "---", "kairi_75": "---"
113:         }
114:         for k, v in placeholders.items():
115:             if k not in details: details[k] = v
116: 
117:         return details
118:     except:
119:         return {}
120: 
121: def get_kabutan_news(stock_code):
122:     url = f"https://kabutan.jp/stock/news?code={stock_code}"
123:     headers = {"User-Agent": "Mozilla/5.0"}
124:     try:
125:         response = requests.get(url, headers=headers, timeout=5)
126:         soup = BeautifulSoup(response.text, 'html.parser')
127:         news_items = []
128:         table = soup.find('table', class_='s_news_list')
129:         if table:
130:             rows = table.find_all('tr')
131:             for row in rows:
132:                 time_td = row.find('td', class_='date')
133:                 time_str = time_td.get_text(strip=True) if time_td else ""
134:                 link_tag = row.find('a')
135:                 if link_tag:
136:                     title = link_tag.get_text(strip=True)
137:                     href = link_tag.get('href')
138:                     if not href.startswith('http'):
139:                         href = f"https://kabutan.jp{href}"
140:                     news_items.append({"title": f"[{time_str}] {title}", "url": href})
141:                 if len(news_items) >= 15: break
142:         return news_items
143:     except:
144:         return []
145: 
146: # ---------------------------------------------------------
147: # 2. ルート定義
148: # ---------------------------------------------------------
149: @app.route("/")
150: def index():
151:     favs = load_favorites()
152:     current_code = request.args.get("code")
153:     if not current_code:
154:         current_code = list(favs.keys())[0] if favs else "7203"
155:     
156:     details = get_stock_details(current_code)
157:     news = get_kabutan_news(current_code)
158:     
159:     return render_template("index.html", 
160:                            favorites=favs, 
161:                            current_code=current_code, 
162:                            stock=details,
163:                            news=news)
164: 
165: @app.route("/stock/<codeSegment>")
166: def stock_panel(codeSegment):
167:     """HTMX用：銘柄詳細パネルのみを返す"""
168:     details = get_stock_details(codeSegment)
169:     news = get_kabutan_news(codeSegment)
170:     return render_template("partials/stock_panel.html", 
171:                            current_code=codeSegment, 
172:                            stock=details, 
173:                            news=news)
174: 
175: @app.route("/api/stock_data/<code>")
176: def get_historical_data(code):
177:     """チャート描画用の数値を返す"""
178:     try:
179:         # 日本株の場合は .T を付与（とりあえず東証前提）
180:         ticker_code = f"{code}.T"
181:         ticker = yf.Ticker(ticker_code)
182:         # 直近6ヶ月分のデータを取得
183:         df = ticker.history(period="6mo")
184:         
185:         if df.empty:
186:             return jsonify({"error": "No data found"}), 404
187:             
188:         data = []
189:         for index, row in df.iterrows():
190:             data.append({
191:                 "time": index.strftime('%Y-%m-%d'),
192:                 "open": float(row['Open']),
193:                 "high": float(row['High']),
194:                 "low": float(row['Low']),
195:                 "close": float(row['Close'])
196:             })
197:         return jsonify(data)
198:     except Exception as e:
199:         return jsonify({"error": str(e)}), 500
200: 
201: @app.route("/favorites/add", methods=["POST"])
202: def add_favorite():
203:     code = request.form.get("code")
204:     if code and re.match(r'^\d{4}$', code):
205:         favs = load_favorites()
206:         if code not in favs:
207:             name = get_stock_name(code)
208:             favs[code] = name
209:             save_favorites(favs)
210:     return render_template("partials/watchlist.html", favorites=load_favorites())
211: 
212: @app.route("/favorites/remove", methods=["POST"])
213: def remove_favorite():
214:     code = request.form.get("code")
215:     favs = load_favorites()
216:     if code in favs:
217:         del favs[code]
218:         save_favorites(favs)
219:     return render_template("partials/watchlist.html", favorites=load_favorites())
220: 
221: @app.route("/favorites/import", methods=["POST"])
222: def import_favorites():
223:     text = request.form.get("text")
224:     codes = re.findall(r'\b(\d{4})\b', text)
225:     favs = load_favorites()
226:     for c in codes:
227:         if c not in favs:
228:             favs[c] = get_stock_name(c)
229:     save_favorites(favs)
230:     return render_template("partials/watchlist.html", favorites=load_favorites())
231: 
232: if __name__ == "__main__":
233:     # GCP (Cloud Run) のポート番号に対応
234:     port = int(os.environ.get("PORT", 5001))
235:     app.run(debug=True, host="0.0.0.0", port=port)
````

## File: eslint.config.js
````javascript
 1: import js from '@eslint/js'
 2: import globals from 'globals'
 3: import reactHooks from 'eslint-plugin-react-hooks'
 4: import reactRefresh from 'eslint-plugin-react-refresh'
 5: import tseslint from 'typescript-eslint'
 6: import { defineConfig, globalIgnores } from 'eslint/config'
 7: 
 8: export default defineConfig([
 9:   globalIgnores(['dist']),
10:   {
11:     files: ['**/*.{ts,tsx}'],
12:     extends: [
13:       js.configs.recommended,
14:       tseslint.configs.recommended,
15:       reactHooks.configs.flat.recommended,
16:       reactRefresh.configs.vite,
17:     ],
18:     languageOptions: {
19:       ecmaVersion: 2020,
20:       globals: globals.browser,
21:     },
22:   },
23: ])
````

## File: index.html
````html
 1: <!DOCTYPE html>
 2: <html lang="en">
 3:   <head>
 4:     <meta charset="UTF-8" />
 5:     <link rel="icon" type="image/svg+xml" href="/vite.svg" />
 6:     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 7:     <title>株情報ダッシュボード</title>
 8:   </head>
 9:   <body>
10:     <div id="root"></div>
11:     <script type="module" src="/src/main.tsx"></script>
12:   </body>
13: </html>
````

## File: package.json
````json
 1: {
 2:   "name": "trade-info-app",
 3:   "private": true,
 4:   "version": "0.0.0",
 5:   "type": "module",
 6:   "scripts": {
 7:     "dev": "vite",
 8:     "build": "tsc -b && vite build",
 9:     "lint": "eslint .",
10:     "preview": "vite preview"
11:   },
12:   "dependencies": {
13:     "react": "^19.2.0",
14:     "react-dom": "^19.2.0"
15:   },
16:   "devDependencies": {
17:     "@eslint/js": "^9.39.1",
18:     "@types/node": "^24.10.1",
19:     "@types/react": "^19.2.5",
20:     "@types/react-dom": "^19.2.3",
21:     "@vitejs/plugin-react": "^5.1.1",
22:     "autoprefixer": "^10.4.22",
23:     "eslint": "^9.39.1",
24:     "eslint-plugin-react-hooks": "^7.0.1",
25:     "eslint-plugin-react-refresh": "^0.4.24",
26:     "globals": "^16.5.0",
27:     "postcss": "^8.5.6",
28:     "tailwindcss": "^3.4.16",
29:     "typescript": "~5.9.3",
30:     "typescript-eslint": "^8.46.4",
31:     "vite": "^7.2.4"
32:   }
33: }
````

## File: postcss.config.js
````javascript
1: export default {
2:   plugins: {
3:     tailwindcss: {},
4:     autoprefixer: {},
5:   },
6: }
````

## File: README.md
````markdown
 1: # TradeInfo - Market Speed Style Dashboard
 2: 
 3: 株探 (Kabutan) と Yahoo Finance のデータ、および TradingView のチャートライブラリを活用した、プロフェッショナルな株価分析ダッシュボードです。
 4: 
 5: ## 主な機能
 6: 
 7: - **高性能チャート**: TradingView Lightweight Charts を採用。ローソク足、ライン、エリア切り替え、MA5/MA25 表示に対応。
 8: - **詳細指標の可視化**: 株探から VWAP、出来高、信用買残・売残、貸借倍率、25/75 日移動平均乖離率、利回り、決算予定日を自動取得。
 9: - **高速な UI**: HTMX を採用し、ページ単位のリロードなしで銘柄切り替えやウォッチリスト管理が可能。
10: - **ウォッチリスト管理**: 複数銘柄の一括インポート、削除、お気に入り保存に対応。
11: 
12: ## セットアップ手順
13: 
14: ### 1. 環境構築
15: 
16: Python 3.10 以上がインストールされていることを確認してください。
17: 
18: ```bash
19: # 仮想環境の作成
20: python3 -m venv venv
21: source venv/bin/activate  # Windowsの場合は venv\Scripts\activate
22: 
23: # 依存ライブラリのインストール
24: pip install -r requirements.txt
25: ```
26: 
27: ### 2. アプリケーションの起動
28: 
29: ```bash
30: python3 app.py
31: ```
32: 
33: 起動後、ブラウザで `http://127.0.0.1:5001` にアクセスしてください。
34: 
35: ## 技術スタック
36: 
37: - **Backend**: Python / Flask
38: - **Frontend**: HTMX, Tailwind CSS, JavaScript (Lightweight Charts v3.8)
39: - **Data Source**: yfinance (株価履歴), Beautiful Soup (株探スクレイピング)
40: 
41: ## 免責事項
42: 
43: 本アプリケーションは個人利用を目的としており、取得したデータの再配布や商用利用は各データ提供元の規約を確認してください。投資判断は自己責任でお願いいたします。
````

## File: requirements.txt
````
1: flask
2: flask-cors
3: requests
4: beautifulsoup4
5: yfinance
6: google-generativeai
7: python-dotenv
````

## File: run_dashboard.sh
````bash
 1: #!/bin/bash
 2: 
 3: # このスクリプトのあるディレクトリに移動
 4: cd "$(dirname "$0")"
 5: 
 6: echo "🚀 株ニュースダッシュボードを起動しています..."
 7: 
 8: # 仮想環境の作成と有効化
 9: if [ ! -d "venv" ]; then
10:     echo "📦 仮想環境を作成しています..."
11:     python3 -m venv venv
12: fi
13: source venv/bin/activate
14: 
15: # 必要なライブラリのインストール確認
16: if ! pip freeze | grep -q "Flask"; then
17:     echo "📦 必要なライブラリをインストールしています..."
18:     pip install flask flask-cors beautifulsoup4 requests
19: fi
20: 
21: # 必要なライブラリのインストール確認
22: if ! pip freeze | grep -q "Flask"; then
23:     echo "📦 必要なライブラリをインストールしています..."
24:     pip install flask flask-cors beautifulsoup4 requests
25: fi
26: 
27: # Flaskアプリの起動
28: echo "✅ ブラウザで http://127.0.0.1:5001 を開いてください"
29: export PORT=5001
30: python3 app.py
````

## File: run_flask.sh
````bash
1: #!/bin/bash
2: # Market Speed HTMX Dashboard Runner
3: 
4: echo "Starting Market Speed Web Dashboard (Flask + HTMX)..."
5: export FLASK_APP=app_v2.py
6: export FLASK_ENV=development
7: python3 app_v2.py
````

## File: run_v3.sh
````bash
 1: #!/bin/bash
 2: 
 3: # Kill background processes on exit
 4: trap 'kill %1; kill %2' SIGINT
 5: 
 6: echo "Starting TradeInfo v3 Development Environment..."
 7: 
 8: # Terminate existing backend processes if any
 9: lsof -ti :8000 | xargs kill -9 2>/dev/null
10: 
11: # Start Backend
12: cd backend
13: source venv/bin/activate
14: uvicorn main:app --reload --port 8000 --host 127.0.0.1 &
15: 
16: # Start Frontend
17: cd ../frontend
18: npm run dev -- --port 3000 &
19: 
20: wait
````

## File: tailwind.config.js
````javascript
 1: /** @type {import('tailwindcss').Config} */
 2: export default {
 3:   content: [
 4:     "./index.html",
 5:     "./src/**/*.{js,ts,jsx,tsx}",
 6:   ],
 7:   theme: {
 8:     extend: {},
 9:   },
10:   plugins: [],
11: }
````

## File: tsconfig.app.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
 4:     "target": "ES2022",
 5:     "useDefineForClassFields": true,
 6:     "lib": ["ES2022", "DOM", "DOM.Iterable"],
 7:     "module": "ESNext",
 8:     "types": ["vite/client"],
 9:     "skipLibCheck": true,
10: 
11:     /* Bundler mode */
12:     "moduleResolution": "bundler",
13:     "allowImportingTsExtensions": true,
14:     "verbatimModuleSyntax": true,
15:     "moduleDetection": "force",
16:     "noEmit": true,
17:     "jsx": "react-jsx",
18: 
19:     /* Linting */
20:     "strict": true,
21:     "noUnusedLocals": true,
22:     "noUnusedParameters": true,
23:     "erasableSyntaxOnly": true,
24:     "noFallthroughCasesInSwitch": true,
25:     "noUncheckedSideEffectImports": true
26:   },
27:   "include": ["src"]
28: }
````

## File: tsconfig.json
````json
1: {
2:   "files": [],
3:   "references": [
4:     { "path": "./tsconfig.app.json" },
5:     { "path": "./tsconfig.node.json" }
6:   ]
7: }
````

## File: tsconfig.node.json
````json
 1: {
 2:   "compilerOptions": {
 3:     "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
 4:     "target": "ES2023",
 5:     "lib": ["ES2023"],
 6:     "module": "ESNext",
 7:     "types": ["node"],
 8:     "skipLibCheck": true,
 9: 
10:     /* Bundler mode */
11:     "moduleResolution": "bundler",
12:     "allowImportingTsExtensions": true,
13:     "verbatimModuleSyntax": true,
14:     "moduleDetection": "force",
15:     "noEmit": true,
16: 
17:     /* Linting */
18:     "strict": true,
19:     "noUnusedLocals": true,
20:     "noUnusedParameters": true,
21:     "erasableSyntaxOnly": true,
22:     "noFallthroughCasesInSwitch": true,
23:     "noUncheckedSideEffectImports": true
24:   },
25:   "include": ["vite.config.ts"]
26: }
````

## File: vite.config.ts
````typescript
1: import { defineConfig } from 'vite'
2: import react from '@vitejs/plugin-react'
3: 
4: // https://vite.dev/config/
5: export default defineConfig({
6:   plugins: [react()],
7: })
````

## File: backend/api/stocks.py
````python
 1: from fastapi import APIRouter, HTTPException
 2: from services.kabutan import KabutanService
 3: from schemas.stock import StockDetails, MarketIndices
 4: 
 5: router = APIRouter(prefix="/stocks", tags=["stocks"])
 6: service = KabutanService()
 7: 
 8: @router.get("/market", response_model=MarketIndices)
 9: async def get_market():
10:     try:
11:         return await service.get_market_indices()
12:     except Exception as e:
13:         raise HTTPException(status_code=500, detail=str(e))
14: 
15: @router.get("/{code}", response_model=StockDetails)
16: async def get_stock(code: str):
17:     try:
18:         details = await service.get_stock_details(code)
19:         if details.name == "Error":
20:             raise HTTPException(status_code=404, detail="Stock not found")
21:         return details
22:     except Exception as e:
23:         raise HTTPException(status_code=500, detail=str(e))
````

## File: backend/schemas/stock.py
````python
 1: from pydantic import BaseModel, Field
 2: from typing import List, Optional
 3: 
 4: class NewsItem(BaseModel):
 5:     title: str
 6:     url: str
 7: 
 8: class OHLCV(BaseModel):
 9:     date: str
10:     open: float
11:     high: float
12:     low: float
13:     close: float
14:     volume: int
15:     vwap: Optional[float] = None
16: 
17: class IndexInfo(BaseModel):
18:     name: str
19:     price: str
20:     change: str
21:     change_percent: str
22: 
23: class MarketIndices(BaseModel):
24:     nikkei225: IndexInfo
25:     topix: IndexInfo
26:     futures: IndexInfo
27: 
28: class StockDetails(BaseModel):
29:     code: str
30:     name: str
31:     current_price: Optional[str] = None
32:     change: Optional[str] = None
33:     change_percent: Optional[str] = None
34:     vwap: Optional[str] = None
35:     volume: Optional[str] = None
36:     margin_buy: Optional[str] = None
37:     margin_sell: Optional[str] = None
38:     margin_ratio: Optional[str] = None
39:     ma25_diff: Optional[str] = None
40:     ma75_diff: Optional[str] = None
41:     dividend_yield: Optional[str] = None
42:     ex_dividend_date: Optional[str] = None
43:     benefit_date: Optional[str] = None
44:     settlement_date: Optional[str] = None
45:     news: List[NewsItem] = []
46:     history: List[OHLCV] = []
````

## File: backend/services/kabutan.py
````python
  1: import httpx
  2: import asyncio
  3: from bs4 import BeautifulSoup
  4: import re
  5: from typing import List, Optional
  6: from schemas.stock import StockDetails, NewsItem, OHLCV, MarketIndices, IndexInfo
  7: 
  8: class KabutanService:
  9:     BASE_URL = "https://kabutan.jp"
 10:     HEADERS = {
 11:         "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
 12:     }
 13: 
 14:     async def get_stock_details(self, code: str) -> StockDetails:
 15:         url = f"{self.BASE_URL}/stock/?code={code}"
 16:         async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
 17:             response = await client.get(url)
 18:             if response.status_code != 200:
 19:                 return StockDetails(code=code, name="Error")
 20:             
 21:             soup = BeautifulSoup(response.text, 'html.parser')
 22:             
 23:             # 基本情報
 24:             name = ""
 25:             company_block = soup.find('div', class_='company_block')
 26:             if company_block and company_block.find('h3'):
 27:                 name = re.sub(r'^\d{4}\s*', '', company_block.find('h3').get_text(strip=True))
 28: 
 29:             # 株価情報 (Selectors refined)
 30:             current_price = ""
 31:             change = ""
 32:             change_percent = ""
 33:             
 34:             kabuka_span = soup.select_one(".kabuka")
 35:             if kabuka_span:
 36:                 current_price = kabuka_span.get_text(strip=True)
 37:             
 38:             # 前日比の抽出
 39:             si_dl1 = soup.select_one(".si_i1_dl1")
 40:             if si_dl1:
 41:                 dds = si_dl1.find_all('dd')
 42:                 if len(dds) >= 2:
 43:                     change = dds[0].get_text(strip=True)
 44:                     change_percent = dds[1].get_text(strip=True).replace("%", "")
 45: 
 46:             # 詳細指標を抽出する関数 (より堅牢に)
 47:             def get_val(label):
 48:                 # ユーザーフィードバックに基づき、表形式や隣接要素から柔軟に値を抽出
 49:                 cells = soup.find_all(['th', 'td'], string=re.compile(f"^{label}$|{label}"))
 50:                 for cell in cells:
 51:                     # 1. 次の兄弟要素がtdならその値
 52:                     sibling = cell.find_next_sibling(['td', 'th'])
 53:                     if sibling:
 54:                         val = sibling.get_text(strip=True)
 55:                         if val and val != label: return val
 56:                     
 57:                     # 2. 親要素の次の行の同じインデックスを探索
 58:                     row = cell.find_parent('tr')
 59:                     if row:
 60:                         parent = row.parent
 61:                         rows = parent.find_all('tr')
 62:                         try:
 63:                             row_idx = rows.index(row)
 64:                             if row_idx + 1 < len(rows):
 65:                                 siblings = row.find_all(['th', 'td'])
 66:                                 cell_idx = siblings.index(cell)
 67:                                 next_row_cells = rows[row_idx + 1].find_all(['th', 'td'])
 68:                                 if len(next_row_cells) > cell_idx:
 69:                                     val = next_row_cells[cell_idx].get_text(strip=True)
 70:                                     if val: return val
 71:                         except (ValueError, IndexError): pass
 72:                 return "-"
 73: 
 74:             # 指標抽出のための汎用ヘルパー
 75:             def find_metric(label, fuzzy=False):
 76:                 pattern = re.compile(f"^{label}$" if not fuzzy else label)
 77:                 # 1. th/tdの中から検索
 78:                 cell = soup.find(['th', 'td', 'dt'], string=pattern)
 79:                 if not cell:
 80:                     # テキストとして含む要素を検索
 81:                     cell = soup.find(lambda t: t.name in ['th', 'td', 'dt', 'span'] and label in t.get_text())
 82:                 
 83:                 if cell:
 84:                     # 次の兄弟要素をチェック
 85:                     sibling = cell.find_next_sibling(['td', 'dd', 'span'])
 86:                     if sibling:
 87:                         text = sibling.get_text(strip=True)
 88:                         if text and text != label: return text
 89:                     
 90:                     # 親の次の要素をチェック (Vertical layout)
 91:                     parent = cell.parent
 92:                     if parent:
 93:                         next_p = parent.find_next_sibling()
 94:                         if next_p:
 95:                             val = next_p.get_text(strip=True)
 96:                             if val: return val
 97:                 return "-"
 98: 
 99:             # 指標情報
100:             vwap = find_metric("VWAP")
101:             volume = find_metric("出来高")
102:             
103:             # 1. 主要指標テーブル (PER, PBR, 利回り, 信用倍率) の精密抽出
104:             yield_val = "-"
105:             margin_ratio = "-"
106:             stats_div = soup.find('div', id='stockinfo_i3')
107:             if stats_div:
108:                 thead = stats_div.find('thead')
109:                 tbody = stats_div.find('tbody')
110:                 if thead and tbody:
111:                     ths = thead.find_all('th')
112:                     tds = tbody.find_all('td')
113:                     for i, th in enumerate(ths):
114:                         if i < len(tds):
115:                             th_text = th.get_text(strip=True)
116:                             val = tds[i].get_text(strip=True)
117:                             if "利回り" in th_text: yield_val = val
118:                             if "信用倍率" in th_text: margin_ratio = val
119: 
120:             # 2. VWAP と 出来高
121:             vwap = find_metric("VWAP")
122:             volume = find_metric("出来高")
123: 
124:             # 3. 信用残高 (専用テーブル)
125:             margin_buy = "-"
126:             margin_sell = "-"
127:             shinyo_h2 = soup.find('h2', string=re.compile("信用取引"))
128:             if shinyo_h2:
129:                 shinyo_table = shinyo_h2.find_next('table')
130:                 if shinyo_table:
131:                     td_list = shinyo_table.find_all('td')
132:                     if len(td_list) >= 2:
133:                         margin_sell = td_list[0].get_text(strip=True)
134:                         margin_buy = td_list[1].get_text(strip=True)
135:                         # ここでもしmargin_ratioが取れていなければ上書き
136:                         if margin_ratio == "-" and len(td_list) >= 3:
137:                             margin_ratio = td_list[2].get_text(strip=True)
138: 
139:             # 4. 25日/75日乖離率
140:             ma25_diff = "-"
141:             ma75_diff = "-"
142:             trend_table = soup.select_one(".kabuka_trend")
143:             if trend_table:
144:                 trs = trend_table.find_all('tr')
145:                 if len(trs) >= 2:
146:                     td_list = trs[1].find_all('td')
147:                     if len(td_list) >= 2:
148:                         ma25_diff = td_list[0].get_text(strip=True)
149:                         ma75_diff = td_list[1].get_text(strip=True)
150: 
151:             # 5. 決算・配当・優待の日程 (より柔軟な検索)
152:             def get_robust_date(labels):
153:                 for label in labels:
154:                     target = soup.find(['th', 'td', 'dt'], string=re.compile(label))
155:                     if target:
156:                         sib = target.find_next_sibling(['td', 'dd'])
157:                         if sib: return sib.get_text(strip=True)
158:                         # Vertical case
159:                         tr = target.find_parent('tr')
160:                         if tr:
161:                             next_tr = tr.find_next_sibling('tr')
162:                             if next_tr:
163:                                 idx = tr.find_all(['th', 'td']).index(target)
164:                                 next_tds = next_tr.find_all(['th', 'td'])
165:                                 if len(next_tds) > idx: return next_tds[idx].get_text(strip=True)
166:                 return "-"
167: 
168:             settlement = get_robust_date(["決算発表日", "発表日"])
169:             ex_div = get_robust_date(["配当落ち日", "配当落", "権利付最終"])
170:             benefit = get_robust_date(["優待発生月", "優待権利", "株主優待"])
171: 
172:             # 同時並行でニュースと履歴を取得
173:             news = await self.get_news(code)
174:             history = await self.get_history(code)
175: 
176:             details = StockDetails(
177:                 code=code,
178:                 name=name,
179:                 current_price=current_price,
180:                 change=change,
181:                 change_percent=change_percent,
182:                 vwap=vwap,
183:                 volume=volume,
184:                 margin_buy=margin_buy,
185:                 margin_sell=margin_sell,
186:                 margin_ratio=margin_ratio,
187:                 ma25_diff=ma25_diff,
188:                 ma75_diff=ma75_diff,
189:                 dividend_yield=yield_val,
190:                 ex_dividend_date=ex_div,
191:                 benefit_date=benefit,
192:                 settlement_date=settlement,
193:                 news=news,
194:                 history=history
195:             )
196:             return details
197: 
198:     async def get_news(self, code: str) -> List[NewsItem]:
199:         url = f"{self.BASE_URL}/stock/news?code={code}"
200:         async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
201:             response = await client.get(url)
202:             if response.status_code != 200:
203:                 return []
204:             
205:             soup = BeautifulSoup(response.text, 'html.parser')
206:             news_items = []
207:             table = soup.find('table', class_='s_news_list')
208:             if table:
209:                 for row in table.find_all('tr')[:15]:
210:                     link = row.find('a')
211:                     if link:
212:                         title = link.get_text(strip=True)
213:                         href = link.get('href')
214:                         if not href.startswith('http'):
215:                             href = f"{self.BASE_URL}{href}"
216:                         news_items.append(NewsItem(title=title, url=href))
217:             return news_items
218: 
219:     async def get_market_indices(self) -> MarketIndices:
220:         indices = await asyncio.gather(
221:             self._get_index_info("0000", "日経平均"),
222:             self._get_index_info("0010", "TOPIX"),
223:             self._get_index_info("0411", "日経先物")
224:         )
225:         return MarketIndices(
226:             nikkei225=indices[0],
227:             topix=indices[1],
228:             futures=indices[2]
229:         )
230: 
231:     async def _get_index_info(self, code: str, fallback_name: str) -> IndexInfo:
232:         url = f"{self.BASE_URL}/stock/chart?code={code}"
233:         async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
234:             try:
235:                 response = await client.get(url)
236:                 if response.status_code != 200:
237:                     return IndexInfo(name=fallback_name, price="---", change="---", change_percent="---")
238:                 
239:                 soup = BeautifulSoup(response.text, 'html.parser')
240:                 
241:                 # インデックス名
242:                 name = fallback_name
243:                 company_block = soup.find('div', class_='company_block')
244:                 if company_block and company_block.find('h3'):
245:                     name = re.sub(r'^\d{4}\s*', '', company_block.find('h3').get_text(strip=True))
246: 
247:                 # 株価情報
248:                 price = "---"
249:                 change = "---"
250:                 pct = "---"
251:                 
252:                 kabuka_span = soup.select_one(".kabuka")
253:                 if kabuka_span:
254:                     price = kabuka_span.get_text(strip=True)
255:                 
256:                 si_dl1 = soup.select_one(".si_i1_dl1")
257:                 if si_dl1:
258:                     dds = si_dl1.find_all('dd')
259:                     if len(dds) >= 2:
260:                         change = dds[0].get_text(strip=True)
261:                         pct = dds[1].get_text(strip=True)
262:                 
263:                 return IndexInfo(name=name, price=price, change=change, change_percent=pct)
264:             except Exception:
265:                 return IndexInfo(name=fallback_name, price="---", change="---", change_percent="---")
266: 
267:     async def get_history(self, code: str) -> List[OHLCV]:
268:         url = f"{self.BASE_URL}/stock/kabuka?code={code}"
269:         async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
270:             response = await client.get(url)
271:             if response.status_code != 200:
272:                 return []
273:             
274:             soup = BeautifulSoup(response.text, 'html.parser')
275:             history = []
276: 
277:             def clean_num(s):
278:                 if not s: return 0
279:                 return re.sub(r'[^\d.]', '', s)
280: 
281:             # 履歴テーブル (日付, 始値, 高値, 安値, 終値, 前日比, 騰落率, 売買高)
282:             tables = soup.select("table.stock_kabuka0, table.stock_kabuka_dwm")
283:             for table in tables:
284:                 tbody = table.find('tbody')
285:                 if not tbody: continue
286:                 rows = tbody.find_all('tr')
287:                 for row in rows:
288:                     tds = row.find_all(['th', 'td'])
289:                     if len(tds) >= 8:
290:                         # 日付はthのtimeタグ
291:                         date_tag = tds[0].find('time')
292:                         date_str = date_tag.get('datetime') if date_tag else tds[0].get_text(strip=True)
293:                         
294:                         try:
295:                             o = float(clean_num(tds[1].get_text(strip=True)))
296:                             h = float(clean_num(tds[2].get_text(strip=True)))
297:                             l = float(clean_num(tds[3].get_text(strip=True)))
298:                             c = float(clean_num(tds[4].get_text(strip=True)))
299:                             v = int(clean_num(tds[7].get_text(strip=True)))
300:                             
301:                             # VWAPの推定 (Typical Price: (H+L+C)/3)
302:                             est_vwap = round((h + l + c) / 3, 2)
303:                             
304:                             item = OHLCV(
305:                                 date=date_str,
306:                                 open=o,
307:                                 high=h,
308:                                 low=l,
309:                                 close=c,
310:                                 volume=v,
311:                                 vwap=est_vwap
312:                             )
313:                             history.append(item)
314:                         except (ValueError, TypeError):
315:                             continue
316:             
317:             # 日付順にソート（古い順）
318:             history.sort(key=lambda x: x.date)
319:             return history
````

## File: backend/main.py
````python
 1: from fastapi import FastAPI
 2: from fastapi.middleware.cors import CORSMiddleware
 3: from api.stocks import router as stocks_router
 4: from api.review import router as review_router
 5: 
 6: app = FastAPI(title="TradeInfo API", version="3.0.0")
 7: 
 8: # CORS設定
 9: app.add_middleware(
10:     CORSMiddleware,
11:     allow_origins=["*"],  # 開発用。本番では適切に制限すること
12:     allow_credentials=True,
13:     allow_methods=["*"],
14:     allow_headers=["*"],
15: )
16: 
17: app.include_router(stocks_router)
18: app.include_router(review_router)
19: 
20: @app.get("/")
21: async def root():
22:     return {"message": "TradeInfo API v3 is running"}
23: 
24: @app.get("/health")
25: async def health_check():
26:     return {"status": "healthy"}
````

## File: frontend/src/app/page.tsx
````typescript
 1: "use client";
 2: 
 3: import { useState, useEffect } from "react";
 4: import { useStockStore } from "@/store/useStockStore";
 5: import Watchlist from "@/components/dashboard/Watchlist";
 6: import IntelligenceGrid from "@/components/dashboard/IntelligenceGrid";
 7: import MainChart from "@/components/dashboard/MainChart";
 8: import NewsList from "@/components/dashboard/NewsList";
 9: import LeftRail from "@/components/dashboard/LeftRail";
10: import CommandPalette from "@/components/dashboard/CommandPalette";
11: import CategoryRail from "@/components/dashboard/CategoryRail";
12: import MarketTicker from "@/components/dashboard/MarketTicker";
13: 
14: export default function DashboardPage() {
15:   const { selectedTicker } = useStockStore();
16:   const [mounted, setMounted] = useState(false);
17: 
18:   useEffect(() => {
19:     setMounted(true);
20:   }, []);
21: 
22:   if (!mounted) {
23:     return (
24:       <div className="flex items-center justify-center h-screen bg-[#F8FAFC]">
25:         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
26:       </div>
27:     );
28:   }
29: 
30:   return (
31:     <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden">
32:       <CommandPalette />
33:       
34:       {/* 0. Left Rail (72px) - Global Nav */}
35:       <LeftRail />
36: 
37:       {/* 0.5 Category Rail (Genre Menu) */}
38:       <CategoryRail />
39: 
40:       <div className="flex-1 flex flex-col overflow-hidden">
41:         {/* Market Index Ticker (10% height) */}
42:         <div className="h-[10%] min-h-[70px] max-h-[90px]">
43:           <MarketTicker />
44:         </div>
45: 
46:         <div className="flex-1 flex overflow-hidden">
47:           {/* 1. Left Column: Watchlist (Fixed Width) */}
48:           <aside className="w-80 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col">
49:             <Watchlist />
50:           </aside>
51: 
52:           {/* 2. Middle Column: Market Intelligence */}
53:           <aside className="w-80 flex-shrink-0 border-r border-slate-200 overflow-y-auto bg-white flex flex-col">
54:             <IntelligenceGrid />
55:           </aside>
56: 
57:           {/* 3. Right Column: Chart & News (Remaining Space flex-1) */}
58:           <main className="flex-1 flex flex-col bg-white overflow-hidden">
59:             {/* Pane 3: Main Chart (60%) */}
60:             <div className="h-[60%] border-b border-slate-200 shadow-sm relative z-0">
61:               <MainChart />
62:             </div>
63:             {/* Pane 4: News & Links (40%) */}
64:             <div className="h-[40%] overflow-y-auto">
65:               <NewsList />
66:             </div>
67:           </main>
68:         </div>
69:       </div>
70:     </div>
71:   );
72: }
````

## File: frontend/src/components/dashboard/IntelligenceGrid.tsx
````typescript
  1: "use client";
  2: 
  3: import { useEffect } from "react";
  4: import { useStockStore } from "@/store/useStockStore";
  5: import { useQuery } from "@tanstack/react-query";
  6: import { ExternalLink, TrendingUp, Info, Activity, Database, FileText, Star } from "lucide-react";
  7: 
  8: export default function IntelligenceGrid() {
  9:   const { selectedTicker, setCurrentPrice } = useStockStore();
 10: 
 11:   const { data, isLoading } = useQuery({
 12:     queryKey: ['stock', selectedTicker],
 13:     queryFn: async () => {
 14:       const resp = await fetch(`http://127.0.0.1:8000/stocks/${selectedTicker}`);
 15:       if (!resp.ok) throw new Error('Failed to fetch stock data');
 16:       return resp.json();
 17:     },
 18:     enabled: !!selectedTicker
 19:   });
 20: 
 21:   useEffect(() => {
 22:     if (data?.current_price) {
 23:       setCurrentPrice(data.current_price);
 24:     }
 25:   }, [data, setCurrentPrice]);
 26: 
 27:   if (isLoading) return <div className="p-8 text-center text-slate-400 animate-pulse">Loading intelligence...</div>;
 28:   if (!data) return <div className="p-8 text-center text-slate-400">Select a ticker to see analysis</div>;
 29: 
 30:   const MetricItem = ({ label, value, icon: Icon, subValue }: any) => (
 31:     <div className="flex flex-col gap-1">
 32:       <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
 33:         {Icon && <Icon size={12} />}
 34:         {label}
 35:       </div>
 36:       <div className="font-mono text-xl font-bold text-slate-900">{value || "-"}</div>
 37:       {subValue && <div className="font-mono text-[11px] text-slate-500">{subValue}</div>}
 38:     </div>
 39:   );
 40: 
 41:   return (
 42:     <div className="p-4 space-y-6">
 43:       {/* Header Section: 3-line layout */}
 44:       <div className="border-b border-slate-200 pb-4 flex flex-col items-center text-center">
 45:         <div className="text-sm font-mono font-bold text-slate-400 mb-1">{data.code}</div>
 46:         <div className="text-xl font-black text-slate-900 mb-2">{data.name}</div>
 47:         <div className="flex flex-col items-center mb-3">
 48:           <div className={`text-4xl font-mono font-black ${data.change && data.change.startsWith('+') ? 'text-red-600' : 'text-blue-600'}`}>
 49:             {data.current_price}
 50:           </div>
 51:           <div className={`text-sm font-mono font-bold ${data.change && data.change.startsWith('+') ? 'text-red-600' : 'text-blue-600'}`}>
 52:             {data.change} ({data.change_percent}%)
 53:           </div>
 54:         </div>
 55:         {data.dividend_yield && (
 56:           <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
 57:             <TrendingUp size={10} />
 58:             利回り {data.dividend_yield}
 59:           </div>
 60:         )}
 61:       </div>
 62: 
 63:       {/* Pane 2: Market Intelligence - Core Metrics */}
 64:       <div className="flex flex-col gap-8">
 65:         
 66:         {/* 1. 主要指標 */}
 67:         <section>
 68:           <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-blue-600 pl-2 uppercase tracking-tight">主要指標</h3>
 69:           <div className="flex flex-col gap-6">
 70:             <MetricItem label="VWAP" value={data.vwap} icon={Activity} />
 71:             <MetricItem label="出来高" value={data.volume} icon={Info} />
 72:             <MetricItem label="25日乖離" value={data.ma25_diff} icon={TrendingUp} />
 73:             <MetricItem label="75日乖離" value={data.ma75_diff} icon={TrendingUp} />
 74:           </div>
 75:         </section>
 76: 
 77:         {/* 2. 需給 */}
 78:         <section>
 79:           <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-indigo-600 pl-2 uppercase tracking-tight">需給コンディション</h3>
 80:           <div className="flex flex-col gap-6">
 81:             <MetricItem label="信用買残" value={data.margin_buy} icon={Database} />
 82:             <MetricItem label="信用売残" value={data.margin_sell} icon={Database} />
 83:             <MetricItem label="貸借倍率" value={data.margin_ratio} icon={Database} />
 84:           </div>
 85:         </section>
 86: 
 87:         {/* 3. ファンダメンタル */}
 88:         <section>
 89:           <h3 className="text-xs font-black text-slate-900 mb-4 border-l-4 border-emerald-600 pl-2 uppercase tracking-tight">ファンダメンタル</h3>
 90:           <div className="flex flex-col gap-6">
 91:             <MetricItem label="配当利回り" value={data.dividend_yield} icon={TrendingUp} />
 92:             <MetricItem label="決算発表予定日" value={data.settlement_date} icon={FileText} />
 93:             <div className="grid grid-cols-2 gap-4">
 94:               <MetricItem label="配当落ち日" value={data.ex_dividend_date} icon={Info} />
 95:               <MetricItem label="優待発生月" value={data.benefit_date} icon={Star} />
 96:             </div>
 97:           </div>
 98:         </section>
 99: 
100:       </div>
101:     </div>
102:   );
103: }
````

## File: frontend/src/components/dashboard/LeftRail.tsx
````typescript
 1: import { LayoutDashboard, Star, Filter, Settings, Search, ClipboardCheck } from "lucide-react";
 2: import Link from "next/link";
 3: import { usePathname } from "next/navigation";
 4: 
 5: export default function LeftRail() {
 6:   const pathname = usePathname();
 7: 
 8:   return (
 9:     <div className="w-[72px] bg-white border-r border-slate-200 flex flex-col items-center py-6 gap-8">
10:       <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4">
11:         T
12:       </div>
13:       
14:       <Link href="/">
15:         <NavIcon icon={<LayoutDashboard size={24} />} active={pathname === "/"} />
16:       </Link>
17:       <Link href="/review">
18:         <NavIcon icon={<ClipboardCheck size={24} />} active={pathname === "/review"} />
19:       </Link>
20:       <NavIcon icon={<Star size={24} />} />
21:       <NavIcon icon={<Search size={24} />} />
22:       
23:       <div className="mt-auto mb-4">
24:         <NavIcon icon={<Settings size={24} />} />
25:       </div>
26:     </div>
27:   );
28: }
29: 
30: function NavIcon({ icon, active = false }: { icon: React.ReactNode; active?: boolean }) {
31:   return (
32:     <div className={`
33:       p-3 rounded-2xl cursor-pointer transition-all duration-200
34:       ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
35:     `}>
36:       {icon}
37:     </div>
38:   );
39: }
````

## File: frontend/src/components/dashboard/Watchlist.tsx
````typescript
  1: "use client";
  2: 
  3: import { useState, useEffect } from "react";
  4: import { useStockStore } from "@/store/useStockStore";
  5: import { X, Plus, ListPlus, Trash2, GripVertical } from "lucide-react";
  6: import {
  7:   DndContext,
  8:   closestCenter,
  9:   KeyboardSensor,
 10:   PointerSensor,
 11:   useSensor,
 12:   useSensors,
 13:   DragEndEvent,
 14: } from '@dnd-kit/core';
 15: import {
 16:   arrayMove,
 17:   SortableContext,
 18:   sortableKeyboardCoordinates,
 19:   verticalListSortingStrategy,
 20:   useSortable,
 21: } from '@dnd-kit/sortable';
 22: import { CSS } from '@dnd-kit/utilities';
 23: import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
 24: 
 25: interface SortableItemProps {
 26:   item: any;
 27:   isSelected: boolean;
 28:   onSelect: (code: string) => void;
 29:   onRemove: (code: string) => void;
 30: }
 31: 
 32: function SortableWatchlistItem({ item, isSelected, onSelect, onRemove }: SortableItemProps) {
 33:   const {
 34:     attributes,
 35:     listeners,
 36:     setNodeRef,
 37:     transform,
 38:     transition,
 39:     isDragging,
 40:   } = useSortable({ id: item.code });
 41: 
 42:   const style = {
 43:     transform: CSS.Transform.toString(transform),
 44:     transition,
 45:     zIndex: isDragging ? 50 : 'auto',
 46:     opacity: isDragging ? 0.5 : 1,
 47:   };
 48: 
 49:   return (
 50:     <div
 51:       ref={setNodeRef}
 52:       style={style}
 53:       className={`group p-3 border-b border-slate-100 cursor-pointer transition-colors relative flex gap-2 items-center ${
 54:         isSelected ? "bg-blue-50 border-l-4 border-blue-600 shadow-inner" : "hover:bg-slate-50"
 55:       }`}
 56:       onClick={() => onSelect(item.code)}
 57:     >
 58:       <div 
 59:         {...attributes} 
 60:         {...listeners} 
 61:         className="cursor-grab active:cursor-grabbing p-1 text-slate-300 hover:text-slate-500 transition-colors"
 62:       >
 63:         <GripVertical size={16} />
 64:       </div>
 65:       
 66:       <div className="flex-1 min-w-0">
 67:         <div className="flex justify-between items-start mb-0.5">
 68:           <span className="font-mono font-bold text-slate-400 text-[10px] tracking-tight">{item.code}</span>
 69:           <div className="flex items-center gap-1">
 70:             <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded uppercase font-bold tracking-tighter">
 71:               {item.industry || "---"}
 72:             </span>
 73:             <button
 74:               onClick={(e) => {
 75:                 e.stopPropagation();
 76:                 onRemove(item.code);
 77:               }}
 78:               className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 hover:text-red-600 rounded text-slate-400 transition-all ml-1"
 79:             >
 80:               <X size={12} />
 81:             </button>
 82:           </div>
 83:         </div>
 84:         <div className="text-sm font-black text-slate-800 truncate mb-1">
 85:           {item.name || <span className="text-slate-300 font-normal italic">Loading...</span>}
 86:         </div>
 87:         <div className="flex justify-between items-center mb-1">
 88:           <span className="font-mono font-bold text-slate-900">{item.price || "¥ ---"}</span>
 89:           <div className="flex flex-col items-end">
 90:              <span className={`font-mono text-[10px] font-bold ${item.change?.includes('+') ? 'text-red-500' : 'text-blue-500'}`}>
 91:               {item.change || "---"}
 92:             </span>
 93:             <span className={`font-mono text-[9px] font-bold ${item.ma25_diff?.includes('+') ? 'text-red-500' : 'text-blue-500'}`}>
 94:               MA25: {item.ma25_diff || "---"}
 95:             </span>
 96:           </div>
 97:         </div>
 98:       </div>
 99:     </div>
100:   );
101: }
102: 
103: export default function Watchlist() {
104:   const { 
105:     categories,
106:     activeCategoryId,
107:     selectedTicker, 
108:     setSelectedTicker, 
109:     addTickers, 
110:     removeFromWatchlist, 
111:     updateWatchlistItem,
112:     reorderWatchlist,
113:     clearWatchlist 
114:   } = useStockStore();
115:   
116:   const [input, setInput] = useState("");
117:   const [showBulk, setShowBulk] = useState(false);
118: 
119:   const sensors = useSensors(
120:     useSensor(PointerSensor, {
121:       activationConstraint: {
122:         distance: 5,
123:       },
124:     }),
125:     useSensor(KeyboardSensor, {
126:       coordinateGetter: sortableKeyboardCoordinates,
127:     })
128:   );
129: 
130:   const activeCategory = categories.find(c => c.id === activeCategoryId) || categories[0];
131:   const watchlist = activeCategory.items;
132:   const watchlistCodes = watchlist.map(i => i.code).join(',');
133: 
134:   useEffect(() => {
135:     watchlist.forEach(async (item) => {
136:       if (!item.code) return;
137:       if (!item.name || !item.price) {
138:         try {
139:           const resp = await fetch(`http://127.0.0.1:8000/stocks/${item.code}`);
140:           if (resp.ok) {
141:             const data = await resp.json();
142:             updateWatchlistItem(item.code, {
143:               name: data.name,
144:               price: data.current_price,
145:               change: `${data.change} (${data.change_percent}%)`,
146:               industry: data.industry || "市場情報",
147:               vwap: data.vwap,
148:               ma25_diff: data.ma25_diff,
149:               settlement_date: data.settlement_date,
150:               ex_dividend_date: data.ex_dividend_date,
151:               benefit_date: data.benefit_date
152:             });
153:           }
154:         } catch (e) {
155:           console.error(`Failed to fetch metadata for ${item.code}`, e);
156:         }
157:       }
158:     });
159:   }, [watchlistCodes, updateWatchlistItem]);
160: 
161:   const handleBulkAdd = () => {
162:     const tickers = input
163:       .split(/[\s,、\n]+/)
164:       .map(t => t.trim())
165:       .filter(t => /^\d{4}$/.test(t) || /^[A-Z]{1,5}$/.test(t));
166:     
167:     if (tickers.length > 0) {
168:       addTickers(tickers);
169:       setInput("");
170:       setShowBulk(false);
171:     }
172:   };
173: 
174:   const handleDragEnd = (event: DragEndEvent) => {
175:     const { active, over } = event;
176:     if (over && active.id !== over.id) {
177:       const oldIndex = watchlist.findIndex(i => i.code === active.id);
178:       const newIndex = watchlist.findIndex(i => i.code === over.id);
179:       reorderWatchlist(activeCategoryId, oldIndex, newIndex);
180:     }
181:   };
182: 
183:   return (
184:     <div className="flex-1 flex flex-col overflow-hidden bg-white">
185:       <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
186:         <div className="flex items-center gap-2">
187:           <h2 className="font-bold text-slate-700 uppercase tracking-tighter truncate max-w-[120px]">
188:             {activeCategory.name}
189:           </h2>
190:           <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full font-mono">
191:             {watchlist.length}/10
192:           </span>
193:         </div>
194:         <div className="flex items-center gap-1">
195:           <button 
196:             onClick={() => setShowBulk(!showBulk)}
197:             className="p-1.5 hover:bg-slate-100 rounded text-slate-500 transition-colors"
198:             title="一括追加"
199:           >
200:             <ListPlus size={18} />
201:           </button>
202:           <button 
203:             onClick={() => {
204:               if(confirm("このカテゴリーの銘柄をすべて削除しますか？")) clearWatchlist();
205:             }}
206:             className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500 transition-colors"
207:             title="すべて削除"
208:           >
209:             <Trash2 size={16} />
210:           </button>
211:         </div>
212:       </div>
213: 
214:       {showBulk && (
215:         <div className="p-3 bg-slate-50 border-b border-slate-100 animate-in fade-in slide-in-from-top-1">
216:           <textarea
217:             value={input}
218:             onChange={(e) => setInput(e.target.value.toUpperCase())}
219:             placeholder="銘柄コードをご入力ください"
220:             className="w-full text-sm font-mono p-2 border border-slate-200 rounded-lg h-24 mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
221:           />
222:           <div className="flex justify-end gap-2">
223:             <button onClick={() => setShowBulk(false)} className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700">Cancel</button>
224:             <button onClick={handleBulkAdd} className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 font-bold">
225:               <Plus size={14} /> 追加
226:             </button>
227:           </div>
228:         </div>
229:       )}
230:       
231:       <div className="flex-1 overflow-y-auto">
232:         {watchlist.length === 0 ? (
233:           <div className="p-8 text-center text-slate-400 text-sm">
234:             銘柄が登録されていません。<br/>「+」から追加してください。
235:           </div>
236:         ) : (
237:           <DndContext
238:             sensors={sensors}
239:             collisionDetection={closestCenter}
240:             onDragEnd={handleDragEnd}
241:             modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
242:           >
243:             <SortableContext
244:               items={watchlist.map(i => i.code)}
245:               strategy={verticalListSortingStrategy}
246:             >
247:               {watchlist.map((item) => (
248:                 <SortableWatchlistItem
249:                   key={item.code}
250:                   item={item}
251:                   isSelected={selectedTicker === item.code}
252:                   onSelect={setSelectedTicker}
253:                   onRemove={removeFromWatchlist}
254:                 />
255:               ))}
256:             </SortableContext>
257:           </DndContext>
258:         )}
259:       </div>
260:     </div>
261:   );
262: }
````

## File: frontend/src/store/useStockStore.ts
````typescript
  1: import { create } from 'zustand';
  2: import { persist } from 'zustand/middleware';
  3: 
  4: export interface WatchlistItem {
  5:   code: string;
  6:   name?: string;
  7:   price?: string;
  8:   change?: string;
  9:   industry?: string;
 10:   vwap?: string;
 11:   ma25_diff?: string;
 12:   settlement_date?: string;
 13:   ex_dividend_date?: string;
 14:   benefit_date?: string;
 15: }
 16: 
 17: export interface IndexInfo {
 18:   name: string;
 19:   price: string;
 20:   change: string;
 21:   change_percent: string;
 22: }
 23: 
 24: export interface MarketIndices {
 25:   nikkei225: IndexInfo;
 26:   topix: IndexInfo;
 27:   futures: IndexInfo;
 28: }
 29: 
 30: export interface WatchlistCategory {
 31:   id: string;
 32:   name: string;
 33:   items: WatchlistItem[];
 34: }
 35: 
 36: interface StockState {
 37:   selectedTicker: string;
 38:   currentPrice: string;
 39:   categories: WatchlistCategory[];
 40:   activeCategoryId: string;
 41:   marketIndices: MarketIndices | null;
 42:   
 43:   setSelectedTicker: (ticker: string) => void;
 44:   setCurrentPrice: (price: string) => void;
 45:   setActiveCategory: (id: string) => void;
 46:   updateMarketIndices: (indices: MarketIndices) => void;
 47:   
 48:   addCategory: (name: string) => void;
 49:   renameCategory: (id: string, name: string) => void;
 50:   deleteCategory: (id: string) => void;
 51:   
 52:   addToWatchlist: (ticker: string) => void;
 53:   addTickers: (tickers: string[]) => void;
 54:   removeFromWatchlist: (ticker: string) => void;
 55:   updateWatchlistItem: (ticker: string, data: Partial<WatchlistItem>) => void;
 56:   reorderWatchlist: (categoryId: string, startIndex: number, endIndex: number) => void;
 57:   clearWatchlist: () => void;
 58: }
 59: 
 60: const DEFAULT_CATEGORIES: WatchlistCategory[] = [
 61:   { id: 'cat-1', name: '主要銘柄', items: [{ code: '7203', name: 'トヨタ', industry: '輸送用機器' }, { code: '9434', name: 'ソフトバンク', industry: '情報・通信業' }] },
 62:   { id: 'cat-2', name: '監視銘柄A', items: [] },
 63:   { id: 'cat-3', name: '監視銘柄B', items: [] },
 64:   { id: 'cat-4', name: '高配当銘柄', items: [] },
 65:   { id: 'cat-5', name: 'グロース', items: [] },
 66:   { id: 'cat-6', name: 'カテゴリ6', items: [] },
 67:   { id: 'cat-7', name: 'カテゴリ7', items: [] },
 68:   { id: 'cat-8', name: 'カテゴリ8', items: [] },
 69:   { id: 'cat-9', name: 'カテゴリ9', items: [] },
 70:   { id: 'cat-10', name: 'カテゴリ10', items: [] },
 71: ];
 72: 
 73: export const useStockStore = create<StockState>()(
 74:   persist(
 75:     (set) => ({
 76:       selectedTicker: '7203',
 77:       currentPrice: '',
 78:       categories: DEFAULT_CATEGORIES,
 79:       activeCategoryId: 'cat-1',
 80:       marketIndices: null,
 81: 
 82:       setSelectedTicker: (ticker) => set({ selectedTicker: ticker, currentPrice: '' }),
 83:       setCurrentPrice: (price) => set({ currentPrice: price }),
 84:       setActiveCategory: (id) => set({ activeCategoryId: id }),
 85:       updateMarketIndices: (indices) => set({ marketIndices: indices }),
 86: 
 87:       addCategory: (name) => set((state) => ({
 88:         categories: [...state.categories, { id: `cat-${Date.now()}`, name, items: [] }]
 89:       })),
 90: 
 91:       renameCategory: (id, name) => set((state) => ({
 92:         categories: state.categories.map(c => c.id === id ? { ...c, name } : c)
 93:       })),
 94: 
 95:       deleteCategory: (id) => set((state) => {
 96:         const newCategories = state.categories.filter(c => c.id !== id);
 97:         return {
 98:           categories: newCategories,
 99:           activeCategoryId: state.activeCategoryId === id ? (newCategories[0]?.id || '') : state.activeCategoryId
100:         };
101:       }),
102: 
103:       addToWatchlist: (ticker) =>
104:         set((state) => ({
105:           categories: state.categories.map(c => 
106:             c.id === state.activeCategoryId 
107:               ? { 
108:                   ...c, 
109:                   items: c.items.some(i => i.code === ticker) || c.items.length >= 10
110:                     ? c.items 
111:                     : [...c.items, { code: ticker }]
112:                 }
113:               : c
114:           )
115:         })),
116: 
117:       addTickers: (tickers) =>
118:         set((state) => ({
119:           categories: state.categories.map(c => {
120:             if (c.id !== state.activeCategoryId) return c;
121:             const existingCodes = new Set(c.items.map(i => i.code));
122:             const newCodes = tickers.filter(t => t && !existingCodes.has(t));
123:             const availableSlots = 10 - c.items.length;
124:             if (availableSlots <= 0) return c;
125:             
126:             const itemsToAdd = newCodes.slice(0, availableSlots).map(code => ({ code }));
127:             return { ...c, items: [...c.items, ...itemsToAdd] };
128:           })
129:         })),
130: 
131:       removeFromWatchlist: (ticker) =>
132:         set((state) => ({
133:           categories: state.categories.map(c =>
134:             c.id === state.activeCategoryId
135:               ? { ...c, items: c.items.filter(i => i.code !== ticker) }
136:               : c
137:           )
138:         })),
139: 
140:       updateWatchlistItem: (ticker, data) =>
141:         set((state) => ({
142:           categories: state.categories.map(c => ({
143:             ...c,
144:             items: c.items.map(i => i.code === ticker ? { ...i, ...data } : i)
145:           }))
146:         })),
147: 
148:       reorderWatchlist: (categoryId, startIndex, endIndex) =>
149:         set((state) => ({
150:           categories: state.categories.map(c => {
151:             if (c.id !== categoryId) return c;
152:             const newItems = Array.from(c.items);
153:             const [removed] = newItems.splice(startIndex, 1);
154:             newItems.splice(endIndex, 0, removed);
155:             return { ...c, items: newItems };
156:           })
157:         })),
158: 
159:       clearWatchlist: () =>
160:         set((state) => ({
161:           categories: state.categories.map(c =>
162:             c.id === state.activeCategoryId ? { ...c, items: [] } : c
163:           )
164:         })),
165:     }),
166:     {
167:       name: 'trade-info-v3-storage',
168:       version: 4,
169:       migrate: (persistedState: any, version: number) => {
170:         if (!persistedState) return persistedState;
171:         
172:         // 旧バージョン (watchlist配列) からの新バージョン (categories) への移行
173:         if (persistedState.watchlist && !persistedState.categories) {
174:           persistedState.categories = [
175:             { id: 'cat-1', name: 'インポート', items: persistedState.watchlist.slice(0, 10) },
176:             ...DEFAULT_CATEGORIES.slice(1)
177:           ];
178:           persistedState.activeCategoryId = 'cat-1';
179:           delete persistedState.watchlist;
180:         }
181: 
182:         // 不備がある場合のガード
183:         if (persistedState.categories) {
184:           persistedState.categories = persistedState.categories.map((c: any) => ({
185:             ...c,
186:             items: Array.isArray(c.items) ? c.items.map((i: any) => 
187:               typeof i === 'string' ? { code: i } : i
188:             ).filter((i: any) => i && i.code) : []
189:           }));
190:         }
191: 
192:         return persistedState;
193:       },
194:     }
195:   )
196: );
````

## File: frontend/package.json
````json
 1: {
 2:   "name": "frontend",
 3:   "version": "0.1.0",
 4:   "private": true,
 5:   "scripts": {
 6:     "dev": "next dev",
 7:     "build": "next build",
 8:     "start": "next start",
 9:     "lint": "eslint"
10:   },
11:   "dependencies": {
12:     "@dnd-kit/core": "^6.3.1",
13:     "@dnd-kit/modifiers": "^9.0.0",
14:     "@dnd-kit/sortable": "^10.0.0",
15:     "@dnd-kit/utilities": "^3.2.2",
16:     "@tanstack/react-query": "^5.90.12",
17:     "class-variance-authority": "^0.7.1",
18:     "clsx": "^2.1.1",
19:     "lightweight-charts": "^5.1.0",
20:     "lucide-react": "^0.562.0",
21:     "next": "16.1.1",
22:     "react": "19.2.3",
23:     "react-dom": "19.2.3",
24:     "tailwind-merge": "^3.4.0",
25:     "zustand": "^5.0.9"
26:   },
27:   "devDependencies": {
28:     "@tailwindcss/postcss": "^4",
29:     "@types/node": "^20",
30:     "@types/react": "^19",
31:     "@types/react-dom": "^19",
32:     "eslint": "^9",
33:     "eslint-config-next": "16.1.1",
34:     "tailwindcss": "^4",
35:     "tw-animate-css": "^1.4.0",
36:     "typescript": "^5"
37:   }
38: }
````

## File: evolution_history.md
````markdown
 1: # evolution_history.md
 2: 
 3: ## 2025-12-23: Web 特化型プロフェッショナル・ダッシュボードの再定義
 4: 
 5: - [P] LINE 連携をスコープ外とし、Web での「マーケットスピード II」超えの操作性を目標に設定。
 6: - [D] 4 ペイン構成の確定。Zustand による状態管理と JetBrains Mono による数値表示ロジックの設計。
 7: - [C] 4 ペインは情報密度が高いため、14 インチ以下のノート PC での視認性を Shadcn UI の Density（密度）調整で解決予定。
 8: - [A] 銘柄詳細取得 API を「高速・非同期（httpx）」で再実装する。
 9: 
10: ## 2025-12-23: TradeInfo v3 の完成（実データ・マルチカテゴリ・VWAP）
11: 
12: - [P] 外部スクレイピングによる日足データの完全同期と、マルチカテゴリによる銘柄整理機能を実装。
13: - [D] 4 カラム構成（ジャンル、リスト、指標、チャート＆ニュース）によりプロ仕様の情報密度を実現。
14: - [C] VWAP の描画形式（棒グラフから折れ線へ）をユーザーのフィードバックに基づき最適化。
15: 
16: ## 2025-12-24: TradeInfo v3.1 視認性向上とレビュー・システムの導入
17: 
18: - [P] ユーザーフィードバックに基づく UI の大幅な整理。ウオッチリストをスッキリさせ、指標を中央パネルへ集約。
19: - [D] 開発・検証を効率化する「インタラクティブ・レビュー・ダッシュボード」を導入。アプリ内で直接 FB のやり取りを実現。
20: - [C] マーケット・ティッカーの配色をライトテーマに変更し、1 分ごとの更新を停止。ユーザーの集中力を削がない設計へ。
21: - [A] Kabutan スクレイピング・ロジックを刷新。表形式の差異を吸収する堅牢な抽出方式により、配当利回りや各種日程の取得精度を極限まで向上。
````
