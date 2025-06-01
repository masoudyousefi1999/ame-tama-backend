import { AbstractDto } from '../../../common/dto/abstract.dto';
import { WalletEntity } from '../entity/wallet.entity';
import { ClassField, NumberField } from '../../../decorators/field.decorators';
import { UserDto } from '../../../modules/user/dtos/user.dto';

export class WalletDto extends AbstractDto {
  @NumberField()
  balance!: number;

  @ClassField(() => UserDto)
  user!: UserDto;

  constructor(entity: WalletEntity) {
    super(entity);
    this.balance = entity.balance;
    this.user = new UserDto(entity.user!);
  }
}
