import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../common/abstract.repository';
import { OtpEntity } from './otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
//@ts-ignore
export class OtpRepository extends AbstractRepository<OtpEntity> {
  constructor(
    @InjectRepository(OtpEntity) protected otpRepo: Repository<OtpEntity>,
  ) {
    super(otpRepo);
  }
}
