import _Badge from './Badge.vue'

export const Badge = _Badge
export default Badge
export type { BadgeThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanBadge: typeof Badge
  }
}
