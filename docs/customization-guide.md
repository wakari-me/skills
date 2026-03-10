# カスタマイズガイド

このリポジトリでのスキルカスタマイズの考え方と手順をまとめています。

---

## 基本的な流れ

```
① 元スキルを fork or copy
② 動作確認（そのままで動くか？）
③ 問題点を特定
④ SKILL.md を修正
⑤ 再テスト
⑥ changes に差分を記録して push
```

---

## SKILL.md のフロントマター規約

このリポジトリでは以下のフロントマターを標準としています。

```yaml
---
name: skill-name
description: |
  スキルの説明。Claude がいつこのスキルを使うべきか明示する。
  Use when ○○ or when the user mentions △△.
source: https://github.com/元リポジトリ/のURL
customized-by: wakari-me
changes:
  - 変更内容1
  - 変更内容2
---
```

### `source` がない場合（オリジナルスキル）

```yaml
---
name: skill-name
description: |
  スキルの説明。
source: original
customized-by: wakari-me
---
```

---

## カスタマイズのよくあるパターン

### 1. 日本語対応
- エラーメッセージの日本語化
- コメント・説明文の日本語追記
- 日本語入力が前提の処理の追加

### 2. 実行環境の調整
- Python → bun / Node.js への変換
- パッケージマネージャーの変更（npm → bun）
- パスの調整（macOS / Linux 対応）

### 3. ユースケースの絞り込み
- 汎用スキルを特定用途に特化
- 不要な処理を削除してトークン節約
- よく使うオプションをデフォルト化

---

## スキルをリポジトリに追加する手順

```bash
# 1. スキルディレクトリを作成
mkdir skills/[skill-name]

# 2. SKILL.md を作成（上記フロントマター規約に従う）
touch skills/[skill-name]/SKILL.md

# 3. marketplace.json の skills 配列に追加
# .claude-plugin/marketplace.json を編集

# 4. README.md のスキル一覧テーブルを更新

# 5. コミット
git add .
git commit -m "feat: add [skill-name] skill"
git push
```

---

## README バッジの更新

スキルを追加したら README の Skills Count バッジを更新してください。

```markdown
[![Skills Count](https://img.shields.io/badge/skills-{数字}-blue)](./skills)
```
