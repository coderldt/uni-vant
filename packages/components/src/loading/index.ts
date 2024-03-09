import { type ExtractPropTypes } from 'vue'
import {
  makeStringProp,
  numericProp,
  withInstall,
} from '../utils'
import _Loading from './Loading.vue'

export const Loading = withInstall(_Loading)
export default Loading
export type { LoadingThemeVars } from './types'
export type LoadingType = 'circular' | 'spinner'

export const loadingProps = {
  size: numericProp,
  type: makeStringProp<LoadingType>('circular'),
  color: String,
  vertical: Boolean,
  textSize: numericProp,
  textColor: String,
}
export type LoadingProps = ExtractPropTypes<typeof loadingProps>

declare module 'vue' {
  export interface GlobalComponents {
    VanLoading: typeof Loading
  }
}
