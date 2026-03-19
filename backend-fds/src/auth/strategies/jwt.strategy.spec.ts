import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should throw UnauthorizedException if no payload provided', () => {
      expect(() => strategy.validate(null as any)).toThrow(UnauthorizedException);
    });

    it('should return mapped user details from payload', () => {
      const payload = { sub: 'u1', email: 'e@e.com', role: 'CLIENT' };
      const res = strategy.validate(payload);
      expect(res).toEqual({ userId: 'u1', email: 'e@e.com', role: 'CLIENT' });
    });
  });

  describe('when JWT_SECRET is undefined', () => {
    it('should fallback to defaultSecretForDev', async () => {
      const emptyConfigService = {
        get: jest.fn().mockReturnValue(undefined),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          JwtStrategy,
          { provide: ConfigService, useValue: emptyConfigService },
        ],
      }).compile();

      const strat = module.get<JwtStrategy>(JwtStrategy);
      expect(strat).toBeDefined();
      expect(emptyConfigService.get).toHaveBeenCalledWith('JWT_SECRET');
    });
  });
});
