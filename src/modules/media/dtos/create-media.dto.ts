import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../../../constants/media-type';
import { EnumField } from '../../../decorators/field.decorators';

export class CreateMediaDto {
  @ApiProperty({
    enum: () => MediaType,
    description:
      'product : product -----------  blog: blog -----------  topic: topic -----------  category: category -----------  tag: tag -----------  user: user',
  })
  @EnumField(() => MediaType)
  type!: MediaType;
}
