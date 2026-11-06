import { DateTime } from 'luxon';
import { describe, expect, it } from 'vitest';

import { convertToLocalSystemFormat, toLuxonDateFormat } from './date-formats';

describe('toLuxonDateFormat', () => {
  it('translates date-fns XXX timezone token to Luxon ZZ token', () => {
    expect(toLuxonDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX")).toBe("yyyy-MM-dd'T'HH:mm:ss.SSSZZ");
  });

  it('stamps numeric timezone offset instead of literal XXX', () => {
    const dt = DateTime.fromISO('2026-03-05T10:20:30.123', { zone: 'UTC' });
    const output = dt.toFormat(toLuxonDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));

    expect(output).not.toContain('XXX');
    expect(output).toBe('2026-03-05T10:20:30.123+00:00');
  });

  it('formats non-UTC timezone offsets accurately', () => {
    const dt = DateTime.fromISO('2026-03-05T10:20:30.123', { zone: 'Asia/Kolkata' });
    const output = dt.toFormat(toLuxonDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSXXX"));

    expect(output).toBe('2026-03-05T10:20:30.123+05:30');
  });

  it('parses previously stamped dates with literal XXX suffix in convertToLocalSystemFormat', () => {
    const result = convertToLocalSystemFormat(
      '2026-03-05T10:20:30.123XXX',
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      'UTC',
    );

    expect(result).not.toBe('Invalid date');
    expect(result).not.toContain('XXX');
  });

  it('leaves non-ISO format strings unchanged', () => {
    expect(toLuxonDateFormat('yyyy-MM-dd')).toBe('yyyy-MM-dd');
    expect(toLuxonDateFormat('dd/MM/yyyy')).toBe('dd/MM/yyyy');
  });
});
