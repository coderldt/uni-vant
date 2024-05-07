<script lang="ts" setup>
import './index.less'
import { computed, ref, useSlots } from 'vue'
import Icon from '../icon/Icon.vue'

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
  (event: 'update:show', value: boolean): void
}>()

const [_, bem] = createNamespace('popover')

const wrapperRef = ref<HTMLElement>()

const slots = useSlots()

const show = computed({
  get: () => props.show,
  set: (value: boolean) => emit('update:show', value),
})

function onClickWrapper() {
  if (props.trigger === 'click')
    show.value = !show.value
}

function onClickAction(action: PopoverAction, index: number) {
  if (action.disabled)
    return

  emit('select', action, index)

  if (props.closeOnClickAction)
    show.value = !show.value
}

// 点击外部关闭弹窗
// function onClickAway() {
//   if (
//     show.value
//     && props.closeOnClickOutside
//     && (!props.overlay || props.closeOnClickOverlay)
//   )
//     show.value = false
// }
</script>

<template>
  <view
    ref="wrapperRef"
    :class="bem('wrapper')"
    @click="onClickWrapper"
  >
    <slot name="reference" />
    <view
      v-if="show"
      :class="bem([theme])"
      :data-popper-placement="placement"
    >
      <view
        v-if="showArrow"
        :class="bem('arrow')"
      />
      <view
        role="menu"
        :class="bem('content', actionsDirection)"
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
            @click.stop="onClickAction(item, index)"
          >
            <slot
              v-if="slots.action"
              name="action"
              :data="item"
              :index="index"
            />
            <template v-else>
              <Icon
                v-if="item.icon"
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
    </view>
  </view>
</template>
