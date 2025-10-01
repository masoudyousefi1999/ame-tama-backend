import { AbstractDto } from '../../../common/dto/abstract.dto';
import { CommentEntity } from '../entity/comment.entity';
import { UserDto } from '../../../modules/user/dtos/user.dto';
import { ProductDto } from '../../../modules/product/dto/product.dto';
import { ClassFieldOptional, StringField } from '../../../decorators/field.decorators';

export class CommentDto extends AbstractDto {
  @StringField()
  text!: string;

  @ClassFieldOptional(() => UserDto)
  user?: UserDto;

  @ClassFieldOptional(() => ProductDto)
  product?: ProductDto;

  constructor(entity: CommentEntity) {
    super(entity);
    this.text = entity.text;
    this.product = entity.product ? new ProductDto(entity.product) : undefined;
    this.user = entity.user ? new UserDto(entity.user) : undefined;
  }
}
