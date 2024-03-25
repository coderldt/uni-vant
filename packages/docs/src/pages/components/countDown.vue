<script lang='ts' setup>
import { ref } from 'vue'
import { Button, CountDown, Space } from 'uni-vant'

const time = ref(30 * 60 * 60 * 1000)

const countDown = ref<CountDown>()

function start() {
  countDown.value.start()
}
function pause() {
  countDown.value.pause()
}
function reset() {
  countDown.value.reset()
}
const onFinish = () => showToast('倒计时结束')
</script>

<template>
  <view class="box">
    <h2>CountDown</h2>
    <CountDown :time="time" />
    <CountDown :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
    <CountDown :time="time">
      <template #default="timeData">
        <text class="block">
          {{ timeData.hours }}
        </text>
        <text class="colon">
          :
        </text>
        <text class="block">
          {{ timeData.minutes }}
        </text>
        <text class="colon">
          :
        </text>
        <text class="block">
          {{ timeData.seconds }}
        </text>
      </template>
    </CountDown>
    <CountDown
      ref="countDown"
      millisecond
      :time="3000"
      :auto-start="false"
      format="ss:SSS"
      @finish="onFinish"
    />
    <Space>
      <Button icon="play-circle-o" @click="start">
        开始
      </Button>
      <Button icon="pause-circle-o" @click="pause">
        暂停
      </Button>
      <Button icon="replay" @click="reset">
        重置
      </Button>
    </Space>
  </view>
</template>
