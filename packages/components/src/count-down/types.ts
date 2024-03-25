import type { ComponentPublicInstance, ExtractPropTypes } from 'vue'
import type { CurrentTime } from '@vant/use'
import { makeNumericProp, makeStringProp, truthProp } from '../utils'

interface CountDownExpose {
  start: () => void
  pause: () => void
  reset: () => void
}

export type CountDownInstance = ComponentPublicInstance<
  CountDownProps,
  CountDownExpose
>

export type CountDownCurrentTime = CurrentTime

export interface CountDownThemeVars {
  countDownTextColor?: string
  countDownFontSize?: string
  countDownLineHeight?: number | string
}

export const countDownProps = {
  time: makeNumericProp(0),
  format: makeStringProp('HH:mm:ss'),
  autoStart: truthProp,
  millisecond: Boolean,
}

export type CountDownProps = ExtractPropTypes<typeof countDownProps>
