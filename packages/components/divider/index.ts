import _Divider from './Divider.vue';

export const Divider = _Divider;
export default Divider;
export type { DividerThemeVars, DividerProps, DividerContentPosition } from './types';

declare module 'vue' {
  export interface GlobalComponents {
    VanDivider: typeof Divider;
  }
}
