<script lang="ts" setup>
import './index.less'
import {
  type PropType,
  computed,
} from 'vue'
import { useChildren } from '@vant/use'
import { createNamespace, makeStringProp, truthProp } from '../utils'
import type { RowAlign, RowJustify, RowSpaces, VerticalSpaces } from '.'
import { ROW_KEY } from '.'

const props = defineProps({
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  wrap: truthProp,
  align: String as PropType<RowAlign>,
  gutter: {
    type: [String, Number, Array] as PropType<
      string | number | (string | number)[]
    >,
    default: 0,
  },
  justify: String as PropType<RowJustify>,
})
const [name, bem] = createNamespace('row')
const { children, linkChildren } = useChildren(ROW_KEY)

const groups = computed(() => {
  const groups: number[][] = [[]]

  let totalSpan = 0
  children.forEach((child, index) => {
    totalSpan += Number(child.span)

    if (totalSpan > 24) {
      groups.push([index])
      totalSpan -= 24
    }
    else {
      groups[groups.length - 1].push(index)
    }
  })

  return groups
})

const spaces = computed(() => {
  let gutter = 0
  if (Array.isArray(props.gutter))
    gutter = Number(props.gutter[0]) || 0
  else
    gutter = Number(props.gutter)

  const spaces: RowSpaces = []

  if (!gutter)
    return spaces

  groups.value.forEach((group) => {
    const averagePadding = (gutter * (group.length - 1)) / group.length

    group.forEach((item, index) => {
      if (index === 0) {
        spaces.push({ right: averagePadding })
      }
      else {
        const left = gutter - spaces[item - 1].right
        const right = averagePadding - left
        spaces.push({ left, right })
      }
    })
  })

  return spaces
})

const verticalSpaces = computed(() => {
  const { gutter } = props
  const spaces: VerticalSpaces = []
  if (Array.isArray(gutter) && gutter.length > 1) {
    const bottom = Number(gutter[1]) || 0
    if (bottom <= 0)
      return spaces

    groups.value.forEach((group, index) => {
      if (index === groups.value.length - 1)
        return
      group.forEach(() => {
        spaces.push({ bottom })
      })
    })
  }
  return spaces
})

linkChildren({ spaces, verticalSpaces })
</script>

<template>
  <view
    :class="bem({
      [`align-${align}`]: align,
      [`justify-${justify}`]: justify,
      nowrap: !wrap,
    })"
  >
    <slot />
  </view>
</template>
