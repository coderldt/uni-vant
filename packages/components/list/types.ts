import type { ComponentPublicInstance, ExtractPropTypes } from 'vue'
import { makeNumericProp } from '../utils'

export type ListInstance = ComponentPublicInstance<ListProps>

export interface ListThemeVars {
  listTextColor?: string
  listTextFontSize?: string
  listTextLineHeight?: number | string
  listLoadingIconSize?: string
}

export const listProps = {
  error: Boolean,
  offset: makeNumericProp(50),
  loading: Boolean,
  disabled: Boolean,
  finished: Boolean,
  refresher: Boolean,
  refresherTriggered: Boolean,
  errorText: String,
  loadingText: String,
  finishedText: String,
}

export type ListProps = ExtractPropTypes<typeof listProps>
