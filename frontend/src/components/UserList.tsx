import { useQuery } from '@tanstack/react-query';
import { client } from '../api/client';

/**
 * ユーザー一覧を表示するコンポーネント
 */
export default function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => client.GET('/api/users'),
  });

  // ローディング表示
  if (isLoading) {
    return <div className="loading">ユーザー情報を読み込み中...</div>;
  }

  // エラー表示
  if (error || data?.error) {
    const errorMessage = error?.message || (data?.error as any)?.message || '不明なエラーが発生しました';
    return <div className="error">エラー: {errorMessage}</div>;
  }

  // ユーザー一覧を表示
  return (
    <div className="user-list">
      <h2>👥 ユーザー一覧</h2>
      <div className="list">
        {data?.data?.users?.map((user) => (
          <div key={user.id} className="card">
            <h3>{user.name}</h3>
            <p>📧 {user.email}</p>
            <p className="date">
              登録日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
