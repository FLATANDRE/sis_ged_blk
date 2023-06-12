import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    //alias: [
    //  { find: "@", replacement: "/src" }
    //]
    alias : {
      "@" : "/src",
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: 'util',
    }
  },
});
