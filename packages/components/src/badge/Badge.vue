<script lang="ts" setup>
import './index.less'
import {
  type CSSProperties,
  type PropType,
  computed,
  useSlots,
} from 'vue'
import {
  type Numeric,
  addUnit,
  createNamespace,
  isDef,
  isNumeric,
  makeStringProp,
  numericProp,
  truthProp,
} from '../utils'

type BadgePosition =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'

const props = defineProps({
  dot: Boolean,
  max: numericProp,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  color: String,
  offset: Array as unknown as PropType<[Numeric, Numeric]>,
  content: numericProp,
  showZero: truthProp,
  position: makeStringProp<BadgePosition>('top-right'),
})
const [name, bem] = createNamespace('badge')
const slots = useSlots()

function hasContent() {
  if (slots.content)
    return true

  const { content, showZero } = props
  return (
    isDef(content)
        && content !== ''
        && (showZero || (content !== 0 && content !== '0'))
  )
}

function getOffsetWithMinusString(val: string) {
  return val.startsWith('-') ? val.replace('-', '') : `-${val}`
}

const style = computed(() => {
  const style: CSSProperties = {
    background: props.color,
  }

  if (props.offset) {
    const [x, y] = props.offset
    const { position } = props
    const [offsetY, offsetX] = position.split('-') as [
      'top' | 'bottom',
      'left' | 'right',
    ]

    if (slots.default) {
      if (typeof y === 'number') {
        style[offsetY] = addUnit(offsetY === 'top' ? y : -y)
      }
      else {
        style[offsetY]
              = offsetY === 'top' ? addUnit(y) : getOffsetWithMinusString(y)
      }

      if (typeof x === 'number') {
        style[offsetX] = addUnit(offsetX === 'left' ? x : -x)
      }
      else {
        style[offsetX]
              = offsetX === 'left' ? addUnit(x) : getOffsetWithMinusString(x)
      }
    }
    else {
      style.marginTop = addUnit(y)
      style.marginLeft = addUnit(x)
    }
  }

  return style
})
</script>

<template>
  <template v-if="slots.default">
    <view :class="bem('wrapper')">
      <slot />

      <view
        v-if="hasContent() || props.dot"
        :class="bem([
          props.position,
          { dot: props.dot, fixed: !!slots.default },
        ])"
        :style="style"
      >
        <slot v-if="slots.content" />
        <template v-else-if="isDef(max) && isNumeric(content!) && +content > +max">
          {{ `${max}+` }}
        </template>
        <template v-else>
          {{ content }}
        </template>
      </view>
    </view>
  </template>
  <view
    v-else
    :class="bem([
      props.position,
      { dot: props.dot, fixed: !!slots.default },
    ])"
    :style="style"
  >
    <template v-if="hasContent() || props.dot">
      <slot v-if="slots.content" />
      <template v-else-if="isDef(max) && isNumeric(content!) && +content > +max">
        {{ `${max}+` }}
      </template>
      <template v-else>
        {{ content }}
      </template>
    </template>
  </view>
</template>
