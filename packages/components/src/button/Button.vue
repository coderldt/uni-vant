<template>
  <view
    :type="nativeType"
    :class="classes"
    :style="getStyle"
    :disabled="disabled"
    :onClick="onClick"
  >
    <view :class="bem('content')">
      <view :class="bem('content')">
        <template v-if="iconPosition === 'left'">
          <Loading
            v-if="loading"
            :size="props.loadingSize"
            :type="props.loadingType"
            :class="bem('loading')"
            />
          <slot v-else-if="slots.icon"></slot>
          <Icon v-else-if="icon" :name="icon" :class="bem('icon')" :classPrefix="iconPrefix" />
        </template>
        <text :class="bem('text')">
          <template v-if="loading">{{ loadingText }}</template>
          <template v-else-if="text">{{ text }}</template>
          <slot v-else></slot>
        </text>
        <template v-if="iconPosition === 'right'">
          <Loading
            v-if="loading"
            :size="props.loadingSize"
            :type="props.loadingType"
            :class="bem('loading')"
            />
          <slot v-else-if="slots.icon"></slot>
          <Icon v-else-if="icon" :name="icon" :class="bem('icon')" :classPrefix="iconPrefix" />
        </template>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import './index.less'

import {
  defineComponent,
  useSlots,
  type PropType,
  type CSSProperties,
  type ExtractPropTypes,
} from 'vue';

// Utils
import {
  extend,
  numericProp,
  preventDefault,
  makeStringProp,
  createNamespace,
  BORDER_SURROUND,
} from '../utils';

// Components
import { Icon } from '../icon';
import { Loading, LoadingType } from '../loading';

// Types
import {
  ButtonSize,
  ButtonType,
  ButtonNativeType,
  ButtonIconPosition,
} from './types';
import { buttonProps,  } from '.'

const props = defineProps(buttonProps)
const emit = defineEmits(['click'])
const slots = useSlots()

const getStyle = () => {
      const { color, plain } = props;
      if (color) {
        const style: CSSProperties = {
          color: plain ? color : 'white',
        };

        if (!plain) {
          // Use background instead of backgroundColor to make linear-gradient work
          style.background = color;
        }

        // hide border when color is linear-gradient
        if (color.includes('gradient')) {
          style.border = 0;
        } else {
          style.borderColor = color;
        }

        return style;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (props.loading) {
        preventDefault(event);
      } else if (!props.disabled) {
        emit('click', event);
      }
    };
const [name, bem] = createNamespace('button');

const getClasses = () => {
  const {
        type,
        size,
        block,
        round,
        plain,
        square,
        loading,
        disabled,
        hairline,
      } = props;

      const classes = [
        bem([
          type,
          size,
          {
            plain,
            block,
            round,
            square,
            loading,
            disabled,
            hairline,
          },
        ]),
        { [BORDER_SURROUND]: hairline },
      ];

      return classes
}

const classes = getClasses()


</script>