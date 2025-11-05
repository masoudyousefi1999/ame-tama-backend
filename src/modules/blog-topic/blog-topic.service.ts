import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogTopicRepository } from './blog-topic.repository';
import type { CreateBlogTopicDto } from './dto/create-blog-topic.dto';
import type { BlogTopicDto } from './dto/blog-topic.dto';
import { MediaService } from '../media/media.service';
import type { GetBlogTopicDto } from './dto/get-blog-topic.dto';
import type { PaginationDto } from 'common/dto/pagination.dto';
import type { UpdateBlogTopicDto } from './dto/update-blog-topic.dto';
import { IsNull, type FindOptionsWhere } from 'typeorm';
import type { BlogTopicEntity } from './blog-topic.entity';
import { BlogRepository } from '../../modules/blog/blog.repository';
import type { BlogDto } from '../../modules/blog/dto/blog.dto';

@Injectable()
export class BlogTopicService {
  constructor(
    private readonly blogTopicRepository: BlogTopicRepository,
    private readonly mediaService: MediaService,
    private readonly blogRepository: BlogRepository,
  ) {}

  async createBlogTopic(
    createBlogTopicDto: CreateBlogTopicDto,
  ): Promise<BlogTopicDto> {
    const { image, ...rest } = createBlogTopicDto;

    // check is slug unique
    const isSlugUnique = await this.findOneBlogTopic({
      slug: rest.slug,
    });

    if (isSlugUnique) {
      throw new ConflictException('slug must be unique');
    }

    let mediaId = null;
    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }
      mediaId = media.id;
    }

    const blogTopic = await this.blogTopicRepository.create({
      ...rest,
      ...(mediaId ? { imageId: mediaId } : {}),
    });

    return blogTopic.toDto() as BlogTopicDto;
  }

  async getBlogTopic(getBlogTopicDto: GetBlogTopicDto, paginationDto: PaginationDto) {
    const { uuid, slug } = getBlogTopicDto;
    const { page, limit } = paginationDto;

    const blogTopic = await this.blogTopicRepository.findOne({
      filter: {
        ...(uuid ? { uuid } : {}),
        ...(slug ? { slug } : {}),
        deletedAt: IsNull(),
      },
      relations: ['image'],
    });

    if (!blogTopic) {
      throw new NotFoundException('blog topic not founded');
    }

    const { document: blogs, count } = await this.blogRepository.find({
      filter: { topicId: blogTopic.id },
      relations: ['image'],
      page,
      limit,
      order: { publishedAt: 'desc' },
    });

    const normalizedBlogs: BlogDto[] = [];


    blogs.map((blog) => {
      blog.topic = blogTopic.toDto() as any;
      normalizedBlogs.push(blog.toDto() as BlogDto);
    });

    return { blogs: normalizedBlogs, totalCount: count };
  }

  async getBlogTopics(
    paginationDto: PaginationDto,
  ): Promise<{ blogTopics: BlogTopicDto[]; totalCount: number }> {
    const { page, limit } = paginationDto;

    const { document: blogTopics, count } = await this.blogTopicRepository.find(
      {
        filter: { deletedAt: IsNull() },
        page,
        limit,
        relations: ['image'],
        order: { updatedAt: 'desc' },
      },
    );

    const normalizedBlogTopics: BlogTopicDto[] = [];
    blogTopics.map((blogTopic) => {
      normalizedBlogTopics.push(blogTopic.toDto() as BlogTopicDto);
    });

    return { blogTopics: normalizedBlogTopics, totalCount: count };
  }

  async updateBlogTopic(
    uuid: Uuid,
    updateBlogTopicDto: UpdateBlogTopicDto,
  ): Promise<BlogTopicDto> {
    if (!updateBlogTopicDto) {
      throw new BadRequestException('updateBlogTopicDto is required');
    }

    if (updateBlogTopicDto.slug) {
      const isSlugUnique = await this.findOneBlogTopic({
        slug: updateBlogTopicDto.slug,
      });

      if (isSlugUnique) {
        throw new ConflictException('slug must be unique');
      }
    }

    const { image, ...rest } = updateBlogTopicDto;

    let mediaId = null;
    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      mediaId = media.id;
    }

    const blogTopic = await this.blogTopicRepository.update({
      updateData: { ...rest, ...(mediaId ? { imageId: mediaId } : {}) },
      filter: { uuid, deletedAt: IsNull() },
      relations: ['image', 'blogs', 'blogs.image'],
    });

    if (!blogTopic) {
      throw new InternalServerErrorException('cant update blog topic');
    }

    return blogTopic.toDto() as BlogTopicDto;
  }

  async deleteBlogTopic(uuid: Uuid): Promise<boolean> {
    await this.blogTopicRepository.update({
      filter: { uuid },
      updateData: { deletedAt: new Date() },
    });

    return true;
  }

  async findOneBlogTopic(
    filter: FindOptionsWhere<BlogTopicEntity>,
  ): Promise<BlogTopicEntity | null> {
    const blogTopic = await this.blogTopicRepository.findOne({
      filter: { ...filter, deletedAt: IsNull() },
    });

    return blogTopic;
  }
  async getTopicForSiteMap() {
    const { document: topics, count: _ } = await this.blogTopicRepository.find({
      filter: { deletedAt: IsNull() },
      page: 1,
      limit: 1000,
      relations: ['image', 'blogs', 'blogs.image'],
    });
    return topics;
  }
}
