import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const FRONTEND_HOST = env.VITE_FRONTEND_HOST || process.env.VITE_FRONTEND_HOST || 'localhost';

    return {
        plugins: [
            react(),
            tailwindcss(),
            federation({
                name: 'service-manager', // Đổi tên
                filename: 'remoteEntry.js',
                exposes: {
                    './App': './src/App.jsx',
                },
                remotes: {
                    container: `http://${FRONTEND_HOST}:3000/assets/remoteEntry.js`,
                },
                shared: ['react', 'react-dom', 'react-router-dom'],
            }),
        ],
        build: {
            modulePreload: false,
            target: 'esnext',
            minify: false,
            cssCodeSplit: false,
        },
        server: {
            port: 3003,
            host: '0.0.0.0',
            cors: true,
        },
        preview: {
            port: 3003,
            host: '0.0.0.0',
            cors: true,
        }
    };
});