import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { FinanceRepository } from './finance.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceEntity } from './finance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FinanceEntity])],
  providers: [FinanceService, FinanceRepository],
  controllers: [FinanceController],
})
export class FinanceModule {}
