import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { ProviderDetails } from './entities/provider-details.entity';
import { ConflictException } from '@nestjs/common';
import { Role } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';

describe('UsersService', () => {
  let service: UsersService;
  
  const mockUsersRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCompaniesRepository = {
    create: jest.fn(),
  };

  const mockProviderDetailsRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Company),
          useValue: mockCompaniesRepository,
        },
        {
          provide: getRepositoryToken(ProviderDetails),
          useValue: mockProviderDetailsRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should call findOne with correct params', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: '1' });
      const res = await service.findByEmail('test@test.com');
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
      expect(res).toEqual({ id: '1' });
    });
  });

  describe('findById', () => {
    it('should call findOne with correct params', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: '1' });
      const res = await service.findById('1');
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(res).toEqual({ id: '1' });
    });
  });

  describe('createClient', () => {
    it('should throw ConflictException if email exists', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: '1' });
      await expect(service.createClient('test', 'hash', 'rut', 'company')).rejects.toThrow(ConflictException);
    });

    it('should create and save new client', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      mockCompaniesRepository.create.mockReturnValue({ companyName: 'comp' });
      mockUsersRepository.create.mockReturnValue({ role: Role.CLIENT });
      mockUsersRepository.save.mockResolvedValueOnce({ role: Role.CLIENT });
      
      const res = await service.createClient('test', 'hash', 'rut', 'company');
      expect(mockCompaniesRepository.create).toHaveBeenCalledWith({ rut: 'rut', companyName: 'company' });
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
      expect(res).toEqual({ role: Role.CLIENT });
    });
  });

  describe('createProvider', () => {
    it('should throw ConflictException if email exists', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce({ id: '1' });
      await expect(service.createProvider('test', 'hash', 'rut1', 'company1')).rejects.toThrow(ConflictException);
    });

    it('should create and save new provider', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      mockProviderDetailsRepository.create.mockReturnValue({ id: 'prov-det' });
      mockUsersRepository.create.mockReturnValue({ role: Role.PROVIDER });
      mockUsersRepository.save.mockResolvedValueOnce({ role: Role.PROVIDER });
      
      const res = await service.createProvider('test', 'hash', 'rut1', 'company1');
      expect(mockProviderDetailsRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(mockUsersRepository.save).toHaveBeenCalled();
      expect(res).toEqual({ role: Role.PROVIDER });
    });
  });

  describe('setStatus', () => {
    it('should throw error if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.setStatus('1', UserStatus.ACTIVE)).rejects.toThrow('User not found');
    });

    it('should update status and save user', async () => {
      const user = { id: '1', status: UserStatus.PENDING_APPROVAL };
      mockUsersRepository.findOne.mockResolvedValueOnce(user);
      mockUsersRepository.save.mockResolvedValueOnce({ ...user, status: UserStatus.ACTIVE });
      
      const res = await service.setStatus('1', UserStatus.ACTIVE);
      expect(mockUsersRepository.save).toHaveBeenCalledWith({ id: '1', status: UserStatus.ACTIVE });
      expect(res.status).toBe(UserStatus.ACTIVE);
    });
  });
});
