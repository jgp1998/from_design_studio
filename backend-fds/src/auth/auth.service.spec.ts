import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

jest.mock('../common/utils/rut.util', () => ({
  validateRut: jest.fn().mockImplementation((rut) => rut !== 'invalid'),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    createClient: jest.fn(),
    createProvider: jest.fn(),
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerB2B', () => {
    it('should throw BadRequestException if email is not corporate', async () => {
      await expect(
        service.registerB2B({ email: 'test@gmail.com', password: '123', rut: '111', companyName: 'Name' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if RUT is invalid', async () => {
      await expect(
        service.registerB2B({ email: 'test@company.com', password: '123', rut: 'invalid', companyName: 'Name' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register client successfully', async () => {
      mockUsersService.createClient.mockResolvedValue({ id: 'usr-1', passwordHash: 'hw' });
      const res = await service.registerB2B({ email: 'test@company.com', password: '123', rut: '18312061-K', companyName: 'Name' });
      expect(mockUsersService.createClient).toHaveBeenCalled();
      expect(res).toEqual({ id: 'usr-1' });
    });
  });

  describe('registerProvider', () => {
    it('should register provider successfully', async () => {
      mockUsersService.createProvider.mockResolvedValue({ id: 'usr-2', passwordHash: 'hw' });
      const res = await service.registerProvider({ email: 'test@prov.com', password: '123', rut: 'rut2', companyName: 'company2' });
      expect(mockUsersService.createProvider).toHaveBeenCalled();
      expect(res).toEqual({ id: 'usr-2' });
    });
  });

  describe('validateUser', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.validateUser('notfound', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password mismatch', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'usr', passwordHash: 'hash' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.validateUser('mail', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });

    it('should return user without passwordHash on success', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'usr', passwordHash: 'hash', role: 'CLIENT' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const res = await service.validateUser('mail', 'pass');
      expect(res).toEqual({ id: 'usr', role: 'CLIENT' });
    });
  });

  describe('login', () => {
    it('should return user and token', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 'usr', email: 'mail', passwordHash: 'hash', role: 'CLIENT' });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      const res = await service.login({ email: 'mail', password: 'pass' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ email: 'mail', sub: 'usr', role: 'CLIENT' });
      expect(res).toEqual({
        token: 'mocked_jwt_token',
        user: { id: 'usr', email: 'mail', role: 'CLIENT' },
      });
    });
  });
});
