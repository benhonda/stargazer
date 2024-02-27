/**
 * Button or link component
 */

import { twMerge } from "tailwind-merge";

const primaryClasses =
  "bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 text-gray-300 px-2.5 py-1.5 text-sm rounded-md";

export function Clickable(
  props: { variant: "primary" | "primary-lg"; as?: "button" | "a" } & React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
) {
  const { as = "button", variant, className, ...rest } = props;

  const classes = twMerge(
    "inline-flex items-center",
    variant === "primary" ? primaryClasses : "",
    variant === "primary-lg" ? primaryClasses + " px-4 py-2 text-base" : "",
    className
  );

  if (as === "button") {
    return <button type="button" className={classes} {...rest} />;
  }

  if (as === "a") {
    return <a className={classes} {...rest} />;
  }

  return null;
}
