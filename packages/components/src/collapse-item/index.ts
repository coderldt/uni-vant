import _CollapseItem from './CollapseItem.vue';

export const CollapseItem = _CollapseItem;
export default CollapseItem;
export { collapseItemProps } from './types';
export type { CollapseItemInstance, CollapseItemThemeVars, CollapseItemProps } from './types';

declare module 'vue' {
  export interface GlobalComponents {
    VanCollapseItem: typeof CollapseItem;
  }
}
