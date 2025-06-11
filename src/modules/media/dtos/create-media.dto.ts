import { ApiProperty } from '@nestjs/swagger';
import { MediaType } from '../../../constants/media-type';
import { EnumField } from '../../../decorators/field.decorators';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    enum: () => MediaType,
    description: '1 : image -----------  2: video',
  })
  @Transform(({ value }) => parseInt(value, 10))
  @EnumField(() => MediaType)
  @IsOptional()
  type!: MediaType;
}
