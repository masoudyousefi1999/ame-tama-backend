import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import type { FindOptionsWhere } from 'typeorm';
import type { TransactionEntity } from './entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(private transactionRepo: TransactionRepository) {}

  async createTransaction(createTransactionDto: {
    amount: number;
    method: string;
    paymentId: number;
    referenceId: string;
  }) {
    const { amount, paymentId, method, referenceId } = createTransactionDto;
    const transaction = await this.transactionRepo.create({
      amount,
      method,
      paymentId,
      referenceId,
    });

    return transaction;
  }

  async updateTransaction(
    transactionId: number,
    updateTransactionDto: {
      amount?: number;
      responseData?: Record<string, any>;
      trackingCode?: string;
      paidAt?: string;
    },
  ) {
    const { amount, responseData, trackingCode, paidAt } = updateTransactionDto;
    const transaction = await this.transactionRepo.update({
      filter: { id: transactionId },
      updateData: { amount, responseData, trackingCode, paidAt },
    });

    return transaction;
  }

  async findOneTransaction(
    filter: FindOptionsWhere<TransactionEntity>,
    relations?: string[],
  ) {
    return await this.transactionRepo.findOne({ filter, relations });
  }
}
