import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  base: "/Booking/", // use '/myapp/' if deployed at https://site.com/myapp/
  build: { outDir: "dist" }, // default is 'dist', but set explicitly
  preview: { port: 3000 }, // optional: preview on 3000 so you're used to it
});
