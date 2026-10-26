import { describe, expect, it } from 'vitest';
import { getEducationalPinAlias, type EducationalPinLike } from '../utils/pinDisplayAliases';

function pins(...names: string[]): EducationalPinLike[] {
  return names.map((name) => ({ name }));
}

function alias(name: string, allPins: EducationalPinLike[]): string | undefined {
  const pin = allPins.find((item) => item.name === name);
  if (!pin) throw new Error(`Missing test pin ${name}`);
  return getEducationalPinAlias(pin, allPins);
}

describe('educational pin aliases', () => {
  it('labels LED polarity without changing A/C IDs', () => {
    const component = pins('A', 'C');
    expect(alias('A', component)).toBe('Anode (+)');
    expect(alias('C', component)).toBe('Cathode (-)');
  });

  it('labels diode polarity using A/K', () => {
    const component = pins('A', 'K');
    expect(alias('A', component)).toBe('Anode (+)');
    expect(alias('K', component)).toBe('Cathode (-)');
  });

  it('does not confuse a sensor NC pin with a relay contact', () => {
    const sensor = pins('VCC', 'DATA', 'NC', 'GND');
    expect(alias('NC', sensor)).toBeUndefined();

    const relay = pins('VCC', 'GND', 'IN', 'COM', 'NO', 'NC');
    expect(alias('COM', relay)).toBe('Common contact');
    expect(alias('NO', relay)).toBe('Normally open (NO)');
    expect(alias('NC', relay)).toBe('Normally closed (NC)');
  });

  it('labels seven-segment pins as segments', () => {
    const display = pins('A', 'B', 'C', 'D', 'E', 'F', 'G', 'DP', 'COM');
    expect(alias('A', display)).toBe('Segment A');
    expect(alias('G', display)).toBe('Segment G');
    expect(alias('DP', display)).toBe('Decimal point');
  });

  it('labels keypad rows and columns', () => {
    const keypad = pins('R1', 'R2', 'R3', 'R4', 'C1', 'C2', 'C3', 'C4');
    expect(alias('R3', keypad)).toBe('Row 3');
    expect(alias('C2', keypad)).toBe('Column 2');
  });

  it('labels common buses and power pins', () => {
    const module = pins('VCC', 'GND', 'SDA', 'SCL', 'MOSI', 'MISO', 'SCK', 'CS', 'TX', 'RX');
    expect(alias('VCC', module)).toBe('Supply (+)');
    expect(alias('GND', module)).toBe('Ground (0 V)');
    expect(alias('SDA', module)).toBe('I²C data (SDA)');
    expect(alias('SCL', module)).toBe('I²C clock (SCL)');
    expect(alias('MOSI', module)).toBe('SPI data (MOSI)');
    expect(alias('TX', module)).toBe('UART transmit (TX)');
  });

  it('uses upstream descriptions before generic guesses', () => {
    const component: EducationalPinLike[] = [
      { name: 'X', description: 'Custom sensor output' },
      { name: 'GND' },
    ];
    expect(alias('X', component)).toBe('Custom sensor output');
  });

  it('leaves unknown ambiguous pins alone', () => {
    const component = pins('X1', 'X2');
    expect(alias('X1', component)).toBeUndefined();
  });
});
