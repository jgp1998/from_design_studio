import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    registerB2B: jest.fn(),
    registerProvider: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registerB2B should call service', async () => {
    const dto = {
      email: 'test@corp.com',
      password: 'pass',
      rut: '1-9',
      companyName: 'Corp',
    };
    mockAuthService.registerB2B.mockResolvedValue({ id: 'user-1' });
    const result = await controller.registerB2B(dto);
    expect(service.registerB2B).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 'user-1' });
  });

  it('registerProvider should call service', async () => {
    const dto = {
      email: 'prov@corp.com',
      password: 'pass',
      rut: '12345678-9',
      companyName: 'Corp Prov',
    };
    mockAuthService.registerProvider.mockResolvedValue({ id: 'user-prov' });
    const result = await controller.registerProvider(dto);
    expect(service.registerProvider).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 'user-prov' });
  });

  it('login should call service', async () => {
    const dto = { email: 'a@a.com', password: 'p' };
    mockAuthService.login.mockResolvedValue({ token: 'token', user: { id: 'usr', email: 'a@a.com', role: 'CLIENT' } });
    const result = await controller.login(dto);
    expect(service.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ token: 'token', user: { id: 'usr', email: 'a@a.com', role: 'CLIENT' } });
  });
});
