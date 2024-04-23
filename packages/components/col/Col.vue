<script lang="ts">
import './index.less'
import { computed } from 'vue'
import {
  createNamespace,
  extend,
  makeNumericProp,
  numericProp,
} from '../utils'
import { ROW_KEY } from '../row'
import { useParent } from '../vant-use'

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps({
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
    if (left) {
      styles = {
        paddingLeft: `${left}px`,
      }
    }

    if (right) {
      extend(styles, {
        paddingRight: `${right}px`,
      })
    }
  }

  const { bottom } = verticalSpaces?.value[index.value] || {}
  if (bottom) {
    extend(styles, {
      marginBottom: `${bottom}px`,
    })
  }

  return styles
})
// const parent = inject(ROW_KEY, null)

// const style = computed(() => {
//   if (!parent)
//     return

//   const { horizontalGutter = 0, verticalGutter = 0 } = parent
//   const average = Number.isNaN(Number(horizontalGutter)) ? 0 : Number(horizontalGutter)
//   const averagePadding = average / 2

//   let styles = {}

//   if (averagePadding) {
//     styles = {
//       paddingLeft: `${averagePadding}px`,
//       paddingRight: `${averagePadding}px`,
//     }
//   }
//   if (verticalGutter) {
//     styles = extend(styles, {
//       marginBottom: `${verticalGutter}px`,
//     })
//   }

//   return styles
// })
</script>

<template>
  <view :style="style" :class="bem({ [span]: span, [`offset-${offset}`]: offset })">
    <slot />
  </view>
</template>
