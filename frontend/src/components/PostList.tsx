import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { client } from '../api/client';

/**
 * 投稿一覧を表示するコンポーネント（ページネーション付き）
 */
export default function PostList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () =>
      client.GET('/api/posts', {
        params: {
          query: {
            page: currentPage,
            limit: 3,
          },
        },
      }),
  });

  const posts = data?.data?.data;
  const pagination = data?.data?.pagination;

  // 前のページへ
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 次のページへ
  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // ローディング表示
  if (isLoading) {
    return <div className="loading">投稿を読み込み中...</div>;
  }

  // エラー表示
  if (error || data?.error) {
    const errorMessage = error?.message || (data?.error as any)?.message || '不明なエラーが発生しました';
    return <div className="error">エラー: {errorMessage}</div>;
  }

  // 投稿一覧とページネーションを表示
  return (
    <div className="post-list">
      <h2>📝 投稿一覧</h2>
      <div className="list">
        {posts?.map((post) => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <p className="date">
              投稿日: {new Date(post.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        ))}
      </div>
      
      {/* ページネーション */}
      {pagination && (
        <div className="pagination">
          <button 
            onClick={handlePrevPage} 
            disabled={currentPage === 1}
          >
            ← 前へ
          </button>
          <span>
            {currentPage} / {pagination.totalPages} ページ
            （全 {pagination.total} 件）
          </span>
          <button 
            onClick={handleNextPage} 
            disabled={currentPage === pagination.totalPages}
          >
            次へ →
          </button>
        </div>
      )}
    </div>
  );
}
