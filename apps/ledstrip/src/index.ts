import type { ClientSocket } from "$types/socket.js"

import ws281x from "rpi-ws281x-native"
import { Ledkit } from "$ledkit/index.js"
import io from "socket.io-client"

const NUM_LEDS = 300
const BACKEND_LOCAL_ADDR = process.env.BACKEND_LOCAL_ADDR ?? ""
if (!BACKEND_LOCAL_ADDR) throw new Error("BACKEND_LOCAL_ADDR not set")

const socket: ClientSocket = io(BACKEND_LOCAL_ADDR)

socket.on("connect", () => {
  console.log("connected")
})

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

socket.on("setLEDs", colors => {
  console.log("setLEDs", colors)
  kit.setColors(colors)
})

export {}
