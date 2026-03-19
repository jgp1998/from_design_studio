import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Company } from './entities/company.entity';
import { ProviderDetails } from './entities/provider-details.entity';
import { Role } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    @InjectRepository(ProviderDetails)
    private providerDetailsRepository: Repository<ProviderDetails>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createClient(
    email: string,
    passwordHash: string,
    rut: string,
    companyName: string,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const company = this.companiesRepository.create({
      rut,
      companyName,
    });

    const user = this.usersRepository.create({
      email,
      passwordHash,
      role: Role.CLIENT,
      status: UserStatus.ACTIVE, // Clients can be active right away, or per rule
      company,
    });

    return this.usersRepository.save(user);
  }

  async createProvider(
    email: string,
    passwordHash: string,
    rut: string,
    companyName: string,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const company = this.companiesRepository.create({
      rut,
      companyName,
    });

    const providerDetails = this.providerDetailsRepository.create();

    const user = this.usersRepository.create({
      email,
      passwordHash,
      role: Role.PROVIDER,
      status: UserStatus.PENDING_APPROVAL,
      company,
      providerDetails,
    });

    return this.usersRepository.save(user);
  }

  async setStatus(id: string, status: UserStatus): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    user.status = status;
    return this.usersRepository.save(user);
  }
}
