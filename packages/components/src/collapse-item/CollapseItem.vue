<script setup lang="ts">
import './index.less'
import { doubleRaf, raf, useParent } from '@vant/use'
import {
  computed,
  nextTick,
  ref,
  useSlots,
  watch,
} from 'vue'

import { Cell, cellSharedProps } from '../cell'
import {
  createNamespace,
  pick,
} from '../utils'
import { COLLAPSE_KEY } from '../collapse'

import { useLazyRender } from '../composables/use-lazy-render'

import { CELL_SLOTS, collapseItemProps } from './types'

const props = defineProps(collapseItemProps)

const slots = useSlots()

const cellSlots = pick(slots, CELL_SLOTS)

const [_, bem] = createNamespace('collapse-item')

const wrapperRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const { parent, index } = useParent(COLLAPSE_KEY)

// if (!parent) {
//   if (process.env.NODE_ENV !== 'production') {
//     console.error(
//       '[Vant] <CollapseItem> must be a child component of <Collapse>.',
//     );
//   }
//   return;
// }

const name = computed(() => props.name ?? index.value)
const expanded = computed(() => parent?.isExpanded(name.value))

const show = ref(expanded.value)
const lazyRender = useLazyRender(() => show.value || !props.lazyRender)

function onTransitionEnd() {
  if (!expanded.value)
    show.value = false
  else if (wrapperRef.value)
    wrapperRef.value.style.height = ''
}

watch(expanded, (value, oldValue) => {
  if (oldValue === null)
    return

  if (value)
    show.value = true

  const tick = value ? nextTick : raf

  tick(() => {
    if (!contentRef.value || !wrapperRef.value)
      return

    const { offsetHeight } = contentRef.value
    if (offsetHeight) {
      const contentHeight = `${offsetHeight}px`
      wrapperRef.value.style.height = value ? '0' : contentHeight

      doubleRaf(() => {
        if (wrapperRef.value)
          wrapperRef.value.style.height = value ? contentHeight : '0'
      })
    }
    else {
      onTransitionEnd()
    }
  })
})

function toggle(newValue = !expanded.value) {
  parent.toggle(name.value, newValue)
}

function onClickTitle() {
  if (!props.disabled && !props.readonly)
    toggle()
}

const getCellTitleAttr = computed(() => {
  const attrs = pick(
    props,
    Object.keys(cellSharedProps) as Array<keyof typeof cellSharedProps>,
  )

  if (props.readonly)
    attrs.isLink = false

  if (props.disabled || props.readonly)
    attrs.clickable = false

  return attrs
})
</script>

<template>
  <view :class="[bem({ border: index && border })]">
    <Cell
      v-slot="cellSlots"
      role="button"
      :class="[bem('title', { disabled, expanded, borderless: !border })]"
      :aria-expanded="String(expanded)"
      :tag="getCellTitleAttr.tag"
      :icon="getCellTitleAttr.icon"
      :size="getCellTitleAttr.size"
      :title="getCellTitleAttr.title"
      :value="getCellTitleAttr.value"
      :label="getCellTitleAttr.label"
      :center="getCellTitleAttr.center"
      :is-link="getCellTitleAttr.isLink"
      :border="getCellTitleAttr.border"
      :icon-prefix="getCellTitleAttr.iconPrefix"
      :value-class="getCellTitleAttr.valueClass"
      :label-class="getCellTitleAttr.labelClass"
      :title-class="getCellTitleAttr.titleClass"
      :title-style="getCellTitleAttr.titleStyle"
      :arrow-direction="getCellTitleAttr.arrowDirection"
      :required="getCellTitleAttr.required"
      :clickable="getCellTitleAttr.clickable"
      @click="onClickTitle"
    />
    <template v-if="show || !lazyRender">
      <view
        v-show="{ show }"
        ref="wrapperRef"
        :class="bem('wrapper')"
        @transitionend="onTransitionEnd"
      >
        <view ref="contentRef" :class="bem('content')">
          <slot />
        </view>
      </view>
    </template>
  </view>
</template>
