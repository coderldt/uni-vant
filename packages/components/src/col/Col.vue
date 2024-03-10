<script lang="ts" setup>
import { computed } from 'vue'
import { useParent } from '@vant/use'
import {
  createNamespace,
  extend,
  makeNumericProp,
  makeStringProp,
  numericProp,
} from '../utils'
import { ROW_KEY } from '../row'

const props = defineProps({
  tag: makeStringProp<keyof HTMLElementTagNameMap>('div'),
  span: makeNumericProp(0),
  offset: numericProp,
})
const [name, bem] = createNamespace('col')
const { parent, index } = useParent(ROW_KEY)

const style = computed(() => {
  if (!parent)
    return

  const { spaces, verticalSpaces } = parent
  let styles = {}
  if (spaces && spaces.value && spaces.value[index.value]) {
    const { left, right } = spaces.value[index.value]
    styles = {
      paddingLeft: left ? `${left}px` : null,
      paddingRight: right ? `${right}px` : null,
    }
  }

  const { bottom } = verticalSpaces.value[index.value] || {}

  return extend(styles, {
    marginBottom: bottom ? `${bottom}px` : null,
  })
})
</script>

<template>
  <view :style="style" :class="bem({ [span]: span, [`offset-${offset}`]: offset })">
    <slot />
  </view>
</template>
