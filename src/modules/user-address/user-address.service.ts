import { CreateUserAddressDto } from './dto/create-address.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAddressRepository } from './user-address.repository';
import type { UserEntity } from 'modules/user/user.entity';
import { IsNull } from 'typeorm';
import { province } from './data/province.data';
import { cities } from './data/city.data';

@Injectable()
export class UserAddressService {
  constructor(private userAddressRepo: UserAddressRepository) {}

  async createAddress(
    user: UserEntity,
    createUserAddressDto: CreateUserAddressDto,
  ) {
    if (!user) {
      throw new ForbiddenException();
    }

    const userId = user.id;

    await this.userAddressRepo.makeAllAddressDefaultFalse(userId);

    const address = await this.userAddressRepo.create({
      ...createUserAddressDto,
      userId,
      default: true,
    });

    address.user = user;

    return address.toDto();
  }

  async getAddresses(user: UserEntity) {
    if (!user) {
      throw new ForbiddenException();
    }

    const userId = user.id;

    const { document: addresses, count } = await this.userAddressRepo.find({
      filter: { userId, deletedAt: IsNull() },
    });

    if (addresses.length === 0) {
      return [];
    }

    const normalizedAddresses = addresses.map((item) => item.toDto());

    return { addresses: normalizedAddresses, totalCount: count };
  }

  async getAddress(addressId: Uuid, user: UserEntity) {
    const address = await this.userAddressRepo.findOne({
      filter: { uuid: addressId, deletedAt: IsNull() },
    });

    if (!address) {
      throw new NotFoundException('address not founded');
    }

    address.user = user;

    return address.toDto();
  }

  async getProvince() {
    return province;
  }

  async getCities() {
    return cities;
  }

  async updateAddress(
    addressId: Uuid,
    updateAddressDto: CreateUserAddressDto,
    user: UserEntity,
  ) {
    const address = await this.userAddressRepo.findOne({
      filter: { uuid: addressId },
    });

    if (!address) {
      throw new NotFoundException('address not founded');
    }

    const updatedAddress = await this.userAddressRepo.update({
      filter: { id: address.id },
      updateData: { ...updateAddressDto },
    });

    if (updateAddressDto) {
      updatedAddress!.user = user;
    }

    return address?.toDto();
  }

  async removeAddress(addressId: Uuid) {
    const address = await this.userAddressRepo.findOne({
      filter: { uuid: addressId },
    });

    if (!address) {
      throw new NotFoundException('address not founded');
    }

    await this.userAddressRepo.update({
      filter: { id: address.id },
      updateData: { deletedAt: new Date() },
    });

    return true;
  }

  async getCurrentUserAddress(userId: number) {
    return await this.userAddressRepo.findOne({
      filter: { default: true, userId },
    });
  }

  async makeDefaultAddress(uuid: Uuid, user: UserEntity) {
    if (!user) {
      throw new UnauthorizedException('user is not logged in');
    }

    const address = await this.userAddressRepo.findOne({
      filter: { uuid },
    });

    if (!address) {
      throw new NotFoundException('address not founded');
    }

    if (address.default) {
      return address;
    }

    await this.userAddressRepo.makeAllAddressDefaultFalse(user.id);

    const updatedAddress = await this.userAddressRepo.update({
      filter: { id: address.id },
      updateData: { default: true },
    });

    return updatedAddress;
  }
}
