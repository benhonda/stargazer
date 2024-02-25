import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import authLoadDirective from "./astro-authload-directive/register.js";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [authLoadDirective(), react(), tailwind()],
});
