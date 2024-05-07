<script lang='ts' setup>
import VanPopover from 'uni-vant/popover/Popover.vue'
import VanButton from 'uni-vant/button/Button.vue'
import { ref } from 'vue'

const showPopover = ref(false)
const showPopover1 = ref(false)

// 通过 actions 属性来定义菜单选项
const actions = [
  { text: '选项一' },
  { text: '选项二' },
  { text: '选项三' },
]
function onSelect(action) {
  console.log(`你来了${action.text}`)
}
</script>

<template>
  <div class="flex">
    <VanPopover
      v-model:show="showPopover"
      style="margin-right: 50px"
      placement="bottom-start"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference>
        <VanButton type="primary">
          浅色风格
        </VanButton>
      </template>
    </VanPopover>
    <VanPopover
      v-model:show="showPopover1"
      placement="right-end"
      theme="dark"
      :actions="actions"
      @select="onSelect"
    >
      <template #reference>
        <VanButton type="primary">
          浅色风格
        </VanButton>
      </template>
    </VanPopover>
  </div>
</template>

<style>
.flex {
  width: 400px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
