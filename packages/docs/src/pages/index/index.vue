<script setup lang="ts">
import VanTab from 'uni-vant/tab/Tab.vue'
import VanTabs from 'uni-vant/tabs/Tabs.vue'
</script>

<template>
  <view class="content">s
    <VanTabs>
      <VanTab title="标签 1">
        内容 1
      </VanTab>
      <VanTab title="标签 2">
        内容 2
      </VanTab>
      <VanTab title="标签 3">
        内容 3
      </VanTab>
      <VanTab title="标签 4">
        内容 4
      </VanTab>
    </VanTabs>
  </view>
</template>

<style>
.content {
  height: 300px;
  position: relative;
}
</style>
