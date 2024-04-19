<script lang="ts" setup>
import {
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
  type TeleportProps,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'

// Utils
import { useRect } from '@vant/use'
import type { Interceptor } from '../utils'
import {
  HAPTICS_FEEDBACK,
  callInterceptor,
  createNamespace,
  makeArrayProp,
  makeNumericProp,
  makeStringProp,
  pick,
  truthProp,
  unknownProp,
  windowHeight,
  windowWidth,
} from '../utils'

// Composables
import { useExpose } from '../composables/use-expose'

// Components
import { Icon } from '../icon'
import type { SwipeInstance, SwipeToOptions } from '../swipe'
import { Swipe } from '../swipe'
import type { PopupCloseIconPosition } from '../popup'
import { Popup } from '../popup'
import ImagePreviewItem from './ImagePreviewItem'

// Types
import type {
  ImagePreviewItemInstance,
  ImagePreviewScaleEventParams,
} from './types'

const [name, bem] = createNamespace('image-preview')

const popupProps = [
  'show',
  'teleport',
  'transition',
  'overlayStyle',
  'closeOnPopstate',
] as const

const props = defineProps({
  show: Boolean,
  loop: truthProp,
  images: makeArrayProp<string>(),
  minZoom: makeNumericProp(1 / 3),
  maxZoom: makeNumericProp(3),
  overlay: truthProp,
  closeable: Boolean,
  showIndex: truthProp,
  className: unknownProp,
  closeIcon: makeStringProp('clear'),
  transition: String,
  beforeClose: Function as PropType<Interceptor>,
  doubleScale: truthProp,
  overlayClass: unknownProp,
  overlayStyle: Object as PropType<CSSProperties>,
  swipeDuration: makeNumericProp(300),
  startPosition: makeNumericProp(0),
  showIndicators: Boolean,
  closeOnPopstate: truthProp,
  closeOnClickImage: truthProp,
  closeOnClickOverlay: truthProp,
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-right'),
  teleport: [String, Object] as PropType<TeleportProps['to']>,
})
const emit = defineEmits(['scale', 'close', 'closed', 'change', 'longPress', 'update:show'])

const swipeRef = ref<SwipeInstance>()
    const activedPreviewItemRef = ref<ImagePreviewItemInstance>()

    const state = reactive({
      active: 0,
      rootWidth: 0,
      rootHeight: 0,
      disableZoom: false,
    })

    const resize = () => {
      if (swipeRef.value) {
        const rect = useRect(swipeRef.value.$el)
        state.rootWidth = rect.width
        state.rootHeight = rect.height
        swipeRef.value.resize()
      }
    }

    const emitScale = (args: ImagePreviewScaleEventParams) =>
      emit('scale', args)

    const updateShow = (show: boolean) => emit('update:show', show)

    const emitClose = () => {
      callInterceptor(props.beforeClose, {
        args: [state.active],
        done: () => updateShow(false),
      })
    }

    const setActive = (active: number) => {
      if (active !== state.active) {
        state.active = active
        emit('change', active)
      }
    }

    const onDragStart = () => {
      state.disableZoom = true
    }

    const onDragEnd = () => {
      state.disableZoom = false
    }

    const swipeTo = (index: number, options?: SwipeToOptions) =>
      swipeRef.value?.swipeTo(index, options)

    useExpose({
      resetScale: () => {
        activedPreviewItemRef.value?.resetScale()
      },
      swipeTo,
    })

    onMounted(resize)

watch([windowWidth, windowHeight], resize)

watch(
  () => props.startPosition,
  value => setActive(+value),
)

watch(
  () => props.show,
  (value) => {
    const { images, startPosition } = props
    if (value) {
      setActive(+startPosition)
      nextTick(() => {
        resize()
        swipeTo(+startPosition, { immediate: true })
      })
    }
    else {
      emit('close', {
        index: state.active,
        url: images[state.active],
      })
    }
  },
)
</script>

<template>
  <Popup :class="[bem(), props.className]" :overlay-class="[bem('overlay'), props.overlayClass]"></Popup>
</template>