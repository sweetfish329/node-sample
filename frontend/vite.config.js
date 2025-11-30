import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Vite設定
export default defineConfig({
    plugins: [react()],
    server: {
        // 開発サーバーの設定
        port: 5173,
        // バックエンドAPIへのプロキシ設定
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            }
        }
    }
});
