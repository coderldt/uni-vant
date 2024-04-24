import _List from './List.vue'

export const List = _List
export default List

export { listProps } from './types'
export type { ListInstance, ListThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanList: typeof List
  }
}
