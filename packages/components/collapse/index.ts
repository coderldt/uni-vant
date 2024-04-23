import type { InjectionKey } from 'vue'
import { createNamespace } from '../utils'
import _Collapse from './Collapse.vue'
import type {
  CollapseInstance,
  CollapseProps,
  CollapseProvide,
  CollapseToggleAllOptions,
} from './types'

export const Collapse = _Collapse
export default Collapse

export { collapseProps } from './types'

const [name] = createNamespace('collapse')
export const COLLAPSE_KEY: InjectionKey<CollapseProvide> = Symbol(name)

export {
  CollapseProps,
  CollapseInstance,
  CollapseToggleAllOptions,
}

declare module 'vue' {
  export interface GlobalComponents {
    VanCollapse: typeof Collapse
  }
}
