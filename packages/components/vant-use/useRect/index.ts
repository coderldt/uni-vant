import type { Ref } from 'vue'
import { unref } from 'vue'

const isWindow = (val: unknown): val is Window => val === window

function makeDOMRect(width: number, height: number) {
  return ({
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    width,
    height,
  }) as DOMRect
}

export function useRect(elementOrRef: Element | Window | Ref<Element | Window | undefined>) {
  const element = unref(elementOrRef)

  if (isWindow(element)) {
    const width = element.innerWidth
    const height = element.innerHeight
    return makeDOMRect(width, height)
  }

  if (element?.getBoundingClientRect)
    return element.getBoundingClientRect()

  return makeDOMRect(0, 0)
}