import { Column, CreateDateColumn, Entity, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../common/abstract.entity';

@Entity({ name: 'shipping_method' })
export class ShippingMethodEntity extends AbstractEntity {
  @Column()
  name!: string;

  @Column()
  price!: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}
