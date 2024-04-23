import _Cell from './Cell.vue'

export const Cell = _Cell
export default Cell
export { cellProps, cellSharedProps } from './types'
export type {
  CellSize,
  CellProps,
  CellArrowDirection,
  CellThemeVars,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanCell: typeof Cell
  }
}
