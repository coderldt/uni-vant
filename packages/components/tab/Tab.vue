<script lang="ts">
import './index.less'
import {
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
  computed,
  getCurrentInstance,
  nextTick,
  provide,
  ref,
  useSlots,
  watch,
  watchEffect,
} from 'vue'

import { normalizeClass, normalizeStyle, stringifyStyle } from '@vue/shared'

// Utils
import { doubleRaf, useParent } from '../vant-use'
import {
  createNamespace,
  numericProp,
  truthProp,
  unknownProp,
} from '../utils'

// Composables
import { useId } from '../composables/use-id'
import { useExpose } from '../composables/use-expose'
import { TAB_STATUS_KEY } from '../composables/use-tab-status'

// Components
import SwipeItem from '../swipe-item/SwipeItem.vue'
import { TABS_KEY } from '../tabs'

const [name, bem] = createNamespace('tab')

export const tabProps = {
  dot: Boolean,
  name: numericProp,
  badge: numericProp,
  title: String,
  disabled: Boolean,
  titleClass: unknownProp,
  titleStyle: [String, Object] as PropType<string | CSSProperties>,
  showZeroBadge: truthProp,
}
export type TabProps = ExtractPropTypes<typeof tabProps>

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps(tabProps)

const id = useId()
const inited = ref(false)
const instance = getCurrentInstance()
const { parent, index } = useParent(TABS_KEY)

const getName = () => props.name ?? index.value

function init() {
  inited.value = true

  if (parent?.props.lazyRender) {
    nextTick(() => {
      parent?.onRendered(getName(), props.title)
    })
  }
}

const active = computed(() => {
  const isActive = getName() === parent?.currentName.value

  if (isActive && !inited.value)
    init()

  return isActive
})

// see: https://github.com/vant-ui/vant/issues/11763
const parsedClass = ref('')
const parsedStyle = ref<string | undefined>('')
watchEffect(() => {
  const { titleClass, titleStyle } = props
  parsedClass.value = titleClass ? normalizeClass(titleClass) : ''
  parsedStyle.value
        = titleStyle && typeof titleStyle !== 'string'
      ? stringifyStyle(normalizeStyle(titleStyle))
      : titleStyle
})

const hasInactiveClass = ref(!active.value)

watch(active, (val) => {
  if (val) {
    hasInactiveClass.value = false
  }
  else {
    // mark tab as inactive until the active tab is rendered
    // to avoid incorrect scroll position or other render issue
    // https://github.com/youzan/vant/issues/11050
    doubleRaf(() => {
      hasInactiveClass.value = true
    })
  }
})

watch(
  () => props.title,
  () => {
    parent?.setLine()
    parent?.scrollIntoView()
  },
)

provide(TAB_STATUS_KEY, active)

useExpose({
  id,
  parsedStyle,
  parsedClass,
  active,
  index,
})

const label = computed(() => `${parent?.id}-${index.value}`)
const animated = computed(() => parent?.props.animated)
const swipeable = computed(() => parent?.props.swipeable)
const scrollspy = computed(() => parent?.props.scrollspy)
const lazyRender = computed(() => parent?.props.lazyRender)
const show = computed(() => scrollspy.value || active.value)
const shouldRender = computed(() => inited.value || scrollspy.value || !lazyRender.value)
const slots = useSlots()
</script>

<template>
  <template v-if="animated || swipeable">
    <SwipeItem
      :id="id"
      role="tabpanel"
      :class="bem('panel-wrapper', { inactive: hasInactiveClass })"
      :tabindex="active ? 0 : -1"
      :aria-hidden="!active"
      :aria-labelledby="label"
    >
      <view :class="bem('panel')">
        <slot />
      </view>
    </SwipeItem>
  </template>
  <view
    v-else
    v-show="show"
    :id="id"
    role="tabpanel"
    :class="bem('panel', { inactive: hasInactiveClass })"
    :tabindex="show ? 0 : -1"
    :aria-labelledby="label"
  >
    <template v-if="shouldRender">
      <slot />
    </template>
  </view>
</template>
