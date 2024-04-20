<script setup lang="ts">
// import Uploader from 'uni-vant/uploader/Uploader.vue'
import Uploader from 'uni-vant/uploader/Uploader.vue'
import loading from '../components/loading.vue'
import VButton from '../components/button.vue'
</script>

<template>
  <view class="content">
    <Uploader />
    <loading />
    <VButton />
  </view>
</template>

<style lang="less">
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
</style>
