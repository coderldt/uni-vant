<script lang='ts' setup>
import { ref } from 'vue'
import CountDown from 'uni-vant/count-down/CountDown.vue'
import CButton from 'uni-vant/button/Button.vue'




const time = ref(30 * 60 * 60 * 1000)

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
function onFinish() {}
</script>

<template>
  <CountDown :time="time" />
  <CountDown :time="time" format="DD 天 HH 时 mm 分 ss 秒" />
  <CountDown :time="time">
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
    :time="3000"
    :auto-start="true"
    format="ss:SSS"
    @finish="onFinish"
  />
  <CButton icon="play-circle-o" @click="start">
    开始
  </CButton>
  <CButton icon="pause-circle-o" @click="pause">
    暂停
  </CButton>
  <CButton icon="replay" @click="reset">
    重置
  </CButton>
</template>
