import type { InjectionKey } from 'vue'
import { createNamespace } from '../utils'
import type { TabsProps } from './Tabs.vue'
import _Tabs from './Tabs.vue'
import type { TabsProvide } from './types'

export const Tabs = _Tabs
export default Tabs
export { tabsProps } from './Tabs.vue'
export type { TabsProps }
export type { TabsType, TabsInstance, TabsThemeVars } from './types'

const [name] = createNamespace('tabs')
export const TABS_KEY: InjectionKey<TabsProvide> = Symbol(name)

declare module 'vue' {
  export interface GlobalComponents {
    VanTabs: typeof Tabs
  }
}
