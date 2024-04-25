<script setup lang="ts">
import './index.less'
import { ref, watch } from 'vue'
import { createNamespace } from '../utils'
import Loading from '../loading/Loading.vue'
import { pullRefreshProps } from './types'

const props = defineProps(pullRefreshProps)

const emit = defineEmits<{
  (event: 'change'): void
  (event: 'refresh'): void
  (event: 'update:modelValue', val: boolean): void
}>()

const [_, bem] = createNamespace('pull-refresh')

const refresherTriggered = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    refresherTriggered.value = val
  },
)

function handleRefresherpulling() {
  // 正在加载
  if (refresherTriggered.value)
    return

  refresherTriggered.value = true
  emit('update:modelValue', true)
  emit('refresh')
}
</script>

<template>
  <scroll-view
    :class="bem()"
    refresher-default-style="none"
    :refresher-enabled="!disabled"
    :refresher-triggered="refresherTriggered"
    @refresherpulling="handleRefresherpulling"
  >
    <template #refresher>
      <view :class="bem('head')">
        <slot name="refrenshLoading">
          <Loading
            :size="20"
            :class="bem('loading')"
          >
            {{ loadingText }}
          </Loading>
        </slot>
      </view>
    </template>
    <slot />
  </scroll-view>
</template>
