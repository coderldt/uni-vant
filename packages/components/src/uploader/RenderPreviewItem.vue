<script lang="ts" setup>
import { useSlots } from 'vue'
import { extend, pick } from '../utils'
import type { UploaderFileListItem } from './types'
import UploaderPreviewItem from './UploaderPreviewItem.vue'

const props = defineProps<{
  item: UploaderFileListItem & { name?: string; lazyLoad?: boolean }
  index: number
  parentProps: any // TODO parentProps 类型
  deleteFile: any
  previewImage: any
  reuploadImage: any
}>()
const emit = defineEmits(['click-uploader-file-list-item'])
const slots = useSlots()

const needPickData = [
  'imageFit',
  'deletable',
  'reupload',
  'previewSize',
  'beforeDelete',
  'name',
  'lazyLoad',
] as const

const previewData = extend(
  pick(props.parentProps, needPickData),
  pick(props.item, needPickData, true),
)
</script>

<template>
  <UploaderPreviewItem
    :item="item"
    :index="index"
    :name="previewData.name"
    :lazy-load="previewData.lazyLoad"
    :image-fit="previewData.imageFit"
    :deletable="previewData.deletable"
    :reupload="previewData.reupload"
    :preview-size="previewData.previewSize"
    :before-delete="previewData.beforeDelete"
    @click="() => { emit('click-uploader-file-list-item') }"
    @delete="() => deleteFile(item, index)"
    @preview="() => previewImage(item)"
    @reupload="() => reuploadImage(index)"
  >
    <template #preview-cover>
      <slot v-if="slots['preview-cover']" name="preview-cover" />
    </template>
    <template v-if="slots['preview-delete']">
      <slot v-if="slots['preview-delete']" name="preview-delete" />
    </template>
  </UploaderPreviewItem>
</template>
