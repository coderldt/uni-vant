import type {
  ComponentPublicInstance,
  PropType,
  ExtractPropTypes
} from 'vue';
// import type { CollapseItemProps } from './CollapseItem';

import { cellSharedProps } from '../cell';

import {
  isDef,
  extend,
  truthProp,
  unknownProp,
  numericProp,
  makeStringProp,
  createNamespace,
} from '../utils';

export type CollapseItemExpose = {
  toggle: (newValue?: boolean) => void;
};

export type CollapseItemInstance = ComponentPublicInstance<
  CollapseItemProps,
  CollapseItemExpose
>;

export type CollapseItemThemeVars = {
  collapseItemDuration?: string;
  collapseItemContentPadding?: string;
  collapseItemContentFontSize?: string;
  collapseItemContentLineHeight?: number | string;
  collapseItemContentTextColor?: string;
  collapseItemContentBackground?: string;
  collapseItemTitleDisabledColor?: string;
};

export const CELL_SLOTS = ['icon', 'title', 'value', 'label', 'right-icon'] as const;

export const collapseItemProps = extend({}, cellSharedProps, {
  name: numericProp,
  isLink: truthProp,
  disabled: Boolean,
  readonly: Boolean,
  lazyRender: truthProp,
});

export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>;