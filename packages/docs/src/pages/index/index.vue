<script setup lang="ts">
import Uploader from 'uni-vant/uploader/Uploader.vue'
import VanCol from 'uni-vant/col/Col.vue'
import VanRow from 'uni-vant/row/Row.vue'
import VanSticky from 'uni-vant/sticky/Sticky.vue'
import VanButton from 'uni-vant/button/Button.vue'
import CountDown from '../components/countDown.vue'
import Callapse from '../components/callapse.vue'
import VanDivider from '../components/divider.vue'
import Empty from '../components/empty.vue'
import Highlight from '../components/highlight.vue'
import List from '../components/list.vue'
</script>

<template>
  <view class="content">
    <List />
    <Highlight />
    <Empty />
    <VanDivider />
    <Uploader />
    <CountDown />
    <Callapse />
    <VanRow :horizontal-gutter="10">
      <VanCol span="8">
        span: 8
      </VanCol>
      <VanCol span="8">
        span: 8
      </VanCol>
      <VanCol span="8">
        span: 8
      </VanCol>
    </VanRow>
    <view class="sticky-content">
      <VanSticky>
        <VanButton type="primary">
          基础用法
        </VanButton>
      </VanSticky>
    </view>
  </view>
</template>

<style>
.sticky-content {
  height: 1000px;
}
</style>
