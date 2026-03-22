import { useEffect, useState } from "react";

interface Props {
  text: string;
  visible: boolean;
  /** Bubble auto-hides after this many ms. 0 = never. */
  autoHideMs?: number;
}

/**
 * WorkAdventure-style speech bubble above a character.
 * White rounded rect with triangle pointer, positioned above.
 */
export default function SpeechBubble({
  text,
  visible,
  autoHideMs = 10000,
}: Props) {
  const [show, setShow] = useState(visible);

  // Reset visibility when text changes
  useEffect(() => {
    if (visible) {
      setShow(true);
      if (autoHideMs > 0) {
        const timer = setTimeout(() => setShow(false), autoHideMs);
        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [visible, text, autoHideMs]);

  if (!show || !text) return null;

  const truncated = text.length > 60 ? text.slice(0, 57) + "..." : text;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 4,
        zIndex: 20,
      }}
    >
      <div
        className="relative px-2 py-1 rounded-md text-[9px] leading-tight whitespace-nowrap"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          color: "#2e3440",
          maxWidth: 180,
          whiteSpace: "normal",
          wordBreak: "break-word",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          fontFamily: "'Courier New', monospace",
          fontWeight: 600,
        }}
      >
        {truncated}
        {/* Triangle pointer */}
        <div
          className="absolute"
          style={{
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            width: 0,
            height: 0,
            borderLeft: "4px solid transparent",
            borderRight: "4px solid transparent",
            borderTop: "4px solid rgba(255, 255, 255, 0.92)",
          }}
        />
      </div>
    </div>
  );
}
