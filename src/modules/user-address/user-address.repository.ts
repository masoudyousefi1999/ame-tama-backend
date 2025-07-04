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

  async makeAllAddressDefaultFalse(userId: number) {
    await this.repository.query(
      'update "user_addresses" set "default" = false where user_id = $1::bigint',
      [userId],
    );

    return;
  }
}
