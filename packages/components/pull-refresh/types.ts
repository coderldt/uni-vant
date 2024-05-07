import type { ExtractPropTypes } from 'vue'
import { makeStringProp } from '../utils'

export interface PullRefreshThemeVars {
  pullRefreshHeadHeight?: string
  pullRefreshHeadFontSize?: string
  pullRefreshHeadTextColor?: string
  pullRefreshLoadingIconSize?: string
}

export const pullRefreshProps = {
  disabled: Boolean,
  modelValue: Boolean,
  loadingText: makeStringProp('加载中...'),
}

export type PullRefreshProps = ExtractPropTypes<typeof pullRefreshProps>
