import { withInstall,   extend,
  numericProp,
  preventDefault,
  makeStringProp,
  createNamespace,
  BORDER_SURROUND, } from '../utils';
import _Button from './Button.vue';
import {
  ButtonSize,
  ButtonType,
  ButtonNativeType,
  ButtonIconPosition,
} from './types';
import {
  defineComponent,
  useSlots,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';
import { Loading, LoadingType } from '../loading';
export const Button = withInstall(_Button);
export default Button;
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
});

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;
export type {
  ButtonType,
  ButtonSize,
  ButtonThemeVars,
  ButtonNativeType,
  ButtonIconPosition,
} from './types';
