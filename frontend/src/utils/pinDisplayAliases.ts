export interface EducationalPinLike {
  name: string;
  description?: string;
  signals?: Array<{ type: string; signal?: string }>;
}

function normalizedNames(pins: EducationalPinLike[]): Set<string> {
  return new Set(pins.map((pin) => pin.name.trim().toUpperCase()));
}

function hasExactPinSet(pins: EducationalPinLike[], names: string[]): boolean {
  if (pins.length !== names.length) return false;
  const actual = normalizedNames(pins);
  return names.every((name) => actual.has(name.toUpperCase()));
}

function hasPins(pins: EducationalPinLike[], names: string[]): boolean {
  const actual = normalizedNames(pins);
  return names.every((name) => actual.has(name.toUpperCase()));
}

function descriptionAlias(description?: string): string | undefined {
  const value = description?.trim();
  if (!value) return undefined;

  switch (value.toLowerCase()) {
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
    case 'ground':
    case 'gnd':
      return 'Ground (0 V)';
    case 'power':
    case 'supply':
      return 'Supply (+)';
    default:
      // Upstream descriptions are already useful teaching labels. Preserve
      // them instead of replacing them with a less precise generic alias.
      return value;
  }
}

function componentSpecificAlias(
  name: string,
  pins: EducationalPinLike[],
): string | undefined {
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
  // deliberately do not label it + or -.
  if (hasExactPinSet(pins, ['R', 'COM', 'G', 'B'])) {
    if (name === 'R') return 'Red channel';
    if (name === 'G') return 'Green channel';
    if (name === 'B') return 'Blue channel';
    if (name === 'COM') return 'Common (COM)';
  }

  // Potentiometer.
  if (hasExactPinSet(pins, ['GND', 'SIG', 'VCC'])) {
    if (name === 'GND') return 'Ground (0 V)';
    if (name === 'SIG') return 'Signal / wiper';
    if (name === 'VCC') return 'Supply (+)';
  }

  // Hobby servo.
  if (hasExactPinSet(pins, ['GND', 'V+', 'PWM'])) {
    if (name === 'GND') return 'Ground (0 V)';
    if (name === 'V+') return 'Supply (+)';
    if (name === 'PWM') return 'Control signal (PWM)';
  }

  // Relay contacts. This intentionally requires all three contact labels so a
  // sensor pin named NC is not accidentally described as normally closed.
  if (hasPins(pins, ['COM', 'NO', 'NC'])) {
    if (name === 'COM') return 'Common contact';
    if (name === 'NO') return 'Normally open (NO)';
    if (name === 'NC') return 'Normally closed (NC)';
  }

  // Character LCD (HD44780-style).
  if (hasPins(pins, ['RS', 'RW', 'E', 'D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7'])) {
    if (name === 'VSS') return 'Ground (0 V)';
    if (name === 'VDD') return 'Supply (+)';
    if (name === 'VO') return 'Contrast voltage';
    if (name === 'RS') return 'Register select';
    if (name === 'RW') return 'Read / write';
    if (name === 'E') return 'Enable';
    if (/^D[0-7]$/.test(name)) return `Data bit ${name.slice(1)}`;
    if (name === 'A') return 'Backlight anode (+)';
    if (name === 'K') return 'Backlight cathode (-)';
  }

  // Seven-segment displays. A-G are segment names here, not transistor pins.
  if (hasPins(pins, ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'DP'])) {
    if (/^[A-G]$/.test(name)) return `Segment ${name}`;
    if (name === 'DP') return 'Decimal point';
    if (name === 'COM') return 'Common (COM)';
  }

  // Matrix keypads use R1..Rn and C1..Cn.
  const names = [...normalizedNames(pins)];
  const rowCount = names.filter((value) => /^R\d+$/.test(value)).length;
  const columnCount = names.filter((value) => /^C\d+$/.test(value)).length;
  if (rowCount >= 2 && columnCount >= 2) {
    const row = name.match(/^R(\d+)$/);
    if (row) return `Row ${row[1]}`;
    const column = name.match(/^C(\d+)$/);
    if (column) return `Column ${column[1]}`;
  }

  // 74HC595-style shift register.
  if (hasPins(pins, ['DS', 'SHCP', 'STCP'])) {
    if (name === 'DS') return 'Serial data input';
    if (name === 'SHCP') return 'Shift-register clock';
    if (name === 'STCP') return 'Latch / storage clock';
    if (name === 'OE') return 'Output enable (active low)';
    if (name === 'MR') return 'Master reset (active low)';
    if (name === 'Q7S') return 'Serial data output';
    const output = name.match(/^Q(\d+)$/);
    if (output) return `Parallel output Q${output[1]}`;
  }

  // Joystick modules.
  if (hasPins(pins, ['HORZ', 'VERT', 'SEL'])) {
    if (name === 'HORZ') return 'Horizontal axis';
    if (name === 'VERT') return 'Vertical axis';
    if (name === 'SEL') return 'Pushbutton / select';
  }

  // Rotary encoder modules.
  if (hasPins(pins, ['CLK', 'DT', 'SW'])) {
    if (name === 'CLK') return 'Encoder clock';
    if (name === 'DT') return 'Encoder data';
    if (name === 'SW') return 'Pushbutton';
  }

  // MPU-style IMU auxiliary/address pins.
  if (hasPins(pins, ['SDA', 'SCL']) && (hasPins(pins, ['XDA', 'XCL']) || hasPins(pins, ['AD0', 'INT']))) {
    if (name === 'XDA') return 'Auxiliary I²C data';
    if (name === 'XCL') return 'Auxiliary I²C clock';
    if (name === 'AD0') return 'I²C address select';
    if (name === 'INT') return 'Interrupt output';
  }

  // Typical three-pin sensor/module with a single S pin.
  if (hasPins(pins, ['VCC', 'GND', 'S']) && name === 'S') {
    return 'Signal';
  }

  // Simple two-terminal polarized loads/sources. The component type may vary,
  // so use electrical polarity rather than claiming it is specifically a motor.
  if (hasExactPinSet(pins, ['+', '-'])) {
    if (name === '+') return 'Positive (+)';
    if (name === '-') return 'Negative (-)';
  }

  // Bipolar stepper/motor coil labels.
  if (hasPins(pins, ['A+', 'A-', 'B+', 'B-'])) {
    if (name === 'A+') return 'Coil A (+)';
    if (name === 'A-') return 'Coil A (-)';
    if (name === 'B+') return 'Coil B (+)';
    if (name === 'B-') return 'Coil B (-)';
  }

  return undefined;
}

const GENERIC_ALIASES: Record<string, string> = {
  GND: 'Ground (0 V)',
  GROUND: 'Ground (0 V)',
  AGND: 'Analog ground',
  DGND: 'Digital ground',
  VSS: 'Ground / negative supply',

  VCC: 'Supply (+)',
  VDD: 'Supply (+)',
  'V+': 'Supply (+)',
  VS: 'Supply (+)',
  VIN: 'Supply input (VIN)',
  VBUS: 'USB supply (VBUS)',
  VBAT: 'Battery supply',
  BAT: 'Battery supply',
  AVCC: 'Analog supply',
  '3V3': '3.3 V supply',
  '3.3V': '3.3 V supply',
  '5V': '5 V supply',
  VREF: 'Reference voltage',
  AREF: 'Analog reference voltage',
  VM: 'Motor supply',
  VMOT: 'Motor supply',

  SDA: 'I²C data (SDA)',
  SCL: 'I²C clock (SCL)',
  MOSI: 'SPI data (MOSI)',
  MISO: 'SPI data (MISO)',
  SCK: 'SPI clock (SCK)',
  SCLK: 'SPI clock (SCLK)',
  SS: 'SPI chip select (SS)',
  CS: 'Chip select (CS)',
  CSN: 'Chip select (CSN)',
  NSS: 'Chip select (NSS)',
  SDI: 'Serial data input',
  SDO: 'Serial data output',

  TX: 'UART transmit (TX)',
  TXD: 'UART transmit (TX)',
  RX: 'UART receive (RX)',
  RXD: 'UART receive (RX)',

  TRIG: 'Trigger input',
  TRIGGER: 'Trigger input',
  ECHO: 'Echo output',
  PWM: 'Control signal (PWM)',
  SIG: 'Signal',
  SIGNAL: 'Signal',
  DATA: 'Data',
  DAT: 'Data',
  DIN: 'Data input',
  DOUT: 'Data output',
  DI: 'Data input',
  DO: 'Data output',
  AIN: 'Analog input',
  AI: 'Analog input',
  AOUT: 'Analog output',
  AO: 'Analog output',
  ADC: 'Analog input (ADC)',
  DAC: 'Analog output (DAC)',

  CLK: 'Clock',
  CLOCK: 'Clock',
  EN: 'Enable',
  ENABLE: 'Enable',
  CE: 'Chip enable',
  RST: 'Reset',
  RESET: 'Reset',
  RES: 'Reset',
  INT: 'Interrupt',
  IRQ: 'Interrupt request',
  BUSY: 'Busy / status',
  READY: 'Ready / status',
  RDY: 'Ready / status',

  DC: 'Data / command',
  'D/C': 'Data / command',
  CMD: 'Command',
  BL: 'Backlight',
  BLK: 'Backlight',
  LED: 'LED / backlight',

  CANH: 'CAN bus high',
  CANL: 'CAN bus low',
  'D+': 'USB data (+)',
  'D-': 'USB data (-)',
  BCLK: 'I²S bit clock',
  LRCLK: 'I²S left/right clock',
  WS: 'I²S word select',

  SWDIO: 'SWD data',
  SWCLK: 'SWD clock',
  TDI: 'JTAG data in',
  TDO: 'JTAG data out',
  TCK: 'JTAG clock',
  TMS: 'JTAG mode select',
};

function genericNumberedAlias(name: string): string | undefined {
  const input = name.match(/^IN(\d+)$/);
  if (input) return `Input ${input[1]}`;

  const output = name.match(/^OUT(\d+)$/);
  if (output) return `Output ${output[1]}`;

  const enable = name.match(/^EN(\d+)$/);
  if (enable) return `Enable ${enable[1]}`;

  const chipSelect = name.match(/^CS(\d+)$/);
  if (chipSelect) return `Chip select ${chipSelect[1]}`;

  const tx = name.match(/^TX(\d+)$/);
  if (tx) return `UART transmit ${tx[1]}`;

  const rx = name.match(/^RX(\d+)$/);
  if (rx) return `UART receive ${rx[1]}`;

  return undefined;
}

/**
 * Returns a classroom-friendly display alias for a pin without changing the
 * technical pin ID used by wiring, simulation, imports, or saved projects.
 *
 * Priority:
 * 1. Explicit upstream pin description.
 * 2. Component-signature rules for otherwise ambiguous names.
 * 3. Safe generic electrical/protocol names.
 * 4. No alias when ESP-Lab cannot identify the pin confidently.
 */
export function getEducationalPinAlias(
  pin: EducationalPinLike,
  pins: EducationalPinLike[],
): string | undefined {
  const explicit = descriptionAlias(pin.description);
  if (explicit) return explicit;

  const name = pin.name.trim().toUpperCase();

  const componentAlias = componentSpecificAlias(name, pins);
  if (componentAlias) return componentAlias;

  const genericAlias = GENERIC_ALIASES[name];
  if (genericAlias) return genericAlias;

  const numberedAlias = genericNumberedAlias(name);
  if (numberedAlias) return numberedAlias;

  return undefined;
}
