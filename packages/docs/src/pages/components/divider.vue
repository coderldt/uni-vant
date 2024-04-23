<script lang='ts' setup>
import VanDivider from 'uni-vant/divider/Divider.vue'
</script>

<template>
  <VanDivider dashed>文本</VanDivider>
  <van-divider
    :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
  >
    文本
  </van-divider>
  <van-divider vertical />
    文本
  <van-divider vertical dashed />
    文本
  <van-divider vertical :hairline="false" />
    文本
  <van-divider vertical :style="{ borderColor: '#1989fa' }" />
</template>
