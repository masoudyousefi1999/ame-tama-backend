import { Injectable } from '@nestjs/common';
import { AbstractRepository } from '../../common/abstract.repository';
import { UserAddressEntity } from './entity/user-address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

@Injectable()
export class UserAddressRepository extends AbstractRepository<UserAddressEntity> {
  constructor(
    @InjectRepository(UserAddressEntity)
    UserAddressRepo: Repository<UserAddressEntity>,
  ) {
    super(UserAddressRepo);
  }
}
