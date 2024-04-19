import _SwipeItem from './SwipeItem.vue'

export const SwipeItem = _SwipeItem
export default SwipeItem

declare module 'vue' {
  export interface GlobalComponents {
    VanSwipeItem: typeof SwipeItem
  }
}
