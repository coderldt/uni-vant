<script lang="ts" setup>
import { type PropType, computed, useSlots } from 'vue'

// Utils
import {
  type Interceptor,
  type Numeric,
  callInterceptor,
  extend,
  getSizeStyle,
  isDef,
  makeRequiredProp,
  numericProp,
} from '../utils'

// Components
import { Icon } from '../icon'
import type { ImageFit } from '../image'
import { Image } from '../image'
import { Loading } from '../loading'
import { bem, isImageFile, t } from './utils'

// Types
import type { UploaderFileListItem } from './types'

const props = defineProps({
  name: numericProp,
  item: makeRequiredProp<PropType<UploaderFileListItem>>(Object),
  index: Number,
  imageFit: String as PropType<ImageFit>,
  lazyLoad: Boolean,
  deletable: Boolean,
  reupload: Boolean,
  previewSize: [Number, String, Array] as PropType<
      Numeric | [Numeric, Numeric]
    >,
  beforeDelete: Function as PropType<Interceptor>,
})
const emit = defineEmits(['delete', 'preview', 'reupload'])

function onDelete(event: MouseEvent) {
  const { name, item, index, beforeDelete } = props
  event.stopPropagation()
  callInterceptor(beforeDelete, {
    args: [item, { name, index }],
    done: () => emit('delete'),
  })
}

const onPreview = () => emit('preview')

const onReupload = () => emit('reupload')
const slots = useSlots()
const itemStatus = computed(() => props.item.status)
const itemMessage = computed(() => props.item.message)
</script>

<template>
  <view :class="bem('preview')">
    <template v-if="isImageFile(props.item)">
      <Image :fit="props.imageFit" :src="props.item.objectUrl || props.item.content || props.item.url" :class="bem('preview-image')" :width="Array.isArray(previewSize) ? previewSize[0] : previewSize" :height="Array.isArray(previewSize) ? previewSize[0] : previewSize" :lazy-load="lazyLoad" @click="reupload ? onReupload : onPreview">
        <template v-if="slots['preview-cover']">
          <view :class="bem('preview-cover')">
            <slot name="preview-cover" :item="extend({ index }, item)" />
          </view>
        </template>
      </Image>
    </template>
    <template v-else>
      <view :class="bem('file')" :style="getSizeStyle(props.previewSize)">
        <Icon :class="bem('file-icon')" name="description" />
        <view class="van-ellipsis" :class="[bem('file-name')]">
          {{ item.file ? item.file.name : item.url }}
        </view>
        <template v-if="slots['preview-cover']">
          <view :class="bem('preview-cover')">
            <slot name="preview-cover" :item="extend({ index }, item)" />
          </view>
        </template>
      </view>
    </template>

    <template v-if="['uploading', 'failed'].includes(itemStatus as string)">
      <view :class="bem('mask')">
        <Icon v-if="itemStatus === 'failed'" name="close" :class="bem('mask-icon')" />
        <Loading v-else :class="bem('loading')" />
        <template v-if="isDef(itemMessage) && itemMessage !== ''">
          <view :class="bem('mask-message')">
            {{ itemMessage }}
          </view>
        </template>
      </view>
    </template>

    <template v-if="props.deletable && itemStatus !== 'uploading'">
      <view role="button" :class="bem('preview-delete', { shadow: !slots['preview-delete'] })" :tabindex="0" :aria-label="t('delete')" @click="onDelete">
        <template v-if="slots['preview-delete']">
          <slot name="preview-delete" />
        </template>
        <Icon v-else name="cross" :class="bem('preview-delete-icon')" />
      </view>
    </template>
  </view>
</template>
