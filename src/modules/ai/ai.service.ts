import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { ProductService } from '../product/product.service';
import { XMLParser } from 'fast-xml-parser';

@Injectable()
export class AiService {
  private openai!: OpenAI;
  constructor(
    private apiConfigService: ApiConfigService,
    private productService: ProductService,
  ) {
    const { apiKey, baseURL } = this.apiConfigService.aiConfig;
    this.openai = new OpenAI({
      baseURL,
      apiKey,
    });
  }

  async sendChat(messages: OpenAI.Chat.ChatCompletionMessageParam[]) {
    const sendChat = await this.openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      stream: false,
      messages,
      temperature: 0.7,
      reasoning_effort: 'medium',
    });
    return sendChat?.choices[0]?.message?.content;
  }

  async getAnimeLatestNews() {
    try {
      // مرحله ۱: گرفتن آخرین خبر
      const latestFeed = await this.getAnimeLatestNewsFeed();

      // مرحله ۲: گرفتن محصولات برای لینک‌دهی در متن
      const productsDetails = await this.productService.getProductsForAi();

      // مرحله ۳: آماده کردن متن ورودی برای AI
      const feedForAI = `
    <item>
      <title>${latestFeed.title}</title>
      <description>${latestFeed.description}</description>
      ${latestFeed.thumb ? `<img src="${latestFeed.thumb}" alt="${latestFeed.title}" />` : ''}
      <link>${latestFeed.link}</link>
      <pubDate>${latestFeed.pubDate}</pubDate>
    </item>
    `;

      // مرحله ۴: فرستادن به AI
      const aiResponse = await this.sendChat([
        {
          role: 'system',
          content: `
      تو یک نویسنده و تحلیل‌گر خبره در زمینه‌ی انیمه و مانگا هستی.
      وظیفه‌ی تو نوشتن خبر و تحلیل جذاب به زبان فارسی و با لحنی انسانی و طبیعی است، نه شبیه هوش مصنوعی یا کتاب رسمی.
      نکته مهم: نام‌های انیمه، مانگا، شخصیت‌ها و برندها را ترجمه نکن و به همان شکل اصلی خودشان ولی حتما با حروف فارسی استفاده کن.
      تو تحلیل‌گر هوش مصنوعی سایت آمه‌تاما هستی.
      `,
        },
        {
          role: 'assistant',
          content: `
      خبر ورودی از RSS:
      
      ${feedForAI}
      
      وظایف تو:
      1. خبر را بازنویسی و تحلیل کن به فارسی روان و جذاب.
      2. متن کوتاه را با توضیح و تحلیل گسترش بده تا برای کاربر ارزشمندتر شود (مثلاً چرا خبر مهم است یا چه تاثیری روی طرفداران دارد).
      3. از اموجی‌ها به‌اندازه مناسب استفاده کن.
      4. نام انیمه، شخصیت‌ها و برندها را ترجمه نکن.
      5. اگر خبر مربوط به هرکدام از محصولات زیر است، نام محصول و لینک آن را در متن بیاور:
      ${productsDetails
        .map((product) => `- ${product.name} - ${product.url}`)
        .join('\n')}
      6. از لینک تصویر که در خبر آمده استفاده کن و آن را در فیلد image_url قرار بده.
      7. در آخر متن content حتماً جمله زیر را اضافه کن:
      "ترجمه و تحلیل توسط آمه‌تاما انجام شده است."
      8. حتماً نام و لینک منبع اصلی خبر را هم در content قرار بده.
      9. خروجی تو **تنها و فقط یک JSON معتبر** باشد که قابلیت پارس شدن داشته باشد، با کلیدهای زیر:
      {
        title: "عنوان خبر",
        content: "متن خبر تحلیل شده و فارسی (HTML مجاز)",
        slug: "قسمتی از لینک خبر، حتما انگلیسی و SEO-friendly، حروف کوچک و - به جای فاصله",
        image_url: "لینک تصویر"
      }
      هیچ متن اضافی خارج از JSON تولید نکن.
      `,
        },
      ]);

      const normalizedResponse = aiResponse
        ?.replace('json', '')
        .replace(/`/g, '');

      return JSON.parse(normalizedResponse as any) as any as {
        title: string;
        content: string;
        slug: string;
        image_url: string;
      };
    } catch (error) {
      return;
    }
  }

  async getAnimeLatestNewsFeed() {
    const res = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2Fcrunchyroll%2Frss',
    );

    const feedText = await res.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const parsed = parser.parse(feedText);

    const items = parsed?.rss?.channel?.item || [];
    if (!items.length) throw new Error('No news items found in feed.');

    items.sort(
      (a: any, b: any) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    );

    const latestFeed = items[0];

    // استخراج تصویر از description
    const desc = latestFeed.description || '';
    const imgMatch = desc.match(/<img[^>]+src="([^">]+)"/);
    const extractedImg = imgMatch ? imgMatch[1] : null;

    const thumb =
      latestFeed['media:thumbnail']?.url ||
      latestFeed['media:thumbnail']?.['@_url'] ||
      extractedImg || // از description
      latestFeed['enclosure']?.['@_url'] ||
      null;

    return {
      guid: latestFeed.guid,
      title: latestFeed.title,
      description: latestFeed.description,
      link: latestFeed.link,
      pubDate: latestFeed.pubDate,
      thumb,
    };
  }

  async getImageBuffer(imageUrl: string) {
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();
    return Buffer.from(imageBuffer);
  }
}
