// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    app: {
        head: {
            title: 'Nuxt Shop'
        }
    },
    runtimeConfig: {
        public: {
            backendUrl: process.env.BACKEND_URL
        }
    },
    css: ['~/assets/css/tailwind.css', 'primeicons/primeicons.css', '~/assets/scss/layout.scss'],
    modules: ['@nuxtjs/tailwindcss', '@primevue/nuxt-module', '@pinia/nuxt'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
        },
    }
})