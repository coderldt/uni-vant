import {
  type InjectionKey,
  type PropType,

} from 'vue'
import {
  type Numeric,
  createNamespace,
} from '../utils'
import _ConfigProvider from './ConfigProvider.vue'

export const ConfigProvider = _ConfigProvider
export default ConfigProvider

export type { ConfigProviderThemeVars } from './types'

export type ConfigProviderTheme = 'light' | 'dark'

export type ConfigProviderThemeVarsScope = 'local' | 'global'

export interface ConfigProviderProvide {
  iconPrefix?: string
}
const [name] = createNamespace('config-provider')

export const CONFIG_PROVIDER_KEY: InjectionKey<ConfigProviderProvide>
  = Symbol(name)

export type ThemeVars = PropType<Record<string, Numeric>>

declare module 'vue' {
  export interface GlobalComponents {
    VanConfigProvider: typeof ConfigProvider
  }
}
