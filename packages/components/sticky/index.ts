import _Sticky from './Sticky.vue'

export const Sticky = _Sticky
export default Sticky
export { stickyProps } from './Sticky.vue'
export type { StickyProps, StickyPosition } from './Sticky.vue'
export type { StickyThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanSticky: typeof Sticky
  }
}
