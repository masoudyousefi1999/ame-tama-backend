import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OpenAI } from 'openai';
import { type Response } from 'express';
import type { UserEntity } from '../../modules/user/user.entity';
import type { CreateFinanceDto } from './dto/create-finance.dto';
import { FinanceRepository } from './finance.repository';
import type { PaginationDto } from 'common/dto/pagination.dto';
import type { FinanceDto } from './dto/finance.dto';

@Injectable()
export class FinanceService {
  private openai!: OpenAI;

  constructor(private financeRepo: FinanceRepository) {
    this.openai = new OpenAI({
      baseURL: 'https://ai.liara.ir/api/v1/686a521fcfc8b228e253fd34',
      apiKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWViMGQwMTIxNjczMjhjYzUyNDRjNzkiLCJ0eXBlIjoiYXV0aCIsImlhdCI6MTc1MTc5ODk3NX0.KmnXbILqHLJjhFbKYezT9fy81OHolX_KNXGDan45Xpg',
    });
  }

  async addFinance(createFinanceDto: CreateFinanceDto, user: UserEntity) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const { amount, note, type } = createFinanceDto;

    const finance = await this.financeRepo.create({
      amount,
      note,
      type,
      userId: user.id,
    });

    return finance;
  }

  async chat(message: string, res: Response, user: UserEntity) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const { finances: dbData } = await this.getFinances(user, {
      limit: 100,
      page: 1,
    });

    const sendChat = await this.openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      stream: false,

      messages: [
        {
          role: 'system',
          content:
            'you are finance assistance application in persian language talk like a human and not a AI or Book.',
        },
        {
          role: 'assistant',
          content:
            " whenever you want to send user the money don't say like this 40000toman instead say 4 milion toman for example and user friendly and short and use emojis for better ux",
        },
        {
          role: 'developer',
          content: [
            {
              type: 'text',
              text: 'this is user current info for income and expense',
            },
            { type: 'text', text: JSON.stringify(dbData) },
          ],
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const response = sendChat?.choices[0]?.message?.content;

    res.json(response);
    return;
  }

  async getTip(res: Response, user: UserEntity) {
    if (!user) {
      throw new UnauthorizedException();
    }

    return await this.chat(
      'give me tip of the day base of my income and expense. if income and expense provided give me tip base of that else give some random tip and use emojis for better ux',
      res,
      user,
    );
  }

  async getFinances(user: UserEntity, paginationDto: PaginationDto) {
    if (!user) {
      throw new UnauthorizedException();
    }

    const { limit, page } = paginationDto;

    const finances = await this.financeRepo.find({
      filter: { userId: user.id },
      limit,
      order: { createdAt: 'desc' },
      page,
    });

    const { document, count: totalCount } = finances;

    const normalizedFinances: FinanceDto[] = [];

    document.map((item) => {
      normalizedFinances.push(item.toDto() as FinanceDto);
    });

    return { finances: normalizedFinances, totalCount };
  }

  async generateFinance(message: string, res: Response) {
    const sendChat = await this.openai.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      stream: false,

      messages: [
        {
          role: 'system',
          content: `base of the user description generate this info for me 
            {
                note: "", //  type string base of the user described text should be in persian and use emojis for better ux
                amount: 0 // if in user describe text he give you amount use it if not return 0
            }
                You must output only a clean JSON object . Do Not explayin , no extra text, no strings, and no formatting outside of the JSON object.
            `,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    const response = sendChat?.choices[0]?.message?.content!;
    let normalizedResponse;
    if (response) {
      normalizedResponse = response.replace('json', '').replace(/`/g, '');
      normalizedResponse = JSON.parse(normalizedResponse);
    }

    res.json(normalizedResponse);
    return;
  }
}
