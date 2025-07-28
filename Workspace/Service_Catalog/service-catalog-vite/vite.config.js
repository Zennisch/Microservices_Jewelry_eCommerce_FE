import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), '');
	const FRONTEND_HOST = env.VITE_FRONTEND_HOST || process.env.VITE_FRONTEND_HOST || 'localhost';

	console.log('Cart-Order - FRONTEND_HOST:', FRONTEND_HOST);

	return {
		plugins: [
			react(),
			tailwindcss(),
			federation({
				name: 'service-catalog',
				filename: 'remoteEntry.js',
				exposes: {
					'./App': './src/App.jsx',
					'./CategoryPage': './src/pages/CategoryPage.jsx',
					'./ProductPage': './src/pages/ProductPage.jsx',
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
			port: 3005,
			host: '0.0.0.0',
			cors: true,
		},
		preview: {
			port: 3005,
			host: '0.0.0.0',
			cors: true,
		},
	};
});
