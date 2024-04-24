import type { ExtractPropTypes, PropType } from 'vue'
import { makeRequiredProp, makeStringProp, truthProp } from '../utils'

export interface HighlightThemeVars {
  highlightTagColor?: string
}

export const highlightProps = {
  autoEscape: truthProp,
  caseSensitive: Boolean,
  highlightClass: String,
  highlightTag: makeStringProp<keyof HTMLElementTagNameMap>('span'),
  keywords: makeRequiredProp<PropType<string | string[]>>([String, Array]),
  sourceString: makeStringProp(''),
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  unhighlightClass: String,
  unhighlightTag: makeStringProp<keyof HTMLElementTagNameMap>('span'),
}

export type HighlightProps = ExtractPropTypes<typeof highlightProps>
