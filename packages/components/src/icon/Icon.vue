<template>
  <div
    :class='bem(type, { vertical })'
    aria-live='polite'
    aria-busy
  >
    <span :class='bem("spinner", type)' :style='getStyle' >
      <slot name="icon">
        <template v-if='type === "spinner"'>
          <i v-for='item in 12' :key='item' :class='bem("line", String(item + 1))' />
        </template>
        <template v-else>
          <svg :class='bem("circular")' viewBox='25 25 50 50'>
            <circle cx='50' cy='50' r='20' fill='none' />
          </svg>
        </template>
      </slot>
    </span>
    <span
      :class='bem("text")'
      :style='{
        fontSize: addUnit(textSize),
        color: textColor ?? color
      }'
    >
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import './index.less'

import {computed, useSlots} from 'vue';
import {
  extend,
  addUnit,
  getSizeStyle,
  createNamespace,
} from '../utils';

import { iconProps } from '.'

const [name, bem] = createNamespace('loading');

const props = defineProps(iconProps)

const getStyle = computed(() => extend({ color: props.color }, getSizeStyle(props.size)))
</script>