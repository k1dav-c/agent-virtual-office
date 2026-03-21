import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "warning" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

/*
 * Pixel-art game button — thick border, drop-shadow that shrinks on press,
 * monospace font, no rounded corners.
 *
 * Colour map (Nord-ish):
 *   primary  → indigo  (#5e81ac / #4c6a91)
 *   secondary→ grey    (#d8dee9 / #c0c8d8)
 *   danger   → red     (#bf616a / #a34e56)
 *   warning  → gold    (#ebcb8b / #d4b56e)
 *   outline  → ghost   (transparent / border only)
 */

const VARIANTS: Record<
  NonNullable<ButtonProps["variant"]>,
  { bg: string; bgHover: string; fg: string; shadow: string }
> = {
  primary: {
    bg: "#5e81ac",
    bgHover: "#4c6a91",
    fg: "#eceff4",
    shadow: "#2e4a6e",
  },
  secondary: {
    bg: "#d8dee9",
    bgHover: "#c0c8d8",
    fg: "#2e3440",
    shadow: "#8892a6",
  },
  danger: {
    bg: "#bf616a",
    bgHover: "#a34e56",
    fg: "#eceff4",
    shadow: "#7a2e35",
  },
  warning: {
    bg: "#ebcb8b",
    bgHover: "#d4b56e",
    fg: "#2e3440",
    shadow: "#9e8540",
  },
  outline: {
    bg: "transparent",
    bgHover: "#e5e9f0",
    fg: "#5e81ac",
    shadow: "#4c566a",
  },
};

const SIZES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1 text-[11px]",
  md: "px-5 py-2 text-xs",
  lg: "px-7 py-3 text-sm",
};

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  style,
  ...props
}) => {
  const v = VARIANTS[variant];
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        inline-flex items-center justify-center font-bold
        select-none transition-all duration-75
        active:translate-y-[3px]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0
        ${SIZES[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      style={{
        fontFamily: "'Courier New', monospace",
        background: v.bg,
        color: v.fg,
        border: `3px solid #4c566a`,
        borderRadius: 2,
        boxShadow: isDisabled ? "none" : `0 4px 0 ${v.shadow}`,
        cursor: isDisabled ? "not-allowed" : "pointer",
        imageRendering: "pixelated",
        letterSpacing: "0.05em",
        ...style,
      }}
      disabled={isDisabled}
      onMouseEnter={(e) => {
        if (!isDisabled) e.currentTarget.style.background = v.bgHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = v.bg;
      }}
      onMouseDown={(e) => {
        if (!isDisabled)
          e.currentTarget.style.boxShadow = `0 1px 0 ${v.shadow}`;
      }}
      onMouseUp={(e) => {
        if (!isDisabled)
          e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`;
      }}
      {...props}
    >
      {loading && (
        <span
          className="mr-2 inline-block w-3 h-3 border-2 border-current border-t-transparent animate-spin"
          style={{ borderRadius: 1 }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;
