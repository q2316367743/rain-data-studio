import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vetur from '@volar-plugins/vetur'

function _resolve(dir: string) {
    return path.resolve(__dirname, dir);
}

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': _resolve('src'),
            'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
        }
    },
    // @ts-ignore
    plugins: [vue(), vetur()],
    base: process.env.ELECTRON == "true" ? './' : ""
})