export interface RateThemeVars {
  rateIconSize?: string
  rateIconGutter?: string
  rateIconVoidColor?: string
  rateIconFullColor?: string
  rateIconDisabledColor?: string
}

export type RateStatus = 'full' | 'half' | 'void'

export interface RateListItem {
  value: number
  status: RateStatus
}

export function getRateStatus(
  value: number,
  index: number,
  allowHalf: boolean,
  readonly: boolean,
): RateListItem {
  if (value >= index)
    return { status: 'full', value: 1 }

  if (value + 0.5 >= index && allowHalf && !readonly)
    return { status: 'half', value: 0.5 }

  if (value + 1 >= index && allowHalf && readonly) {
    const cardinal = 10 ** 10
    return {
      status: 'half',
      value: Math.round((value - index + 1) * cardinal) / cardinal,
    }
  }

  return { status: 'void', value: 0 }
}
