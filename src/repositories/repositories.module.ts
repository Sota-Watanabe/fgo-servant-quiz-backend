import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileQuizEntity } from '@/database/entities/profile-quiz.entity';
import { QuizResultRepository } from '@/repositories/profile-quiz.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileQuizEntity])],
  providers: [QuizResultRepository],
  exports: [QuizResultRepository],
})
export class RepositoriesModule {}
