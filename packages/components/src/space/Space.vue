<script lang="ts" setup>
import './index.less'
import { Comment, Fragment, Text, computed, useSlots } from 'vue'
import type { CSSProperties, PropType, VNode } from 'vue'

import { createNamespace } from '../utils'
import type { SpaceAlign, SpaceSize } from './types'

const props = defineProps({
  align: String as PropType<SpaceAlign>,
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal',
  },
  size: {
    type: [Number, String, Array] as PropType<number | string | [SpaceSize, SpaceSize]>,
    default: 8,
  },
  wrap: Boolean,
  fill: Boolean,
})

const [name, bem] = createNamespace('space')

const slots = useSlots()

const mergedAlign = computed(() => props.align ?? (props.direction === 'horizontal' ? 'center' : ''))

function filterEmpty(children: VNode[] = []) {
  const nodes: VNode[] = []
  children.forEach((child) => {
    if (Array.isArray(child))
      nodes.push(...child)
    else if (child.type === Fragment)
      nodes.push(...filterEmpty(child.children as VNode[]))
    else
      nodes.push(child)
  })
  return nodes.filter(
    c => !(c
      && (c.type === Comment
        || (c.type === Fragment && c.children?.length === 0)
        || (c.type === Text && (c.children as string).trim() === ''))
    ),
  )
}

function getMargin(size: SpaceSize) {
  if (typeof size === 'number')
    return `${size}px`

  return size
}
function getMarginStyle(isLast: boolean): CSSProperties {
  const style: CSSProperties = {}

  const marginRight = `${getMargin(Array.isArray(props.size) ? props.size[0] : props.size)}`
  const marginBottom = `${getMargin(Array.isArray(props.size) ? props.size[1] : props.size)}`

  if (isLast)
    return props.wrap ? { marginBottom } : {}

  if (props.direction === 'horizontal')
    style.marginRight = marginRight

  if (props.direction === 'vertical' || props.wrap)
    style.marginBottom = marginBottom

  return style
}

const getDefaultSlot = computed(() => slots.default?.() || [])
</script>

<template>
  <view
    :class="bem({
      [direction]: direction,
      [`align-${mergedAlign}`]: mergedAlign,
      wrap,
      fill,
    })"
  >
    <div
      v-for="(item, index) in filterEmpty(getDefaultSlot)"
      :key="`item-${index}`"
      :class="`${name}-item`"
      :style="getMarginStyle(index === getDefaultSlot.length - 1)"
    >
      {{ item }}
    </div>
  </view>
</template>
