import {
  DateFieldOptional,
  UUIDFieldOptional,
} from '../../decorators/field.decorators.ts';
import type { AbstractEntity } from '../abstract.entity.ts';

export class AbstractDto {
  @UUIDFieldOptional()
  uuid?: Uuid;

  @DateFieldOptional()
  createdAt?: Date;

  @DateFieldOptional()
  updatedAt?: Date;

  constructor(entity: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.createdAt = entity?.createdAt;
      this.updatedAt = entity?.updatedAt;
      this.uuid = entity.uuid;
    }
  }
}
