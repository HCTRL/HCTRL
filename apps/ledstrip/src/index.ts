import ws281x from "rpi-ws281x-native"
import chroma from "chroma-js"

const NUM_LEDS = 300

const channel = ws281x(NUM_LEDS, { stripType: "ws2812" })
channel.brightness = 50

const colors = channel.array
const scale = chroma.scale(["#fecb6f", "#393b62"]).mode("lch")
// const scale = chroma.bezier(["yellow", "blue"])

for (let i = 0; i < colors.length; i++) {
  colors[i] = scale(i / colors.length).num()
}

ws281x.render()
console.log(`rendered at ${new Date().toLocaleString()}`)

export {}
