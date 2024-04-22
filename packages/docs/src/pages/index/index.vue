<script setup lang="ts">
import Uploader from 'uni-vant/uploader/Uploader.vue';
import CountDown from '../components/countDown.vue';
import Callapse from '../components/callapse.vue'
</script>

<template>
  <view class="content">
    <Uploader />
    <CountDown />
    <Callapse />
  </view>s
</template>

<style lang="less">
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
</style>
