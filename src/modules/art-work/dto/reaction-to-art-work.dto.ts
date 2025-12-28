import { ApiProperty } from '@nestjs/swagger';
import { EnumField } from '../../../decorators/field.decorators';
import { ReactionEnum } from '../reaction.enum';

export class ReactToArtWorkDto {
  @ApiProperty({ name: 'reaction', required: true, enum: ReactionEnum })
  @EnumField(() => ReactionEnum)
  reaction!: ReactionEnum;
}
