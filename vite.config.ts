import { defineConfig } from "vite"
import hyperapp from "vite-plugin-hyperapp"
export default defineConfig({
  base: "/synth-sequencer/",
  plugins: [hyperapp({ hmr: false })],
})
