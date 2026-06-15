import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Voir la documentation : https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gaId = env.VITE_GA_MEASUREMENT_ID

  return {
    plugins: [
      react(),
      {
        name: 'inject-ga4',
        transformIndexHtml(html) {
          if (!gaId) return html

          const snippet = `    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    </script>`

          return html.replace('</head>', `${snippet}\n  </head>`)
        },
      },
    ],
  }
})
