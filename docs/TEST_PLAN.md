# テスト計画

## テスト戦略
- 主要機能のみをテスト
- ステップ単位でテスト実行
- カバレッジ目標: 主要モジュール80%以上

## ユニットテスト

### storage.test.js
- 統計の保存・取得
- 正答率計算（0%/100%）
- 閾値フィルタリング
- タイプ別統計集計
- 全データ削除

### questionManager.test.js
- JSON読み込み（複数ファイル）
- タイプ別フィルタリング
- 閾値フィルタリング
- ランダムシャッフル

### renderers.test.js
- verbRenderer: 2つの入力フィールド生成
- choiceRenderer: ラジオボタン生成
- reorderRenderer: template内の__N__を入力に変換

### components.test.js
- sidebar: フィルターUI、閾値プルダウン生成
- statsPanel: プログレスバーHTML生成
- quizCard: 問題カード描画

## 統合テスト

### quiz-flow.test.js
- フィルター選択 → 問題フィルタリング
- 問題表示 → 正しいレンダラー使用
- 回答送信 → 統計更新
- 次の問題 → 状態遷移

## テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード
npm run test:watch

# カバレッジ付き
npm run test:coverage
```
