import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const FRONTEND_HOST = env.VITE_FRONTEND_HOST || process.env.VITE_FRONTEND_HOST || 'localhost';

    console.log('Container - FRONTEND_HOST:', FRONTEND_HOST);

    return {
        plugins: [
            react(),
            tailwindcss(),
            federation({
                name: 'container',
                filename: 'remoteEntry.js',
                exposes: {
                    './AuthContext': './src/contexts/AuthContext.tsx',
                    './CartOrderContext': './src/contexts/CartOrderContext.tsx',
                    './catalogService': './src/services/catalogService.ts',
                    './cartOrderService': './src/services/cartOrderService.ts',
                    './managerService': './src/services/managerService.ts',
                    './apiConfig': './src/services/apiConfig.js',
                },
                remotes: {
                    account: `http://${FRONTEND_HOST}:3001/assets/remoteEntry.js`,
                    manager: `http://${FRONTEND_HOST}:3003/assets/remoteEntry.js`,
                    catalog: `http://${FRONTEND_HOST}:3005/assets/remoteEntry.js`,
                    cart_order: `http://${FRONTEND_HOST}:3006/assets/remoteEntry.js`,
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
            port: 3000,
            host: '0.0.0.0',
            cors: true,
        },
        preview: {
            port: 3000,
            host: '0.0.0.0',
            cors: true,
        },
    };
});