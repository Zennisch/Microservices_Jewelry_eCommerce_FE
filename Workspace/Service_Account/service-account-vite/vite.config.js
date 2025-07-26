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
            name: 'service-account',
            filename: 'remoteEntry.js',
            exposes: {
                './App': './src/App.jsx',
            },
            remotes: {
                container: 'http://localhost:3000/assets/remoteEntry.js',
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
        port: 3001,
        host: '0.0.0.0',
        cors: true,
    },
    preview: {
        port: 3001,
        host: '0.0.0.0',
        cors: true,
    }
});
