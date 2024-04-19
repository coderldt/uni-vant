import type { InjectionKey } from 'vue'
import { createNamespace } from '../utils'
import _Swipe from './Swipe.vue'
import type { SwipeProvide } from './types'

export const Swipe = _Swipe
export default Swipe
export type { SwipeInstance, SwipeToOptions, SwipeThemeVars } from './types'
const [name] = createNamespace('swipe')
export const SWIPE_KEY: InjectionKey<SwipeProvide> = Symbol(name)

declare module 'vue' {
  export interface GlobalComponents {
    VanSwipe: typeof Swipe
  }
}
