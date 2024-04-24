<script setup lang="ts">
import Uploader from 'uni-vant/uploader/Uploader.vue'
import VanCol from 'uni-vant/col/Col.vue'
import VanRow from 'uni-vant/row/Row.vue'
import VanSticky from 'uni-vant/sticky/Sticky.vue'
import VanButton from 'uni-vant/button/Button.vue'
import VanSwipe from 'uni-vant/swipe/Swipe.vue'
import VanSwipeItem from 'uni-vant/swipe-item/SwipeItem.vue'
import Callapse from '../components/callapse.vue'
import CountDown from '../components/countDown.vue'
import VanDivider from '../components/divider.vue'
</script>

<template>
  <view class="content">
    <VanSwipe :autoplay="3000">
      <VanSwipeItem>
        <view style="color: #fff;font-size: 20px;line-height: 150px;text-align: center;background-color: #39a9ed;">
          test
        </view>
      </VanSwipeItem>
      <VanSwipeItem>
        <view style="color: #fff;font-size: 20px;line-height: 150px;text-align: center;background-color: red;">
          test
        </view>
      </VanSwipeItem>
      <VanSwipeItem>
        <view style="color: #fff;font-size: 20px;line-height: 150px;text-align: center;background-color: red;">
          test
        </view>
      </VanSwipeItem>
    </VanSwipe>
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
