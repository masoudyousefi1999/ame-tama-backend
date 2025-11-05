import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import type { CreateBlogDto } from './dto/create-blog.dto';
import type { UserEntity } from '../../modules/user/user.entity';
import { MediaService } from '../media/media.service';
import { BlogTopicService } from '../../modules/blog-topic/blog-topic.service';
import {
  IsNull,
  type FindOptionsRelations,
  type FindOptionsWhere,
} from 'typeorm';
import type { BlogEntity } from './blog.entity';
import type { BlogDto } from './dto/blog.dto';
import type { PaginationDto } from '../../common/dto/pagination.dto';
import type { UpdateBlogDto } from './dto/update-blog.dto';
import { RoleType } from '../../constants/role-type';
import { BlogTopicDto } from '../../modules/blog-topic/dto/blog-topic.dto';
import { BlogTopicEntity } from '../../modules/blog-topic/blog-topic.entity';
import { ModuleRef } from '@nestjs/core';
@Injectable()
export class BlogService {
  private blogTopicService!: BlogTopicService;

  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly mediaService: MediaService,
    private readonly moduleRef: ModuleRef,
  ) {}

  async onModuleInit() {
    this.blogTopicService = await this.moduleRef.get(BlogTopicService, {
      strict: false,
    });
  }

  async createBlog(createBlogDto: CreateBlogDto, user: UserEntity) {
    const { image, topic, slug, ...rest } = createBlogDto;

    const isSlugExists = await this.blogRepository.findOne({
      filter: { slug },
    });

    if (isSlugExists) {
      throw new BadRequestException('slug already exists');
    }

    let imageId = null;
    let topicId = null;

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }

      imageId = media.id;
    }

    const currentTopic = await this.blogTopicService.findOneBlogTopic({
      uuid: topic,
    });

    if (!currentTopic) {
      throw new NotFoundException('topic not founded');
    }

    topicId = currentTopic.id;

    const isPublishedAutomatically = user.id === 1 ? true : false;

    const blog = await this.blogRepository.create({
      ...rest,
      topicId,
      userId: user.id,
      slug,
      ...(imageId ? { imageId } : {}),
      ...(isPublishedAutomatically
        ? { isPublished: true, publishedAt: new Date() }
        : {}),
    });

    return blog.toDto();
  }

  async findOneBlogBySlug(slug: string): Promise<BlogDto> {
    const blog = await this.findOneBlog({ slug, isPublished: true }, [
      'topic',
      'user',
      'image',
    ]);

    if (!blog) {
      throw new NotFoundException('blog not founded');
    }

    if (blog.topic) {
      (blog as any).topic = new BlogTopicDto(blog.topic);
    }

    return blog.toDto();
  }

  async getBlogs(
    paginationDto: PaginationDto,
  ): Promise<{ blogs: BlogDto[]; totalCount: number }> {
    const { page, limit } = paginationDto;

    const { document: blogs, count } = await this.blogRepository.find({
      filter: { deletedAt: IsNull(), isPublished: true },
      relations: ['topic', 'user', 'image'],
      page,
      limit,
      order: { updatedAt: 'desc' },
    });

    const normalizedBlogs: BlogDto[] = [];

    blogs.forEach((blog) => {
      normalizedBlogs.push(blog.toDto());
    });

    normalizedBlogs.forEach((blog) => {
      if (blog.topic) {
        (blog as any).topic = new BlogTopicDto(
          blog.topic as unknown as BlogTopicEntity,
        );
      }
    });

    return { blogs: normalizedBlogs, totalCount: count };
  }

  async updateBlog(
    uuid: Uuid,
    updateBlogDto: UpdateBlogDto,
    user: UserEntity,
  ): Promise<BlogDto> {
    const { topic, image, slug, ...rest } = updateBlogDto;

    const blog = await this.findOneBlog({ uuid }, ['topic', 'user', 'image']);

    if (!blog) {
      throw new NotFoundException('blog not founded');
    }

    if (user.role !== RoleType.ADMIN && blog.userId !== user.id) {
      throw new ForbiddenException('you are not allowed to update this blog');
    }

    let topicId = null;
    let imageId = null;

    if (topic) {
      const currentTopic = await this.blogTopicService.findOneBlogTopic({
        uuid: topic,
      });

      if (!currentTopic) {
        throw new NotFoundException('topic not founded');
      }
      topicId = currentTopic.id;
    }

    if (image) {
      const media = await this.mediaService.getMedia({ uuid: image });

      if (!media) {
        throw new NotFoundException('media not founded');
      }
      imageId = media.id;
    }

    if (slug) {
      const isSlugUnique = await this.findOneBlog(
        {
          slug,
        },
        [],
      );

      if (isSlugUnique) {
        throw new BadRequestException('slug already exists');
      }
    }

    const updatedBlog = await this.blogRepository.update({
      filter: { uuid },
      updateData: {
        ...rest,
        ...(topicId ? { topicId } : {}),
        ...(imageId ? { imageId } : {}),
        ...(slug ? { slug } : {}),
      },
      relations: ['topic', 'user', 'image'],
    });

    if (!updatedBlog) {
      throw new InternalServerErrorException('cant update blog');
    }

    return updatedBlog.toDto();
  }

  async togglePublishBlog(uuid: Uuid): Promise<BlogDto> {
    const blog = await this.findOneBlog({ uuid }, []);

    if (!blog) {
      throw new NotFoundException('blog not founded');
    }

    const isPublished = !blog.isPublished;

    const publishedBlog = await this.blogRepository.update({
      filter: { uuid },
      updateData: {
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
      relations: ['topic', 'user', 'image'],
    });

    if (!publishedBlog) {
      throw new InternalServerErrorException('cant publish blog');
    }

    return publishedBlog.toDto();
  }

  async deleteBlog(uuid: Uuid): Promise<boolean> {
    const blog = await this.findOneBlog({ uuid }, []);

    if (!blog) {
      throw new NotFoundException('blog not founded');
    }

    await this.blogRepository.update({
      filter: { id: blog.id },
      updateData: { deletedAt: new Date(), isPublished: false },
    });

    return true;
  }

  async findOneBlog(
    filter: FindOptionsWhere<BlogEntity>,
    relations: string[],
  ): Promise<BlogEntity | null> {
    const blog = await this.blogRepository.findOne({
      filter: { ...filter, deletedAt: IsNull() },
      relations: relations as FindOptionsRelations<BlogEntity>,
    });

    return blog;
  }

  async getBlogForSiteMap() {
    const { document: blogs, count: _ } = await this.blogRepository.find({
      filter: { deletedAt: IsNull(), isPublished: true },
      page: 1,
      limit: 1000,
      relations: ['image'],
    });
    return blogs;
  }
}
