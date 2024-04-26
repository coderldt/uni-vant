<script lang="ts">
import './index.less'
import { onMounted, ref, watch } from 'vue'
import { createNamespace, makeRequiredProp, numericProp } from '../utils'
import type { SwipeInstance } from '../swipe'
import Swipe from '../swipe/Swipe.vue'
import { useExpose } from '../composables/use-expose'

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps({
  count: makeRequiredProp(Number),
  inited: Boolean,
  animated: Boolean,
  duration: makeRequiredProp(numericProp),
  swipeable: Boolean,
  lazyRender: Boolean,
  currentIndex: makeRequiredProp(Number),
})
const emit = defineEmits(['change'])
const [name, bem] = createNamespace('tabs')
const swipeRef = ref<SwipeInstance>()

const onChange = (index: number) => emit('change', index)

function swipeToCurrentTab(index: number) {
  const swipe = swipeRef.value
  if (swipe && swipe.state.active !== index)
    swipe.swipeTo(index, { immediate: !props.inited })
}

watch(() => props.currentIndex, swipeToCurrentTab)

onMounted(() => {
  swipeToCurrentTab(props.currentIndex)
})

useExpose({ swipeRef })
</script>

<template>
  <view
    :class="bem('content', {
      animated: props.animated || props.swipeable,
    })"
  >
    <template v-if="props.animated || props.swipeable">
      <Swipe
        ref="swipeRef"
        :loop="false"
        :class="bem('track')"
        :duration="+props.duration * 1000"
        :touchable="props.swipeable"
        :lazy-render="props.lazyRender"
        :show-indicators="false"
        @change="onChange"
      >
        <slot />
      </Swipe>
    </template>
    <slot v-else />
  </view>
</template>
