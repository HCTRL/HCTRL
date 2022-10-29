import { execa } from "execa"
import jet from "fs-jetpack"

import { dirname, join } from "path"
import { fileURLToPath } from "url"

const LOCAL_LEDPI_DEPLOY_IP = process.env.LOCAL_LEDPI_DEPLOY_IP ?? "rasperrypi"
const LOCAL_LEDPI_DEPLOY_PATH = process.env.LOCAL_LEDPI_DEPLOY_PATH ?? "/home/pi/HCTRL"

const SCP_DEST = `${LOCAL_LEDPI_DEPLOY_IP}:${LOCAL_LEDPI_DEPLOY_PATH}`

const __dirname = dirname(fileURLToPath(import.meta.url))
const mainDir = join(__dirname, "../..")
const cwd = mainDir

const main = async () => {
  const mainPackage = jet.read("package.json", "json")
  const workspaces: string[] = mainPackage.workspaces

  await execa("npm", ["run", "build"], { cwd, stdio: "inherit" })

  const moduleFolders = workspaces
    .map(workspace => {
      return jet.find(mainDir, {
        matching: ["!**/node_modules/**", workspace],
        directories: true,
        files: false,
      })
    })
    .flat()

  const distFolders: string[] = []
  for (const folder of moduleFolders) {
    const dist = join(folder, "dist")
    if (jet.exists(dist)) distFolders.push(dist)
  }

  for (const source of distFolders) {
    const dest = join(SCP_DEST, source).replace(/\\/g, "/")
    await execa("scp", ["-r", source, dest], { cwd, stdio: "inherit" })
  }
}

main()
