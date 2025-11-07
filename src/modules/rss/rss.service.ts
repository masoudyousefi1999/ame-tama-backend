import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RssEntity } from './rss.entity';
import type { Repository } from 'typeorm';
import { BlogService } from '../blog/blog.service';
import { BlogTopicService } from '../blog-topic/blog-topic.service';
import type { AddNewsDto } from './dto/add-news-dto';

@Injectable()
export class RssService {
  constructor(
    @InjectRepository(RssEntity)
    private rssRepository: Repository<RssEntity>,
    private blogService: BlogService,
    private blogTopicService: BlogTopicService,
  ) {}

  async createRss(createRssDto: { url: string }) {
    const rss = this.rssRepository.create(createRssDto);
    await this.rssRepository.save(rss);

    return rss;
  }

  async findOneRss(url: string) {
    const rss = await this.rssRepository.findOne({ where: { url } });
    if (rss) {
      return true;
    }

    return false;
  }

  async addNews(addNewsDto: AddNewsDto) {
    const isRssExists = await this.findOneRss(addNewsDto.url);
    if (isRssExists) {
      console.error('rss already exists url: ', addNewsDto.url);
      return false; // rss already exists
    }

    try {
      const newsTopic = await this.blogTopicService.findOneBlogTopic({
        slug: 'news',
      });

      if (!newsTopic) {
        throw new NotFoundException('news topic not found');
      }

      const { title, content, slug, image, url } = addNewsDto;
      const blog = await this.blogService.createBlog(
        {
          topic: newsTopic.uuid,
          title,
          content,
          slug,
          image,
        },
        { id: 1 } as any,
      );

      if (blog) {
        await this.createRss({ url });
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
