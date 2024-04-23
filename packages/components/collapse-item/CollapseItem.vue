<script setup lang="ts">
import './index.less'
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'
import { useParent, useUniRect } from '../vant-use'

import Cell from '../cell/Cell.vue'
import { cellSharedProps } from '../cell'
import {
  createNamespace,
  pick,
} from '../utils'
import { COLLAPSE_KEY } from '../collapse'

import { collapseItemProps } from './types'

const props = defineProps(collapseItemProps)

const [_, bem] = createNamespace('collapse-item')

const instance = getCurrentInstance()

const wrapperRef = ref<HTMLElement>()
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

const wrapperClassName = bem('wrapper')
const contentClassName = bem('content')
const wrapperHeight = ref(0)

onMounted(() => {
  // TODO res type
  useUniRect(`.${contentClassName}`, instance).then((res: any) => {
    wrapperHeight.value = res.height
  })
})

function toggle(newValue = !expanded.value) {
  parent && parent.toggle(name.value, newValue)
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
  <view
    ref="wrapperRef"
    :class="[bem({ border: index && border })]"
    @click="onClickTitle"
  >
    <Cell
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
    <view
      :class="wrapperClassName"
      :style="{ height: `${expanded ? wrapperHeight : 0}px` }"
    >
      <view :class="contentClassName">
        <slot />
      </view>
    </view>
  </view>
</template>
