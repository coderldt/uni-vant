<script setup lang="ts">
import { Button } from 'uni-vant'
</script>

<template>
  <view class="content">
    <Button type="primary" size="small" loading loading-text="加载中..." loading-type="spinner">
      123
    </Button>
    <Button type="primary">
      test
    </Button>
    <Button icon="plus" type="warning">
      按钮
    </Button>
  </view>
</template>
