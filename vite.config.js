import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

function cleanRoutes() {
  return {
    name: "clean-routes",

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/blogs/")) {
          req.url = "/blog-details.html";
        }

        if (req.url && req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        next();
      });
    },

    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.startsWith("/blogs/")) {
          req.url = "/blog-details.html";
        }

        if (req.url && req.url.startsWith("/project-details/")) {
          req.url = "/project-details.html";
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), cleanRoutes()],
});
