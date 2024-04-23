<script setup lang="ts">
import './index.less'
import { useSlots } from 'vue'
import { createNamespace, getSizeStyle } from '../utils'
import Error from './assets/error.png'
import Network from './assets/network.png'
import Search from './assets/search.png'
import Default from './assets/default.png'

import { emptyProps } from './types'

const props = defineProps(emptyProps)

const [name, bem] = createNamespace('empty')

const slot = useSlots()

const PRESET_IMAGES: Record<string, string> = {
  error: Error,
  search: Search,
  network: Network,
  default: Default,
}
</script>

<template>
  <view :class="bem()">
    <view
      :class="bem('image')"
      :style="getSizeStyle(props.imageSize)"
    >
      <!-- Image -->
      <slot
        v-if="slot.image"
        name="image"
      />
      <image
        v-else
        :src="PRESET_IMAGES[image] || props.image"
      />
    </view>
    <!-- Description -->
    <view
      v-if="slot.description || description"
      :class="bem('description')"
    >
      <slot
        v-if="slot.description"
        name="description"
      />
      <template v-else-if="description">
        {{ description }}
      </template>
    </view>
    <!-- Button -->
    <view
      v-if="slot.default"
      :class="bem('bottom')"
    >
      <slot />
    </view>
  </view>
</template>
