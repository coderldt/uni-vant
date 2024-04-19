import type { InjectionKey } from 'vue'
import type { Numeric } from '../utils'
import type { CollapseProvide } from './types'

export function validateModelValue(modelValue: Numeric | Numeric[],
  accordion: boolean) {
  if (accordion && Array.isArray(modelValue)) {
    console.error(
      '[Vant] Collapse: "v-model" should not be Array in accordion mode',
    )
    return false
  }
  if (!accordion && !Array.isArray(modelValue)) {
    console.error(
      '[Vant] Collapse: "v-model" should be Array in non-accordion mode',
    )
    return false
  }
  return true
}

export function createCollapseKey(name: string) {
  const COLLAPSE_KEY: InjectionKey<CollapseProvide> = Symbol(name)
  return { COLLAPSE_KEY }
}