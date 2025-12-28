import { UserEntity } from '../../user/user.entity';
import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, type Relation } from 'typeorm';
import { ArtWorkEntity } from './art-work.entity';

@Entity({ name: 'artwork_reaction' })
export class ArtWorkReactionEntity extends AbstractEntity {
  @Column({ type: 'bigint' })
  userId!: number;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: Relation<UserEntity>;

  @Column({ type: 'bigint' })
  artworkId!: number;

  @ManyToOne(() => ArtWorkEntity, { eager: true })
  @JoinColumn({ name: 'artwork_id', referencedColumnName: 'id' })
  artwork!: Relation<ArtWorkEntity>;

  @Column({ type: 'smallint' })
  reaction!: 1 | -1;
}
