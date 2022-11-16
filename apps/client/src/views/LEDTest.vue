<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue"
import { Ledkit } from "$ledkit/index"
import chroma from "chroma-js"

const PADDING = 50
const THICKNESS = 100

const canvas = ref<HTMLCanvasElement>()

let landscape = false

let gradient: string[] = []

const setSize = () => {
  if (!canvas.value) return

  landscape = window.innerWidth > window.innerHeight

  if (landscape) {
    canvas.value.width = innerWidth - PADDING
    canvas.value.height = THICKNESS
  } else {
    canvas.value.width = THICKNESS
    canvas.value.height = innerHeight - PADDING
  }
}

const draw = (ctx: CanvasRenderingContext2D | null) => {
  if (!ctx) return
  if (!canvas.value) return

  const width = canvas.value.width
  const height = canvas.value.height
  const mx = canvas.value.width / 2
  const my = canvas.value.height / 2

  ctx.clearRect(0, 0, width, height)

  // ctx.globalCompositeOperation = "source-over"
  // ctx.fillStyle = "white"
  // ctx.fillRect(0, 0, innerWidth, innerHeight)

  // ctx.globalCompositeOperation = compositionModes[currentComposition]
  const loopOver = landscape ? width : height
  for (let i = 0; i < loopOver; i++) {
    const color = gradient[Math.floor(gradient.length * (i / loopOver))]

    ctx.fillStyle = color

    const pixel = 1
    let x, y

    if (landscape) {
      x = mx - width / 2 + i
      y = my - THICKNESS / 2
      ctx.fillRect(x, y, pixel, THICKNESS)
    } else {
      x = mx - THICKNESS / 2
      y = my - height / 2 + i
      ctx.fillRect(x, y, THICKNESS, pixel)
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
    gradient = colors.map(c => {
      return chroma(c).set("hsl.l", 0.85).set("hsl.s", 0.75).hex()
    })

    const ctx = canvas.value?.getContext("2d") ?? null
    draw(ctx)
  }
  const kit = new Ledkit(renderFn)
  kit.startRendering()

  const newColors = chroma
    .scale(["#f0f", "#00f"])
    .colors(kit.ledCount, null)
    .map(c => c.num())

  kit.setColors(newColors)

  console.log(newColors)

  onUnmounted(kit.stopRendering)
})
</script>

<template>
  <div class="ledtest">
    <div class="wrap">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ledtest {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
}

.wrap {
  display: flex;
}

canvas {
  // mix-blend-mode: hard-light;
  // opacity: 0.5;
}
</style>
