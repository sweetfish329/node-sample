# Gemini AI 開発ガイド

このドキュメントは、Gemini AI がこのプロジェクトで開発を支援する際のガイドラインです。

## 🏗️ プロジェクト概要

このプロジェクトは、**openapi-typescript**を使用してフロントエンドとバックエンドで型定義を共有する、モノレポ構成のサンプルです。

### アーキテクチャ

```
┌─────────────────┐
│   Frontend      │
│  React + TS     │
└────────┬────────┘
         │
         │ API Request (型安全)
         │
┌────────▼────────┐
│   Backend       │
│   Hono.js       │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Schema  │
    │ OpenAPI │
    └─────────┘
```

### ディレクトリ構成の詳細

#### `docs/api/`

- **目的**: OpenAPI 仕様の定義
- **主要ファイル**:
  - `openapi.yaml`: API 仕様定義

#### `packages/schema/`

- **目的**: 型定義の生成と配布
- **主要ファイル**:
  - `generated/`: openapi-typescript で自動生成される型定義
  - `package.json`: 型生成スクリプトと依存関係

#### `backend/`

- **目的**: Hono.js を使用した RESTful API サーバー
- **主要ファイル**:
  - `src/index.ts`: エントリーポイント
  - `src/routes/`: API ルート定義
  - `src/handlers/`: リクエストハンドラ
- **依存関係**: `packages/schema`の型定義をインポート

#### `frontend/`

- **目的**: React を使用した Web アプリケーション
- **主要ファイル**:
  - `src/App.tsx`: メインコンポーネント
  - `src/api/`: API 呼び出しロジック
  - `src/types/`: 追加の型定義
- **依存関係**: `packages/schema`の型定義をインポート

## 🎯 開発タスクの進め方

### 1. 新しい API エンドポイントの追加

**手順**:

1. `docs/api/openapi.yaml`を編集してエンドポイントを定義
2. `npm run generate:types`で型定義を再生成
3. `backend/src/routes/`に新しいルートを追加
4. `frontend/src/api/`に API 呼び出し関数を追加

**例**: ユーザー取得 API

```yaml
# docs/api/openapi.yaml
paths:
  /api/users/{id}:
    get:
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        "200":
          description: Success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
```

### 2. 型定義の更新

**重要**: API 仕様を変更したら必ず型定義を再生成してください。

```bash
cd packages/schema
npm run generate
```

### 3. バックエンド実装

Hono.js での実装例:

```typescript
import { Hono } from "hono";
import type { paths } from "@node-sample/schema";

const app = new Hono();

// 型安全なルート定義
app.get("/api/users/:id", async (c) => {
  const id = c.req.param("id");
  // レスポンスの型は自動的に推論される
  return c.json({ id, name: "Example User" });
});
```

### 4. フロントエンド実装

React + `openapi-react-query`での実装例です。

#### API クライアントの設定

まず、`openapi-fetch` を使用して API クライアントを作成します。

```typescript
// src/api/client.ts
import createClient from "openapi-fetch";
import type { paths } from "@node-sample/schema";

export const client = createClient<paths>({
  baseUrl: "http://localhost:3000", // バックエンドのアドレス
});
```

#### React Query の設定

`App.tsx` またはエントリーポイントで `QueryClientProvider` を設定します。

```typescript
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

#### コンポーネントでのデータ取得

`useQuery` を使用して、コンポーネント内で型安全にデータを取得します。

```typescript
// src/components/UserList.tsx
import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => client.GET("/api/users"),
  });

  if (isLoading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error.message}</div>;

  return (
    <ul>
      {data?.data?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## 🔧 開発時の注意点

### 型の一貫性

- OpenAPI 仕様が唯一の信頼できる情報源 (Single Source of Truth)
- 手動で型定義を修正せず、必ず OpenAPI 仕様を更新してから型を再生成

### モノレポの依存関係

- フロントエンドとバックエンドは両方とも`packages/schema`に依存
- `packages/schema`の変更は両方のプロジェクトに影響

### ビルド順序

1. `packages/schema` - 型定義の生成
2. `backend` - バックエンドのビルド
3. `frontend` - フロントエンドのビルド

## 🚀 ESNext と最新JavaScript機能の使用

このプロジェクトは **ESNext** をターゲットとし、**TypeScript 5.9.3** を使用して最新のJavaScript機能を活用できます。

### ESNext の主な新機能

#### 1. Array Grouping (`Object.groupBy`, `Map.groupBy`)

配列の要素をグループ化する標準メソッドが追加されました。

```typescript
// 例: 投稿を著者IDでグループ化
const posts = [
  { id: '1', title: '記事1', authorId: 'user1' },
  { id: '2', title: '記事2', authorId: 'user2' },
  { id: '3', title: '記事3', authorId: 'user1' },
];

// Object.groupByを使用
const groupedByAuthor = Object.groupBy(posts, (post) => post.authorId);
// 結果: { 'user1': [...], 'user2': [...] }

// Map.groupByを使用（キーがオブジェクトの場合に便利）
const groupedMap = Map.groupBy(posts, (post) => post.authorId);
```

#### 2. Promise.withResolvers()

Promise の作成を簡潔に記述できます。

```typescript
// 従来の方法
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// ESNext
const { promise, resolve, reject } = Promise.withResolvers();

// 使用例: 非同期処理の制御
const { promise: dataPromise, resolve: resolveData } = Promise.withResolvers();
fetchData().then(resolveData);
```

#### 3. Set Methods

Set オブジェクトに新しいメソッドが追加されました。

```typescript
const setA = new Set([1, 2, 3]);
const setB = new Set([3, 4, 5]);

// 和集合
const union = setA.union(setB); // Set {1, 2, 3, 4, 5}

// 積集合
const intersection = setA.intersection(setB); // Set {3}

// 差集合
const difference = setA.difference(setB); // Set {1, 2}

// 対称差
const symmetricDiff = setA.symmetricDifference(setB); // Set {1, 2, 4, 5}

// 部分集合の判定
const isSubset = setA.isSubsetOf(setB); // false
const isSuperset = setA.isSupersetOf(setB); // false
const isDisjoint = setA.isDisjointFrom(setB); // false
```

#### 4. Duplicate Named Capture Groups in Regular Expressions

正規表現で同じ名前のキャプチャグループを複数使用できます。

```typescript
// 日付のパターンマッチング（複数のフォーマットに対応）
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})|(?<day>\d{2})\/(?<month>\d{2})\/(?<year>\d{4})/;

const match1 = '2024-12-25'.match(datePattern);
// match1.groups: { year: '2024', month: '12', day: '25' }

const match2 = '25/12/2024'.match(datePattern);
// match2.groups: { day: '25', month: '12', year: '2024' }
```

### プロジェクトでの活用例

#### バックエンド (Hono.js)

```typescript
// 投稿を著者別にグループ化するエンドポイント
app.get('/api/posts/by-author', (c) => {
  const posts = getAllPosts();
  const grouped = Object.groupBy(posts, (post) => post.authorId);
  return c.json({ groupedPosts: grouped });
});

// タグによる投稿のフィルタリング（Set methods使用）
app.get('/api/posts/by-tags', (c) => {
  const requiredTags = new Set(c.req.query('tags')?.split(',') || []);
  const posts = getAllPosts().filter(post => {
    const postTags = new Set(post.tags);
    return requiredTags.isSubsetOf(postTags);
  });
  return c.json({ posts });
});
```

#### フロントエンド (React)

```typescript
// ユーザーを権限別にグループ化
function UserManagement() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.GET('/api/users').then(res => res.data),
  });

  if (isLoading || !users) {
    return <div>読み込み中...</div>;
  }

  const usersByRole = Object.groupBy(users, (user) => user.role);
  
  return (
    <div>
      {Object.entries(usersByRole).map(([role, userGroup]) => (
        <UserGroup key={role} role={role} users={userGroup} />
      ))}
    </div>
  );
}

// Promise.withResolvers() を使った非同期処理の制御
function DataLoader() {
  const { promise, resolve } = Promise.withResolvers();
  
  useEffect(() => {
    client.GET('/api/some-data')
      .then(res => resolve(res.data))
      .catch(console.error);
  }, [resolve]);
  
  return <Suspense fallback={<Loading />}>
    <DataDisplay promise={promise} />
  </Suspense>;
}
```

### 開発時の注意点

#### ブラウザ互換性

ESNextの機能は最新のブラウザでサポートされていますが、古いブラウザをサポートする場合はpolyfillが必要になる場合があります。

#### TypeScript での型サポート

**TypeScript 5.9.3** を使用することを推奨します。`tsconfig.json` で以下の設定が必要です：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM"]
  }
}
```

> [!NOTE]
> [!IMPORTANT]
> TypeScriptでは`ESNext`をターゲットとすることで、最新のJavaScript機能を利用できます。TypeScript 5.9.3以降の使用を推奨します。

#### パフォーマンス

- `Object.groupBy` は大きな配列でも効率的に動作します
- Set methods は新しい Set を返すため、元の Set は変更されません
- `Promise.withResolvers()` はシンプルな Promise 作成に適していますが、複雑な非同期フローには async/await の方が読みやすい場合があります

## 📋 Gemini へのタスク依頼例

### 良い依頼例 ✅

- "ユーザー一覧取得 API を追加してください。OpenAPI 仕様から実装まで一貫して作成してください"
- "`/api/posts`エンドポイントにページネーション機能を追加してください"
- "フロントエンドのユーザー詳細ページで、`openapi-react-query` を使ってAPI から取得したデータを表示してください"

### 避けるべき依頼 ❌

- "フロントエンドだけ修正してください" (型定義の整合性が失われる可能性)
- "型定義ファイルを直接編集してください" (OpenAPI 仕様から再生成する必要がある)

## 🚀 コマンドリファレンス

### ルートディレクトリ

```bash
npm install              # 全依存関係のインストール
npm run dev              # フロントエンド・バックエンド同時起動
npm run build            # 全プロジェクトのビルド
npm run generate:types   # 型定義の生成
```

> [!WARNING]
> 現在、一部の `npm` バージョンで `workspaces` 機能が正しく動作しない問題が確認されています。`npm install` が失敗する場合は、各ワークスペースの `package.json` で、他のワークスペースへの依存関係を `"@node-sample/schema": "1.0.0"` のようにバージョン番号で直接指定することで問題を回避してください。

### バックエンド (`backend/`)

```bash
npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run start            # プロダクションサーバー起動
npm run test             # テスト実行
```

### フロントエンド (`frontend/`)

```bash
# 依存関係のインストール
npm install openapi-fetch openapi-react-query @tanstack/react-query

npm run dev              # 開発サーバー起動
npm run build            # プロダクションビルド
npm run preview          # ビルド結果のプレビュー
npm run test             # テスト実行
```

### スキーマ (`packages/schema/`)

```bash
npm run generate         # OpenAPIから型定義を生成
npm run validate         # OpenAPI仕様の検証
```

## 🧪 テスト戦略

### バックエンド

- ユニットテスト: 各ハンドラーの単体テスト
- 統合テスト: API エンドポイントの E2E テスト
- 型チェック: TypeScript コンパイラによる型検証

### フロントエンド

- コンポーネントテスト: React コンポーネントのテスト
- API モック: `openapi-react-query` と生成された型を使用したモックデータ

## 📦 パッケージ管理

このプロジェクトは npm workspaces を使用しています。

```json
{
  "workspaces": ["frontend", "backend", "packages/*"]
}
```

### 共通パッケージの参照

理想的には、`workspace:` プロトコルを使用して、ワークスペース内のパッケージを参照します。

```json
// frontend/package.json または backend/package.json
{
  "dependencies": {
    "@node-sample/schema": "workspace:^1.0.0"
  }
}
```

> [!NOTE]
> `npm` の `workspaces` 機能に問題がある場合は、一時的な回避策として、バージョン番号を直接指定してください (`"@node-sample/schema": "1.0.0"`)。

## 🔄 開発フロー

1. **機能設計** → OpenAPI 仕様に記述
2. **型生成** → `npm run generate:types`
3. **バックエンド実装** → 生成された型を使用
4. **フロントエンド実装** → `openapi-react-query` を使用して、同じ型定義でデータ取得
5. **テスト** → 型安全性を活用したテスト
6. **デプロイ** → ビルドとデプロイ

## 💡 ベストプラクティス

- **API First**: API 設計から始める
- **型安全性**: 生成された型と `openapi-react-query` を最大限活用
- **DRY**: 型定義の重複を避ける
- **一貫性**: OpenAPI 仕様を唯一の情報源とする
- **自動化**: 型生成を自動化してヒューマンエラーを防ぐ

## 📐 コーディング規約

このプロジェクトはサンプルプロジェクトのため、初学者にもわかりやすい実装を心がけています。

### 言語とコミュニケーション

- **コメントは日本語で記述**: すべてのコード内コメントは日本語で記述してください
- **会話も日本語で**: Gemini とのチャット会話も日本語で行ってください
- **変数名・関数名は英語**: 変数名、関数名、ファイル名などは英語で記述（国際標準に従う）

### 実装ガイドライン

#### シンプルさを優先

- **複雑な抽象化を避ける**: サンプルとして理解しやすいよう、過度な抽象化は避ける
- **直感的なコード**: 一目で何をしているか分かるコードを書く
- **段階的な実装**: 必要な機能から順に実装し、最初から完璧を目指さない

#### 丁寧なコメント

すべてのコードには、以下のようなコメントを付けてください：

```typescript
// ✅ 良い例: 丁寧なコメント

/**
 * ユーザー情報を取得する
 * @param id - ユーザーID
 * @returns ユーザー情報のPromise
 */
async function getUser(id: string): Promise<User> {
  // APIエンドポイントにリクエストを送信
  const response = await fetch(`/api/users/${id}`);

  // エラーハンドリング: レスポンスが正常でない場合は例外をスロー
  if (!response.ok) {
    throw new Error(`ユーザー取得に失敗しました: ${response.statusText}`);
  }

  // レスポンスをJSON形式でパースして返す
  return response.json();
}
```

```typescript
// ❌ 悪い例: コメントなし、または不十分

async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(response.statusText);
  return response.json();
}
```

#### コメントの書き方

1. **関数・クラスには JSDoc コメント**を付ける
   - 目的、パラメータ、戻り値を明記
2. **処理のブロックごとにコメント**を付ける
   - 何をしているか（What）だけでなく、なぜそうしているか（Why）も記述
3. **複雑なロジックには詳細な説明**を付ける

   - 初学者でも理解できるよう、丁寧に説明

4. **TODO や FIXME も日本語**で記述
   ```typescript
   // TODO: エラーハンドリングを改善する
   // FIXME: キャッシュ機能が正しく動作しない場合がある
   ```

### ファイル構成

- **1 ファイル 1 責務**: ファイルごとに明確な責務を持たせる
- **適切なファイル名**: 内容が分かるファイル名を付ける
- **ディレクトリ構造**: 機能ごとにディレクトリを分ける

### エラーハンドリング

- **明示的なエラーメッセージ**: 日本語でわかりやすいエラーメッセージを提供
- **適切なエラー処理**: try-catch を使用し、エラーを適切に処理
- **ユーザーフレンドリー**: エンドユーザーにもわかりやすいメッセージ

### 例: サンプルコードの品質基準

```typescript
// ✅ このプロジェクトで推奨されるコードスタイル

/**
 * 投稿一覧を取得するAPIハンドラー
 * ページネーションに対応しています
 */
export const getPosts = async (c: Context) => {
  // クエリパラメータからページ番号と1ページあたりの件数を取得
  const page = Number(c.req.query("page") || "1");
  const limit = Number(c.req.query("limit") || "10");

  try {
    // データベースから投稿を取得（ページネーション適用）
    const posts = await db.posts.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" }, // 新しい順にソート
    });

    // 総件数を取得（ページネーション情報のため）
    const total = await db.posts.count();

    // レスポンスを返す
    return c.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // エラーログを出力
    console.error("投稿一覧の取得に失敗しました:", error);

    // クライアントにエラーレスポンスを返す
    return c.json({ error: "投稿一覧の取得に失敗しました" }, 500);
  }
};
```
