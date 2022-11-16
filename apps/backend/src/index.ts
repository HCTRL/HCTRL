import type { ClientToServerEvents, ServerToClientEvents } from "$types/socket"

import { Server } from "socket.io"

const BACKEND_PORT = parseInt(process.env.BACKEND_PORT ?? "3762")

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: ["http://localhost:8080"],
  },
})

// import { Ledkit } from "$ledkit/index.js"

// console.log("test", Ledkit)

io.on("connection", socket => {
  socket.on("setLEDs", colors => {
    console.log("setLEDs", colors)
  })
})

io.listen(BACKEND_PORT)
console.log(`listening on port ${BACKEND_PORT}`)

export {}
