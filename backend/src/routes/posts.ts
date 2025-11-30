import { Hono } from 'hono';
import type { paths } from '@node-sample/schema';

// 投稿API用のルーターを作成
export const postsRouter = new Hono();

// 投稿のレスポンス型を取得
type Post = paths['/api/posts']['get']['responses']['200']['content']['application/json']['data'][number];
type Pagination = paths['/api/posts']['get']['responses']['200']['content']['application/json']['pagination'];
type CreatePostRequest = paths['/api/posts']['post']['requestBody']['content']['application/json'];

// モックデータ: 実際にはデータベースから取得する
let posts: Post[] = [
  {
    id: '1',
    title: 'OpenAPI TypeScriptの使い方',
    content: 'OpenAPI仕様からTypeScript型を自動生成する方法を紹介します。',
    authorId: '1',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: '2',
    title: 'Hono.jsで型安全なAPIを作る',
    content: 'Hono.jsとOpenAPI TypeScriptを組み合わせて型安全なAPIを構築します。',
    authorId: '1',
    createdAt: '2024-01-11T11:00:00Z'
  },
  {
    id: '3',
    title: 'Reactでフロントエンド開発',
    content: 'ReactとTypeScriptを使った最新のフロントエンド開発手法。',
    authorId: '2',
    createdAt: '2024-01-12T12:00:00Z'
  },
  {
    id: '4',
    title: 'モノレポのメリット',
    content: 'フロントエンドとバックエンドをモノレポで管理する利点について。',
    authorId: '2',
    createdAt: '2024-01-13T13:00:00Z'
  },
  {
    id: '5',
    title: 'TypeScriptベストプラクティス',
    content: 'TypeScriptを効果的に使うためのベストプラクティス集。',
    authorId: '3',
    createdAt: '2024-01-14T14:00:00Z'
  }
];

/**
 * GET /api/posts
 * 投稿一覧を取得する（ページネーション対応）
 */
postsRouter.get('/', (c) => {
  // クエリパラメータからページ番号と1ページあたりの件数を取得
  const page = Number(c.req.query('page') || '1');
  const limit = Number(c.req.query('limit') || '10');
  
  // ページネーションの計算
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // 該当ページの投稿を取得
  const paginatedPosts = posts.slice(startIndex, endIndex);
  
  // ページネーション情報を作成
  const pagination: Pagination = {
    page,
    limit,
    total: posts.length,
    totalPages: Math.ceil(posts.length / limit)
  };
  
  // レスポンスを返す
  return c.json({
    data: paginatedPosts,
    pagination
  });
});

/**
 * GET /api/posts/:id
 * 指定されたIDの投稿を取得する
 */
postsRouter.get('/:id', (c) => {
  // パスパラメータから投稿IDを取得
  const id = c.req.param('id');
  
  // 投稿を検索
  const post = posts.find(p => p.id === id);
  
  // 投稿が見つからない場合は404エラーを返す
  if (!post) {
    return c.json({ error: '投稿が見つかりません' }, 404);
  }
  
  // 投稿情報を返す
  return c.json(post);
});

/**
 * POST /api/posts
 * 新しい投稿を作成する
 */
postsRouter.post('/', async (c) => {
  // リクエストボディを取得
  const body = await c.req.json<CreatePostRequest>();
  
  // 新しい投稿を作成
  const newPost: Post = {
    id: String(posts.length + 1), // 簡易的なID生成
    title: body.title,
    content: body.content,
    authorId: body.authorId,
    createdAt: new Date().toISOString()
  };
  
  // 投稿リストの先頭に追加（新しい投稿が上に来るように）
  posts.unshift(newPost);
  
  // 作成した投稿を返す（ステータスコード201）
  return c.json(newPost, 201);
});
