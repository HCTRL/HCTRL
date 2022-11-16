import chroma from "chroma-js"

export type Color = number

const fillWith = <T>(length: number, filler: (i: number) => T): T[] => {
  return Array.from({ length }, (_, i) => filler(i))
}

export type ShiftDirection = "left" | "right"

/**
 * shifts the array with wraparound
 */
const shift = <T>(arr: T[], shiftBy: number, direction: ShiftDirection = "right"): T[] => {
  shiftBy = shiftBy % (arr.length * 2)

  if (shiftBy > arr.length) {
    return shift(arr, arr.length * 2 - shiftBy, direction === "right" ? "left" : "right")
  }

  if (direction === "left") {
    return [...arr.slice(shiftBy), ...arr.slice().reverse().slice(0, shiftBy)]
  } else if (direction === "right") {
    return [...arr.slice().reverse().slice(shiftBy), ...arr.slice(0, shiftBy)].reverse()
  } else throw new Error("invalid direction")
}

/**
 * @param arr the array to shift
 * @param amount between 0 and 1
 */
const shiftRelative = <T>(
  arr: T[],
  amount: number,
  direction: ShiftDirection = "right"
): T[] => {
  amount *= 2
  if (amount < 0) amount /= -1
  amount = amount % 2
  const shiftBy = Math.floor(arr.length * amount)

  return shift(arr, shiftBy, direction)
}

export class Ledkit {
  private colors: Color[] = []
  private rendering = false

  constructor(
    public renderFn: (colors: Color[]) => void,
    public ledCount = 300,
    public FPS = 30
  ) {
    const gradient = chroma.scale(["#fecb6f", "#393b62"]).mode("lch")
    // const gradient = chroma.scale(["crimson", "white"]).mode("lch")

    this.colors = fillWith(this.ledCount, i => gradient(i / this.ledCount).num())

    this.renderFn(this.colors)
  }

  public setColors = (colors: Color[]) => {
    this.colors = colors
  }

  public startRendering = () => {
    this.rendering = true
    this.render()
  }
  public stopRendering = () => {
    this.rendering = false
  }

  public shiftOverTime = 10e3
  private shiftedBy = 0
  public render = () => {
    const frameStart = performance.now()

    this.renderFn(shiftRelative(this.colors, this.shiftedBy))
    this.shiftedBy += 1 / (this.shiftOverTime / (1000 / this.FPS))
    if (this.shiftedBy >= 1) this.shiftedBy = 0

    const frameTime = performance.now() - frameStart
    if (this.rendering) setTimeout(this.render, 1000 / this.FPS - frameTime)
  }
}
