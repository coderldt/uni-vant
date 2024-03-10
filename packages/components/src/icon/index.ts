import _Icon from './Icon.vue'

export const Icon = _Icon
export default Icon

declare module 'vue' {
  export interface GlobalComponents {
    VanIcon: typeof Icon
  }
}
