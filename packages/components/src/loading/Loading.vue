<template></template>

<script lang="ts" setup>
import './index.less'

import { computed, defineComponent, type ExtractPropTypes } from 'vue';
import {
  extend,
  addUnit,
  numericProp,
  getSizeStyle,
  makeStringProp,
  createNamespace,
} from '../utils';
import { loadingProps } from '.'

const [name, bem] = createNamespace('loading');

const props = 
</script>