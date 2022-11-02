import ws281x from "rpi-ws281x-native"
import { Ledkit } from "$ledkit/index.js"

const NUM_LEDS = 300

const channel = ws281x(NUM_LEDS, { stripType: "ws2812" })
channel.brightness = 50

const renderFn = (colors: number[]) => {
  for (let i = 0; i < channel.array.length; i++) {
    channel.array[i] = colors[i]
  }
  ws281x.render()
}

const kit = new Ledkit(renderFn)
kit.startRendering()

export {}
