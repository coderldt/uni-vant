<script lang="ts" setup>
import './index.less'
import { nextTick, onMounted, ref, useAttrs, useSlots } from 'vue'

import { createPopper, offsetModifier } from '@vant/popperjs'
import type { Instance } from '@vant/popperjs'
import Popup from '../popup/Popup.vue'
import { useClickAway } from '../vant-use'
import {
  BORDER_BOTTOM,
  BORDER_RIGHT,
  createNamespace,
} from '../utils'

import type { PopoverAction } from './types'
import { popoverProps } from './types'

const props = defineProps(popoverProps)
const emit = defineEmits<{
  (event: 'select', action: PopoverAction, index: number): void
}>()

const [_, bem] = createNamespace('popover')

const popupRef = ref<HTMLElement>()
const wrapperRef = ref<HTMLElement>()
const popoverRef = ref<InstanceType<typeof Popup> | null>(null)

const attrs = useAttrs()
const slots = useSlots()

const show = ref(false)
let popper: Instance | null

function onClickWrapper() {
  if (props.trigger === 'click')
    show.value = !show.value
}

function onClickAction(action: PopoverAction, index: number) {
  if (action.disabled)
    return

  emit('select', action, index)

  if (props.closeOnClickAction)
    show.value = false
}

function getPopoverOptions() {
  return {
    placement: props.placement,
    modifiers: [
      {
        name: 'computeStyles',
        options: {
          adaptive: false,
          gpuAcceleration: false,
        },
      },
      {
        ...offsetModifier,
        ...{
          options: {
            offset: props.offset,
          },
        },
      },
    ],
  }
}

function createPopperInstance() {
  if (wrapperRef.value && popoverRef.value) {
    return createPopper(
      wrapperRef.value,
      popoverRef.value.popupRef.value,
      getPopoverOptions(),
    )
  }
  return null
}

function updateLocation() {
  nextTick(() => {
    if (!show.value)
      return

    if (!popper)
      popper = createPopperInstance()
    // if (inBrowser) {
    //   window.addEventListener('animationend', updateLocation)
    //   window.addEventListener('transitionend', updateLocation)
    // }

    else
      popper.setOptions(getPopoverOptions())
  })
}

onMounted(() => {
  updateLocation()
  Promise.resolve().then(() => {
    popupRef.value = popoverRef.value?.popupRef.value
  })
})

function onClickAway() {
  if (
    show.value
    && props.closeOnClickOutside
    && (!props.overlay || props.closeOnClickOverlay)
  )
    show.value = false
}

useClickAway([wrapperRef, popupRef], onClickAway, {
  eventName: 'touchstart',
})
</script>

<template>
  <view
    ref="wrapperRef"
    :class="bem('wrapper')"
    @click="onClickWrapper"
  >
    <slot name="reference" />
  </view>
  <Popup
    ref="popoverRef"
    v-model:show="show"
    :class="bem([props.theme])"
    position=""
    transition="van-popover-zoom"
    :lock-scroll="false"
    v-bind="attrs"
    :overlay="overlay"
    :duration="duration"
    :teleport="teleport"
    :overlay-style="overlayStyle"
    :overlay-class="overlayClass"
    :close-on-click-overlay="closeOnClickOverlay"
  >
    <!-- {...useScopeId()} -->
    <view
      v-if="showArrow"
      :class="bem('arrow')"
    />
    <view
      role="menu"
      :class="bem('content', props.actionsDirection)"
    >
      <slot v-if="slots.default" />
      <template v-else>
        <view
          v-for="(item, index) in actions"
          :key="index"
          role="menuitem"
          :class="[
            bem('action', { 'disabled': item.disabled, 'with-icon': item.icon }),
            { [BORDER_RIGHT]: actionsDirection === 'horizontal' },
            item.className,
          ]"
          :style="{ color: item.color }"
          :tabindex="item.disabled ? undefined : 0"
          :aria-disabled="item.disabled || undefined"
          @click="onClickAction(item, index)"
        >
          <slot
            v-if="slots.action"
            name="action"
            :data="item"
            :index="index"
          />
          <template v-else>
            <Icon
              :name="item.icon"
              :class-prefix="iconPrefix"
              :class="bem('action-icon')"
            />
            <div :class="[bem('action-text'), { [BORDER_BOTTOM]: props.actionsDirection === 'vertical' }]">
              {{ item.text }}
            </div>
          </template>
        </view>
      </template>
    </view>
  </Popup>
</template>
