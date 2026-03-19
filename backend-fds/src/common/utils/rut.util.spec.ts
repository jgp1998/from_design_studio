import { cleanRut, validateRut } from './rut.util';

describe('Rut Util', () => {
  describe('cleanRut', () => {
    it('should return empty string if no rut is provided', () => {
      expect(cleanRut('')).toBe('');
      expect(cleanRut(null as any)).toBe('');
      expect(cleanRut(undefined as any)).toBe('');
    });

    it('should remove formatting and uppercase the rut', () => {
      expect(cleanRut('19.123.123-k')).toBe('19123123K');
      expect(cleanRut('  1.111.111 - 4  ')).toBe('11111114');
    });
  });

  describe('validateRut', () => {
    it('should return false if cleaned rut length is less than 2', () => {
      expect(validateRut('1')).toBe(false);
      expect(validateRut('')).toBe(false);
    });

    it('should return true for valid RUTs', () => {
      // expectedDvResult is normal (e.g. 9)
      expect(validateRut('1-9')).toBe(true);
      expect(validateRut('1111111-4')).toBe(true);

      // expectedDvResult is 11, maps to '0'
      expect(validateRut('76000000-0')).toBe(true);
      expect(validateRut('76.000.000-0')).toBe(true);

      // expectedDvResult is 10, maps to 'K'
      expect(validateRut('6-K')).toBe(true);
      expect(validateRut('6-k')).toBe(true); // Should work due to cleaning
    });

    it('should return false for invalid RUTs', () => {
      expect(validateRut('1-8')).toBe(false);
      expect(validateRut('1111111-5')).toBe(false);
      expect(validateRut('76000000-1')).toBe(false);
      expect(validateRut('6-0')).toBe(false);
    });
  });
});
