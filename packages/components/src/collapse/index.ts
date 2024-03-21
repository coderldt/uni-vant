import type { InjectionKey } from 'vue'
import _Collapse from './Collapse.vue'
import { createNamespace } from '../utils'

export const Collapse = _Collapse
export default Collapse

export { collapseProps } from './types'
import type {
  CollapseProps,
  CollapseInstance,
  CollapseToggleAllOptions,
  CollapseProvide
} from './types'

const [name] = createNamespace('collapse')
export const COLLAPSE_KEY: InjectionKey<CollapseProvide> = Symbol(name)

export {
  CollapseProps,
  CollapseInstance,
  CollapseToggleAllOptions
}

declare module 'vue' {
  export interface GlobalComponents {
    VanCollapse: typeof Collapse
  }
}
