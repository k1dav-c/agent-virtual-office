/**
 * PNG tileset configuration for the tilemap office.
 *
 * Uses a pre-built PNG spritesheet at /assets/tiles/office-tileset.png
 * arranged in an 8-column grid of 32×32 tiles.
 *
 * Tile ID mapping:
 *   0  = empty (transparent)
 *   1  = wood floor
 *   2  = carpet (blue)
 *   3  = tile floor (light)
 *   4  = dark floor
 *   5  = wall top
 *   6  = wall left
 *   7  = wall right
 *   8  = wall bottom
 *   9  = wall corner TL
 *  10  = wall corner TR
 *  11  = wall corner BL
 *  12  = wall corner BR
 *  13  = desk horizontal
 *  14  = desk vertical
 *  15  = chair (empty seat marker)
 *  16  = monitor / laptop
 *  17  = plant
 *  18  = bookshelf
 *  19  = whiteboard
 *  20  = coffee machine
 *  21  = rug center
 *  22  = door
 *  23  = table (meeting)
 *  24  = couch
 *  25  = water cooler
 *  26  = lamp
 *  27  = server rack
 *  28  = wall clock
 *  29  = vending machine
 *  30  = trash can
 *  31  = printer
 *  32  = warm carpet
 *  33  = window
 *  34  = potted flower
 *  35  = wall art / picture frame
 */

export const TILE_SIZE = 32;
export const TILESET_COLS = 8;
export const TILESET_PATH = "/assets/tiles/office-tileset.png";
export const TILE_COUNT = 36;

/**
 * Get the CSS background-position for a tile ID within the tileset PNG.
 * Returns null for tile 0 (empty/transparent).
 */
export function getTilePosition(
  tileId: number,
): { x: number; y: number } | null {
  if (tileId <= 0 || tileId >= TILE_COUNT) return null;
  const col = tileId % TILESET_COLS;
  const row = Math.floor(tileId / TILESET_COLS);
  return { x: -(col * TILE_SIZE), y: -(row * TILE_SIZE) };
}
