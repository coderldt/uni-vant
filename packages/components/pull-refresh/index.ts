import _PullRefresh from './PullRefresh.vue'

export const PullRefresh = _PullRefresh
export default PullRefresh

export { pullRefreshProps } from './types'
export type { PullRefreshThemeVars, PullRefreshProps } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanPullRefresh: typeof PullRefresh
  }
}
