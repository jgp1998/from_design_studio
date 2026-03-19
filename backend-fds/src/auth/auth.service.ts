import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterB2BDto } from './dto/register-b2b.dto';
import { RegisterProviderDto } from './dto/register-provider.dto';
import { LoginDto } from './dto/login.dto';
import { validateRut } from '../common/utils/rut.util';
import { isCorporateEmail } from '../common/utils/email.util';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerB2B(dto: RegisterB2BDto): Promise<Omit<User, 'passwordHash'>> {
    if (!isCorporateEmail(dto.email)) {
      throw new BadRequestException('Email must be from a corporate domain');
    }

    if (!validateRut(dto.rut)) {
      throw new BadRequestException('Invalid Chilean RUT');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.usersService.createClient(
      dto.email,
      passwordHash,
      dto.rut,
      dto.companyName,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...result } = user;
    return result;
  }

  async registerProvider(
    dto: RegisterProviderDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    if (!validateRut(dto.rut)) {
      throw new BadRequestException('Invalid Chilean RUT');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.usersService.createProvider(
      dto.email,
      passwordHash,
      dto.rut,
      dto.companyName,
    );


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...result } = user;
    return result;
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await bcrypt.compare(pass, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _ph, ...result } = user;
    return result;
  }

  async login(dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.validateUser(dto.email, dto.password);

    // We can also check if user is SUSPENDED or PENDING_APPROVAL here
    // But for Epic 1, we might just block suspended.
    // Wait, B2B becomes active automatically, Providers become PENDING_APPROVAL.
    // If we want to block pending providers:
    // if (user.status === 'PENDING_APPROVAL') {
    //   throw new UnauthorizedException('Account not yet approved');
    // }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
