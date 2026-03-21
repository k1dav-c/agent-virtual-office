/**
 * Isometric SVG office backgrounds for each scene level.
 * Uses pixel-art aesthetic (G=3 grid) with isometric perspective.
 */

interface Props {
  level: number;
  bgColor: string;
  wallColor: string;
  floorColor: string;
  accentColor: string;
}

const W = 480;
const H = 270;
const WALL_H = 95; // ~35% of 270

/** Darken a hex color by a factor */
function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, ((n >> 16) & 0xff) - Math.round(amount * 255));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(amount * 255));
  const b = Math.max(0, (n & 0xff) - Math.round(amount * 255));
  return `rgb(${r},${g},${b})`;
}

/** Lighten a hex color by a factor */
function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, ((n >> 16) & 0xff) + Math.round(amount * 255));
  const g = Math.min(255, ((n >> 8) & 0xff) + Math.round(amount * 255));
  const b = Math.min(255, (n & 0xff) + Math.round(amount * 255));
  return `rgb(${r},${g},${b})`;
}

function GarageBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Brick lines on wall */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`wl-${i}`} x1="0" y1={i * 16} x2={W} y2={i * 16} stroke={darken(wallColor, 0.05)} strokeWidth="1" />
      ))}
      {/* Exposed pipes */}
      <rect x="20" y="6" width={360} height="3" fill={darken(wallColor, 0.15)} rx="1" />
      <rect x="20" y="6" width="3" height="24" fill={darken(wallColor, 0.15)} rx="1" />
      <rect x="377" y="6" width="3" height="18" fill={darken(wallColor, 0.15)} rx="1" />
      {/* Fluorescent light */}
      <rect x="150" y="12" width="180" height="6" fill="#888" rx="1" />
      <rect x="156" y="14" width="168" height="2" fill="#e8e8d0" opacity="0.8" />
      <rect x="156" y="14" width="168" height="2" fill={accentColor} opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.4;0.15;0.3;0.2" dur="3s" repeatCount="indefinite" />
      </rect>
      {/* Garage door outline */}
      <rect x="18" y="24" width="120" height="71" fill={darken(wallColor, 0.1)} stroke={darken(wallColor, 0.2)} strokeWidth="2" />
      {Array.from({ length: 4 }, (_, i) => (
        <line key={`gd-${i}`} x1="18" y1={24 + (i + 1) * 14} x2="138" y2={24 + (i + 1) * 14} stroke={darken(wallColor, 0.15)} strokeWidth="1" />
      ))}
      {/* Cracks in wall */}
      <polyline points="300,30 306,42 303,54 309,66" fill="none" stroke={darken(wallColor, 0.12)} strokeWidth="1" />
      <polyline points="420,20 417,36 423,48" fill="none" stroke={darken(wallColor, 0.1)} strokeWidth="1" />

      {/* Floor — concrete slabs */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      {/* Baseboard */}
      <rect x="0" y={WALL_H} width={W} height="4" fill={darken(wallColor, 0.1)} />
      {/* Concrete slab joints */}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`fh-${i}`} x1="0" y1={WALL_H + 30 + i * 36} x2={W} y2={WALL_H + 30 + i * 36} stroke={darken(floorColor, 0.06)} strokeWidth="1" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`fv-${i}`} x1={60 + i * 60} y1={WALL_H} x2={60 + i * 60} y2={H} stroke={darken(floorColor, 0.04)} strokeWidth="1" />
      ))}
      {/* Oil stain */}
      <ellipse cx="360" cy="220" rx="18" ry="8" fill={darken(floorColor, 0.08)} opacity="0.5" />
    </>
  );
}

function CoworkingBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Exposed brick section */}
      <rect x="0" y="0" width="150" height={WALL_H} fill={darken(wallColor, 0.06)} />
      {Array.from({ length: 12 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) => (
          <rect
            key={`brk-${row}-${col}`}
            x={3 + col * 30 + (row % 2) * 15}
            y={3 + row * 8}
            width="27"
            height="6"
            fill={darken(wallColor, 0.08 + (row * col) % 3 * 0.02)}
            rx="0.5"
          />
        ))
      )}
      {/* Window */}
      <rect x="200" y="12" width="120" height="66" fill="#87CEEB" stroke={darken(wallColor, 0.15)} strokeWidth="3" rx="1" />
      <line x1="260" y1="12" x2="260" y2="78" stroke={darken(wallColor, 0.15)} strokeWidth="2" />
      <line x1="200" y1="45" x2="320" y2="45" stroke={darken(wallColor, 0.15)} strokeWidth="2" />
      {/* Clouds in window */}
      <ellipse cx="230" cy="36" rx="12" ry="6" fill="white" opacity="0.6" />
      <ellipse cx="290" cy="30" rx="9" ry="5" fill="white" opacity="0.4" />
      {/* String lights */}
      <path d="M 160,18 Q 240,30 320,18 Q 400,30 460,18" fill="none" stroke="#333" strokeWidth="1" />
      {[180, 210, 240, 270, 300, 330, 360, 390, 420, 450].map((x, i) => (
        <circle key={`sl-${i}`} cx={x} cy={18 + Math.sin(x / 30) * 6} r="2" fill={accentColor} opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
        </circle>
      ))}

      {/* Floor — wood planks */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      <rect x="0" y={WALL_H} width={W} height="3" fill={darken(wallColor, 0.08)} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={`plank-${i}`}>
          <rect
            x="0"
            y={WALL_H + 3 + i * 16}
            width={W}
            height="15"
            fill={i % 2 === 0 ? floorColor : lighten(floorColor, 0.03)}
          />
          <line
            x1="0" y1={WALL_H + 3 + i * 16}
            x2={W} y2={WALL_H + 3 + i * 16}
            stroke={darken(floorColor, 0.08)} strokeWidth="0.5"
          />
          {/* Wood grain */}
          <line
            x1={30 + i * 20} y1={WALL_H + 5 + i * 16}
            x2={80 + i * 20} y2={WALL_H + 5 + i * 16}
            stroke={darken(floorColor, 0.04)} strokeWidth="0.5"
          />
        </g>
      ))}
    </>
  );
}

function StartupBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Glass partition accent line */}
      <rect x="0" y={WALL_H - 2} width={W} height="2" fill={accentColor} opacity="0.3" />
      {/* Track lights */}
      {[80, 180, 280, 380].map((x) => (
        <g key={`tl-${x}`}>
          <rect x={x} y="6" width="24" height="6" fill="#aaa" rx="1" />
          <rect x={x + 6} y="12" width="12" height="3" fill="#ccc" />
          <circle cx={x + 12} cy="18" r="4" fill={accentColor} opacity="0.15">
            <animate attributeName="opacity" values="0.1;0.25;0.1" dur="4s" repeatCount="indefinite" />
          </circle>
        </g>
      ))}
      {/* Whiteboard area */}
      <rect x="340" y="24" width="100" height="54" fill="white" stroke="#ccc" strokeWidth="2" rx="1" />
      <line x1="355" y1="36" x2="420" y2="36" stroke="#ddd" strokeWidth="1" />
      <line x1="355" y1="48" x2="410" y2="48" stroke="#ddd" strokeWidth="1" />
      <line x1="355" y1="60" x2="400" y2="60" stroke="#ddd" strokeWidth="1" />
      {/* Green dot on whiteboard */}
      <circle cx="365" cy="36" r="2" fill={accentColor} />

      {/* Floor — polished tiles */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      {/* Tile grid */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`th-${i}`} x1="0" y1={WALL_H + i * 24} x2={W} y2={WALL_H + i * 24}
          stroke={darken(floorColor, 0.06)} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`tv-${i}`} x1={i * 48} y1={WALL_H} x2={i * 48} y2={H}
          stroke={darken(floorColor, 0.06)} strokeWidth="0.5" />
      ))}
      {/* Glass partition on floor */}
      <rect x="380" y={WALL_H} width="3" height={H - WALL_H} fill={accentColor} opacity="0.15" />
    </>
  );
}

function CorporateBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Wainscoting — lower wall darker */}
      <rect x="0" y="48" width={W} height={WALL_H - 48} fill={darken(wallColor, 0.06)} />
      <rect x="0" y="48" width={W} height="2" fill={darken(wallColor, 0.1)} />
      {/* Crown molding */}
      <rect x="0" y="0" width={W} height="3" fill={darken(wallColor, 0.08)} />
      {/* Wainscoting panels */}
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={`wp-${i}`} x={10 + i * 60} y="54" width="50" height="36"
          fill="none" stroke={darken(wallColor, 0.06)} strokeWidth="1" rx="0.5" />
      ))}
      {/* Recessed ceiling lights */}
      {[90, 240, 390].map((x) => (
        <g key={`rl-${x}`}>
          <rect x={x} y="6" width="60" height="3" fill={lighten(wallColor, 0.08)} />
          <rect x={x + 6} y="9" width="48" height="2" fill={accentColor} opacity="0.12">
            <animate attributeName="opacity" values="0.08;0.15;0.08" dur="5s" repeatCount="indefinite" />
          </rect>
        </g>
      ))}
      {/* Framed artwork */}
      <rect x="30" y="18" width="36" height="24" fill={darken(wallColor, 0.03)} stroke={darken(wallColor, 0.12)} strokeWidth="2" />
      <rect x="33" y="21" width="30" height="18" fill={accentColor} opacity="0.15" />

      {/* Floor — marble tiles */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      <rect x="0" y={WALL_H} width={W} height="3" fill={darken(wallColor, 0.06)} />
      {/* Marble tile grid */}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`mh-${i}`} x1="0" y1={WALL_H + 3 + i * 30} x2={W} y2={WALL_H + 3 + i * 30}
          stroke={darken(floorColor, 0.05)} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`mv-${i}`} x1={i * 54} y1={WALL_H} x2={i * 54} y2={H}
          stroke={darken(floorColor, 0.05)} strokeWidth="0.5" />
      ))}
      {/* Marble veins */}
      <path d="M 60,130 Q 90,140 120,135 Q 150,128 180,140" fill="none"
        stroke={darken(floorColor, 0.04)} strokeWidth="0.5" opacity="0.6" />
      <path d="M 240,160 Q 270,155 300,165 Q 330,170 360,160" fill="none"
        stroke={darken(floorColor, 0.04)} strokeWidth="0.5" opacity="0.5" />
    </>
  );
}

function TechCampusBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall — glass with green tint */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Large windows */}
      {[0, 160, 320].map((x) => (
        <g key={`win-${x}`}>
          <rect x={x + 10} y="12" width="130" height="72" fill="#a8d8a8" opacity="0.25"
            stroke={darken(wallColor, 0.12)} strokeWidth="2" />
          <line x1={x + 75} y1="12" x2={x + 75} y2="84" stroke={darken(wallColor, 0.1)} strokeWidth="1.5" />
          <line x1={x + 10} y1="48" x2={x + 140} y2="48" stroke={darken(wallColor, 0.1)} strokeWidth="1.5" />
        </g>
      ))}
      {/* Tree silhouettes visible through windows */}
      <circle cx="60" cy="42" r="18" fill="#6a9a6a" opacity="0.3" />
      <rect x="57" y="54" width="6" height="18" fill="#5a7a5a" opacity="0.25" />
      <circle cx="250" cy="36" r="14" fill="#6a9a6a" opacity="0.25" />
      <rect x="248" y="48" width="5" height="15" fill="#5a7a5a" opacity="0.2" />
      {/* Structural columns */}
      {[158, 318].map((x) => (
        <rect key={`col-${x}`} x={x} y="0" width="6" height={WALL_H} fill={darken(wallColor, 0.12)} />
      ))}
      {/* Skylights */}
      {[120, 240, 360].map((x) => (
        <rect key={`sky-${x}`} x={x} y="0" width="48" height="3" fill={accentColor} opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.2;0.1" dur="6s" repeatCount="indefinite" />
        </rect>
      ))}

      {/* Floor — polished stone */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      <rect x="0" y={WALL_H} width={W} height="2" fill={darken(wallColor, 0.08)} />
      {/* Large stone tiles */}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`sh-${i}`} x1="0" y1={WALL_H + 2 + i * 36} x2={W} y2={WALL_H + 2 + i * 36}
          stroke={darken(floorColor, 0.06)} strokeWidth="0.5" />
      ))}
      {Array.from({ length: 7 }, (_, i) => (
        <line key={`sv-${i}`} x1={i * 72} y1={WALL_H} x2={i * 72} y2={H}
          stroke={darken(floorColor, 0.06)} strokeWidth="0.5" />
      ))}
      {/* Floor plant bed */}
      <rect x="420" y={WALL_H + 10} width="50" height="8" fill="#7ab37a" opacity="0.3" rx="2" />
    </>
  );
}

function FutureHQBackground({ wallColor, floorColor, accentColor }: Omit<Props, "level" | "bgColor">) {
  return (
    <>
      {/* Wall — dark with glow edges */}
      <rect x="0" y="0" width={W} height={WALL_H} fill={wallColor} />
      {/* Star field */}
      {Array.from({ length: 30 }, (_, i) => (
        <circle
          key={`star-${i}`}
          cx={(i * 137 + 23) % W}
          cy={(i * 53 + 7) % (WALL_H - 10)}
          r={i % 3 === 0 ? 1.5 : 0.8}
          fill={accentColor}
          opacity={0.15 + (i % 4) * 0.1}
        >
          <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.1};${0.3 + (i % 3) * 0.1};${0.1 + (i % 3) * 0.1}`} dur={`${2 + (i % 4)}s`} repeatCount="indefinite" />
        </circle>
      ))}
      {/* Glowing wall edge lines */}
      <rect x="0" y={WALL_H - 2} width={W} height="2" fill={accentColor} opacity="0.6">
        <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
      </rect>
      <rect x="0" y="0" width={W} height="1.5" fill={accentColor} opacity="0.3">
        <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
      </rect>
      {/* Holographic panels */}
      {[60, 200, 340].map((x) => (
        <g key={`hp-${x}`}>
          <rect x={x} y="18" width="90" height="54" fill={accentColor} opacity="0.04"
            stroke={accentColor} strokeWidth="1" strokeOpacity="0.25" rx="1" />
          {/* Scan line inside panel */}
          <rect x={x + 3} y="24" width="84" height="2" fill={accentColor} opacity="0.1">
            <animate attributeName="y" values="24;66;24" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.05;0.2;0.05" dur="3s" repeatCount="indefinite" />
          </rect>
        </g>
      ))}
      {/* Vertical glow columns */}
      {[120, 240, 360].map((x) => (
        <rect key={`gc-${x}`} x={x} y="0" width="2" height={WALL_H} fill={accentColor} opacity="0.15">
          <animate attributeName="opacity" values="0.1;0.25;0.1" dur={`${2.5 + (x % 3) * 0.5}s`} repeatCount="indefinite" />
        </rect>
      ))}

      {/* Floor — dark with luminous grid */}
      <rect x="0" y={WALL_H} width={W} height={H - WALL_H} fill={floorColor} />
      {/* Luminous grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`gh-${i}`} x1="0" y1={WALL_H + i * 24} x2={W} y2={WALL_H + i * 24}
          stroke={accentColor} strokeWidth="0.5" opacity="0.12" />
      ))}
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`gv-${i}`} x1={i * 48} y1={WALL_H} x2={i * 48} y2={H}
          stroke={accentColor} strokeWidth="0.5" opacity="0.12" />
      ))}
      {/* Glow pulse on floor center */}
      <ellipse cx={W / 2} cy={WALL_H + 60} rx="60" ry="20" fill={accentColor} opacity="0.04">
        <animate attributeName="opacity" values="0.02;0.06;0.02" dur="4s" repeatCount="indefinite" />
      </ellipse>
      {/* Floor edge glow */}
      <rect x="0" y={H - 2} width={W} height="2" fill={accentColor} opacity="0.2">
        <animate attributeName="opacity" values="0.15;0.3;0.15" dur="3.5s" repeatCount="indefinite" />
      </rect>
    </>
  );
}

export default function IsometricBackground({
  level,
  bgColor,
  wallColor,
  floorColor,
  accentColor,
}: Props) {
  const shared = { wallColor, floorColor, accentColor };

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      shapeRendering="crispEdges"
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {/* Base background */}
      <rect x="0" y="0" width={W} height={H} fill={bgColor} />

      {level === 1 && <GarageBackground {...shared} />}
      {level === 2 && <CoworkingBackground {...shared} />}
      {level === 3 && <StartupBackground {...shared} />}
      {level === 4 && <CorporateBackground {...shared} />}
      {level === 5 && <TechCampusBackground {...shared} />}
      {level === 6 && <FutureHQBackground {...shared} />}
    </svg>
  );
}
