import {
  type ExtractPropTypes,
  type PropType,
} from 'vue'
import {
  extend,
  makeStringProp,
  numericProp,
} from '../utils'
import type { LoadingType } from '../loading'
import type {
  ButtonIconPosition,
  ButtonNativeType,
  ButtonSize,
  ButtonType,
} from './types'

import Button from './Button.vue'

export default Button

// export const Button = withInstall(_Button);
export const buttonProps = extend({}, {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('button'),
  text: String,
  icon: String,
  type: makeStringProp<ButtonType>('default'),
  size: makeStringProp<ButtonSize>('normal'),
  color: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  iconPrefix: String,
  nativeType: makeStringProp<ButtonNativeType>('button'),
  loadingSize: numericProp,
  loadingText: String,
  loadingType: String as PropType<LoadingType>,
  iconPosition: makeStringProp<ButtonIconPosition>('left'),
})

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type {
  ButtonType,
  ButtonSize,
  ButtonThemeVars,
  ButtonNativeType,
  ButtonIconPosition,
} from './types'
