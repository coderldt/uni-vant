<script lang="ts" setup>
import './index.less'
import { computed } from 'vue'
import { createNamespace } from '../utils'
import { highlightProps } from './types'

const props = defineProps(highlightProps)

const [name, bem] = createNamespace('highlight')

const highlightChunks = computed(() => {
  const { autoEscape, caseSensitive, keywords, sourceString } = props
  const flags = caseSensitive ? 'g' : 'gi'
  const _keywords = Array.isArray(keywords) ? keywords : [keywords]

  // generate chunks
  let chunks = _keywords
    .filter(keyword => keyword)
    .reduce<Array<{ start: number; end: number; highlight: boolean }>>(
      (chunks, keyword) => {
        if (autoEscape)
          keyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

        const regex = new RegExp(keyword, flags)

        let match
        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(sourceString))) {
          const start = match.index
          const end = regex.lastIndex

          if (start >= end) {
            regex.lastIndex++
            continue
          }

          chunks.push({
            start,
            end,
            highlight: true,
          })
        }

        return chunks
      },
      [],
    )

  chunks = chunks
    .sort((a, b) => a.start - b.start)
    .reduce<typeof chunks>((chunks, currentChunk) => {
      const prevChunk = chunks[chunks.length - 1]

      if (!prevChunk || currentChunk.start > prevChunk.end) {
        const unhighlightStart = prevChunk ? prevChunk.end : 0
        const unhighlightEnd = currentChunk.start

        if (unhighlightStart !== unhighlightEnd) {
          chunks.push({
            start: unhighlightStart,
            end: unhighlightEnd,
            highlight: false,
          })
        }

        chunks.push(currentChunk)
      }
      else {
        prevChunk.end = Math.max(prevChunk.end, currentChunk.end)
      }

      return chunks
    }, [])

  const lastChunk = chunks[chunks.length - 1]

  if (lastChunk && lastChunk.end < sourceString.length) {
    chunks.push({
      start: lastChunk.end,
      end: sourceString.length,
      highlight: false,
    })
  }

  return chunks
})
</script>

<template>
  <view :class="bem()">
    <template
      v-for="(chunk, index) in highlightChunks"
      :key="index"
    >
      <text
        v-if="chunk.highlight"
        :class="[bem('tag'), highlightClass]"
      >
        {{ sourceString.slice(chunk.start, chunk.end) }}
      </text>
      <text
        v-else
        :class="unhighlightClass"
      >
        {{ sourceString.slice(chunk.start, chunk.end) }}
      </text>
    </template>
  </view>
</template>
