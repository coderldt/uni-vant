import _Col from './Col.vue'

export const Col = _Col
export default Col

declare module 'vue' {
  export interface GlobalComponents {
    VanCol: typeof Col
  }
}
