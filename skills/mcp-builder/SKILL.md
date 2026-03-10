---
name: mcp-builder
description: |
  TypeScript / bun で MCP (Model Context Protocol) サーバーを構築するガイド。
  MCP サーバーを新規作成するとき、外部 API を MCP ツールとして実装するとき、
  または既存の MCP サーバーを改善・レビューするときに使用してください。
  Use when building, reviewing, or improving MCP servers in TypeScript with bun runtime.
source: https://github.com/anthropics/skills/tree/main/skills/mcp-builder
customized-by: wakari-me
changes:
  - Python / FastMCP の記述を削除し TypeScript 専化
  - 実行環境を Node.js から bun に変更
  - フェーズ構成を日本語化・簡略化
  - bun 向けのプロジェクトセットアップ手順を追加
  - エラーメッセージの日本語対応セクションを追加
---

# MCP サーバー開発ガイド（TypeScript + bun）

## 概要

MCP (Model Context Protocol) サーバーは、LLM が外部サービスと連携するための「橋渡し役」です。
品質の高い MCP サーバーは、LLM が現実のタスクをスムーズに完了できるように設計されています。

> 🔧 **このガイドの対象環境**
> - 言語: TypeScript
> - ランタイム: bun
> - トランスポート: stdio（ローカル） / Streamable HTTP（リモート）

---

# 開発フロー

## Phase 1: 調査・設計

### 1.1 MCP の設計原則を理解する

**API カバレッジ vs ワークフローツール**
- 個別 API エンドポイントを網羅する「API ツール」と、複数操作をまとめた「ワークフローツール」のバランスを取る
- 迷ったら **API カバレッジ優先**（LLM が柔軟に組み合わせられるため）

**ツール命名規則**
```
# 良い例：プレフィックス + 動詞 + 対象
github_create_issue
github_list_repos
slack_send_message

# 悪い例：曖昧・重複
create         # 何を作る？
issueManager   # 動詞がない
```

**エラーメッセージは「次のアクション」を示す**
```typescript
// ❌ 悪い例
throw new Error("Not found")

// ✅ 良い例
throw new Error(
  `リソース '${id}' が見つかりません。` +
  `list_resources ツールで利用可能な ID を確認してください。`
)
```

### 1.2 MCP プロトコル仕様を確認する

必要に応じて以下を参照：
- サイトマップ: `https://modelcontextprotocol.io/sitemap.xml`
- 仕様書: `https://modelcontextprotocol.io/specification/draft.md`
- TypeScript SDK: `https://raw.githubusercontent.com/modelcontextprotocol/typescript-sdk/main/README.md`

### 1.3 実装計画を立てる

1. 対象 API のドキュメントを確認
2. 実装するエンドポイントをリストアップ（よく使うものから優先）
3. 認証方式を確認（API Key / OAuth / その他）

---

## Phase 2: 実装

### 2.1 プロジェクトセットアップ（bun）

```bash
mkdir my-mcp-server
cd my-mcp-server
bun init -y
bun add @modelcontextprotocol/sdk zod
bun add -d @types/node typescript
```

**`package.json` の設定**
```json
{
  "name": "my-mcp-server",
  "scripts": {
    "build": "bun build src/index.ts --outdir dist --target node",
    "dev": "bun run src/index.ts",
    "typecheck": "tsc --noEmit"
  }
}
```

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "outDir": "dist"
  }
}
```

### 2.2 基本構造

```typescript
// src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

const server = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
})

// ツールの登録
server.tool(
  "tool_name",
  "ツールの説明（LLM が読む）",
  {
    // Zod で入力スキーマを定義
    param1: z.string().describe("パラメータの説明"),
    param2: z.number().optional().describe("任意パラメータ"),
  },
  async ({ param1, param2 }) => {
    // 実装
    return {
      content: [{ type: "text", text: "結果" }],
    }
  }
)

// サーバー起動
const transport = new StdioServerTransport()
await server.connect(transport)
```

### 2.3 共通ユーティリティのパターン

**API クライアント**
```typescript
// src/client.ts
export class ApiClient {
  private baseUrl: string
  private apiKey: string

  constructor() {
    this.baseUrl = process.env.API_BASE_URL ?? ""
    this.apiKey = process.env.API_KEY ?? ""

    if (!this.apiKey) {
      throw new Error(
        "API_KEY が設定されていません。" +
        "環境変数 API_KEY を設定してください。"
      )
    }
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: { Authorization: `Bearer ${this.apiKey}` },
    })

    if (!res.ok) {
      throw new Error(
        `API エラー: ${res.status} ${res.statusText}\n` +
        `パス: ${path}`
      )
    }

    return res.json() as Promise<T>
  }
}
```

**ページネーション対応**
```typescript
server.tool(
  "list_items",
  "アイテム一覧を取得",
  {
    limit: z.number().min(1).max(100).default(20).describe("取得件数"),
    cursor: z.string().optional().describe("次ページのカーソル"),
  },
  async ({ limit, cursor }) => {
    const data = await client.list({ limit, cursor })
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          items: data.items,
          next_cursor: data.next_cursor,  // LLM が次のページを取得できる
          total: data.total,
        }, null, 2),
      }],
    }
  }
)
```

---

## Phase 3: テスト・品質確認

### 3.1 型チェック・ビルド確認

```bash
# 型エラーがないか確認
bun run typecheck

# ビルド確認
bun run build
```

### 3.2 MCP Inspector でテスト

```bash
# Inspector を起動してインタラクティブにツールをテスト
npx @modelcontextprotocol/inspector bun run src/index.ts
```

### 3.3 品質チェックリスト

- [ ] ツール名がプレフィックス統一されている
- [ ] エラーメッセージに「次のアクション」が含まれている
- [ ] ページネーションが必要なエンドポイントに対応している
- [ ] 環境変数が未設定の場合の適切なエラーが出る
- [ ] 型が全てカバーされている（any を使っていない）
- [ ] `bun run typecheck` が通る

---

## Phase 4: Claude Desktop / Claude Code への登録

### claude_desktop_config.json

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "bun",
      "args": ["run", "/path/to/my-mcp-server/src/index.ts"],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code での確認

```bash
# MCP サーバーが認識されているか確認
/mcp
```

---

# よくあるハマりポイント

| 症状 | 原因 | 対処 |
|------|------|------|
| ツールが Claude に認識されない | `server.connect()` の前にツール登録が必要 | 登録順序を確認 |
| `import` エラー | ESM の `.js` 拡張子が必要な場合がある | `"moduleResolution": "bundler"` を設定 |
| 環境変数が読めない | bun は `.env` を自動読み込み | `.env` ファイルを作成 |
| Inspector が起動しない | Node.js のバージョン問題 | `npx` の代わりに `bunx` を試す |
