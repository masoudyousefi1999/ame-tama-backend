import { Controller, Get, Res } from '@nestjs/common';
import { SiteMapService } from './site-map.service';
import type { Response } from 'express';

@Controller('sitemap')
export class SiteMapController {
  constructor(private readonly siteMapService: SiteMapService) {}

  @Get()
  async getSiteMap(@Res() res: Response) {
    const links = await this.siteMapService.getSiteMap();

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${links
  .map(
    (link) => `
  <url>
    <loc>${link.url}</loc>
    <lastmod>${new Date(link.lastModified).toISOString()}</lastmod>
    <changefreq>${link.changeFrequency}</changefreq>
    <priority>${link.priority}</priority>
    ${
      link.image
        ? `<image:image><image:loc>${link.image}</image:loc></image:image>`
        : ''
    }
  </url>`,
  )
  .join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  }
}
