import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { GetImageDto } from './dto/get-image.dto';
import type { Response } from 'express';
import sharp from 'sharp';
import { RedisService } from '../../shared/services/redis.service';

@Injectable()
export class ImageService {
  constructor(private redisService: RedisService) {}
  async getImage(query: GetImageDto, res: Response): Promise<void> {
    const { url, w, h, q, f } = query as any;

    if (!url) {
      throw new BadRequestException('url is required');
    }

    const normalizedUrl = encodeURI(String(url));

    // Cache key built from normalized URL and effective parameters
    const cacheKey = `image:${normalizedUrl}:w=${w || ''}:h=${h || ''}:q=${q || ''}:f=${f || ''}:dpr=${(query as any).dpr || ''}`;

    // Try cache first
    const cached = await this.redisService.getCachedData(cacheKey);

    if (cached) {
      const { contentType, bufferBase64, vary } = JSON.parse(cached);
      if (vary) {
        res.setHeader('Vary', vary);
      }
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Timing-Allow-Origin', '*');
      res.end(Buffer.from(bufferBase64, 'base64'));
      return;
    }

    let response: Response | any;
    try {
      response = await fetch(normalizedUrl as any);
    } catch {
      throw new BadRequestException('Failed to fetch source image');
    }

    if (!response.ok) {
      throw new BadRequestException(`Source fetch error: ${response.status}`);
    }

    const sourceBuffer = Buffer.from(await response.arrayBuffer());
    let image = sharp(sourceBuffer, { failOnError: false }).rotate();

    // DPR handling
    const dpr =
      query && (query as any).dpr
        ? Math.max(1, Math.min(3, Number((query as any).dpr)))
        : 1;

    const width = w ? Math.round(Number(w) * dpr) : undefined;
    const height = h ? Math.round(Number(h) * dpr) : undefined;
    const quality = q ? Number(q) : undefined;
    const format = (f as string | undefined)?.toLowerCase();

    // Resize (Next.js uses cover-like behavior but does not enlarge)
    if (width || height) {
      image = image.resize({
        width,
        height,
        fit: 'cover',
        withoutEnlargement: true, // important difference
      });
    }

    // Pick format: Next.js does Accept header negotiation (webp/avif/jpeg)
    const accept = (res.req.headers['accept'] as string) || '';
    let finalFormat = format;

    if (!finalFormat) {
      if (accept.includes('image/avif')) {
        finalFormat = 'avif';
      } else if (accept.includes('image/webp')) {
        finalFormat = 'webp';
      } else {
        finalFormat = 'jpeg';
      }
    }

    // Match Next.js defaults
    let contentType = 'image/jpeg';
    if (finalFormat === 'webp') {
      image = image.webp({ quality: quality ?? 75, smartSubsample: true });
      contentType = 'image/webp';
    } else if (finalFormat === 'avif') {
      image = image.avif({ quality: quality ?? 50 });
      contentType = 'image/avif';
    } else if (finalFormat === 'png') {
      image = image.png({ compressionLevel: 9 });
      contentType = 'image/png';
    } else {
      // jpeg fallback
      image = image.jpeg({
        quality: quality ?? 75,
        mozjpeg: true,
        chromaSubsampling: '4:2:0',
      });
      contentType = 'image/jpeg';
    }

    // Strip metadata (Next.js removes ICC/EXIF by default)
    image = image.withMetadata({ icc: undefined });

    try {
      const outputBuffer = await image.toBuffer();

      // Save to cache (6 hours)
      const sixHoursInSec = 60 * 60 * 6;
      await this.redisService.cacheData(
        cacheKey,
        JSON.stringify({
          contentType,
          bufferBase64: outputBuffer.toString('base64'),
          vary: 'Accept',
        }),
        sixHoursInSec,
      );

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Vary', 'Accept'); // key for format negotiation
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Timing-Allow-Origin', '*');

      res.end(outputBuffer);
      return;
    } catch (err) {
      throw new InternalServerErrorException('Failed to process image');
    }
  }
}
