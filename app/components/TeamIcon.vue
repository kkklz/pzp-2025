<template>
  <div
    :style="{'width': `${size}px`,
             'height': `${size}px`,
             'font-size': `${size / 2}px`,
             'background': bgColor}"
    class="text-white font-bold rounded-full flex shadow items-center justify-center"
  >
    <span class="text-shadow-lg">
      {{ team.name.charAt(0).toUpperCase() }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '~/types/team'

const { team, size } = defineProps<{
  team: Team
  size: number
}>()

function getDarkColorFromChar(char: string): string {
  const code = char.toUpperCase().charCodeAt(0) - 65
  const hue = (code % 26) * (360 / 26)

  return `hsl(${hue}, 60%, 25%)`
}

const bgColor = ref<string>('hsl(0, 0%, 25%)')

onMounted(() => {
  bgColor.value = getDarkColorFromChar(team.name.charAt(0))
})
</script>
