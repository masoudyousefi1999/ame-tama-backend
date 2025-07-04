import { Module } from '@nestjs/common';
import { UserAddressService } from './user-address.service';
import { UserAddressController } from './user-address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAddressEntity } from './entity/user-address.entity';
import { UserAddressRepository } from './user-address.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddressEntity])],
  providers: [UserAddressService, UserAddressRepository],
  controllers: [UserAddressController],
  exports: [UserAddressService],
})
export class UserAddressModule {}
