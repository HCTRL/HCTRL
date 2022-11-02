<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { Ledkit } from "$ledkit/index"
import chroma from "chroma-js"

const PADDING = 50
const LED_COUNT = 300

const canvas = ref<HTMLCanvasElement>()

let innerWidth = 0
let innerHeight = 0
let landscape = false

let gradient: string[] = []

const setSize = () => {
  if (!canvas.value) return

  innerWidth = window.innerWidth
  innerHeight = window.innerHeight

  landscape = innerWidth > innerHeight

  canvas.value.width = innerWidth
  canvas.value.height = innerHeight
}

const draw = (ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return

  const width = innerWidth - PADDING
  const height = innerHeight - PADDING
  const mx = innerWidth / 2
  const my = innerHeight / 2

  const loopOver = landscape ? width : height
  for (let i = 0; i < loopOver; i++) {
    const color = gradient[Math.floor(gradient.length * (i / loopOver))]

    ctx.fillStyle = color

    const thickness = 100
    const pixel = 1
    let x, y

    if (landscape) {
      x = mx - width / 2 + i
      y = my - thickness / 2
      ctx.fillRect(x, y, pixel, thickness)
    } else {
      x = mx - thickness / 2
      y = my - height / 2 + i
      ctx.fillRect(x, y, thickness, pixel)
    }
  }
}

onMounted(() => {
  if (!canvas.value) return
  const ctx = canvas.value.getContext("2d")

  window.onresize = () => {
    setSize()
    draw(ctx)
  }

  setSize()
  // draw(ctx)

  const renderFn = (colors: number[]) => {
    gradient = colors.map(c => chroma(c).hex())

    const ctx = canvas.value?.getContext("2d") ?? null
    draw(ctx)
  }
  const kit = new Ledkit(renderFn)
  kit.startRendering()

  onUnmounted(kit.stopRendering)
})
</script>

<template>
  <div class="ledtest">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped lang="scss">
canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: black;
  z-index: -1;
}
</style>
