import type { ComponentPublicInstance, ComputedRef } from 'vue'
import type { SwipeProps } from './Swipe'

export interface SwipeState {
  rect: { width: number; height: number } | null
  width: number
  height: number
  offset: number
  active: number
  swiping: boolean
}

export interface SwipeToOptions {
  immediate?: boolean
}

export interface SwipeExpose {
  prev: () => void
  next: () => void
  resize: () => void
  swipeTo: (index: number, options?: SwipeToOptions) => void
  /** @private */
  state: SwipeState
}

export interface SwipeProvide {
  props: SwipeProps
  size: ComputedRef<number>
  count: ComputedRef<number>
  activeIndicator: ComputedRef<number>
}

export type SwipeInstance = ComponentPublicInstance<SwipeProps, SwipeExpose>

export interface SwipeThemeVars {
  swipeIndicatorSize?: string
  swipeIndicatorMargin?: string
  swipeIndicatorActiveOpacity?: number | string
  swipeIndicatorInactiveOpacity?: number | string
  swipeIndicatorActiveBackground?: string
  swipeIndicatorInactiveBackground?: string
}
