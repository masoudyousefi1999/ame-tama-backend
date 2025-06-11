import { MediaService } from './../media/media.service';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  type FindOptionsRelationByString,
  type FindOptionsRelations,
  type FindOptionsWhere,
} from 'typeorm';
import { UserEntity } from './user.entity.ts';
import { UserRepository } from './user.repository.ts';
import { UpdateUserDto } from './dtos/update-user.dto.ts';
import { CreateUserDto } from './dtos/create-user.dto.ts';
import { UpdatePasswordDto } from './dtos/update-password.dto.ts';
import { UserDto } from './dtos/user.dto.ts';
import { generateHash, validateHash } from '../../common/utils.ts';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mediaService: MediaService,
  ) {}

  async findOne(
    filter: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
    relations?: FindOptionsRelationByString | FindOptionsRelations<UserEntity>,
  ): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ filter, relations });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.create(createUserDto);

    const currentUser = await this.userRepository.findOne({
      filter: { id: user.id },
    });

    if (!currentUser) {
      throw new InternalServerErrorException('cant create user...');
    }

    return currentUser;
  }

  async updateUser(user: UserEntity, updateUserDto: UpdateUserDto) {
    const { avatar, ...rest } = updateUserDto;
    let avatar_id = null;

    if (avatar) {
      const media = await this.mediaService.getMedia({
        uuid: avatar,
      });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      avatar_id = media.id;
    }

    return await this.userRepository.update({
      filter: { id: user.id },
      updateData: { avatar: avatar_id, ...rest },
    });
  }

  async updatePassword(user: UserEntity, updatePasswordDto: UpdatePasswordDto) {
    const { password, old_password } = updatePasswordDto;

    let isPasswordValid = user?.password ? false : true;

    if (user?.password && old_password) {
      isPasswordValid = Boolean(
        await this.validatePassword(user, old_password),
      );
    }

    if (!isPasswordValid) {
      throw new UnprocessableEntityException('password is wrong!');
    }

    const hashedPassword = generateHash(password);

    const updatedUser = await this.userRepository.update({
      filter: { id: user.id },
      updateData: { password: hashedPassword },
    });

    if (updatedUser) {
      return updatedUser.toDto();
    }

    throw new UnprocessableEntityException('update failed');
  }

  async validatePassword(user: UserEntity, password: string): Promise<UserDto> {
    if (!user) {
      throw new NotFoundException('user not founded');
    }

    const isPasswordValid = await validateHash(password, user.password);

    if (!isPasswordValid) {
      throw new UnprocessableEntityException('credentials error!');
    }

    return user.toDto()!;
  }

  async getUsers() {
    const users = await this.userRepository.find({
      order: { createdAt: 'desc' },
    });

    if (users.length === 0) {
      return [];
    }

    return users.map((item) => item.toDto());
  }
}
