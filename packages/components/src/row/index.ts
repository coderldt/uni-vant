import type { ComputedRef, InjectionKey } from 'vue'
import { createNamespace } from '../utils'
import _Row from './Row.vue'

export const Row = _Row
export default Row
export type RowSpaces = { left?: number; right: number }[]
export type VerticalSpaces = { bottom?: number }[]

export interface RowProvide {
  spaces: ComputedRef<RowSpaces>
  verticalSpaces: ComputedRef<VerticalSpaces>
}
const [name] = createNamespace('row')

export const ROW_KEY: InjectionKey<RowProvide> = Symbol(name)

export type RowAlign = 'top' | 'center' | 'bottom'

export type RowJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
declare module 'vue' {
  export interface GlobalComponents {
    VanRow: typeof Row
  }
}
