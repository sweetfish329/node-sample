import UserList from './components/UserList';
import PostList from './components/PostList';
import './App.css';

/**
 * メインアプリケーションコンポーネント
 */
function App() {
  return (
    <div className="app">
      <header>
        <h1>🚀 OpenAPI TypeScript サンプル</h1>
        <p>React + Hono.js + openapi-typescript で型安全な開発</p>
      </header>
      
      <main>
        <div className="container">
          {/* ユーザー一覧セクション */}
          <section>
            <UserList />
          </section>
          
          {/* 投稿一覧セクション */}
          <section>
            <PostList />
          </section>
        </div>
      </main>
      
      <footer>
        <p>
          このサンプルプロジェクトは、フロントエンドとバックエンドで
          OpenAPI仕様から生成された型定義を共有しています。
        </p>
      </footer>
    </div>
  );
}

export default App;
