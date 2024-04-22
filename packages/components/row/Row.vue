<script lang="ts">
import './index.less'
import {
  type PropType,
} from 'vue'
import { createNamespace, truthProp } from '../utils'
import { ROW_KEY, type RowAlign, type RowJustify } from '.'
import { provide } from 'vue'

export default {
  options: {
    virtualHost: true,
  },
}
</script>

<script lang="ts" setup>
const props = defineProps({
  wrap: truthProp,
  align: String as PropType<RowAlign>,
  horizontalGutter: {
    type: [String, Number, Array] as PropType<
      string | number
    >,
    default: 0,
  },
  verticalGutter: {
    type: [String, Number, Array] as PropType<
      string | number
    >,
    default: 0,
  },
  justify: String as PropType<RowJustify>,
})

const [name, bem] = createNamespace('row')

provide(ROW_KEY, {
  horizontalGutter: props.horizontalGutter,
  verticalGutter: props.verticalGutter,
})
</script>

<template>
  <view
    :class="bem({
      [`align-${align}`]: align,
      [`justify-${justify}`]: justify,
      nowrap: !wrap,
    })"
  >
    <slot />
  </view>
</template>
