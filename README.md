# 🧪 skills.wakari.me

> **Claude Agent Skills を発掘・整理・カスタマイズして公開するリポジトリ**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Skills Count](https://img.shields.io/badge/skills-1-blue)](./skills)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-blueviolet)](https://claude.ai/code)
[![Maintained](https://img.shields.io/badge/maintained-actively-green)](./)

[🌐 skills.wakari.me](https://skills.wakari.me) · [📖 使い方](#使い方) · [🤝 コントリビュート](#コントリビュート)

---

## ✨ このリポジトリについて

GitHub に散らばる Claude Agent Skills を**実際に動かして**、使えるものだけを厳選・カスタマイズして公開しています。

- 🔍 **発掘** — `anthropics/skills` やコミュニティリポジトリから有望なスキルを探索
- 🛠️ **カスタマイズ** — 日本語対応・実務ユースケースに合わせて調整
- 📝 **解説** — どこを直したら使えるようになったか、差分つきで紹介

---

## 🚀 使い方

### Claude Code でインストール

```bash
# このリポジトリをマーケットプレイスに追加
/plugin marketplace add wakari-me/skills

# スキルを一覧表示してインストール
/plugin install all-skills@wakari-me-skills
```

### 個別にクローンして使う

```bash
git clone https://github.com/wakari-me/skills
cd skills

# 使いたいスキルを ~/.claude/skills/ にコピーするだけ
cp -r skills/mcp-builder ~/.claude/skills/
```

---

## 📦 スキル一覧

### 🔧 開発・インフラ系

| スキル | 元ソース | カスタマイズ内容 | 難易度 |
|--------|---------|----------------|--------|
| [mcp-builder](./skills/mcp-builder) | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/mcp-builder) | Python 削除・bun 対応・日本語化 | ⭐⭐⭐ |

### 🤖 AI / Claude Code ワークフロー系

| スキル | 元ソース | カスタマイズ内容 | 難易度 |
|--------|---------|----------------|--------|
| Coming soon... | — | — | — |

### 📣 マーケティング・ライティング系

| スキル | 元ソース | カスタマイズ内容 | 難易度 |
|--------|---------|----------------|--------|
| Coming soon... | — | — | — |

---

## 🗂️ ディレクトリ構造

```
skills.wakari.me/
├── .claude-plugin/
│   └── marketplace.json      # Claude Code マーケットプレイス設定
├── skills/
│   ├── [skill-name]/
│   │   ├── SKILL.md          # Claude が読む指示書
│   │   ├── scripts/          # 補助スクリプト（任意）
│   │   └── references/       # 参考ドキュメント（任意）
│   └── ...
├── docs/
│   └── customization-guide.md  # カスタマイズの考え方
└── README.md
```

---

## 🔬 カスタマイズの考え方

各スキルの `SKILL.md` には **元ソースとの差分** を明記しています。

```yaml
---
name: skill-name
source: https://github.com/anthropics/skills/tree/main/skills/skill-name
customized-by: wakari-me
changes:
  - 変更内容を箇条書きで記載
---
```

変更点は GitHub の Compare ビューで確認できます 👇  
`github.com/wakari-me/skills/compare/upstream...main`

---

## 🤝 コントリビュート

「このスキル使えた / 使えなかった」の報告だけでも大歓迎です！

Issue のタイトル例：
- `[skill-name] ○○環境で動かない`
- `[skill-name] ○○を追加したら使えた`

---

## 📰 関連記事

スキルの発掘・カスタマイズ過程は **[wakari.me](https://wakari.me)** で記事にしています。

---

<p align="center">
  Made with ☕ and Claude Code
</p>
