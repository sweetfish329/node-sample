# OpenAPI TypeScript Sample Project

このプロジェクトは、React (TypeScript) フロントエンドと Hono.js バックエンドが **openapi-typescript** を利用して共通の API 型定義を共有する、モノレポ構成のサンプルプロジェクトです。

## 📁 プロジェクト構成

```
node-sample/
├── frontend/          # React (TypeScript) フロントエンド
├── backend/           # Hono.js バックエンドAPI
├── packages/
│   └── schema/        # 生成された型定義
├── docs/
│   └── api/           # OpenAPI仕様定義
├── package.json       # ルートのpackage.json (workspace設定)
├── README.md          # このファイル
└── Gemini.md          # Gemini AI開発ガイド
```

## 🎯 プロジェクトの目的

このサンプルプロジェクトは、以下を実現するためのベストプラクティスを示します:

- **型安全な API 通信**: OpenAPI 仕様から自動生成された型定義を使用
- **フロントエンド・バックエンド間の型の共有**: 単一のソースから TypeScript 型を生成
- **開発効率の向上**: API 仕様の変更が自動的に型定義に反映される

## 🚀 セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または yarn

### インストール

```bash
# 依存関係のインストール
npm install

# 各パッケージのインストール (workspace使用時)
npm install --workspaces
```

### OpenAPI 型定義の生成

```bash
# packages/schema/でOpenAPI仕様から型定義を生成
npm run generate:types
```

## 🛠️ 開発

### バックエンド開発

```bash
cd backend
npm run dev
```

バックエンドは `http://localhost:3000` で起動します。

### フロントエンド開発

```bash
cd frontend
npm run dev
```

フロントエンドは `http://localhost:5173` で起動します。

### 同時起動

```bash
- TypeScript
- Vite
- openapi-typescript

### Backend

- Hono.js
- TypeScript
- Node.js

### Schema

- OpenAPI 3.x
- openapi-typescript

## 🔗 参考リンク

- [OpenAPI Specification](https://swagger.io/specification/)
- [openapi-typescript](https://github.com/drwpow/openapi-typescript)
- [Hono.js](https://hono.dev/)
- [React](https://react.dev/)

## 📄 ライセンス

MIT
```
