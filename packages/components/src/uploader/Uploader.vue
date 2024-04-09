<script lang="ts" setup>
import './index.less'
import {
  type PropType,
  computed,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  useSlots,
} from 'vue'

// Utils
import { useCustomFieldValue } from '@vant/use'
import {
  // extend,
  getSizeStyle,
  isPromise,
  makeArrayProp,
  makeNumericProp,
  makeStringProp,
  toArray,
  truthProp,
} from '../utils'
import type {
  // ComponentInstance,
  Interceptor,
  Numeric,
} from '../utils'

// Composables
import { useExpose } from '../composables/use-expose'

// Components
import { Icon } from '../icon'
import { type ImagePreviewOptions } from '../image-preview'
import type { ImageFit } from '../image'
import RenderPreviewItem from './RenderPreviewItem.vue'

// Types
import {
  bem,
  filterFiles,
  isImageFile,
  isOversize,
  readFileContent,
} from './utils'
import type {
  UploaderAfterRead,
  UploaderBeforeRead,
  UploaderExpose,
  UploaderFileListItem,
  UploaderMaxSize,
  UploaderResultType,
} from './types'

const props = defineProps({
  name: makeNumericProp(''),
  accept: makeStringProp('image/*'),
  capture: String,
  multiple: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  lazyLoad: Boolean,
  maxCount: makeNumericProp(Number.POSITIVE_INFINITY),
  imageFit: makeStringProp<ImageFit>('cover'),
  resultType: makeStringProp<UploaderResultType>('dataUrl'),
  uploadIcon: makeStringProp('photograph'),
  uploadText: String,
  deletable: truthProp,
  reupload: Boolean,
  afterRead: Function as PropType<UploaderAfterRead>,
  showUpload: truthProp,
  modelValue: makeArrayProp<UploaderFileListItem>(),
  beforeRead: Function as PropType<UploaderBeforeRead>,
  beforeDelete: Function as PropType<Interceptor>,
  previewSize: [Number, String, Array] as PropType<
    Numeric | [Numeric, Numeric]
  >,
  previewImage: truthProp,
  previewOptions: Object as PropType<Partial<ImagePreviewOptions>>,
  previewFullImage: truthProp,
  maxSize: {
    type: [Number, String, Function] as PropType<UploaderMaxSize>,
    default: Number.POSITIVE_INFINITY,
  },
})

const emit = defineEmits([
  'delete',
  'oversize',
  'clickUpload',
  'closePreview',
  'clickPreview',
  'clickReupload',
  'update:modelValue',
])

const inputRef = ref()
const urls: string[] = []
const reuploadIndex = ref(-1)
const isReuploading = ref(false)

function getDetail(index = props.modelValue.length) {
  return {
    name: props.name,
    index,
  }
}

function resetInput() {
  if (inputRef.value)
    inputRef.value.value = ''
}

function onAfterRead(items: UploaderFileListItem | UploaderFileListItem[]) {
  resetInput()

  if (isOversize(items, props.maxSize)) {
    if (Array.isArray(items)) {
      const result = filterFiles(items, props.maxSize)
      items = result.valid
      emit('oversize', result.invalid, getDetail())

      if (!items.length)
        return
    }
    else {
      emit('oversize', items, getDetail())
      return
    }
  }
  items = reactive(items)
  if (reuploadIndex.value > -1) {
    const arr = [...props.modelValue]
    arr.splice(reuploadIndex.value, 1, items as UploaderFileListItem)
    emit('update:modelValue', arr)
    reuploadIndex.value = -1
  }
  else {
    emit('update:modelValue', [...props.modelValue, ...toArray(items)])
  }

  if (props.afterRead)
    props.afterRead(items, getDetail())
}

function readFile(files: File | File[]) {
  const { maxCount, modelValue, resultType } = props

  if (Array.isArray(files)) {
    const remainCount = +maxCount - modelValue.length

    if (files.length > remainCount)
      files = files.slice(0, remainCount)

    Promise.all(
      files.map(file => readFileContent(file, resultType)),
    ).then((contents) => {
      const fileList = (files as File[]).map((file, index) => {
        const result: UploaderFileListItem = {
          file,
          status: '',
          message: '',
          objectUrl: URL.createObjectURL(file),
        }

        if (contents[index])
          result.content = contents[index] as string

        return result
      })

      onAfterRead(fileList)
    })
  }
  else {
    readFileContent(files, resultType).then((content) => {
      const result: UploaderFileListItem = {
        file: files as File,
        status: '',
        message: '',
        objectUrl: URL.createObjectURL(files as File),
      }

      if (content)
        result.content = content

      onAfterRead(result)
    })
  }
}

function onChange(event: Event) {
  const { files } = event.target as HTMLInputElement

  if (props.disabled || !files || !files.length)
    return

  const file
        = files.length === 1 ? files[0] : ([].slice.call(files) as File[])

  if (props.beforeRead) {
    const response = props.beforeRead(file, getDetail())

    if (!response) {
      resetInput()
      return
    }

    if (isPromise(response)) {
      response
        .then((data) => {
          if (data)
            readFile(data)
          else
            readFile(file)
        })
        .catch(resetInput)
      return
    }
  }

  readFile(file)
}

// let imagePreview: ComponentInstance | undefined

const onClosePreview = () => emit('closePreview')

function previewImage(item: UploaderFileListItem) {
  if (props.previewFullImage) {
    const imageFiles = props.modelValue.filter(isImageFile)
    const images = imageFiles
      .map((item) => {
        if (item.objectUrl && !item.url && item.status !== 'failed') {
          item.url = item.objectUrl
          urls.push(item.url)
        }
        return item.url
      })
      .filter(Boolean) as string[]

    uni.previewImage({ urls: images })
    // imagePreview = showImagePreview(
    //   extend(
    //     {
    //       images,
    //       startPosition: imageFiles.indexOf(item),
    //       onClose: onClosePreview,
    //     },
    //     props.previewOptions,
    //   ),
    // )
  }
}

function closeImagePreview() {
  // if (imagePreview)
  //   imagePreview.close()
  uni.closePreviewImage()
}

function deleteFile(item: UploaderFileListItem, index: number) {
  const fileList = props.modelValue.slice(0)
  fileList.splice(index, 1)

  emit('update:modelValue', fileList)
  emit('delete', item, getDetail(index))
}

function chooseFile() {
  if (inputRef.value && !props.disabled)
    inputRef.value.click()
}

function reuploadImage(index: number) {
  isReuploading.value = true
  reuploadIndex.value = index
  nextTick(() => chooseFile())
}
function onInputClick() {
  if (!isReuploading.value)
    reuploadIndex.value = -1

  isReuploading.value = false
}

const onClickUpload = (event: MouseEvent) => emit('clickUpload', event)
onBeforeUnmount(() => {
  urls.forEach(url => URL.revokeObjectURL(url))
})

useExpose<UploaderExpose>({
  chooseFile,
  closeImagePreview,
})
useCustomFieldValue(() => props.modelValue)

const hideUploader = computed(() => props.modelValue.length >= +props.maxCount && props.reupload)
const slots = useSlots()
</script>

<template>
  <view :class="bem()">
    <view :class="bem('wrapper', { disabled })">
      <template v-if="props.previewImage">
        <template v-for="(item, index) in props.modelValue" :key="item.url">
          <RenderPreviewItem
            :item="item"
            :index="index"
            :parent-props="props"
            :delete-file="deleteFile"
            :preview-image="previewImage"
            :reupload-image="reuploadImage"
            @click-uploader-file-list-item="() => {
              emit(
                props.reupload ? 'clickReupload' : 'clickPreview',
                item,
                getDetail(index),
              )
            }"
          >
            <template #preview-cover>
              <slot v-if="slots['preview-cover']" name="preview-cover" />
            </template>
            <template v-if="slots['preview-delete']">
              <slot v-if="slots['preview-delete']" name="preview-delete" />
            </template>
          </RenderPreviewItem>
        </template>
      </template>

      <template v-if="!(props.modelValue.length >= +props.maxCount && !props.reupload)">
        <template v-if="slots.default">
          <view v-show="!hideUploader" :class="bem('input-wrapper')" @click="onClickUpload">
            <slot />
            <template v-if="!props.readonly">
              <input ref="inputRef" type="file" :class="bem('input')" :accept="props.accept" :capture="props.capture as unknown as boolean" :multiple="props.multiple && reuploadIndex === -1" :disabled="props.disabled" @change="onChange" @click="onInputClick">
            </template>
          </view>
        </template>
        <template v-else>
          <view v-show="props.showUpload && !hideUploader" :class="bem('upload', { readonly: props.readonly })" :style="getSizeStyle(props.previewSize)" @click="onClickUpload">
            <Icon :name="props.uploadIcon" :class="bem('upload-icon')" />
            <template v-if="props.uploadText">
              <text :class="bem('upload-text')">
                {{ props.uploadText }}
              </text>
            </template>
            <template v-if="!props.readonly">
              <input ref="inputRef" type="file" :class="bem('input')" :accept="props.accept" :capture="props.capture as unknown as boolean" :multiple="props.multiple && reuploadIndex === -1" :disabled="props.disabled" @change="onChange" @click="onInputClick">
            </template>
          </view>
        </template>
      </template>
    </view>
  </view>
</template>
