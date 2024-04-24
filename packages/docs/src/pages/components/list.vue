<script lang='ts' setup>
import { ref } from 'vue'
import VanList from 'uni-vant/list/List.vue'
import VanCell from 'uni-vant/cell/Cell.vue'

const list = ref<number[]>([1, 2, 3])
const loading = ref(false)
const finished = ref(false)
const refresher = ref(true)
const refresherTriggered = ref(false)

const color = ['uni-bg-red', 'uni-bg-green', 'uni-bg-blue']

function onLoad(init?: boolean) {
  setTimeout(() => {
    console.log('加载数据')
    init && (list.value = [])

    for (let i = 0; i < 3; i++)
      list.value.push(list.value.length + 1)

    // 加载状态结束
    loading.value = false
    refresherTriggered.value = false

    // 数据全部加载完成
    if (list.value.length >= 10)
      finished.value = true
  }, 2000)
}

function onRefresherChange() {
  loading.value = false
  finished.value = false
  onLoad(true)
}
</script>

<template>
  <view :style="{ height: '500px' }">
    <VanList
      v-model:loading="loading"
      v-model:refresher-triggered="refresherTriggered"
      :finished="finished"
      finished-text="没有更多了"
      :refresher="refresher"
      @load="onLoad"
      @on-refresher-change="onRefresherChange"
    >
      <view
        v-for="(item, index) in list"
        :key="item"
        class="scroll-view-item"
        :class="[color[index % 3]]"
      >
        <VanCell :title="item" />
      </view>
      <!-- <template #refrenshLoading>
        加载中,,,
      </template> -->
      <!-- <template #loading>
        加载中,,,
      </template> -->
    </VanList>
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
