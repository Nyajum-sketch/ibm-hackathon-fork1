import React from "react";
import { cn } from "@/lib/utils";

/**
 * KineticText Component
 * Creates a fluid wave animation across characters on hover using GPU-accelerated transforms
 * and variable font weights with zero layout shift.
 */
export function KineticText({
  text,
  as: Tag = "h1",
  className = "",
  style,
  ...rest
}) {
  return (
    <Tag
      {...rest}
      className={cn("kinetic-text-wrapper inline-flex flex-wrap justify-center select-none cursor-pointer", className)}
      style={style}
    >
      {text.split("").map((letter, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="kinetic-letter select-none"
        >
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

export default KineticText;
