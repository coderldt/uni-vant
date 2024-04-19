import _SwipeCell from './SwipeCell.vue'

export const SwipeCell = _SwipeCell
export default SwipeCell
export type {
  SwipeCellSide,
  SwipeCellPosition,
  SwipeCellInstance,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanSwipeCell: typeof SwipeCell
  }
}
