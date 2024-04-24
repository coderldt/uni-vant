<script lang='ts' setup>
import VanHighlight from 'uni-vant/highlight/Highlight.vue'

const text = '慢慢来，不要急，生活给你出了难题，可也终有一天会给出答案。'
const keywords = '难题'
</script>

<template>
  <VanHighlight
    :keywords="keywords"
    :source-string="text"
  />
</template>
