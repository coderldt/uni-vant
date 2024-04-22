<script lang='ts' setup>
import { ref } from 'vue'
import CountDown from 'uni-vant/count-down/CountDown.vue'
import VanButton from 'uni-vant/button/Button.vue'

const time1 = 30 * 60 * 60 * 1000
const time2 = ref(30 * 60 * 60 * 1000)

const countDown = ref<InstanceType<typeof CountDown> | null>(null)

function start() {
  countDown.value && countDown.value.start()
}
function pause() {
  countDown.value && countDown.value.pause()
}
function reset() {
  countDown.value && countDown.value.reset()
}
function onFinish() { }
</script>

<template>
  <CountDown :time="time1" />
  <CountDown
    :time="time1"
    format="HH:mm:ss:SS"
    millisecond
  />
  <CountDown
    :time="time1"
    format="DD 天 HH 时 mm 分 ss 秒"
  />
  <CountDown :time="time1">
    <template #default="{ timeData }">
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
    :time="time2"
    :auto-start="false"
    format="HH:mm:ss:SS"
    @finish="onFinish"
  />

  <VanButton
    icon="play-circle-o"
    @click="start"
  >
    开始
  </VanButton>
  <VanButton
    icon="pause-circle-o"
    @click="pause"
  >
    暂停
  </VanButton>
  <VanButton
    icon="replay"
    @click="reset"
  >
    重置
  </VanButton>
</template>
