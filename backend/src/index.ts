import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { usersRouter } from './routes/users.js';
import { postsRouter } from './routes/posts.js';

// Honoアプリケーションのインスタンスを作成
const app = new Hono();

// CORS設定を適用（フロントエンドからのリクエストを許可）
app.use('/*', cors({
  origin: 'http://localhost:5173', // Viteのデフォルトポート
  credentials: true,
}));

// ルートエンドポイント - API稼働確認用
app.get('/', (c) => {
  return c.json({ 
    message: 'Sample API Server is running',
    version: '1.0.0' 
  });
});

// APIルートを登録
app.route('/api/users', usersRouter);
app.route('/api/posts', postsRouter);

// サーバー起動
const port = 3000;
console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
