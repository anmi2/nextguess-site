# NextGuess サイト v4（スマホ優先）

## 目的
参加者がトップからすぐ「いま募集中の議題」を選び、LINEで議論できる公開サイト。現状は静的プロトタイプ。

## 編集する場所
- `data/ideas.json`: 募集テーマ・ABC案と質問
- `data/updates.json`: 進捗
- `data/decisions.json`: 判断ログ
- `data/tips.json`: Tips
- `assets/`: 実アプリ画面

スマホでは議題一覧→詳細へ移動。`?idea=IDEA-001#ideas` の形式で議題ごとの共有リンクを作れます。
現在は投票を記録しません。選択した文面をコピーしてLINEへ貼り付ける形式です。
架空の参加人数、投票数、発言を掲載しないでください。LINEの元発言は本人に確認し、公開用に要旨化してください。

## ローカル確認
`python3 -m http.server 8002` → `http://localhost:8002`

## 未接続
利用規約・プライバシーポリシー正式リンク、独立ドメイン。LINEオープンチャット招待リンクは参加案内に設置済み。GitHub Pagesはmainから公開中。
旧ツールは変更・終了していません。

## 絵コンテ①：プロダクトページ（開発ブランチ）
- `product.html`: 手描きレイアウトの A（大きな説明・機能スライド）／B（更新情報）／C（関連ページリンク）を再現した独立ページ。
- AのMAP・My Area画像は既存の `assets/` を再利用。HEX実機画像は未収集のためプレースホルダー表示。
- NextGuess Businessはローカル管理画面なので、一般公開URLが確定するまでリンクを設置しない。
- 公開中の `index.html`（開発ロードマップ）や `about.html` を変更しない。
- ブランチ `feature/product-landing-storyboard` を取得後、`python3 -m http.server 8002` で `http://localhost:8002/product.html` を確認できる。
- 差し替え候補：①iPhone HEX探索画面（5km/10km） ②会社CSV管理画面の一覧と配信設定。画像に実際の顧客データ・認証情報が写らないよう注意する。
