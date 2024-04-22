<script setup lang="ts">
import Uploader from 'uni-vant/uploader/Uploader.vue';
import CountDown from '../components/countDown.vue';
</script>

<template>
  <view class="content">
    <Uploader />
    <CountDown />
  </view>s
</template>

<style lang="less">
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
</style>
