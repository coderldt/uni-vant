<script lang="ts" setup>
import VanSwipe from 'uni-vant/swipe/Swipe.vue'
import VanSwipeItem from 'uni-vant/swipe-item/SwipeItem.vue'
</script>

<template>
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
</template>
