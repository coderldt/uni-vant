import _Swipe from './Swipe.vue'

export const Swipe = _Swipe
export default Swipe
export type { SwipeInstance, SwipeToOptions, SwipeThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanSwipe: typeof Swipe
  }
}
