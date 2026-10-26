import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd(), '..');

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}

function write(rel, value) {
  fs.writeFileSync(path.join(repoRoot, rel), value);
}

function replaceRequired(source, from, to, label) {
  if (source.includes(to)) return source; // idempotent
  if (!source.includes(from)) {
    throw new Error(`ESP-Lab patch failed (${label}): expected source text not found`);
  }
  return source.replace(from, to);
}

function patchIndex() {
  const rel = 'frontend/src/velxio-elements/index.ts';
  let source = read(rel);
  source = replaceRequired(
    source,
    "import './breadboard-mini-element';",
    "import './breadboard-mini-element';\nimport './breadboard-400-element';",
    'register breadboard-400 element',
  );
  source = replaceRequired(
    source,
    "export { BreadboardMiniElement } from './breadboard-mini-element';",
    "export { BreadboardMiniElement } from './breadboard-mini-element';\nexport { Breadboard400Element } from './breadboard-400-element';",
    'export breadboard-400 element',
  );
  write(rel, source);
}

function patchBreadboardNets() {
  const rel = 'frontend/src/utils/breadboardNets.ts';
  let source = read(rel);
  source = replaceRequired(
    source,
    "const BREADBOARD_IDS = new Set(['breadboard', 'breadboard-mini']);",
    "const BREADBOARD_IDS = new Set(['breadboard', 'breadboard-mini', 'breadboard-400']);",
    'recognise breadboard-400 electrical nets',
  );
  write(rel, source);
}

function patchBreadboardSeating() {
  const rel = 'frontend/src/utils/breadboardSnap.ts';
  let source = read(rel);

  source = replaceRequired(
    source,
    "import {\n  BREADBOARD_MINI_PINS,\n} from '../velxio-elements/breadboard-mini-element';",
    "import {\n  BREADBOARD_MINI_PINS,\n} from '../velxio-elements/breadboard-mini-element';\nimport { BREADBOARD_400_PINS } from '../velxio-elements/breadboard-400-element';",
    'import 400-point hole grid',
  );

  source = replaceRequired(
    source,
    "  if (metadataId === 'breadboard-mini') return BREADBOARD_MINI_PINS;\n  return null;",
    "  if (metadataId === 'breadboard-mini') return BREADBOARD_MINI_PINS;\n  if (metadataId === 'breadboard-400') return BREADBOARD_400_PINS;\n  return null;",
    'use 400-point hole grid for seating',
  );

  write(rel, source);
}

function patchElegooPicker() {
  const rel = 'frontend/src/components/ComponentPickerModal.tsx';
  let source = read(rel);
  source = replaceRequired(
    source,
    "const ELEGOO_COMPONENT_IDS = new Set([\n  'led',",
    "const ELEGOO_COMPONENT_IDS = new Set([\n  'breadboard-400',\n  'led',",
    'show breadboard-400 in Elegoo Kit',
  );
  write(rel, source);
}

function patchCanvasMechanicalSnap() {
  const rel = 'frontend/src/components/simulator/SimulatorCanvas.tsx';
  let source = read(rel);

  const importAnchor = "} from '../../utils/breadboardSnap';";
  const importLine = "import { snapBreadboard400ToMate } from '../../utils/breadboard400Snap';";
  if (!source.includes(importLine)) {
    if (!source.includes(importAnchor)) {
      throw new Error('ESP-Lab patch failed (breadboard mechanical snap import): import anchor missing');
    }
    source = source.replace(importAnchor, `${importAnchor}\n${importLine}`);
  }

  const oldLine =
    'const snapped = cur && snapPositionToBreadboard(cur, nx, ny, simState.components);';
  const newLine =
    'const snapped = cur && (snapBreadboard400ToMate(cur, nx, ny, simState.components) ?? snapPositionToBreadboard(cur, nx, ny, simState.components));';

  if (!source.includes(newLine)) {
    const count = source.split(oldLine).length - 1;
    if (count !== 2) {
      throw new Error(`ESP-Lab patch failed (breadboard mechanical snap): expected 2 drag sites, found ${count}`);
    }
    source = source.split(oldLine).join(newLine);
  }

  write(rel, source);
}

function patchMetadata() {
  const rel = 'frontend/public/components-metadata.json';
  const data = JSON.parse(read(rel));
  if (!Array.isArray(data.components)) {
    throw new Error('ESP-Lab patch failed (metadata): components array missing');
  }

  const metadata = {
    id: 'breadboard-400',
    tagName: 'velxio-breadboard-400',
    name: 'Breadboard 400 (Elegoo)',
    category: 'passive',
    description:
      '400 tie-point solderless breadboard used in the Elegoo ESP32 kit: 30 columns with two 5-hole terminal banks plus four 25-hole power rails. Two boards can mechanically snap together while remaining electrically separate.',
    thumbnail:
      '<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="11" width="56" height="42" rx="3" fill="#fbfbf8" stroke="#c8c4bc"/><line x1="8" y1="16" x2="56" y2="16" stroke="#4b9bd8"/><line x1="8" y1="20" x2="56" y2="20" stroke="#df5353"/><rect x="7" y="30" width="50" height="5" fill="#eceae4"/><g fill="#333"><circle cx="13" cy="25" r="1.2"/><circle cx="20" cy="25" r="1.2"/><circle cx="27" cy="25" r="1.2"/><circle cx="34" cy="25" r="1.2"/><circle cx="41" cy="25" r="1.2"/><circle cx="48" cy="25" r="1.2"/><circle cx="13" cy="40" r="1.2"/><circle cx="20" cy="40" r="1.2"/><circle cx="27" cy="40" r="1.2"/><circle cx="34" cy="40" r="1.2"/><circle cx="41" cy="40" r="1.2"/><circle cx="48" cy="40" r="1.2"/></g><line x1="8" y1="46" x2="56" y2="46" stroke="#4b9bd8"/><line x1="8" y1="50" x2="56" y2="50" stroke="#df5353"/></svg>',
    properties: [],
    defaultValues: {},
    pinCount: 400,
    featured: true,
    tags: ['breadboard', '400', '400-point', '400-tie-point', 'elegoo', 'protoboard', 'passive'],
  };

  const existingIndex = data.components.findIndex((component) => component.id === metadata.id);
  if (existingIndex >= 0) data.components[existingIndex] = metadata;
  else data.components.push(metadata);

  write(rel, `${JSON.stringify(data, null, 2)}\n`);
}

patchIndex();
patchBreadboardNets();
patchBreadboardSeating();
patchElegooPicker();
patchCanvasMechanicalSnap();
patchMetadata();

console.log('Applied ESP-Lab v1 classroom patches (including Elegoo 400-point breadboard).');
