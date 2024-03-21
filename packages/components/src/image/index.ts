import _Image from './Image.vue'

export const Image = _Image
export default Image
export type { ImageFit, ImagePosition, ImageThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanImage: typeof Image
  }
}
