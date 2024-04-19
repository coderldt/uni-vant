<script lang="ts" setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { createAnimation } from './createAnimation'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  modeClass: {
    type: [Array, String],
    default() {
      return 'fade'
    },
  },
  duration: {
    type: Number,
    default: 300,
  },
  styles: {
    type: Object,
    default() {
      return {}
    },
  },
  customClass: {
    type: String,
    default: '',
  },
  onceRender: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['click', 'change'])
const ani = ref()
const data = reactive({
  isShow: false,
  transform: '',
  opacity: 1,
  animationData: {},
  durationTime: 300,
  config: {},
})

// 生成样式数据
const stylesObject = computed(() => {
  const styles = {
    ...data.styles,
    'transition-duration': `${data.duration / 1000}s`,
  }
  let transform = ''
  for (const i in styles) {
    const line = toLine(i)
    transform += `${line}:${styles[i]};`
  }
  return transform
})
// 初始化动画条件
const transformStyles = computed(() => {
  return `transform:${data.transform};` + `opacity:${data.opacity};${stylesObject.value}`
})

watch(() => show, (newVal) => {
  if (newVal) {
    open()
  }
  else {
    // 避免上来就执行 close,导致动画错乱
    if (data.isShow)
      close()
  }
}, {
  immediate: true,

})

function init(obj = {}) {
  if (obj.duration)
    data.durationTime = obj.duration

  data.animation = createAnimation(Object.assign(data.config, obj), data)
}
function onClick() {
  emit('click', {
    detail: data.isShow,
  })
}
function step(obj, config = {}) {
  if (!data.animation)
    return
  for (const i in obj) {
    try {
      if (typeof obj[i] === 'object')
        data.animation[i](...obj[i])

      else
        data.animation[i](obj[i])
    }
    catch (e) {
      console.error(`方法 ${i} 不存在`)
    }
  }
  data.animation.step(config)
  return data
}
function run(fn) {
  if (!data.animation)
    return
  data.animation.run(fn)
}
// 开始过度动画
function open() {
  clearTimeout(data.timer)
  data.transform = ''
  data.isShow = true
  const { opacity, transform } = data.styleInit(false)
  if (typeof opacity !== 'undefined')
    data.opacity = opacity

  data.transform = transform
  // 确保动态样式已经生效后，执行动画，如果不加 nextTick ，会导致 wx 动画执行异常
  nextTick(() => {
    // TODO 定时器保证动画完全执行，目前有些问题，后面会取消定时器
    data.timer = setTimeout(() => {
      data.animation = createAnimation(data.config, data)
      data.tranfromInit(false).step()
      data.animation.run()
      emit('change', {
        detail: data.isShow,
      })
    }, 20)
  })
}
// 关闭过度动画
function close() {
  if (!data.animation)
    return
  tranfromInit(true)
    .step()
    .run(() => {
      data.isShow = false
      data.animationData = null
      data.animation = null
      const { opacity, transform } = styleInit(false)
      data.opacity = opacity || 1
      data.transform = transform
      emit('change', {
        detail: data.isShow,
      })
    })
}
// 处理动画开始前的默认样式
function styleInit(type) {
  const styles = {
    transform: '',
  }
  const buildStyle = (type, mode) => {
    if (mode === 'fade')
      styles.opacity = animationType(type)[mode]
    else
      styles.transform += `${animationType(type)[mode]} `
  }
  if (typeof data.modeClass === 'string') {
    buildStyle(type, data.modeClass)
  }
  else {
    data.modeClass.forEach((mode) => {
      buildStyle(type, mode)
    })
  }
  return styles
}
// 处理内置组合动画
function tranfromInit(type) {
  const buildTranfrom = (type, mode) => {
    let aniNum = null
    if (mode === 'fade') {
      aniNum = type ? 0 : 1
    }
    else {
      aniNum = type ? '-100%' : '0'
      if (mode === 'zoom-in')
        aniNum = type ? 0.8 : 1

      if (mode === 'zoom-out')
        aniNum = type ? 1.2 : 1

      if (mode === 'slide-right')
        aniNum = type ? '100%' : '0'

      if (mode === 'slide-bottom')
        aniNum = type ? '100%' : '0'
    }
    data.animation[animationMode()[mode]](aniNum)
  }
  if (typeof data.modeClass === 'string') {
    buildTranfrom(type, data.modeClass)
  }
  else {
    data.modeClass.forEach((mode) => {
      buildTranfrom(type, mode)
    })
  }

  return data.animation
}
function animationType(type) {
  return {
    'fade': type ? 1 : 0,
    'slide-top': `translateY(${type ? '0' : '-100%'})`,
    'slide-right': `translateX(${type ? '0' : '100%'})`,
    'slide-bottom': `translateY(${type ? '0' : '100%'})`,
    'slide-left': `translateX(${type ? '0' : '-100%'})`,
    'zoom-in': `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
    'zoom-out': `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`,
  }
}
// 内置动画类型与实际动画对应字典
function animationMode() {
  return {
    'fade': 'opacity',
    'slide-top': 'translateY',
    'slide-right': 'translateX',
    'slide-bottom': 'translateY',
    'slide-left': 'translateX',
    'zoom-in': 'scale',
    'zoom-out': 'scale',
  }
}
// 驼峰转中横线
function toLine(name: string) {
  return name.replace(/([A-Z])/g, '-$1').toLowerCase()
}

// 动画默认配置
data.config = {
  duration: data.duration,
  timingFunction: 'ease',
  transformOrigin: '50% 50%',
  delay: 0,
}
data.durationTime = data.duration
</script>

<template>
  <view v-show="data.isShow" ref="ani" :animation="data.animationData" :class="customClass" :style="transformStyles" @click="onClick">
    <slot />
  </view>
</template>

<style></style>
