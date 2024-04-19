import _Overlay from './Overlay.vue'

export const Overlay = _Overlay
export default Overlay
export type { OverlayThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanOverlay: typeof Overlay
  }
}
