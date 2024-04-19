<script setup lang="ts">
import CButton from '../components/button.vue'
import Loading from '../components/loading.vue'
import CountDown from '../components/countDown.vue'
</script>

<template>
  <view class="content">
    <view class="title">
      button
    </view>
    <CButton />
    <view class="title">
      loading
    </view>
    <Loading />
    <view class="title">
      CountDown
    </view>
    <CountDown />

    <!-- <Row>
      <Col span="8">
        span: 8
      </Col>
      <Col span="8">
        span: 8
      </Col>
      <Col span="8">
        span: 8
      </Col>
    </Row>

    <Row>
      <Col span="4">
        span: 4
      </Col>
      <Col span="10" offset="4">
        offset: 4, span: 10
      </Col>
    </Row>

    <Row>
      <Col offset="12" span="12">
        offset: 12, span: 12
      </Col>
    </Row>

    <Overlay :show="show" @click="show = false" />

    <CRate v-model="rateVal" :disabled="disabled" />

    <Badge :content="5">
      <div class="child" />
    </Badge>
    <Badge :content="50" max="20">
      <div class="child" />
    </Badge>

    <div class="box">
      <h2>circle</h2>
      <Space>
        <Circle
          v-model:current-rate="currentRate"
          :rate="30"
          :speed="100"
          :text="text"
        />
        <Circle
          v-model:current-rate="currentRate"
          :rate="60"
          :stroke-width="60"
          text="宽度定制"
        />
        <Circle
          v-model:current-rate="currentRate"
          :rate="100"
          layer-color="#ebedf0"
          text="颜色定制"
        />
      </Space>
    </div>
    <Callapse />
    <CountDown />

    <Image
      width="100"
      height="100"
      fit="cover"
      round
      position="left"
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />

    <Image
      width="100"
      height="100"
      lazy-load
      src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    />

    <Swipe class="my-swipe" :loop="false">
      <SwipeItem>1</SwipeItem>
      <SwipeItem>2</SwipeItem>
      <SwipeItem>3</SwipeItem>
      <SwipeItem>4</SwipeItem>
    </Swipe>

    <Uploader :after-read="(file) => { console.log('file', file) }" /> -->
  </view>
</template>

<style lang="less">
  .title {
    font-size: 30px;
    font-weight: bold;
    margin: 10px 0;
  }
</style>
