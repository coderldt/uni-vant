<script setup lang="ts">
import { Button, Col, Overlay, Rate, Row, Space } from 'uni-vant'
import { ref } from 'vue'

const show = ref(true)
const disabled = ref(false)
const rateVal = ref(3)
function onClick() {
  disabled.value = !disabled.value
  console.log('disabled', disabled)
}
</script>

<template>
  <view class="content">
    <Space>
      <Button type="primary" size="small" loading loading-text="加载中..." loading-type="spinner">
        123
      </Button>
      <Button type="primary">
        test
      </Button>
      <Button icon="plus" type="warning">
        按钮
      </Button>
    </Space>
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
  </view>
</template>
