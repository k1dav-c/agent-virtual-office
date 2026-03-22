import { useEffect, useMemo, useRef, useState } from "react";

import { TILESET_PATH, TILE_SIZE, getTilePosition } from "../../config/tiles";
import type { TileMapData } from "../../types/agent";

interface Props {
  map: TileMapData;
  children?: React.ReactNode;
}

/**
 * CSS grid tilemap renderer using a PNG spritesheet.
 * Renders each layer as an absolute-positioned grid,
 * scaled to fit the parent container.
 */
export default function TileMap({ map, children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const mapPxW = map.width * map.tileSize;
  const mapPxH = map.height * map.tileSize;

  // Scale tilemap to fit container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { clientWidth, clientHeight } = container;
      const sx = clientWidth / mapPxW;
      const sy = clientHeight / mapPxH;
      setScale(Math.min(sx, sy));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, [mapPxW, mapPxH]);

  // Pre-compute tile positions (memoized)
  const tilePositions = useMemo(() => {
    const cache = new Map<number, { x: number; y: number } | null>();
    const allTileIds = new Set<number>();
    for (const layer of map.layers) {
      for (const id of layer.data) {
        if (id !== 0) allTileIds.add(id);
      }
    }
    for (const id of allTileIds) {
      cache.set(id, getTilePosition(id));
    }
    return cache;
  }, [map]);

  // Sort layers by depth
  const sortedLayers = useMemo(
    () => [...map.layers].sort((a, b) => a.depth - b.depth),
    [map.layers],
  );

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        backgroundColor: "#3c5956",
        backgroundImage: `url("/assets/tiles/green-floor-3x3.png")`,
        backgroundSize: "96px 96px",
        backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
    >
      <div
        className="absolute"
        style={{
          width: mapPxW,
          height: mapPxH,
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          imageRendering: "pixelated",
        }}
      >
        {/* Tile layers */}
        {sortedLayers.map((layer) => (
          <div
            key={layer.name}
            className="absolute inset-0"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${map.width}, ${map.tileSize}px)`,
              gridTemplateRows: `repeat(${map.height}, ${map.tileSize}px)`,
              zIndex: layer.depth,
            }}
          >
            {layer.data.map((tileId, i) => {
              if (tileId === 0) return <div key={i} />;
              const pos = tilePositions.get(tileId);
              if (!pos) return <div key={i} />;
              return (
                <div
                  key={i}
                  style={{
                    width: map.tileSize,
                    height: map.tileSize,
                    backgroundImage: `url("${TILESET_PATH}")`,
                    backgroundPosition: `${pos.x}px ${pos.y}px`,
                    backgroundSize: `${TILE_SIZE * 8}px auto`,
                    backgroundRepeat: "no-repeat",
                  }}
                />
              );
            })}
          </div>
        ))}

        {/* Agent layer + overlays (passed as children) */}
        <div className="absolute inset-0" style={{ zIndex: 10 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
