<script lang="ts">
import { type CSSProperties, computed } from 'vue'
import { createNamespace, isDef, numericProp, truthProp } from '../utils'
import Badge from '../badge/Badge.vue'
import '../tabs/index.less'

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps({
  id: String,
  dot: Boolean,
  type: String,
  color: String,
  title: String,
  badge: numericProp,
  shrink: Boolean,
  isActive: Boolean,
  disabled: Boolean,
  controls: String,
  scrollable: Boolean,
  activeColor: String,
  inactiveColor: String,
  showZeroBadge: truthProp,
})
const emit = defineEmits(['click'])
const [name, bem] = createNamespace('tab')
const style = computed(() => {
  const style: CSSProperties = {}
  const { type, color, disabled, isActive, activeColor, inactiveColor }
        = props

  const isCard = type === 'card'

  // card theme color
  if (color && isCard) {
    style.borderColor = color

    if (!disabled) {
      if (isActive)
        style.backgroundColor = color
      else
        style.color = color
    }
  }

  const titleColor = isActive ? activeColor : inactiveColor
  if (titleColor)
    style.color = titleColor

  return style
})

function onClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <view
    :id="props.id"
    role="tab"
    :class="[
      bem([
        props.type,
        {
          grow: props.scrollable && !props.shrink,
          shrink: props.shrink,
          active: props.isActive,
          disabled: props.disabled,
        },
      ]),
    ]"
    :style="style"
    :tabindex="props.disabled ? undefined : props.isActive ? 0 : -1"
    :aria-selected="props.isActive"
    :aria-disabled="props.disabled || undefined"
    :aria-controls="props.controls"
    @click="onClick"
  >
    <template v-if="props.dot || (isDef(props.badge) && props.badge !== '')">
      <Badge :dot="props.dot" :content="props.badge" :show-zero="props.showZeroBadge">
        <text :class="bem('text', { ellipsis: !props.scrollable })">
          {{ props.title }}
        </text>
      </Badge>
    </template>
    <text v-else :class="bem('text', { ellipsis: !props.scrollable })">
      {{ props.title }}
    </text>
  </view>
</template>
