import _Empty from './Empty.vue'

export const Empty = _Empty
export default Empty

export { emptyProps } from './types'
export type { EmptyThemeVars, EmptyProps } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanEmpty: typeof Empty
  }
}
