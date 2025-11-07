import { IsEnum, IsNumber, IsString, IsUUID } from 'class-validator';
import { SeoTypeEnum } from '../seo-type.enum';

export class CreateSeoDto {
  @IsEnum(SeoTypeEnum)
  entityType!: SeoTypeEnum;

  @IsNumber()
  entityId!: number;

  @IsString()
  metaTitle!: string;

  @IsString()
  metaDescription!: string;

  @IsString()
  canonicalUrl!: string;

  @IsString()
  ogTitle!: string;


  @IsUUID()
  ogImage!: Uuid;

  @IsString()
  twitterCard!: string;
}
