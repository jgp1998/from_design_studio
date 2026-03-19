import { isCorporateEmail } from './email.util';

describe('Email Util', () => {
  describe('isCorporateEmail', () => {
    it('should return false for free domains', () => {
      expect(isCorporateEmail('test@gmail.com')).toBe(false);
      expect(isCorporateEmail('user@hotmail.com')).toBe(false);
      expect(isCorporateEmail('foo@yahoo.com')).toBe(false);
    });

    it('should return false if there is no domain / invalid email', () => {
      expect(isCorporateEmail('noatsign')).toBe(false);
    });

    it('should return true for corporate domains', () => {
      expect(isCorporateEmail('test@mycorp.com')).toBe(true);
      expect(isCorporateEmail('user@startup.io')).toBe(true);
    });
  });
});
