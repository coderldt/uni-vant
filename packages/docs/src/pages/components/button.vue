<script lang='ts' setup>
import { ref } from 'vue'
import CButton from 'uni-vant/button/Button.vue'

const disabled = ref(false)

function onClick() {
  disabled.value = !disabled.value
}
</script>

<template>
  <CButton type="primary">
    primary
  </CButton>
  <CButton icon="plus" type="warning">
    plus
  </CButton>
  <!-- </Space> -->
  <CButton @click="onClick">
    test onClick
  </CButton>
  <CButton type="primary" @click="onClick">
    test
  </CButton>
  <CButton icon="plus" type="warning">
    按钮
  </CButton>
  <CButton icon="plus" loading type="warning">
    按钮
  </CButton>
  <CButton size="large" loading type="warning">
    按钮
  </CButton>
  <CButton size="normal" loading type="warning">
    按钮
  </CButton>
  <CButton size="small" loading type="warning" />
  <CButton size="mini" loading type="warning">
    按钮
  </CButton>
</template>
