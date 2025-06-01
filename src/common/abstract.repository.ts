import type {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import type { AbstractEntity } from './abstract.entity';
import { Transactional } from 'typeorm-transactional';
import type { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class AbstractRepository<T extends AbstractEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  /**
   * Create a new entity.
   * @param createDocument - The partial entity data for creation.
   * @returns The created and saved entity.
   */
  @Transactional()
  async create(createDocument: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDocument);
    return await this.repository.save(entity);
  }

  /**
   * Find a single entity matching the filter.
   * @param filter - The filter criteria.
   * @param relations - Optional relations to load.
   * @returns The found entity or null if not found.
   */
  async findOne({
    filter,
    relations,
  }: {
    filter: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
  }): Promise<T | null> {
    return await this.repository.findOne({
      where: Array.isArray(filter) ? filter : { ...filter },
      relations,
    });
  }

  /**
   * Find entities with pagination.
   * @param filter - The filter criteria.
   * @param relations - Optional relations to load.
   * @param page - The page number (default is 1).
   * @param limit - The maximum number of entities per page (default is 10).
   * @returns An array of entities.
   */
  async find({
    limit = 10,
    page = 1,
    filter,
    relations,
    order,
  }: {
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
    page?: number;
    limit?: number;
    order?: FindOptionsOrder<T>;
  }): Promise<T[]> {
    const skip = (page - 1) * limit;
    return await this.repository.find({
      where: filter,
      relations,
      skip,
      take: limit,
      order,
    });
  }

  /**
   * Update an entity matching the filter.
   * @param filter - The filter criteria.
   * @param updateDocumentDto - The partial entity data to update.
   * @returns The updated entity or null if the update did not affect any rows.
   */
  @Transactional()
  async update({
    filter,
    updateData,
    relations,
  }: {
    filter: FindOptionsWhere<T>;
    updateData: QueryDeepPartialEntity<T>;
    relations?: FindOptionsRelations<T> | FindOptionsRelationByString;
  }): Promise<T | null> {
    const isDocumentExists = await this.findOne({ filter });

    if (!isDocumentExists) {
      return null;
    }

    const updateResult = await this.repository.update(filter, updateData);

    if (updateResult.affected) {
      try {
        return await this.findOne({
          filter: { id: isDocumentExists.id as any },
          relations,
        });
      } catch (error) {
        return await this.findOne({ filter, relations });
      }
    }
    return null;
  }

  /**
   * Hard-delete an entity matching the filter.
   * @param filter - The filter criteria.
   * @returns True if an entity was deleted, false otherwise.
   */
  async delete(filter: FindOptionsWhere<T>): Promise<boolean> {
    const deleteResult = await this.repository.delete(filter);
    return Boolean(deleteResult?.affected);
  }
}
