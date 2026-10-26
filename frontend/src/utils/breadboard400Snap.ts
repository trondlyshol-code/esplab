import { BREADBOARD_400_HEIGHT } from '../velxio-elements/breadboard-400-element';

export interface Breadboard400Like {
  id: string;
  metadataId: string;
  x: number;
  y: number;
  properties?: Record<string, unknown>;
}

export interface Point {
  x: number;
  y: number;
}

/**
 * Magnet range for the mechanical tongue/groove join.
 *
 * The Elegoo kit uses two 400-point boards clipped together along their long
 * edges. In the simulator the default orientation is landscape, so the long
 * edges are the top/bottom edges. The electrical nets deliberately remain
 * independent; this helper changes position only.
 */
export const BREADBOARD_400_JOIN_TOLERANCE = 20;

export function snapBreadboard400ToMate(
  dragged: Breadboard400Like,
  tentativeX: number,
  tentativeY: number,
  components: Breadboard400Like[],
): Point | null {
  if (dragged.metadataId !== 'breadboard-400') return null;
  if ((Number(dragged.properties?.rotation) || 0) !== 0) return null;

  let best: { point: Point; distance: number } | null = null;

  for (const mate of components) {
    if (mate.id === dragged.id || mate.metadataId !== 'breadboard-400') continue;
    if ((Number(mate.properties?.rotation) || 0) !== 0) continue;

    // Real kit assembly: one long edge clips against the matching long edge
    // of the other board. Two boards therefore align their X coordinates and
    // sit exactly one board-height apart.
    const candidates: Point[] = [
      { x: mate.x, y: mate.y - BREADBOARD_400_HEIGHT },
      { x: mate.x, y: mate.y + BREADBOARD_400_HEIGHT },
    ];

    for (const point of candidates) {
      const dx = tentativeX - point.x;
      const dy = tentativeY - point.y;
      if (
        Math.abs(dx) > BREADBOARD_400_JOIN_TOLERANCE ||
        Math.abs(dy) > BREADBOARD_400_JOIN_TOLERANCE
      ) {
        continue;
      }
      const distance = Math.hypot(dx, dy);
      if (!best || distance < best.distance) best = { point, distance };
    }
  }

  return best?.point ?? null;
}
