import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../modules/category/category.service';
import { ProductService } from '../../modules/product/product.service';
import type { CategoryDto } from '../../modules/category/dto/category.dto';
import { TagService } from '../../modules/tag/tag.service';
import type { TagDto } from 'modules/tag/dto/tag.dto';
import { BlogTopicService } from '../../modules/blog-topic/blog-topic.service';
import type { BlogEntity } from '../../modules/blog/blog.entity';
import type { BlogTopicEntity } from '../../modules/blog-topic/blog-topic.entity';

@Injectable()
export class SiteMapService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
    private readonly topicService: BlogTopicService,
  ) {}

  async getSiteMap() {
    const links: {
      url?: string;
      lastModified: Date;
      changeFrequency: string;
      priority: number;
      image?: string;
    }[] = [];

    let baseUrl = 'https://ame-tama.com';

    baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';

    const products = await this.productService.getProductForSiteMap();
    const categories = await this.categoryService.getCategoryForSiteMap();
    const tags = await this.tagService.getTagForSiteMap();
    const topics = await this.topicService.getTopicForSiteMap();

    // categories page
    categories.forEach((category: CategoryDto) => {
      links.push({
        url: `${baseUrl}${category.slug}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        image: category.image,
      });
    });

    // /category/tag  pages
    tags.forEach((tag: TagDto) => {
      tag.categories?.forEach((category: CategoryDto) => {
        links.push({
          url: `${baseUrl}${category.slug}/${tag.slug}`,
          lastModified: tag.updatedAt || new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
          image: tag.image?.url,
        });
      });
    });

    // /anime page
    links.push({
      url: `${baseUrl}anime`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // /anime/tag pages
    tags.forEach((tag: TagDto) => {
      links.push({
        url: `${baseUrl}anime/${tag.slug}`,
        lastModified: tag.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        image: tag.image?.url,
      });
    });

    // products page
    products.forEach((product: any) => {
      const categorySlug = product.category?.slug;
      const tagSlug = product?.tags?.[0]?.slug;

      if (categorySlug && tagSlug) {
        links.push({
          url: `${baseUrl}${categorySlug}/${tagSlug}/${product.slug}`,
          lastModified: product?.updatedAt || new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
          image: product?.productMedia?.[0]?.url || null,
        });
      }
    });

    // topic page
    links.push({
      url: `${baseUrl}topic`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    });

    // topics page
    topics.forEach((topic: BlogTopicEntity) => {
      links.push({
        url: `${baseUrl}topic/${topic.slug}`,
        lastModified: topic.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        image: topic.image?.url,
      });

      topic.blogs?.forEach((blog: BlogEntity) => {
        links.push({
          url: `${baseUrl}topic/${topic.slug}/${blog.slug}`,
          lastModified: blog.updatedAt || new Date(),
          changeFrequency: 'monthly',
          priority: 0.5,
          image: blog.image?.url,
        });
      });
    });

    // shop page
    links.push({
      url: `${baseUrl}shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // about page
    links.push({
      url: `${baseUrl}about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // contact page
    links.push({
      url: `${baseUrl}contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // faq page
    links.push({
      url: `${baseUrl}faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // main page
    links.push({
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });

    return links;
  }
}
