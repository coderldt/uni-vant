import { createSSRApp } from 'vue'
import { Lazyload } from 'uni-vant'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  app.use(Lazyload)
  return {
    app,
  }
}
