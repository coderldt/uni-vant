import type {
  ComponentPublicInstance,
  ExtractPropTypes,
} from 'vue'

import { cellSharedProps } from '../cell'

import {
  extend,
  numericProp,
  truthProp,
} from '../utils'

export interface CollapseItemExpose {
  toggle: (newValue?: boolean) => void
}

export type CollapseItemInstance = ComponentPublicInstance<
  CollapseItemProps,
  CollapseItemExpose
>

export interface CollapseItemThemeVars {
  collapseItemDuration?: string
  collapseItemContentPadding?: string
  collapseItemContentFontSize?: string
  collapseItemContentLineHeight?: number | string
  collapseItemContentTextColor?: string
  collapseItemContentBackground?: string
  collapseItemTitleDisabledColor?: string
}

export const CELL_SLOTS = ['icon', 'title', 'value', 'label', 'right-icon'] as const

export const collapseItemProps = extend({}, cellSharedProps, {
  name: numericProp,
  isLink: truthProp,
  disabled: Boolean,
  readonly: Boolean,
  lazyRender: truthProp,
})

export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>
