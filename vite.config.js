import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function htmlIncludePlugin() {
    return {
        name: 'html-include',
        enforce: 'pre',
        transformIndexHtml(html, ctx) {
            const includeRegex = /<include\s+src=["'](.*?)["']\s*><\/include>/gi;
            return html.replace(includeRegex, (match, src) => {
                const filePath = path.resolve(process.cwd(), src);
                if (fs.existsSync(filePath)) {
                    return fs.readFileSync(filePath, 'utf-8');
                }
                console.warn(`Include file not found: ${filePath}`);
                return match; 
            });
        }
    }
}

export default defineConfig({
    plugins: [htmlIncludePlugin()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.html',
                shop: 'pages/shop.html',
                product: 'pages/product.html',
                cart: 'pages/cart.html',
                checkout: 'pages/checkout.html',
                profile: 'pages/profile.html',
                login: 'pages/login.html',
                register: 'pages/register.html',
                about: 'pages/about.html',
                faq: 'pages/faq.html',
                privacy: 'pages/privacy.html',
                shipping: 'pages/shipping.html',
                success: 'pages/success.html'
            }
        }
    }
});
