import { ref } from 'vue'
import type { Numeric } from '../utils'

export const uid = ref(0)

export const format = (rate: Numeric) => Math.min(Math.max(+rate, 0), 100)

export function getPath(clockwise: boolean, viewBoxSize: number) {
  const sweepFlag = clockwise ? 1 : 0
  return `M ${viewBoxSize / 2} ${
    viewBoxSize / 2
  } m 0, -500 a 500, 500 0 1, ${sweepFlag} 0, 1000 a 500, 500 0 1, ${sweepFlag} 0, -1000`
}
