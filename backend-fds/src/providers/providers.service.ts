import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageService } from '../storage/storage.service';
import { ProviderDocument } from '../users/entities/provider-document.entity';
import { User } from '../users/entities/user.entity';
import { DocumentType } from '../common/enums/document-type.enum';
import { UserStatus } from '../common/enums/user-status.enum';

@Injectable()
export class ProvidersService {
  constructor(
    private storageService: StorageService,
    @InjectRepository(ProviderDocument)
    private providerDocumentsRepository: Repository<ProviderDocument>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getPresignedUrlUpload(
    userId: string,
    filename: string,
    documentType: DocumentType,
  ): Promise<{ url: string; key: string }> {
    const key = `providers/${userId}/${Date.now()}_${filename}`;
    const url = await this.storageService.getPresignedUrlUpload(key);

    // Save pending document associated with this user
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const document = this.providerDocumentsRepository.create({
      documentType,
      storageObjectKey: key,
      user,
    });
    await this.providerDocumentsRepository.save(document);

    return { url, key };
  }

  // Admin endpoints:
  async approveProvider(providerId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: providerId },
    });
    if (!user) throw new NotFoundException('Provider not found');

    user.status = UserStatus.ACTIVE;
    return this.usersRepository.save(user);
  }

  async getDocumentDownloadUrl(
    providerId: string,
    documentId: string,
  ): Promise<string> {
    const document = await this.providerDocumentsRepository.findOne({
      where: { id: documentId, user: { id: providerId } },
      relations: ['user'],
    });

    if (!document) throw new NotFoundException('Document not found');

    return this.storageService.getPresignedUrlDownload(
      document.storageObjectKey,
    );
  }
}
