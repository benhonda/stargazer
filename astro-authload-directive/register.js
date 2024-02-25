/**
 * @type {() => import('astro').AstroIntegration}
 */
export default () => ({
  name: "client:authload",
  hooks: {
    "astro:config:setup": ({ addClientDirective }) => {
      addClientDirective({
        name: "authload",
        entrypoint: "./astro-authload-directive/authload.js",
      });
    },
  },
});
