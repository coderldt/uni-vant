<script setup lang="ts">
import { type CSSProperties, computed, useSlots, watch } from 'vue'
import { cancelRaf, raf } from '@vant/use'
import './index.less'
import {
  createNamespace,
  getSizeStyle,
  isObject,
} from '../utils'
import { format, getPath, uid } from './utils'
import { type CircleStartPosition, circleProps } from './types'

const props = defineProps(circleProps)
const emit = defineEmits<{
  (event: 'update:currentRate', data: number): void
}>()

const [_, bem] = createNamespace('circle')
const slots = useSlots()

const id = `van-circle-${uid.value++}`

const viewBoxSize = computed(() => +props.strokeWidth + 1000)

const path = computed(() => getPath(props.clockwise, viewBoxSize.value))

const svgStyle = computed(() => {
  const ROTATE_ANGLE_MAP: Record<CircleStartPosition, number> = {
    top: 0,
    right: 90,
    bottom: 180,
    left: 270,
  }

  const angleValue = ROTATE_ANGLE_MAP[props.startPosition]
  if (angleValue) {
    return {
      transform: `rotate(${angleValue}deg)`,
    }
  }
  return {}
})

watch(
  () => props.rate,
  (rate) => {
    let rafId: number | undefined

    const startTime = Date.now()
    const startRate = props.currentRate
    const endRate = format(rate)
    const duration = Math.abs(
      ((startRate - endRate) * 1000) / +props.speed,
    )

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const rate = progress * (endRate - startRate) + startRate

      emit('update:currentRate', format(Number.parseFloat(rate.toFixed(1))))

      if (endRate > startRate ? rate < endRate : rate > endRate)
        rafId = raf(animate)
    }

    if (props.speed) {
      if (rafId)
        cancelRaf(rafId)

      rafId = raf(animate)
    }
    else {
      emit('update:currentRate', endRate)
    }
  },
  { immediate: true },
)

const getGradientColor = computed(() => {
  const { color } = props

  if (!isObject(color))
    return []

  return Object.keys(color)
    .sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
})

const getHoverStyle = computed(() => {
  const PERIMETER = 3140
  const { strokeWidth, currentRate, strokeLinecap } = props
  const offset = (PERIMETER * currentRate) / 100
  const color = isObject(props.color) ? `url(#${id})` : props.color

  const style: CSSProperties = {
    stroke: color,
    strokeWidth: `${+strokeWidth + 1}px`,
    strokeLinecap,
    strokeDasharray: `${offset}px ${PERIMETER}px`,
  }

  return style
})
</script>

<template>
  <view :class="bem()" :style="getSizeStyle(props.size)">
    <svg
      :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
      :style="svgStyle"
    >
      <view v-if="getGradientColor.length">
        <defs>
          <linearGradient :id="id" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop
              v-for="(key, index) in getGradientColor"
              :key="index"
              :offset="key"
              :stop-color="color[key]"
            />
          </linearGradient>
        </defs>
      </view>
      <path
        :class="bem('layer')"
        :style="{
          fill,
          stroke: layerColor,
          strokeWidth: `${strokeWidth}px`,
        }"
        :d="path"
      />
      <path
        :d="path"
        :style="getHoverStyle"
        :class="bem('hover')"
        :stroke="getHoverStyle.stroke"
      />
    </svg>
    <slot v-if="slots.default" />
    <view v-else-if="text" :class="bem('text')">
      {{ props.text }}
    </view>
  </view>
</template>
