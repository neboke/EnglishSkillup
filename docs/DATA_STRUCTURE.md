# データ構造仕様

## LocalStorage スキーマ

### questionStats
問題IDをキーとして、各問題の試行回数と正解回数を記録

```json
{
  "verb_001": {
    "attempts": 5,
    "correct": 4
  },
  "choice_010": {
    "attempts": 3,
    "correct": 3
  }
}
```

### settings
ユーザー設定を保存

```json
{
  "filterType": "all",
  "accuracyThreshold": 80
}
```

## 問題JSON スキーマ

### verb型（不規則動詞）
```json
{
  "id": "verb_001",
  "type": "verb",
  "base": "stand",
  "past": "stood",
  "pastParticiple": "stood",
  "meaning": "立っている",
  "category": "irregular_verbs",
  "difficulty": "medium"
}
```

### choice型（選択問題）
```json
{
  "id": "choice_001",
  "type": "choice",
  "prompt": "彼は毎日学校に行きます",
  "choices": [
    "He go to school every day.",
    "He goes to school every day.",
    "He going to school every day."
  ],
  "answer": "He goes to school every day.",
  "category": "grammar",
  "difficulty": "easy"
}
```

### reorder型（並び替え）
```json
{
  "id": "reorder_001",
  "type": "reorder",
  "prompt": "あなたは学生ですね",
  "template": "You are __0__ __1__, aren't you?",
  "blanks": ["a", "student"],
  "category": "tag_questions",
  "difficulty": "medium"
}
```

## 統計表示形式
- 全体: "45/56 (80%)"
- タイプ別: 同様の形式
- 正答率は問題単位で0%または100%
- 間違えた問題: 正答率が閾値未満の問題
