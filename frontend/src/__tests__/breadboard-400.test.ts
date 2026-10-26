import { describe, expect, it } from 'vitest';
import {
  BREADBOARD_400_HEIGHT,
  BREADBOARD_400_PINS,
} from '../velxio-elements/breadboard-400-element';
import {
  BREADBOARD_400_JOIN_TOLERANCE,
  snapBreadboard400ToMate,
} from '../utils/breadboard400Snap';

describe('Elegoo 400-point breadboard', () => {
  it('contains exactly 400 tie points', () => {
    expect(BREADBOARD_400_PINS).toHaveLength(400);
  });

  it('has 300 terminal holes and 100 power-rail holes', () => {
    const terminal = BREADBOARD_400_PINS.filter((pin) => /^\d+[tb]\.[a-j]$/.test(pin.name));
    const rails = BREADBOARD_400_PINS.filter((pin) => /^[tb][pn]\.\d+$/.test(pin.name));
    expect(terminal).toHaveLength(300);
    expect(rails).toHaveLength(100);
  });

  it('snaps a second board to the long edge of the first', () => {
    const mate = { id: 'bb1', metadataId: 'breadboard-400', x: 100, y: 80 };
    const dragged = { id: 'bb2', metadataId: 'breadboard-400', x: 0, y: 0 };
    const snapped = snapBreadboard400ToMate(
      dragged,
      106,
      80 + BREADBOARD_400_HEIGHT - 5,
      [mate, dragged],
    );
    expect(snapped).toEqual({ x: 100, y: 80 + BREADBOARD_400_HEIGHT });
  });

  it('does not snap when the board is outside the join tolerance', () => {
    const mate = { id: 'bb1', metadataId: 'breadboard-400', x: 100, y: 80 };
    const dragged = { id: 'bb2', metadataId: 'breadboard-400', x: 0, y: 0 };
    const snapped = snapBreadboard400ToMate(
      dragged,
      100 + BREADBOARD_400_JOIN_TOLERANCE + 1,
      80 + BREADBOARD_400_HEIGHT,
      [mate, dragged],
    );
    expect(snapped).toBeNull();
  });

  it('does not mechanically join a 400-point board to other breadboard types', () => {
    const full = { id: 'bb-full', metadataId: 'breadboard', x: 100, y: 80 };
    const dragged = { id: 'bb400', metadataId: 'breadboard-400', x: 0, y: 0 };
    expect(
      snapBreadboard400ToMate(dragged, 100, 80 + BREADBOARD_400_HEIGHT, [full, dragged]),
    ).toBeNull();
  });
});
