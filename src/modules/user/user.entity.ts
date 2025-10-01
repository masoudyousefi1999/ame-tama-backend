import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity.ts';
import { RoleType } from '../../constants/role-type.ts';
import { UseDto } from '../../decorators/use-dto.decorator.ts';
import { UserDto } from './dtos/user.dto.ts';
import { MediaEntity } from '../../modules/media/media.entity.ts';
import { UserAddressEntity } from '../../modules/user-address/entity/user-address.entity.ts';
import { CommentEntity } from '../../modules/comment/entity/comment.entity.ts';

@Entity({ name: 'users' })
@UseDto(UserDto)
export class UserEntity extends AbstractEntity {
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  declare uuid: Uuid;

  @CreateDateColumn({
    type: 'timestamp',
  })
  declare createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  declare updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
  })
  declare deletedAt: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  firstName!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  lastName!: string | null;

  @Column({ type: 'enum', enum: RoleType, default: RoleType.USER })
  role!: RoleType;

  @Column({ unique: true, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'varchar' })
  phone!: string | null;

  @Column({ nullable: true, type: 'bigint' })
  avatar!: number | null;

  @ManyToOne(() => MediaEntity, { eager: true })
  @JoinColumn({ name: 'avatar', referencedColumnName: 'id' })
  media?: Relation<MediaEntity>;

  @OneToMany(() => UserAddressEntity, (address) => address.user, {
    cascade: true,
  })
  addresses!: Relation<UserAddressEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments!: Relation<CommentEntity[]>;
}
