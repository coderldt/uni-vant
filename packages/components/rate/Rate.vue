<script lang="ts" setup>
import './index.less'

import { computed, ref } from 'vue'
import { useCustomFieldValue, useEventListener, useRect } from '@vant/use'
import {
  addUnit,
  createNamespace,
  makeNumberProp,
  makeNumericProp,
  makeStringProp,
  numericProp,
  preventDefault,
  truthProp,
} from '../utils'
import { useTouch } from '../composables/use-touch'
import { useRefs } from '../composables/use-refs'

import { Icon } from '../icon'

import { type RateListItem, getRateStatus } from './types'

const props = defineProps({
  size: numericProp,
  icon: makeStringProp('star'),
  color: String,
  count: makeNumericProp(5),
  gutter: numericProp,
  clearable: Boolean,
  readonly: Boolean,
  disabled: Boolean,
  voidIcon: makeStringProp('star-o'),
  allowHalf: Boolean,
  voidColor: String,
  touchable: truthProp,
  iconPrefix: String,
  modelValue: makeNumberProp(0),
  disabledColor: String,
})
const emit = defineEmits<{
  (event: 'update:modelValue', value: number): void
  (event: 'change', value: number): void
}>()

const [name, bem] = createNamespace('rate')
const touch = useTouch()

const [itemRefs, setItemRefs] = useRefs()
const groupRef = ref<Element>()

const unselectable = computed(() => props.readonly || props.disabled)
const untouchable = computed(() => unselectable.value || !props.touchable)

const list = computed<RateListItem[]>(() =>
  Array(+props.count)
    .fill('')
    .map((_, i) =>
      getRateStatus(
        props.modelValue,
        i + 1,
        props.allowHalf,
        props.readonly,
      ),
    ),
)

let ranges: Array<{
  left: number
  top: number
  height: number
  score: number
}>

let groupRefRect: DOMRect
let minRectTop = Number.MAX_SAFE_INTEGER
let maxRectTop = Number.MIN_SAFE_INTEGER

function getScoreByPosition(x: number, y: number) {
  for (let i = ranges.length - 1; i > 0; i--) {
    if (y >= groupRefRect.top && y <= groupRefRect.bottom) {
      if (
        x > ranges[i].left
          && y >= ranges[i].top
          && y <= ranges[i].top + ranges[i].height
      )
        return ranges[i].score
    }
    else {
      const curTop = y < groupRefRect.top ? minRectTop : maxRectTop

      if (x > ranges[i].left && ranges[i].top === curTop)
        return ranges[i].score
    }
  }
  return props.allowHalf ? 0.5 : 1
}

function select(value: number) {
  if (unselectable.value || value === props.modelValue)
    return
  emit('update:modelValue', value)
  emit('change', value)
}
function onTouchStart(event: TouchEvent) {
  if (untouchable.value)
    return

  touch.start(event)
  updateRanges()
}

function onTouchMove(event: TouchEvent) {
  if (untouchable.value)
    return

  touch.move(event)

  if (touch.isHorizontal() && !touch.isTap.value) {
    const { clientX, clientY } = event.touches[0]
    preventDefault(event)
    select(getScoreByPosition(clientX, clientY))
  }
}
function updateRanges() {
  groupRefRect = useRect(groupRef)

  const rects = itemRefs.value.map(useRect)

  ranges = []
  rects.forEach((rect, index) => {
    minRectTop = Math.min(rect.top, minRectTop)
    maxRectTop = Math.max(rect.top, maxRectTop)

    if (props.allowHalf) {
      ranges.push(
        {
          score: index + 0.5,
          left: rect.left,
          top: rect.top,
          height: rect.height,
        },
        {
          score: index + 1,
          left: rect.left + rect.width / 2,
          top: rect.top,
          height: rect.height,
        },
      )
    }
    else {
      ranges.push({
        score: index + 1,
        left: rect.left,
        top: rect.top,
        height: rect.height,
      })
    }
  })
}
function onClickItem(event: MouseEvent, index: number) {
  updateRanges()
  let value = props.allowHalf
    ? getScoreByPosition(event.clientX, event.clientY)
    : index + 1
  if (
    props.clearable
      && touch.isTap.value
      && value === props.modelValue
  )
    value = 0

  select(value)
}

useCustomFieldValue(() => props.modelValue)

// useEventListener will set passive to `false` to eliminate the warning of Chrome
useEventListener('touchmove', onTouchMove, {
  target: groupRef,
})
</script>

<template>
  <div
    ref="groupRef"
    role="radiogroup"
    :class="bem({
      readonly,
      disabled,
    })"
    :tabindex="disabled ? undefined : 0"
    :aria-disabled="disabled"
    :aria-readonly="readonly"
    @touchstart.passive="onTouchStart"
  >
    <div
      v-for="(item, index) in list"
      :key="index"
      :ref="setItemRefs(index)"
      role="radio"
      :style="{
        paddingRight: addUnit(gutter),
      }"
      :class="bem('item')"
      :tabindex="disabled ? undefined : 0"
      :aria-setsize="count"
      :aria-posinset="index + 1"
      :aria-checked="!(item.status === 'void')"
      @click="(e: MouseEvent) => onClickItem(e, index)"
    >
      <Icon
        :size="size"
        :name="item.status === 'full' ? icon : voidIcon"
        :class="bem('icon', { disabled, full: item.status === 'full' })"
        :color="disabled ? disabledColor : item.status === 'full' ? color : voidColor"
        :class-prefix="iconPrefix"
      />
      <Icon
        v-if="allowHalf && item.value > 0 && item.value < 1"
        :size="size"
        :style="{ width: `${item.value}em` }"
        :name="item.status === 'void' ? voidIcon : icon "
        :class="bem('icon', ['half', { disabled, full: !(item.status === 'void') }])"
        :color="disabled ? disabledColor : item.status === 'void' ? voidColor : color"
        class-prefix="iconPrefix"
      />
    </div>
  </div>
</template>
