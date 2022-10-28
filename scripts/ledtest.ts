import ws281x from "rpi-ws281x-native"

const channel = ws281x(300, { stripType: "ws2812" })
channel.brightness = 55

const colorArray = channel.array
for (let i = 0; i < channel.count; i++) {
  if (i % 2) colorArray[i] = 0xff00ff
  else colorArray[i] = 0x00ffff
}

ws281x.render()
