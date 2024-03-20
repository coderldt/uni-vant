import type { InjectionKey } from 'vue'
import type { CollapseProvide } from './types'
import { createNamespace } from '../utils'

const [name] = createNamespace('collapse')
export const COLLAPSE_KEY: InjectionKey<CollapseProvide> = Symbol(name)

// conponents
import _Collapse from './Collapse.vue'

export const Collapse = _Collapse
export default Collapse
export { collapseProps } from './types'
export type {
  CollapseProps,
  CollapseInstance,
  CollapseToggleAllOptions,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanCollapse: typeof Collapse
  }
}
