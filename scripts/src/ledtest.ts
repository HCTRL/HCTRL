import { Ledkit } from "$ledkit/index.js"
import ws281x from "rpi-ws281x-native"

const channel = ws281x(300, { stripType: "ws2812" })
channel.brightness = 20

const renderFn = (colors: number[]) => {
  channel.array = new Uint32Array(colors)
  ws281x.render()
}

const kit = new Ledkit(renderFn)
kit.startRendering()
// const colorArray = channel.array
// for (let i = 0; i < channel.count; i++) {
//   colorArray[i] = 0x00ffff
// }

// ws281x.render()
// console.log("render", new Date().toLocaleString())
