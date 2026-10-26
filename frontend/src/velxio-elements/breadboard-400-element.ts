/**
 * <velxio-breadboard-400> — 400 tie-point solderless breadboard.
 *
 * Geometry follows the Elegoo ESP32 kit layout documented in the classroom
 * material: 30 terminal-strip columns x two 5-hole banks (300 tie points)
 * plus four 25-hole power-rail rows (100 tie points) = 400 total.
 *
 * Pin names deliberately follow the existing Wokwi/Velxio breadboard naming
 * convention so the normal breadboard net, seating and wiring machinery can
 * be reused unchanged:
 *   `${col}t.${a-e}` / `${col}b.${f-j}`
 *   `tp.N` / `tn.N` / `bp.N` / `bn.N`
 *
 * The drawing is programmatic rather than copied from Elegoo artwork. This
 * keeps the simulator implementation independent while matching the useful
 * physical geometry: 2.54 mm pitch, centre trench, labelled rows/columns and
 * red/blue power rails.
 */

const PITCH = 9.6;
const COLS = 30;
const RAIL_HOLES = 25;

const GRID_X0 = 16;
const RAIL_X0 = 20.8;

const ROW_Y: Record<string, number> = {
  tn: 14,
  tp: 23.6,
  a: 48,
  b: 57.6,
  c: 67.2,
  d: 76.8,
  e: 86.4,
  f: 115.2,
  g: 124.8,
  h: 134.4,
  i: 144,
  j: 153.6,
  bn: 178,
  bp: 187.6,
};

export const BREADBOARD_400_WIDTH = 310.4;
export const BREADBOARD_400_HEIGHT = 202;

export interface Breadboard400Pin {
  name: string;
  x: number;
  y: number;
  number: number;
  signals: [];
}

function railX(n: number): number {
  const idx = n - 1;
  // Real 400-point boards visually group rail holes in blocks of five.
  return RAIL_X0 + (idx + Math.floor(idx / 5)) * PITCH;
}

function buildPins(): Breadboard400Pin[] {
  const pins: Breadboard400Pin[] = [];
  let number = 1;

  for (const rail of ['tp', 'tn', 'bp', 'bn'] as const) {
    for (let i = 1; i <= RAIL_HOLES; i++) {
      pins.push({
        name: `${rail}.${i}`,
        x: railX(i),
        y: ROW_Y[rail],
        number: number++,
        signals: [],
      });
    }
  }

  for (let col = 1; col <= COLS; col++) {
    const x = GRID_X0 + (col - 1) * PITCH;
    for (const row of ['a', 'b', 'c', 'd', 'e'] as const) {
      pins.push({ name: `${col}t.${row}`, x, y: ROW_Y[row], number: number++, signals: [] });
    }
    for (const row of ['f', 'g', 'h', 'i', 'j'] as const) {
      pins.push({ name: `${col}b.${row}`, x, y: ROW_Y[row], number: number++, signals: [] });
    }
  }

  return pins;
}

const PINS: readonly Breadboard400Pin[] = buildPins();

/** Pure geometry export used by breadboard seating/snap logic and tests. */
export const BREADBOARD_400_PINS: readonly Breadboard400Pin[] = PINS;

function holeSvg(x: number, y: number): string {
  return `<rect x="${(x - 1.65).toFixed(2)}" y="${(y - 1.65).toFixed(2)}" width="3.3" height="3.3" rx="0.8" fill="#30343a"/>`;
}

function textSvg(text: string, x: number, y: number, anchor = 'middle'): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="Arial,sans-serif" font-size="6.4" fill="#777">${text}</text>`;
}

function buildSvg(): string {
  const w = BREADBOARD_400_WIDTH;
  const h = BREADBOARD_400_HEIGHT;
  const parts: string[] = [
    `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`,
    `<rect x="0.75" y="0.75" width="${w - 1.5}" height="${h - 1.5}" rx="5" fill="#fbfbf8" stroke="#cbc8c0" stroke-width="1.5"/>`,
    // Centre trench.
    `<rect x="5" y="94" width="${w - 10}" height="13.6" rx="2" fill="#ebe9e3"/>`,
    // Power rail guide lines.
    `<line x1="10" y1="28.8" x2="${w - 10}" y2="28.8" stroke="#df5353" stroke-width="1.3"/>`,
    `<line x1="10" y1="8.8" x2="${w - 10}" y2="8.8" stroke="#4b9bd8" stroke-width="1.3"/>`,
    `<line x1="10" y1="192.8" x2="${w - 10}" y2="192.8" stroke="#df5353" stroke-width="1.3"/>`,
    `<line x1="10" y1="172.8" x2="${w - 10}" y2="172.8" stroke="#4b9bd8" stroke-width="1.3"/>`,
    // Small visual hints for the tongue/groove interlock on the long edges.
    `<rect x="64" y="0" width="24" height="3" rx="1" fill="#dedbd3"/>`,
    `<rect x="${w - 88}" y="0" width="24" height="3" rx="1" fill="#dedbd3"/>`,
    `<rect x="64" y="${h - 3}" width="24" height="3" rx="1" fill="#dedbd3"/>`,
    `<rect x="${w - 88}" y="${h - 3}" width="24" height="3" rx="1" fill="#dedbd3"/>`,
  ];

  for (const pin of PINS) parts.push(holeSvg(pin.x, pin.y));

  for (let col = 1; col <= COLS; col++) {
    if (col === 1 || col % 5 === 0 || col === COLS) {
      const x = GRID_X0 + (col - 1) * PITCH;
      parts.push(textSvg(String(col), x, 42));
      parts.push(textSvg(String(col), x, 164.5));
    }
  }

  const topRows = ['a', 'b', 'c', 'd', 'e'];
  const bottomRows = ['f', 'g', 'h', 'i', 'j'];
  for (const row of topRows) {
    parts.push(textSvg(row, 7, ROW_Y[row] + 2.2));
    parts.push(textSvg(row, w - 7, ROW_Y[row] + 2.2));
  }
  for (const row of bottomRows) {
    parts.push(textSvg(row, 7, ROW_Y[row] + 2.2));
    parts.push(textSvg(row, w - 7, ROW_Y[row] + 2.2));
  }

  parts.push(textSvg('−', 7, 16.2));
  parts.push(textSvg('+', 7, 25.8));
  parts.push(textSvg('−', 7, 180.2));
  parts.push(textSvg('+', 7, 189.8));
  parts.push('</svg>');
  return parts.join('');
}

const SVG = buildSvg();

// DOM-free guard: geometry exports are used by node-side tests too.
const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement !== 'undefined'
    ? HTMLElement
    : (class {} as unknown as typeof HTMLElement);

export class Breadboard400Element extends HTMLElementBase {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.style.display = 'inline-block';
    this.style.width = `${BREADBOARD_400_WIDTH}px`;
    this.style.height = `${BREADBOARD_400_HEIGHT}px`;
    this.shadowRoot!.innerHTML = SVG;
  }

  get pinInfo() {
    return PINS as unknown as Array<{ name: string; x: number; y: number; number: number }>;
  }
}

if (typeof customElements !== 'undefined' && !customElements.get('velxio-breadboard-400')) {
  customElements.define('velxio-breadboard-400', Breadboard400Element);
}
