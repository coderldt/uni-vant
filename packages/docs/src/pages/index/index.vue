<script setup lang="ts">
import VImage from 'uni-vant/image/Image.vue'
</script>

<template>
  <view class="content">
    <VImage
      width="100"
      height="100"
      fit="cover"
      position="left"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />s
  </view>
</template>

<style lang="less">
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
</style>
