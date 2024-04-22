<script lang='ts' setup>
import './index.less'
import {
  computed,
  useSlots,
} from 'vue'

import {
  createNamespace,
} from '../utils'

import { useRoute } from '../composables/use-route'

import Icon from '../icon/Icon.vue'
import { cellProps } from './types'

const props = defineProps(cellProps)

const [name, bem] = createNamespace('cell')

const route = useRoute()

const slots = useSlots()

const getTagClass = computed(() => {
  const { size, center, border, isLink, required, clickable } = props

  const classes: Record<string, boolean | undefined> = {
    center,
    required: !!required,
    clickable: clickable ?? isLink,
    borderless: !border,
  }

  if (size)
    classes[size] = !!size

  return classes
})

const getTitleSlot = computed(() => slots.title?.() || [])
</script>

<template>
  <view
    :class="bem(getTagClass)"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @click="route"
  >
    <!-- left-icon -->
    <slot v-if="slots.icon" name="icon" />
    <Icon
      v-else-if="icon"
      :name="icon"
      :class="bem('left-icon')"
      :class-prefix="iconPrefix"
    />
    <!-- title -->
    <div
      v-if="slots.title || title"
      :class="[bem('title'), props.titleClass]"
      :style="titleStyle"
    >
      <text v-if="getTitleSlot && getTitleSlot.length !== 0">
        {{ getTitleSlot }}
      </text>
      <text v-else>
        {{ title }}
      </text>
      <div
        v-if="slots.label || label"
        :class="[bem('label'), labelClass]"
      >
        <slot v-if="slots.label" name="label" />
        <text v-else>
          {{ label }}
        </text>
      </div>
    </div>
    <!-- value -->
    <div
      v-if="slots.value || slots.default || value"
      :class="[bem('value'), valueClass]"
    >
      <slot v-if="slots.value" name="label" />
      <slot v-if="slots.default" />
      <text v-else>
        {{ value }}
      </text>
    </div>
    <!-- right-icon -->
    <slot v-if="slots['right-icon']" name="right-icon" />
    <Icon
      v-else-if="isLink"
      :name="`arrow${props.arrowDirection && props.arrowDirection !== 'right' ? `-${props.arrowDirection}` : ''}`"
      :class="bem('right-icon')"
    />
    <slot name="extra" />
  </view>
</template>
