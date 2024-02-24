import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    colors: {
      transparent: colors.transparent,
      black: colors.black,
      white: colors.white,
      gray: {
        ...colors.zinc,
        925: "#0C0C0D",
      },
      primary: colors.violet,
      secondary: colors.amber,
      // support
      blue: colors.blue,
      green: colors.green,
      red: colors.red,
      yellow: colors.yellow,
    },
    extend: {
      fontFamily: {
        display: ["GeneralSans-Variable", ...defaultTheme.fontFamily.serif],
        body: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
