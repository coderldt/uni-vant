<script lang="ts">
import './index.less'
import {
  type CSSProperties,
  // type ComponentPublicInstance,
  type ExtractPropTypes,
  type PropType,
  computed,
  nextTick,
  onActivated,
  reactive,
  ref,
  watch,
} from 'vue'

// Utils

// Composables
import {
  onMountedOrActivated,
  useChildren,
  useEventListener,
  useRect,
  useScrollParent,
} from '../vant-use'
import {
  BORDER_TOP_BOTTOM,
  type ComponentInstance,
  type Interceptor,
  type Numeric,
  addUnit,
  callInterceptor,
  createNamespace,
  extend,
  getElementTop,
  isDef,
  makeNumericProp,
  makeStringProp,
  numericProp,
  setRootScrollTop,
  truthProp,
  unitToPx,
  windowWidth,
} from '../utils'
import { useId } from '../composables/use-id'

// import type { RouteProps } from '../composables/use-route'
// import { route } from '../composables/use-route'
import { useRefs } from '../composables/use-refs'
import { useExpose } from '../composables/use-expose'
import { onPopupReopen } from '../composables/on-popup-reopen'
import { useVisibilityChange } from '../composables/use-visibility-change'

// Components
import TabTitle from '../tab/TabTitle.vue'
import { scrollLeftTo, scrollTopTo } from './utils'
import TabsContent from './TabsContent.vue'

// Types
import type { TabsType } from './types'
import { TABS_KEY } from '.'
import { onMounted } from 'vue'

const [name, bem] = createNamespace('tabs')

export const tabsProps = {
  type: makeStringProp<TabsType>('line'),
  color: String,
  border: Boolean,
  sticky: Boolean,
  shrink: Boolean,
  active: makeNumericProp(0),
  duration: makeNumericProp(0.3),
  animated: Boolean,
  ellipsis: truthProp,
  swipeable: Boolean,
  scrollspy: Boolean,
  offsetTop: makeNumericProp(0),
  background: String,
  lazyRender: truthProp,
  showHeader: truthProp,
  lineWidth: numericProp,
  lineHeight: numericProp,
  beforeChange: Function as PropType<Interceptor>,
  swipeThreshold: makeNumericProp(5),
  titleActiveColor: String,
  titleInactiveColor: String,
}

export type TabsProps = ExtractPropTypes<typeof tabsProps>
</script>

<script lang="ts" setup>
const props = defineProps(tabsProps)
const emit = defineEmits(['change', 'scroll', 'rendered', 'clickTab', 'update:active'])

let tabHeight: number
let lockScroll: boolean
let stickyFixed: boolean
let cancelScrollLeftToRaf: (() => void) | undefined
let cancelScrollTopToRaf: (() => void) | undefined

const root = ref<HTMLElement>()
const navRef = ref<HTMLElement>()
const wrapRef = ref<HTMLElement>()
const contentRef = ref<ComponentInstance>()

const id = useId()
const scroller = useScrollParent(root)
// const [titleRefs, setTitleRefs] = useRefs<ComponentInstance>()
const titleRefs = ref<any[]>([])
function setTitleRefs(index: number) {
  return (el: unknown) => {
    titleRefs.value[index] = el
  }
}
const { children, linkChildren } = useChildren(TABS_KEY)

const state = reactive({
  inited: false,
  position: '',
  lineStyle: {} as CSSProperties,
  currentIndex: -1,
})

// whether the nav is scrollable
const scrollable = computed(
  () =>
    children.length > +props.swipeThreshold
        || !props.ellipsis
        || props.shrink,
)

const navStyle = computed(() => {
  let styles = {}
  if (props.color) {
    styles = {
      borderColor: props.color,
    }
  }
  if (props.background) {
    styles = extend(styles, {
      background: props.background,
    })
  }
  return styles
})

function getTabName(tab: ComponentInstance, index: number): Numeric {
  return tab.name ?? index
}

const currentName = computed(() => {
  const activeTab = children[state.currentIndex]

  if (activeTab)
    return getTabName(activeTab, state.currentIndex)

  return undefined
})

const offsetTopPx = computed(() => unitToPx(props.offsetTop))

const scrollOffset = computed(() => {
  if (props.sticky)
    return offsetTopPx.value + tabHeight

  return 0
})

// scroll active tab into view
function scrollIntoView(immediate?: boolean) {
  const nav = navRef.value
  const titles = titleRefs.value

  if (!scrollable.value || !nav || !titles || !titles[state.currentIndex])
    return

  const title = titles[state.currentIndex].$el
  const to = title.offsetLeft - (nav.offsetWidth - title.offsetWidth) / 2

  if (cancelScrollLeftToRaf)
    cancelScrollLeftToRaf()
  cancelScrollLeftToRaf = scrollLeftTo(
    nav,
    to,
    immediate ? 0 : +props.duration,
  )
}

// update nav bar style
function setLine() {
  const shouldAnimate = state.inited

  nextTick(() => {
    const titles = titleRefs.value
    const rect = titles[state.currentIndex]?.getTabTitleRect()
    if (
      !titles
          || !titles[state.currentIndex]
          || props.type !== 'line'
          || !rect
    )
      return

    const { lineWidth, lineHeight } = props
    const left = rect.left + rect.width / 2

    const lineStyle: CSSProperties = {
      width: addUnit(lineWidth),
      backgroundColor: props.color,
      transform: `translateX(${left}px) translateX(-50%)`,
    }

    if (shouldAnimate)
      lineStyle.transitionDuration = `${props.duration}s`

    if (isDef(lineHeight)) {
      const height = addUnit(lineHeight)
      lineStyle.height = height
      lineStyle.borderRadius = height
    }
    state.lineStyle = lineStyle
  })
}

function findAvailableTab(index: number) {
  const diff = index < state.currentIndex ? -1 : 1

  while (index >= 0 && index < children.length) {
    if (!children[index].disabled)
      return index

    index += diff
  }
}

function setCurrentIndex(currentIndex: number,
  skipScrollIntoView?: boolean) {
  const newIndex = findAvailableTab(currentIndex)

  if (!isDef(newIndex))
    return

  const newTab = children[newIndex]
  const newName = getTabName(newTab, newIndex)
  const shouldEmitChange = state.currentIndex !== null

  if (state.currentIndex !== newIndex) {
    state.currentIndex = newIndex
    console.log('index', state.currentIndex)

    if (!skipScrollIntoView)
      scrollIntoView()

    setLine()
  }

  if (newName !== props.active) {
    emit('update:active', newName)

    if (shouldEmitChange)
      emit('change', newName, newTab.title)
  }

  // scroll to correct position
  if (stickyFixed && !props.scrollspy) {
    setRootScrollTop(
      Math.ceil(getElementTop(root.value!) - offsetTopPx.value),
    )
  }
}

// correct the index of active tab
function setCurrentIndexByName(name: Numeric,
  skipScrollIntoView?: boolean) {
  const matched = children.find(
    (tab, index) => getTabName(tab, index) === name,
  )

  const index = matched ? children.indexOf(matched) : 0
  setCurrentIndex(index, skipScrollIntoView)
}

function scrollToCurrentContent(immediate = false) {
  if (props.scrollspy) {
    const target = children[state.currentIndex].$el

    if (target && scroller.value) {
      const to = getElementTop(target, scroller.value) - scrollOffset.value

      lockScroll = true

      if (cancelScrollTopToRaf)
        cancelScrollTopToRaf()
      cancelScrollTopToRaf = scrollTopTo(
        scroller.value,
        to,
        immediate ? 0 : +props.duration,
        () => {
          lockScroll = false
        },
      )
    }
  }
}

// emit event when clicked
function onClickTab(
  index: number,
  event: MouseEvent) {
  const { title, disabled } = children[index]
  const name = getTabName(children[index], index)

  if (!disabled) {
    callInterceptor(props.beforeChange, {
      args: [name],
      done: () => {
        setCurrentIndex(index)
        scrollToCurrentContent()
      },
    })

    // route(item as ComponentPublicInstance<RouteProps>)
  }

  emit('clickTab', {
    name,
    title,
    event,
    disabled,
  })
}

function onStickyScroll(params: {
  isFixed: boolean
  scrollTop: number
}) {
  stickyFixed = params.isFixed
  emit('scroll', params)
}

function scrollTo(name: Numeric) {
  nextTick(() => {
    setCurrentIndexByName(name)
    scrollToCurrentContent(true)
  })
}

function getCurrentIndexOnScroll() {
  for (let index = 0; index < children.length; index++) {
    const { top } = useRect(children[index].$el)

    if (top > scrollOffset.value)
      return index === 0 ? 0 : index - 1
  }

  return children.length - 1
}

function onScroll() {
  if (props.scrollspy && !lockScroll) {
    const index = getCurrentIndexOnScroll()
    setCurrentIndex(index)
  }
}

function resize() {
  setLine()

  nextTick(() => {
    scrollIntoView(true)
    contentRef.value?.swipeRef.value?.resize()
  })
}

watch(
  () => [props.color, props.duration, props.lineWidth, props.lineHeight],
  setLine,
)
watch(windowWidth, resize)

watch(
  () => props.active,
  (value) => {
    if (value !== currentName.value)
      setCurrentIndexByName(value)
  },
)

watch(
  () => children.length,
  () => {
    if (state.inited) {
      setCurrentIndexByName(props.active)
      setLine()
      nextTick(() => {
        scrollIntoView(true)
      })
    }
  },
)

function init() {
  setCurrentIndexByName(props.active, true)
  nextTick(() => {
    state.inited = true
    if (wrapRef.value)
      tabHeight = useRect(wrapRef.value).height

    scrollIntoView(true)
  })
}

function onRendered(name: Numeric, title?: string) {
  return emit('rendered', name, title)
}

useExpose({
  resize,
  scrollTo,
})

onPopupReopen(setLine)
onMounted(init)
useVisibilityChange(root, setLine)
useEventListener('scroll', onScroll, {
  target: scroller,
  passive: true,
})

linkChildren({
  id,
  props,
  setLine,
  scrollable,
  onRendered,
  currentName,
  setTitleRefs,
  scrollIntoView,
})
</script>

<template>
  <view :class="bem([props.type])">
    <template v-if="props.showHeader">
      <view
        :class="[
          bem('wrap'),
          { [BORDER_TOP_BOTTOM]: type === 'line' && border },
        ]"
      >
        <view
          role="tablist"
          :class="bem('nav', [
            type,
            { shrink: props.shrink, complete: scrollable },
          ])"
          :style="navStyle"
          aria-orientation="horizontal"
        >
          <slot name="nav-left" />
          <template v-for="item in children" :key="`${id}-${item.index.value}`">
            <TabTitle
              :id="`${id}-${item.index.value}`"
              :ref="setTitleRefs(item.index.value)"
              :style="item.parsedStyle.value"
              :class="item.parsedClass.value"
              :is-active="item.active.value"
              :controls="item.id"
              :scrollable="scrollable"
              :active-color="props.titleActiveColor"
              :inactive-color="props.titleInactiveColor"
              :type="props.type"
              :color="props.color"
              :shrink="props.shrink"
              :dot="item.dot"
              :badge="item.badge"
              :title="item.title"
              :disabled="item.disabled"
              :show-zero-badge="item.showZeroBadge"
              @click="(event: MouseEvent) => {
                onClickTab(item.index.value, event)
              }"
            />
          </template>

          <template v-if="props.type === 'line' && children.length">
            <view :class="bem('line')" :style="state.lineStyle" />
          </template>
          <slot name="nav-right" />
        </view>
      </view>
      <slot name="nav-bottom" />
    </template>
    <TabsContent
      ref="contentRef"
      :count="children.length"
      :inited="state.inited"
      :animated="props.animated"
      :duration="props.duration"
      :swipeable="props.swipeable"
      :lazy-render="props.lazyRender"
      :current-index="state.currentIndex"
      @change="setCurrentIndex"
    >
      <slot />
    </TabsContent>
  </view>
</template>
