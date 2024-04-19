<script lang="ts" setup>
import './index.less'
import {
  type CSSProperties,
  type ImgHTMLAttributes,
  type PropType,
  computed,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useSlots,
  watch,
} from 'vue'

// Utils
import {
  addUnit,
  createNamespace,
  inBrowser,
  isDef,
  makeStringProp,
  numericProp,
  truthProp,
} from '../utils'

// Components
import { Icon } from '../icon'

// Types
import type { ImageFit, ImagePosition } from './types'

const props = defineProps({
  src: String,
  alt: String,
  fit: String as PropType<ImageFit>,
  position: String as PropType<ImagePosition>,
  round: Boolean,
  block: Boolean,
  width: numericProp,
  height: numericProp,
  radius: numericProp,
  lazyLoad: Boolean,
  iconSize: numericProp,
  showError: truthProp,
  errorIcon: makeStringProp('photo-fail'),
  iconPrefix: String,
  showLoading: truthProp,
  loadingIcon: makeStringProp('photo'),
  crossorigin: String as PropType<ImgHTMLAttributes['crossorigin']>,
  referrerpolicy: String as PropType<ImgHTMLAttributes['referrerpolicy']>,
})
const emit = defineEmits(['load', 'error'])
const [name, bem] = createNamespace('image')
const error = ref(false)
const loading = ref(true)
const imageRef = ref<HTMLImageElement>()

const { $Lazyload } = getCurrentInstance()!.proxy!
const style = computed(() => {
  const style: CSSProperties = {
    width: addUnit(props.width),
    height: addUnit(props.height),
  }

  if (isDef(props.radius)) {
    style.overflow = 'hidden'
    style.borderRadius = addUnit(props.radius)
  }

  return style
})

watch(
  () => props.src,
  () => {
    error.value = false
    loading.value = true
  },
)

function onLoad(event: Event) {
  if (loading.value) {
    loading.value = false
    emit('load', event)
  }
}

function triggerLoad() {
  const loadEvent = new Event('load')
  Object.defineProperty(loadEvent, 'target', {
    value: imageRef.value,
    enumerable: true,
  })
  onLoad(loadEvent)
}

function onError(event?: Event) {
  error.value = true
  loading.value = false
  emit('error', event)
}

function onLazyLoaded({ el }: { el: HTMLElement }) {
  const check = () => {
    if (el === imageRef.value && loading.value)
      triggerLoad()
  }
  if (imageRef.value) {
    check()
  }
  else {
    // LazyLoad may trigger loaded event before Image mounted
    // https://github.com/vant-ui/vant/issues/10046
    nextTick(check)
  }
}

function onLazyLoadError({ el }: { el: HTMLElement }) {
  if (el === imageRef.value && !error.value)
    onError()
}

if ($Lazyload && inBrowser) {
  $Lazyload.$on('loaded', onLazyLoaded)
  $Lazyload.$on('error', onLazyLoadError)

  onBeforeUnmount(() => {
    $Lazyload.$off('loaded', onLazyLoaded)
    $Lazyload.$off('error', onLazyLoadError)
  })
}

// In nuxt3, the image may not trigger load event,
// so the initial complete state should be checked.
// https://github.com/youzan/vant/issues/11335
onMounted(() => {
  nextTick(() => {
    if (imageRef.value?.complete && !props.lazyLoad)
      triggerLoad()
  })
})

const imageAttrs = computed(() => {
  return {
    alt: props.alt,
    class: bem('img'),
    style: {
      objectFit: props.fit,
      objectPosition: props.position,
    },
    crossorigin: props.crossorigin,
    referrerpolicy: props.referrerpolicy,
  }
})
const slots = useSlots()
</script>

<template>
  <view :class="bem({ round: props.round, block: props.block })" :style="style">
    <template v-if="!error && src">
      <!-- <image v-if="lazyLoad" ref="imageRef" v-lazy="src" v-bind="imageAttrs" /> -->
      <image
        v-if="lazyLoad"
        ref="imageRef"
        :alt="imageAttrs.alt"
        :class="imageAttrs.class"
        :style="imageAttrs.style"
        :crossorigin="imageAttrs.crossorigin"
        :referrerpolicy="imageAttrs.referrerpolicy"
      />
      <image
        v-else ref="imageRef"
        :src="src"
        :alt="imageAttrs.alt"
        :class="imageAttrs.class"
        :style="imageAttrs.style"
        :crossorigin="imageAttrs.crossorigin"
        :referrerpolicy="imageAttrs.referrerpolicy"
        @load="onLoad"
        @error="onError"
      />
    </template>

    <template v-if="loading && showLoading">
      <view :class="bem('loading')">
        <slot v-if="slots.loading" name="loading" />
        <Icon v-else :name="loadingIcon" :size="iconSize" :class="bem('loading-icon')" :class-prefix="iconPrefix" />
      </view>
    </template>

    <template v-if="error && showError">
      <view :class="bem('error')">
        <slot v-if="slots.error" name="error" />
        <Icon v-else :name="errorIcon" :size="iconSize" :class="bem('error-icon')" :class-prefix="iconPrefix" />
      </view>
    </template>

    <slot />
  </view>
</template>
