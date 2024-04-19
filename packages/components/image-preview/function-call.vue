<script lang="ts" setup>
import type { ComponentInstance } from '../utils'
import { extend, inBrowser } from '../utils'
import { mountComponent, usePopupState } from '../utils/mount-component'
import VanImagePreview from './ImagePreview.vue'
import type { ImagePreviewOptions } from './types'

let instance: ComponentInstance

const defaultConfig: ImagePreviewOptions = {
  loop: true,
  images: [],
  maxZoom: 3,
  minZoom: 1 / 3,
  onScale: undefined,
  onClose: undefined,
  onChange: undefined,
  teleport: 'body',
  className: '',
  showIndex: true,
  closeable: false,
  closeIcon: 'clear',
  transition: undefined,
  beforeClose: undefined,
  doubleScale: true,
  overlayStyle: undefined,
  overlayClass: undefined,
  startPosition: 0,
  swipeDuration: 300,
  showIndicators: false,
  closeOnPopstate: true,
  closeOnClickOverlay: true,
  closeIconPosition: 'top-right',
}

const { state, toggle } = usePopupState()
      const onClosed = () => {
        (state as any).images = []
      }
</script>

<template>
  <VanImagePreview :show="state.show" @closed="onClosed" @update:show="toggle" />
</template>
