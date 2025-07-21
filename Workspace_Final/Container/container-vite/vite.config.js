import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
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
                account: 'http://localhost:3001/assets/remoteEntry.js',
                manager: 'http://localhost:3003/assets/remoteEntry.js',
                catalog: 'http://localhost:3005/assets/remoteEntry.js',
                cart_order: 'http://localhost:3006/assets/remoteEntry.js',
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
});
