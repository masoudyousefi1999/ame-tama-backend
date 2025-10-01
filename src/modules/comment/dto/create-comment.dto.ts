import { ApiProperty } from '@nestjs/swagger';
import { StringField, UUIDField } from '../../../decorators/field.decorators';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The text of the comment',
    example: 'This is a comment',
  })
  @StringField({})
  text!: string;

  @ApiProperty({
    description: 'The product ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @UUIDField()
  productId!: Uuid;
}
