<script lang="ts" setup>
import './index.less'
import {
  type CSSProperties,
  type PropType,
  useSlots,
} from 'vue'

// Utils
import {
  BORDER_SURROUND,
  createNamespace,
  makeStringProp,
  numericProp,
  preventDefault,
} from '../utils'

// Components
import Icon from '../icon/Icon.vue'
import type { LoadingType } from '../loading'
import Loading from '../loading/Loading.vue'

// Types
import type {
  ButtonIconPosition,
  ButtonNativeType,
  ButtonSize,
  ButtonType,
} from './types'

const props = defineProps({
  tag: makeStringProp<keyof HTMLElementTagNameMap>('button'),
  text: String,
  icon: String,
  type: makeStringProp<ButtonType>('default'),
  size: makeStringProp<ButtonSize>('normal'),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp<ButtonNativeType>('button'),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String as PropType<LoadingType>,
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
})
const emit = defineEmits(['click'])
const slots = useSlots()
function getStyle() {
  const { color, plain } = props
  if (color) {
    const style: CSSProperties = {
      color: plain ? color : 'white',
    }

    if (!plain) {
      // Use background instead of backgroundColor to make linear-gradient work
      style.background = color
    }

    // hide border when color is linear-gradient
    if (color.includes('gradient'))
      style.border = 0
    else
      style.borderColor = color

    return style
  }
}

function onClick(event: MouseEvent) {
  if (props.loading)
    preventDefault(event)
  else if (!props.disabled)
    emit('click', event)
}
const [name, bem] = createNamespace('button')

function getClasses() {
  const {
    type,
    size,
    block,
    round,
    plain,
    square,
    loading,
    disabled,
    hairline,
  } = props

  const classes = [
    bem([
      type,
      size,
      {
        plain,
        block,
        round,
        square,
        loading,
        disabled,
        hairline,
      },
    ]),
    { [BORDER_SURROUND]: hairline },
  ]

  return classes
}

const classes = getClasses()
</script>

<template>
  <view
    :type="nativeType"
    :class="classes"
    :style="getStyle"
    :disabled="disabled"
    @click="onClick"
  >
    <view :class="bem('content')">
      <template v-if="iconPosition === 'left'">
        <Loading
          v-if="loading"
          :size="props.loadingSize"
          :type="props.loadingType"
          :class="bem('loading')"
        />
        <slot v-else-if="slots.icon" />
        <Icon v-else-if="icon" :name="icon" :class="bem('icon')" :class-prefix="iconPrefix" />
      </template>

      <template v-if="loading && loadingText">
        <text :class="bem('text')">
          {{ loadingText }}
        </text>
      </template>
      <template v-else-if="slots.default">
        <text :class="bem('text')">
          <slot />
        </text>
      </template>
      <template v-else-if="text">
        <text :class="bem('text')">
          {{ text }}
        </text>
      </template>

      <template v-if="iconPosition === 'right'">
        <Loading
          v-if="loading"
          :size="props.loadingSize"
          :type="props.loadingType"
          :class="bem('loading')"
        />
        <slot v-else-if="slots.icon" />
        <Icon v-else-if="icon" :name="icon" :class="bem('icon')" :class-prefix="iconPrefix" />
      </template>
    </view>
  </view>
</template>
