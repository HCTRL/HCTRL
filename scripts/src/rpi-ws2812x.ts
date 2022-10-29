import jet from "fs-jetpack"
import { execa } from "execa"

import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "../..")

const REPO_URL = "https://github.com/jgarff/rpi_ws281x"
const COMMIT_SHA1 = "1ba8e385708fb7802b09c0177a7ea4293948e25c"
const HW_FILE_SEARCH = "rpi_hw_t rpi_hw_info[]"
const INSERT = `    {
      .hwver = 0xa52082,
      .type = RPI_HWVER_TYPE_PI2,
      .periph_base = PERIPH_BASE_RPI2,
      .videocore_base = VIDEOCORE_BASE_RPI2,
      .desc = "Raspberry Pi 3 Model B Rev 1.2"
    },`.split("\n")

const modulePath = join(root, "node_modules/rpi-ws281x-native")
const nativeLib = join(modulePath, "src/rpi_ws281x")
const hwFile = join(nativeLib, "rpihw.c")

const main = async () => {
  console.log("fixing rpi-ws281x-native")

  if (!jet.exists(modulePath)) return console.log("rpi-ws281x-native not installed")

  // *---------
  console.log("removing outdated rpi_ws281x")
  jet.remove(nativeLib)

  // *---------
  console.log("cloning rpi-ws281x")
  let cwd = jet.dir(nativeLib).cwd()
  await execa("git", ["init"], { cwd })
  await execa("git", ["remote", "add", "origin", REPO_URL], { cwd })
  await execa("git", ["fetch", "--depth", "1", "origin", COMMIT_SHA1], { cwd })
  await execa("git", ["checkout", "FETCH_HEAD"], { cwd })

  // *---------
  console.log("patching rpihw.c")
  const hw = jet.read(hwFile)
  if (!hw) throw new Error("hw file not found")

  const lines = hw.split("\n")

  insertLines: for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes(HW_FILE_SEARCH)) {
      lines.splice(i + 1, 0, ...INSERT)
      break insertLines
    }
  }

  jet.write(hwFile, lines.join("\n"))

  // *---------
  console.log("rebuilding rpi-ws281x-native")
  cwd = modulePath
  await execa("npx", ["--yes", "node-gyp", "rebuild"], { cwd, stdio: "inherit" })
}

main()

export {}
