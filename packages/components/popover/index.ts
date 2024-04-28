import _Popover from './Popover.vue'

export const Popover = _Popover
export default Popover

export { popoverProps } from './types'
export type {
  PopoverTheme,
  PopoverAction,
  PopoverTrigger,
  PopoverThemeVars,
  PopoverPlacement,
  PopoverProps,
} from './types'

declare module 'vue' {
  export interface GlobalComponents {
    VanPopover: typeof Popover
  }
}
