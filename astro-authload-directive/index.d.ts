import "astro";
declare module "astro" {
  interface AstroClientDirectives {
    "client:authload"?: boolean;
  }
}
