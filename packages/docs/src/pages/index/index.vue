<script setup lang="ts">
import VanTab from 'uni-vant/tab/Tab.vue'
import VanTabs from 'uni-vant/tabs/Tabs.vue'
import { ref } from 'vue'

const active = ref(0)
</script>

<template>
  <VanTabs v-model:active="active">
    <VanTab title="标签 1">
      内容 1
    </VanTab>
    <VanTab title="标签 2">
      内容 2
    </VanTab>
  </VanTabs>
</template>

<style>
.content {
  height: 300px;
  position: relative;
}
</style>
