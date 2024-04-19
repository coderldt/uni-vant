import _Circle from './Circle.vue'

export const Circle = _Circle
export default Circle

export { type CircleProps, type CircleThemeVars } from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanCircle: typeof Circle
  }
}
