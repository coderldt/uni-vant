<script setup lang="ts">
import './index.less'
import { useSlots } from 'vue'
import { createNamespace } from '../utils'
import { dividerProps } from './types'

const props = defineProps(dividerProps)

const [name, bem] = createNamespace('divider')

const slots = useSlots()
</script>

<template>
  <div
    role="separator"
    :class="bem({
      dashed: props.dashed,
      hairline: props.hairline,
      vertical: props.vertical,
      [`content-${props.contentPosition}`]:
        !!slots.default && !props.vertical,
    })"
  >
    <slot v-if="!props.vertical"></slot>
  </div>
</template>
