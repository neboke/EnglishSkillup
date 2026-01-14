# アーキテクチャ設計

## システム概要
不規則動詞と英文法例文の学習アプリ。統計管理、フィルタリング、複数問題形式対応。

## 3層アーキテクチャ

### データ層
- **LocalStorage**: 統計データの永続化
- **JSON Files**: 問題データ（questions1-9.json）

### ビジネスロジック層
- **StorageManager**: 統計CRUD、正答率計算
- **QuestionManager**: 問題読み込み、フィルタリング、シャッフル
- **Renderers**: 問題タイプ別のHTML生成

### UI層
- **Components**: サイドバー、統計パネル、問題カード
- **QuizApp**: メインコントローラー、状態管理

## データフロー
1. QuizApp初期化 → QuestionManager が JSON読み込み
2. ユーザーがフィルター選択 → QuestionManager でフィルタリング
3. 問題表示 → 対応するRenderer で HTML生成
4. 回答送信 → StorageManager で統計更新
5. 統計表示更新 → StatsPanel で描画

## モジュール構成

```
src/
├── storage.js           - LocalStorage管理
├── questionManager.js   - 問題データ管理
├── app.js              - メインコントローラー
├── renderers/          - 問題タイプ別レンダラー
│   ├── verbRenderer.js
│   ├── choiceRenderer.js
│   └── reorderRenderer.js
└── components/         - UIコンポーネント
    ├── sidebar.js
    ├── statsPanel.js
    └── quizCard.js
```
