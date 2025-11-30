import { Hono } from 'hono';
import type { paths } from '@node-sample/schema';

// ユーザーAPI用のルーターを作成
export const usersRouter = new Hono();

// ユーザーのレスポンス型を取得
type User = paths['/api/users']['get']['responses']['200']['content']['application/json']['users'][number];
type CreateUserRequest = paths['/api/users']['post']['requestBody']['content']['application/json'];

// モックデータ: 実際にはデータベースから取得する
let users: User[] = [
  {
    id: '1',
    name: '山田太郎',
    email: 'yamada@example.com',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '佐藤花子',
    email: 'sato@example.com',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: '鈴木一郎',
    email: 'suzuki@example.com',
    createdAt: '2024-01-03T00:00:00Z'
  }
];

/**
 * GET /api/users
 * ユーザー一覧を取得する
 */
usersRouter.get('/', (c) => {
  // 全ユーザーを返す
  return c.json({ users });
});

/**
 * GET /api/users/:id
 * 指定されたIDのユーザーを取得する
 */
usersRouter.get('/:id', (c) => {
  // パスパラメータからユーザーIDを取得
  const id = c.req.param('id');
  
  // ユーザーを検索
  const user = users.find(u => u.id === id);
  
  // ユーザーが見つからない場合は404エラーを返す
  if (!user) {
    return c.json({ error: 'ユーザーが見つかりません' }, 404);
  }
  
  // ユーザー情報を返す
  return c.json(user);
});

/**
 * POST /api/users
 * 新しいユーザーを作成する
 */
usersRouter.post('/', async (c) => {
  // リクエストボディを取得
  const body = await c.req.json<CreateUserRequest>();
  
  // 新しいユーザーを作成
  const newUser: User = {
    id: String(users.length + 1), // 簡易的なID生成
    name: body.name,
    email: body.email,
    createdAt: new Date().toISOString()
  };
  
  // ユーザーリストに追加
  users.push(newUser);
  
  // 作成したユーザーを返す（ステータスコード201）
  return c.json(newUser, 201);
});
