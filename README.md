# EnglishSkillup

不規則動詞と英文法の学習アプリケーション

## 📝 概要

このアプリケーションは、英語の不規則動詞と文法問題を学習するためのクイズツールです。
問題ごとの正答率を追跡し、苦手な問題をフィルタリングして集中的に学習できます。

### 主な機能

- **3種類の問題タイプ**
  - 不規則動詞: 過去形と過去分詞を入力
  - 選択問題: 複数の選択肢から正解を選択
  - 並べ替え問題: 空欄に適切な単語を入力

- **詳細な統計追跡**
  - 問題ごとの正答率を記録
  - 全体統計と問題タイプ別統計
  - 視覚的なプログレスバー表示

- **柔軟なフィルタリング**
  - すべて/不規則動詞/選択問題/並べ替え問題
  - 正答率が閾値未満の「間違えた問題」のみ表示
  - 閾値の調整（20%/40%/60%/80%/100%）

- **レスポンシブデザイン**
  - デスクトップ: サイドバーレイアウト
  - タブレット/モバイル: ドロワーメニュー

## 🚀 セットアップ

### 開発環境

```bash
# 依存関係のインストール
npm install

# テストの実行
npm test
```

### ローカルでの実行

```bash
# 簡易HTTPサーバーの起動（npx serve使用）
npm run serve

# または他のHTTPサーバーを使用
python3 -m http.server 8000
```

ブラウザで http://localhost:3000（または該当ポート）を開いてアクセス。

## 📁 プロジェクト構成

```
EnglishWord/
├── data/                   # 問題データ（JSON）
│   └── questions1-9.json   # 124問の問題
├── src/
│   ├── storage.js          # LocalStorage管理
│   ├── questionManager.js  # 問題データ管理
│   ├── app.js              # メインアプリケーション
│   ├── renderers/          # 問題タイプ別レンダラー
│   │   ├── verbRenderer.js
│   │   ├── choiceRenderer.js
│   │   └── reorderRenderer.js
│   └── components/         # UIコンポーネント
│       ├── sidebar.js
│       ├── statsPanel.js
│       └── quizCard.js
├── styles/                 # スタイルシート
│   ├── base.css
│   ├── layout.css
│   ├── sidebar.css
│   ├── quiz.css
│   └── responsive.css
├── tests/                  # テストファイル
│   ├── unit/
│   └── integration/
├── docs/                   # 技術ドキュメント
│   ├── ARCHITECTURE.md
│   ├── DATA_STRUCTURE.md
│   └── TEST_PLAN.md
└── index.html              # エントリーポイント
```

## 💻 使い方

1. **フィルター選択**: 左サイドバーで問題タイプを選択
2. **閾値設定**: 正答率の閾値を設定（間違えた問題フィルター用）
3. **問題に回答**: 入力フィールドまたは選択肢から回答
4. **確認**: 「確認」ボタンで答え合わせ
5. **次へ**: 「次へ」ボタンで次の問題へ進む
6. **統計確認**: サイドバーで進捗と正答率を確認

### キーボードショートカット

- `Enter`: 確認/次へ

## 🧪 テスト

```bash
# すべてのテストを実行
npm test

# カバレッジレポート付きで実行
npm run test:coverage

# ウォッチモード
npm run test:watch
```

## 📊 データ構造

### 問題データ (questions*.json)

```json
{
  "id": "verb_001",
  "type": "verb",
  "question": "be",
  "correctAnswer": {
    "past": ["was", "were"],
    "pastParticiple": "been"
  },
  "difficulty": "medium"
}
```

### LocalStorage

```json
{
  "questionStats": {
    "verb_001": {
      "attempts": 5,
      "correct": 4
    }
  },
  "settings": {
    "filterType": "all",
    "accuracyThreshold": 80
  }
}
```

## 🔧 技術スタック

- **フロントエンド**: Vanilla JavaScript (ES6 Modules)
- **テスト**: Jest + Testing Library
- **スタイル**: CSS Grid + Custom CSS
- **データ**: JSON + LocalStorage

## 📝 ライセンス

MIT

## 🌐 デプロイ

GitHub Pagesでホスティング: https://neboke.github.io/EnglishSkillup/

### デプロイ手順

```bash
# リポジトリにプッシュ
git add .
git commit -m "Update"
git push origin main

# GitHub Pages設定
# Settings → Pages → Source: main branch
```

## 🤝 コントリビューション

プルリクエストを歓迎します！

1. Fork
2. Feature branchを作成 (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Pull Requestを作成
