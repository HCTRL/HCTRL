import type { Socket } from "socket.io-client"

type setLEDs = (colors: number[]) => void

export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  setLEDs: setLEDs
}

export interface ClientToServerEvents {
  hello: () => void
  setLEDs: setLEDs
}

export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>
