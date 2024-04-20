<script lang="ts" setup>
import './index.less'

import { computed, useSlots } from 'vue'
import {
  addUnit,
  createNamespace,
  extend,
  getSizeStyle,
  makeStringProp,
  numericProp,
} from '../utils'
import type { LoadingType } from '.'

const props = defineProps({
  size: numericProp,
  type: makeStringProp<LoadingType>('circular'),
  color: makeStringProp('#c9c9c9'),
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
          <view :class="bem('circular')" />
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
