import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { ProfileQuizEntity } from '@/database/entities/profile-quiz.entity';

@Injectable()
export class QuizResultRepository {
  constructor(
    @InjectRepository(ProfileQuizEntity)
    private readonly repository: Repository<ProfileQuizEntity>,
  ) {}

  async save(
    params: Partial<ProfileQuizEntity>,
    manager?: EntityManager,
  ): Promise<ProfileQuizEntity> {
    const repository = manager
      ? manager.getRepository(ProfileQuizEntity)
      : this.repository;
    const record = repository.create(params);
    return repository.save(record);
  }

  async findByServantId(
    servantId: number,
    manager?: EntityManager,
  ): Promise<ProfileQuizEntity | null> {
    const repository = manager
      ? manager.getRepository(ProfileQuizEntity)
      : this.repository;
    return repository.findOne({ where: { servantId } });
  }
}
