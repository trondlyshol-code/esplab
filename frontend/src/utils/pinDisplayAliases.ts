export interface EducationalPinLike {
  name: string;
  description?: string;
}

function hasExactPinSet(pins: EducationalPinLike[], names: string[]): boolean {
  if (pins.length !== names.length) return false;
  const actual = new Set(pins.map((pin) => pin.name.toUpperCase()));
  return names.every((name) => actual.has(name));
}

/**
 * Returns a classroom-friendly display alias for a pin without changing the
 * technical pin ID used by wiring, simulation, imports, or saved projects.
 *
 * Component-specific aliases are detected from the complete pin signature,
 * which avoids turning an unrelated pin named A/B/C into the wrong label.
 */
export function getEducationalPinAlias(
  pin: EducationalPinLike,
  pins: EducationalPinLike[],
): string | undefined {
  const description = pin.description?.trim();

  if (description) {
    switch (description.toLowerCase()) {
      case 'anode':
        return 'Anode (+)';
      case 'cathode':
        return 'Cathode (-)';
      case 'base':
        return 'Base (B)';
      case 'collector':
        return 'Collector (C)';
      case 'emitter':
        return 'Emitter (E)';
      default:
        return description;
    }
  }

  const name = pin.name.toUpperCase();

  // Standard LED: A = anode, C = cathode.
  if (hasExactPinSet(pins, ['A', 'C'])) {
    if (name === 'A') return 'Anode (+)';
    if (name === 'C') return 'Cathode (-)';
  }

  // Diode variants commonly use A/K (K = cathode).
  if (hasExactPinSet(pins, ['A', 'K'])) {
    if (name === 'A') return 'Anode (+)';
    if (name === 'K') return 'Cathode (-)';
  }

  // Bipolar transistor.
  if (hasExactPinSet(pins, ['B', 'C', 'E'])) {
    if (name === 'B') return 'Base (B)';
    if (name === 'C') return 'Collector (C)';
    if (name === 'E') return 'Emitter (E)';
  }

  // Four-lead RGB LED. COM polarity depends on component configuration, so
  // deliberately do not label it + or - here.
  if (hasExactPinSet(pins, ['R', 'COM', 'G', 'B'])) {
    if (name === 'R') return 'Red';
    if (name === 'G') return 'Green';
    if (name === 'B') return 'Blue';
    if (name === 'COM') return 'Common (COM)';
  }

  // Wokwi potentiometer.
  if (hasExactPinSet(pins, ['GND', 'SIG', 'VCC'])) {
    if (name === 'GND') return 'Ground (0 V)';
    if (name === 'SIG') return 'Signal / wiper';
    if (name === 'VCC') return 'Supply (+)';
  }

  // Wokwi servo.
  if (hasExactPinSet(pins, ['GND', 'V+', 'PWM'])) {
    if (name === 'GND') return 'Ground (0 V)';
    if (name === 'V+') return 'Supply (+)';
    if (name === 'PWM') return 'Control signal (PWM)';
  }

  return undefined;
}
