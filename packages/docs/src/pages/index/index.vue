<script setup lang="ts">
import { Button } from 'uni-vant'
</script>

<template>
  <view class="content">
    <view class="text-area">
      <Button type="primary" size="small" loading loading-text="加载中..." loading-type="spinner">
        123
      </Button>
      <Button type="primary">
        test
      </Button>
      <Button icon="plus" type="primary">
        按钮
      </Button>
    </view>
  </view>
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
