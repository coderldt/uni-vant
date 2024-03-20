import type { ExtractPropTypes, PropType } from 'vue'
import { makeNumberProp, makeNumericProp, makeStringProp, numericProp, truthProp } from '../utils'

export interface CircleThemeVars {
  circleSize?: string
  circleColor?: string
  circleLayerColor?: string
  circleTextColor?: string
  circleTextFontWeight?: string
  circleTextFontSize?: string
  circleTextLineHeight?: number | string
}

export type CircleStartPosition = 'top' | 'right' | 'bottom' | 'left'

export const circleProps = {
  text: String,
  size: numericProp,
  fill: makeStringProp('none'),
  rate: makeNumericProp(100),
  speed: makeNumericProp(0),
  color: [String, Object] as PropType<string | Record<string, string>>,
  clockwise: truthProp,
  layerColor: String,
  currentRate: makeNumberProp(0),
  strokeWidth: makeNumericProp(40),
  strokeLinecap: String as PropType<CanvasLineCap>,
  startPosition: makeStringProp<CircleStartPosition>('top'),
}

export type CircleProps = ExtractPropTypes<typeof circleProps>
