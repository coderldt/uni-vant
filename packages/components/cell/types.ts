import {
  type CSSProperties,
  type ExtractPropTypes,
  type PropType,
} from 'vue'

// Utils
import {
  extend,
  makeStringProp,
  numericProp,
  truthProp,
  unknownProp,
} from '../utils'

import { routeProps } from '../composables/use-route'

export interface CellThemeVars {
  cellFontSize?: string
  cellLineHeight?: number | string
  cellVerticalPadding?: string
  cellHorizontalPadding?: string
  cellTextColor?: string
  cellBackground?: string
  cellBorderColor?: string
  cellActiveColor?: string
  cellRequiredColor?: string
  cellLabelColor?: string
  cellLabelFontSize?: string
  cellLabelLineHeight?: number | string
  cellLabelMarginTop?: string
  cellValueColor?: string
  cellIconSize?: string
  cellRightIconColor?: string
  cellLargeVerticalPadding?: string
  cellLargeTitleFontSize?: string
  cellLargeLabelFontSize?: string
}

export type CellSize = 'normal' | 'large'

export type CellArrowDirection = 'up' | 'down' | 'left' | 'right'

export const cellSharedProps = {
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  icon: String,
  size: String as PropType<CellSize>,
  title: numericProp,
  value: numericProp,
  label: numericProp,
  center: Boolean,
  isLink: Boolean,
  border: truthProp,
  iconPrefix: String,
  valueClass: unknownProp,
  labelClass: unknownProp,
  titleClass: unknownProp,
  titleStyle: null as unknown as PropType<string | CSSProperties>,
  arrowDirection: String as PropType<CellArrowDirection>,
  required: {
    type: [Boolean, String] as PropType<boolean | 'auto'>,
    default: null,
  },
  clickable: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
}

export const cellProps = extend({}, cellSharedProps, routeProps)

export type CellProps = ExtractPropTypes<typeof cellProps>
