import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/css/app.css', 'resources/js/app.js'],
//             refresh: true,
//         }),
//         tailwindcss(),
//     ],
// });


export default defineConfig(({ mode }) => {
    // Load .env variables
    const env = loadEnv(mode, process.cwd(), '');

    // Parse the VITE_APP_URL
    const appUrl = new URL(env.VITE_APP_URL);

    return {
        plugins: [
            laravel({
                input: 'resources/js/src/main.jsx',
                refresh: true,
            }),
            react(),
        ],
        server: {
            host: '0.0.0.0', // <-- Correct for Docker
            hmr: {
                host: 'localhost', // <-- Correct for the browser
            },
        },
    };
});