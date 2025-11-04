import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'rss' })
export class RssEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  url!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
