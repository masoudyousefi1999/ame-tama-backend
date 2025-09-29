import { Injectable } from '@nestjs/common';
import { CategoryService } from '../../modules/category/category.service';
import { ProductService } from '../../modules/product/product.service';
import type { ProductDto } from 'modules/product/dto/product.dto';
import type { CategoryDto } from 'modules/category/dto/category.dto';

@Injectable()
export class SiteMapService {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  async getSiteMap() {
    const products = await this.productService.getProducts(
      {
        page: 1,
        limit: 1000,
      },
      false,
    );

    const links: {
      url?: string;
      lastModified: Date;
      changeFrequency: string;
      priority: number;
      image?: string;
    }[] = [];

    products.products.map((product: ProductDto) => {
      const image = (product as any).productMedia[0]?.url || null;

      links.push({
        url: `https://ame-tama.com/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'daily',
        priority: 0.8,
        ...(image && { image }),
      });
    });

    const categories = await this.categoryService.findAll();
    const figureImage = categories[0]?.image || null;
    // categories page
    links.push({
      url: `https://ame-tama.com/category/figures`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(figureImage && { image: figureImage }),
    });

    (categories[0] as any)?.children.map((category: CategoryDto) => {
      const image = category?.image;

      links.push({
        url: `https://ame-tama.com/category/figures/${category.slug}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        ...(image && { image }),
      });
    });

    // shop page
    links.push({
      url: `https://ame-tama.com/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });

    // about page
    links.push({
      url: `https://ame-tama.com/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // contact page
    links.push({
      url: `https://ame-tama.com/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // faq page
    links.push({
      url: `https://ame-tama.com/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // main page
    links.push({
      url: `https://ame-tama.com`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });

    return links;
  }
}
