import _Highlight from './Highlight.vue'

export const Highlight = _Highlight
export default Highlight

export { highlightProps } from './types'
export type { HighlightThemeVars, HighlightProps } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    vanHighlight: typeof Highlight
  }
}
