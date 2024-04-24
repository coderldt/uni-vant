<script setup lang="ts">
import './index.less'
import { computed, ref, useSlots, watch } from 'vue'
import { createNamespace } from '../utils'
import Loading from '../loading/Loading.vue'
import { listProps } from './types'

const props = defineProps(listProps)

const emit = defineEmits<{
  (event: 'load'): void
  (event: 'update:error', val: boolean): void
  (event: 'update:loading', val: boolean): void
  (event: 'update:refresherTriggered', val: boolean): void
  (event: 'onRefresherChange'): void
}>()

const [_, bem, t] = createNamespace('list')

const slot = useSlots()

const loading = computed({
  get() {
    return props.loading
  },
  set: (val) => {
    emit('update:loading', val)
  },
})

const refresherTriggered = ref(props.refresherTriggered)

watch(
  () => props.refresherTriggered,
  (val) => {
    refresherTriggered.value = val
  },
)

// TODO 1. 无立即immediateCheck 2. Expose check

function clickErrorText() {
  emit('update:error', false)
}

function handleScrollLower() {
  // 禁用滚动加载
  if (props.disabled)
    return

  // 数据加载结束
  if (props.finished)
    return

  // 正在加载
  if (loading.value)
    return

  loading.value = true
  emit('update:loading', true)

  emit('load')
}

function handlerEfresherpulling() {
  // 正在加载
  if (refresherTriggered.value)
    return

  refresherTriggered.value = true
  emit('update:refresherTriggered', true)
  emit('onRefresherChange')
}
</script>

<template>
  <scroll-view
    :class="bem()"
    :lower-threshold="offset"
    refresher-default-style="none"
    :refresher-enabled="refresher"
    :refresher-triggered="refresherTriggered"
    scroll-y="true"
    class="scroll-Y"
    @scrolltolower="handleScrollLower"
    @refresherpulling="handlerEfresherpulling"
  >
    <template #refresher>
      <view :class="bem('refrensh-text')">
        <slot name="refrenshLoading">
          <Loading
            :size="20"
            :class="bem('loading')"
          >
            加载中...
          </Loading>
        </slot>
      </view>
    </template>
    <slot />

    <!-- loading -->
    <view
      v-if="loading && !finished && !disabled"
      :class="bem('loading')"
    >
      <slot name="loading">
        <Loading
          :size="20"
          :class="bem('loading-icon')"
        >
          {{ loadingText || t('loading') }}
        </Loading>
      </slot>
    </view>

    <!-- Finished -->
    <view
      v-if="finished"
      :class="bem('finished-text')"
    >
      <slot name="finished">
        {{ finishedText }}
      </slot>
    </view>

    <!-- error -->
    <view
      v-if="error"
      :class="bem('error-text')"
      @click="clickErrorText"
    >
      <slot name="error">
        {{ errorText }}
      </slot>
    </view>
  </scroll-view>
</template>
