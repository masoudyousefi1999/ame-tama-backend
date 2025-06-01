import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('otps')
export class OtpEntity {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column()
  phone!: string;

  @Column()
  otpCode!: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;
}
