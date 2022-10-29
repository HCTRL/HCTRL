import ws281x from "rpi-ws281x-native"

const channel = ws281x(300, { stripType: "ws2812" })
channel.brightness = 55

const colorArray = channel.array
for (let i = 0; i < channel.count; i++) {
  colorArray[i] = 0xff00ff
}

ws281x.render()
