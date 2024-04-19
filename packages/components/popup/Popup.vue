<script lang="ts" setup>
import './index.less'
import {
  type CSSProperties,
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'

// Utils
import { useEventListener } from '@vant/use'
import {
  HAPTICS_FEEDBACK,
  callInterceptor,
  createNamespace,
  extend,
  isDef,
  makeStringProp,
} from '../utils'

// Composables
import { useExpose } from '../composables/use-expose'
import { useLockScroll } from '../composables/use-lock-scroll'
import { useLazyRender } from '../composables/use-lazy-render'
import { POPUP_TOGGLE_KEY } from '../composables/on-popup-reopen'
import { useGlobalZIndex } from '../composables/use-global-z-index'

// Components
import { Icon } from '../icon'
import { Overlay } from '../overlay'
import { popupSharedProps } from './shared'

// Types
import type { PopupCloseIconPosition, PopupPosition } from './types'

const props = defineProps(extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp<PopupPosition>('center'),
  closeIcon: makeStringProp('cross'),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-right'),
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean,
}))
const emit = defineEmits([
  'open',
  'close',
  'opened',
  'closed',
  'keydown',
  'update:show',
  'clickOverlay',
  'clickCloseIcon',
])

let opened: boolean
let shouldReopen: boolean

const zIndex = ref<number>()
const popupRef = ref<HTMLElement>()
const [name, bem] = createNamespace('popup')

const lazyRender = useLazyRender(() => props.show || !props.lazyRender)

const style = computed(() => {
  const style: CSSProperties = {
    zIndex: zIndex.value,
  }

  if (isDef(props.duration)) {
    const key
          = props.position === 'center'
            ? 'animationDuration'
            : 'transitionDuration'
    style[key] = `${props.duration}s`
  }

  return style
})

function open() {
  if (!opened) {
    opened = true

    zIndex.value
          = props.zIndex !== undefined ? +props.zIndex : useGlobalZIndex()

    emit('open')
  }
}

function close() {
  if (opened) {
    callInterceptor(props.beforeClose, {
      done() {
        opened = false
        emit('close')
        emit('update:show', false)
      },
    })
  }
}

function onClickOverlay(event: MouseEvent) {
  emit('clickOverlay', event)

  if (props.closeOnClickOverlay)
    close()
}

function onClickCloseIcon(event: MouseEvent) {
  emit('clickCloseIcon', event)
  close()
}

// see: https://github.com/youzan/vant/issues/11901
let timer: ReturnType<typeof setTimeout> | null
function onOpened() {
  if (timer)
    clearTimeout(timer)
  timer = setTimeout(() => {
    emit('opened')
  })
}
const onClosed = () => emit('closed')
const onKeydown = (event: KeyboardEvent) => emit('keydown', event)

watch(
  () => props.show,
  (show) => {
    if (show && !opened)
      open()

    // if (attrs.tabindex === 0) {
    //   nextTick(() => {
    //     popupRef.value?.focus()
    //   })
    // }

    if (!show && opened) {
      opened = false
      emit('close')
    }
  },
)

useExpose({ popupRef })

useLockScroll(popupRef, () => props.show && props.lockScroll)

useEventListener('popstate', () => {
  if (props.closeOnPopstate) {
    close()
    shouldReopen = false
  }
})

onMounted(() => {
  if (props.show)
    open()
})

onActivated(() => {
  if (shouldReopen) {
    emit('update:show', true)
    shouldReopen = false
  }
})

onDeactivated(() => {
  // teleported popup should be closed when deactivated
  if (props.show && props.teleport) {
    close()
    shouldReopen = true
  }
})

provide(POPUP_TOGGLE_KEY, () => props.show)
</script>

<template>
  <Overlay v-if="props.overlay" :show="props.show" :class="props.overlayClass" :z-index="zIndex" :duration="props.duration" :custom-style="props.overlayStyle" :role="props.closeOnClickOverlay ? 'button' : undefined" :tabindex="props.closeOnClickOverlay ? 0 : undefined" @click="onClickOverlay">
    <slot name="overlay-content" />
  </Overlay>

  <view
    v-show="props.show"
    ref="popupRef" :style="style"
    role="dialog" :tabindex="0"
    :class="[
      bem({
        round,
        [position]: position,
      }),
      {
        'van-safe-area-top': safeAreaInsetTop,
        'van-safe-area-bottom': safeAreaInsetBottom,
      },
    ]"
    @keydown="onKeydown"
  >
    <slot />
    <Icon
      v-if="props.closeable"
      role="button"
      :tabindex="0"
      :name="props.closeIcon"
      :class="[
        bem('close-icon', props.closeIconPosition),
        HAPTICS_FEEDBACK,
      ]"
      :class-prefix="props.iconPrefix"
      @click="onClickCloseIcon"
    />
  </view>
</template>
