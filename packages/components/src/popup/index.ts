import _Popup from './Popup.vue'

export const Popup = _Popup
export default Popup
export type {
  PopupPosition,
  PopupInstance,
  PopupThemeVars,
  PopupCloseIconPosition,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanPopup: typeof Popup
  }
}
