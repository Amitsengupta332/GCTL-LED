import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

function cleanProjectDetailsRoute() {
  return {
    name: "clean-project-details-route",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        next();
      });
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), cleanProjectDetailsRoute()],
});