import _CountDown from './CountDown.vue'

export const CountDown = _CountDown
export default CountDown

export { countDownProps } from './types'
export type {
  CountDownInstance,
  CountDownThemeVars,
  CountDownCurrentTime,
  CountDownProps,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanCountDown: typeof CountDown
  }
}
