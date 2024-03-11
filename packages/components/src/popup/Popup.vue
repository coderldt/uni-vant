<script lang="ts" setup>
import {
  type CSSProperties,
  type ExtractPropTypes,
  Teleport,
  Transition,
  computed,
  defineComponent,
  nextTick,
  onActivated,
  onDeactivated,
  onMounted,
  provide,
  ref,
  watch,
} from 'vue'

// Utils
import { useEventListener } from '@vant/use'
import {
  HAPTICS_FEEDBACK,
  callInterceptor,
  createNamespace,
  extend,
  isDef,
  makeStringProp,
} from '../utils'

// Composables
import { useExpose } from '../composables/use-expose'
import { useLockScroll } from '../composables/use-lock-scroll'
import { useLazyRender } from '../composables/use-lazy-render'
import { POPUP_TOGGLE_KEY } from '../composables/on-popup-reopen'
import { useGlobalZIndex } from '../composables/use-global-z-index'
import { useScopeId } from '../composables/use-scope-id'

// Components
import { Icon } from '../icon'
import { Overlay } from '../overlay'
import { popupSharedProps } from './shared'

// Types
import type { PopupCloseIconPosition, PopupPosition } from './types'

const props = defineProps(extend({}, popupSharedProps, {
  round: Boolean,
  position: makeStringProp<PopupPosition>('center'),
  closeIcon: makeStringProp('cross'),
  closeable: Boolean,
  transition: String,
  iconPrefix: String,
  closeOnPopstate: Boolean,
  closeIconPosition: makeStringProp<PopupCloseIconPosition>('top-right'),
  safeAreaInsetTop: Boolean,
  safeAreaInsetBottom: Boolean,
}))
</script>