import { defineConfig } from "vite"
import hyperapp from "vite-plugin-hyperapp"
export default defineConfig({
  plugins: [hyperapp({ hmr: false })],
})
