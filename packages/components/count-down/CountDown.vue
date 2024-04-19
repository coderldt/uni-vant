<script setup lang="ts">
import './index.less'
import { computed, watch } from 'vue'
import { useCountDown } from '@vant/use'

import { createNamespace } from '../utils'
import { parseFormat } from './utils'

import { countDownProps } from './types'

const props = defineProps(countDownProps)

const emit = defineEmits<{
  // todo CurrentTime ts
  (event: 'change', current: any): void
  (event: 'finish'): void
}>()

const [name, bem] = createNamespace('count-down')

const { start, pause, reset, current } = useCountDown({
  time: +props.time,
  millisecond: props.millisecond,
  onChange: current => emit('change', current),
  onFinish: () => emit('finish'),
})

const timeText = computed(() => parseFormat(props.format, current.value))

function resetTime() {
  reset(+props.time)
  console.log(props.autoStart, 'props.autoStart')
  if (props.autoStart)
    start()
}

watch(() => props.time, resetTime, { immediate: true })

defineExpose({
  start,
  pause,
  reset: resetTime,
})
</script>

<template>
  <div role="timer" :class="bem()">
    <slot :timeData="current">
      {{ timeText }}
    </slot>
  </div>
</template>
