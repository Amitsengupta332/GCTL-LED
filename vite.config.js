import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { readdirSync } from "node:fs";

function getHtmlInputs() {
  const rootDir = process.cwd();

  const htmlFiles = readdirSync(rootDir).filter((file) =>
    file.endsWith(".html"),
  );

  const inputs = {};

  htmlFiles.forEach((file) => {
    const name = file.replace(".html", "");
    inputs[name] = resolve(rootDir, file);
  });

  return inputs;
}

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

        if (req.url && req.url.startsWith("/products/details/")) {
          req.url = "/index.html";
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

        if (req.url && req.url.startsWith("/products/details/")) {
          req.url = "/index.html";
        }

        next();
      });
    },
  };
}

export default defineConfig({
  appType: "mpa",

  plugins: [tailwindcss(), cleanRoutes()],

  build: {
    outDir: "dist",
    emptyOutDir: true,

    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
});