import { Column, Entity } from 'typeorm';

import { TimestampedEntity } from '@/database/entities/base.entity';

@Entity({ name: 'profile_quiz' })
export class ProfileQuizEntity extends TimestampedEntity {
  @Column({ type: 'int', name: 'servant_id' })
  servantId: number;

  @Column({ type: 'text', name: 'raw_profile' })
  rawProfile: string;

  @Column({ type: 'text', name: 'masked_profile' })
  maskedProfile: string;
}
