import _Uploader from './Uploader.vue'

export const Uploader = _Uploader
export default Uploader
export type {
  UploaderInstance,
  UploaderThemeVars,
  UploaderResultType,
  UploaderFileListItem,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanUploader: typeof Uploader
  }
}
