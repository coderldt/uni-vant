<script lang="ts" setup>
import './index.less'

import { computed, useSlots } from 'vue'
import {
  addUnit,
  createNamespace,
  extend,
  getSizeStyle, makeStringProp, numericProp,
} from '../utils'
import type { LoadingType } from '.'

const props = defineProps({
  size: numericProp,
  type: makeStringProp<LoadingType>('circular'),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String,
})

const [name, bem] = createNamespace('loading')

const slots = useSlots()

const getStyle = computed(() => extend({ color: props.color }, getSizeStyle(props.size)))
</script>

<template>
  <view
    :class="bem([type, { vertical }])"
    aria-live="polite"
    aria-busy
  >
    <text :class="bem('spinner', type)" :style="getStyle">
      <slot name="icon">
        <template v-if="type === 'spinner'">
          <text v-for="item in 12" :key="item" :class="bem('line', String(item + 1))" />
        </template>
        <template v-else>
          <svg :class="bem('circular')" viewBox="25 25 50 50">
            <circle cx="50" cy="50" r="20" fill="none" />
          </svg>
        </template>
      </slot>
    </text>
    <text
      v-if="!!slots.default"
      :class="bem('text')"
      :style="{
        fontSize: addUnit(textSize),
        color: textColor ?? color,
      }"
    >
      <slot />
    </text>
  </view>
</template>
