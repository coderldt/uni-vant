<script setup lang="ts">
import { Badge, Button, Circle, Col, Image, Overlay, Rate, Row, Swipe, SwipeItem, Uploader } from 'uni-vant'
import { ref } from 'vue'
import { Callapse, CountDown } from '../components'

const show = ref(false)
const disabled = ref(false)
const rateVal = ref(3)
function onClick() {
  disabled.value = !disabled.value
  console.log('disabled', disabled)
}

const currentRate = ref(20)
const text = ref('测试文本')
</script>

<template>
  <view class="content">
    <!-- <Space> -->
    <Button type="primary" size="small" loading loading-text="加载中..." loading-type="spinner">
      123
    </Button>
    <Button type="primary">
      test
    </Button>
    <Button icon="plus" type="warning">
      按钮
    </Button>
    <!-- </Space> -->
    <button @click="onClick">
      test
    </button>
    <Button type="primary" size="small" loading loading-text="加载中..." loading-type="spinner">
      123
    </Button>
    <Button type="primary" @click="onClick">
      test
    </Button>
    <Button icon="plus" type="warning">
      按钮
    </Button>

    <Row>
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

    <Rate v-model="rateVal" :disabled="disabled" />

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

    <Uploader :after-read="(file) => { console.log('file', file) }" />
  </view>
</template>

<style lang="less">
  .child {
    width: 40px;
    height: 40px;
    background: #f2f3f5;
    border-radius: 4px;
    margin-left: 30px;
  }

  .box {
    padding: 20px;
    background: #eaeaea;
    border-radius: 10px;
    h2 {
      margin: 20px 0;
    }
  }

  .my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
  }
</style>
