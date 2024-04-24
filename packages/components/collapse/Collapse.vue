<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue'
import { useChildren } from '../vant-use'
import { BORDER_TOP_BOTTOM, type Numeric, createNamespace } from '../utils'
import { validateModelValue } from './utis'
import { collapseProps } from './types'
import type { CollapseToggleAllOptions } from './types'
import { COLLAPSE_KEY } from '.'

const props = defineProps(collapseProps)

const emit = defineEmits<{
  (event: 'change', name: Numeric | Numeric[]): void
  (event: 'update:modelValue', name: Numeric | Numeric[]): void
}>()

const [name, bem] = createNamespace('collapse')

const instance = getCurrentInstance()

const { linkChildren, children } = useChildren(COLLAPSE_KEY)

const getClass = computed(() => [bem(), { [BORDER_TOP_BOTTOM]: props.border }])

function updateName(name: Numeric | Numeric[]) {
  emit('change', name)
  emit('update:modelValue', name)
}

function toggle(name: Numeric, expanded: boolean) {
  const { accordion, modelValue } = props
  if (accordion) {
    updateName(name === modelValue ? '' : name)
  }
  else if (expanded) {
    updateName((modelValue as Numeric[]).concat(name))
  }
  else {
    updateName(
      (modelValue as Numeric[]).filter(activeName => activeName !== name),
    )
  }
}

function toggleAll(options: boolean | CollapseToggleAllOptions = {}) {
  if (props.accordion)
    return

  if (typeof options === 'boolean')
    options = { expanded: options }

  const { expanded, skipDisabled } = options!
  const expandedChildren = children.filter((item: any) => {
    if (item.disabled && skipDisabled)
      return item.expanded.value

    return expanded ?? !item.expanded.value
  })

  const names = expandedChildren.map(item => item.itemName.value)
  updateName(names)
}

function isExpanded(name: Numeric) {
  const { accordion, modelValue } = props

  // eslint-disable-next-line n/prefer-global/process
  if (process.env.NODE_ENV !== 'production' && !validateModelValue(modelValue, accordion))
    return false

  return accordion
    ? modelValue === name
    : (modelValue as Numeric[]).includes(name)
}
linkChildren({ toggle, isExpanded })

defineExpose({
  toggleAll,
})
</script>

<template>
  <view :class="getClass">
    <slot />
  </view>
</template>
