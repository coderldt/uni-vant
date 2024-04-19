import _Space from './Space.vue'

export const Space = _Space
// export { spaceProps } from './Space.vue'
// export type { SpaceProps, SpaceSize, SpaceAlign } from './Space.vue'

declare module 'vue' {
  export interface GlobalComponents {
    VanSpace: typeof Space
  }
}
