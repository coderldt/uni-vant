import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

export const TAB_STATUS_KEY: InjectionKey<ComputedRef<boolean>> = Symbol('TAB_STATUS_KEY')

export const useTabStatus = () => inject(TAB_STATUS_KEY, null)
