<script lang="ts" setup>
import '@vant/icons/src/encode-woff2.less'
import './index.less'
import {
  type PropType,
  computed,
  inject,
} from 'vue'
import {
  addUnit,
  createNamespace,
  makeStringProp,
  numericProp,
} from '../utils'
import { Badge } from '../badge'

import { CONFIG_PROVIDER_KEY } from '../config-provider'

const props = defineProps({
  dot: Boolean,
  tag: makeStringProp<keyof HTMLElementTagNameMap>('i'),
  name: String,
  size: numericProp,
  badge: numericProp,
  color: String,
  // TODO badgeProps
  badgeProps: Object as PropType<Partial<any>>,
  classPrefix: String,
})

const [name, bem] = createNamespace('icon')

const isImage = (name?: string) => name?.includes('/')

const config = inject(CONFIG_PROVIDER_KEY, null)

const classPrefix = computed(
  () => props.classPrefix || config?.iconPrefix || bem(),
)
const isImageIcon = isImage(props.name)
</script>

<template>
  <Badge
    :dot="dot"
    :tag="tag"
    :class="[
      classPrefix,
      isImageIcon ? '' : `${classPrefix}-${props.name}`,
    ]"
    :style="{
      color,
      fontSize: addUnit(size),
    }"
    :content="badge"
    :max="badgeProps?.max"
    :color="badgeProps?.color"
    :offset="badgeProps?.offset"
    :show-zero="badgeProps?.showZero"
    :position="badgeProps?.position"
  >
    <slot />
    <template v-if="isImageIcon">
      <image :class="bem('image')" :src="name" />
    </template>
  </Badge>
</template>
