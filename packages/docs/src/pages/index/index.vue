<script setup lang="ts">
import Uploader from 'uni-vant/uploader/Uploader.vue'
import VanCol from 'uni-vant/col/Col.vue'
import VanRow from 'uni-vant/row/Row.vue'
</script>

<template>
  <view class="content">
    <Uploader />s
  </view>

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
</template>
