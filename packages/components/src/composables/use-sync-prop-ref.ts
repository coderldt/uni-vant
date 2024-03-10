import type { Ref } from 'vue'
import { ref, watch } from 'vue'

export function useSyncPropRef<T>(getProp: () => T,
  setProp: (value: T) => void) {
  const propRef = ref<T>(getProp()) as Ref<T>

  watch(getProp, (value) => {
    if (value !== propRef.value)
      propRef.value = value
  })

  watch(propRef, (value) => {
    if (value !== getProp())
      setProp(value)
  })

  return propRef
}
