<template>
  <view :class="[bem({ border: index && border })]">
    <Cell
      v-slot="cellSlots"
      role="button"
      :class="[bem('title', { disabled, expanded, borderless: !border })]"
      :aria-expanded="String(expanded)"
      @click="onClickTitle"
      v-bind="getCellTitleAttr"
    />
    <template v-if="show || !lazyRender">
      <view
        v-show="{show}"
        ref="wrapperRef"
        :class="bem('wrapper')"
        @transitionend="onTransitionEnd"
      >
        <view ref="contentRef" :class="bem('content')">
          <slot></slot>
        </view>
      </view>
    </template>
  </view>
</template>
<script setup lang="ts">
import './index.less'
import { raf, doubleRaf, useParent } from '@vant/use';
import {
  ref,
  watch,
  computed,
  nextTick,
  useSlots,
} from 'vue';

import { cellSharedProps, Cell } from '../cell';
import {
  pick,
  createNamespace,
} from '../utils';
import { COLLAPSE_KEY } from '../collapse';

import { useLazyRender } from '../composables/use-lazy-render';

import { collapseItemProps, CELL_SLOTS } from './types'

const props = defineProps(collapseItemProps)

const slots = useSlots()

const cellSlots = pick(slots, CELL_SLOTS)

const [_, bem] = createNamespace('collapse-item');

const wrapperRef = ref<HTMLElement>();
const contentRef = ref<HTMLElement>();
const { parent, index } = useParent(COLLAPSE_KEY);

// if (!parent) {
//   if (process.env.NODE_ENV !== 'production') {
//     console.error(
//       '[Vant] <CollapseItem> must be a child component of <Collapse>.',
//     );
//   }
//   return;
// }

const name = computed(() => props.name ?? index.value);
const expanded = computed(() => parent?.isExpanded(name.value));

const show = ref(expanded.value);
const lazyRender = useLazyRender(() => show.value || !props.lazyRender);

const onTransitionEnd = () => {
  if (!expanded.value) {
    show.value = false;
  } else if (wrapperRef.value) {
    wrapperRef.value.style.height = '';
  }
};

watch(expanded, (value, oldValue) => {
  if (oldValue === null) {
    return;
  }

  if (value) {
    show.value = true;
  }

  const tick = value ? nextTick : raf;

  tick(() => {
    if (!contentRef.value || !wrapperRef.value) {
      return;
    }

    const { offsetHeight } = contentRef.value;
    if (offsetHeight) {
      const contentHeight = `${offsetHeight}px`;
      wrapperRef.value.style.height = value ? '0' : contentHeight;

      doubleRaf(() => {
        if (wrapperRef.value) {
          wrapperRef.value.style.height = value ? contentHeight : '0';
        }
      });
    } else {
      onTransitionEnd();
    }
  });
});

const toggle = (newValue = !expanded.value) => {
  parent.toggle(name.value, newValue);
};

const onClickTitle = () => {
  if (!props.disabled && !props.readonly) {
    toggle();
  }
};

const getCellTitleAttr = computed(() => {
  const attrs = pick(
    props,
    Object.keys(cellSharedProps) as Array<keyof typeof cellSharedProps>
  )

  if (props.readonly) {
    attrs.isLink = false
  }

  if (props.disabled || props.readonly) {
    attrs.clickable = false;
  }

  return attrs
})
</script>

