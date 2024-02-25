/**
 * Hydrate on first click on the window
 * @type {import('astro').ClientDirective}
 */
export default (load, opts, el) => {
  window.addEventListener(
    "authload", // wait for authload event
    async () => {
      console.log("authload event received, hydrating...");
      console.log("authload opts", opts);
      const hydrate = await load();
      await hydrate();
    },
    { once: true }
  );
};
