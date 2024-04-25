<script lang='ts' setup>
import { ref } from 'vue'
import VanPullRefresh from 'uni-vant/pull-refresh/PullRefresh.vue'

const list = ref<number[]>([1, 2, 3])
const refresher = ref(true)
const disabled = ref(false)
const modelValue = ref(true)

const color = ['uni-bg-red', 'uni-bg-green', 'uni-bg-blue']

function onRefresherChange() {
  setTimeout(() => {
    modelValue.value = false
  }, 1000)
}
</script>

<template>
  <view :style="{ height: '500px' }">
    <VanPullRefresh
      v-model:disabled="disabled"
      v-model="modelValue"
      finished-text="没有更多了"
      :refresher="refresher"
      @refresh="onRefresherChange"
    >
      <view
        v-for="(item, index) in list"
        :key="item"
        class="scroll-view-item"
        :class="[color[index % 3]]"
      >
        <VanCell :title="item" />
      </view>
    </VanPullRefresh>
  </view>
</template>

<style>
.scroll-view-item {
  height: 300px;
  border-bottom: 1px solid #eaeaea;
}

.uni-bg-red {
  background: rgb(234, 116, 116);
}

.uni-bg-green {
  background: rgb(101, 223, 101);
}

.uni-bg-blue {
  background: rgb(115, 115, 217);
}
</style>
