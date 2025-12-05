import { Module } from '@nestjs/common';
import { ShippingMethodService } from './shipping-method.service';
import { ShippingMethodController } from './shipping-method.controller';
import { ShippingMethodEntity } from './shipping-method.entity';
import { ShippingMethodRepository } from './repository/shipping-method.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethodEntity])],
  providers: [ShippingMethodService, ShippingMethodRepository],
  controllers: [ShippingMethodController],
  exports: [ShippingMethodService],
})
export class ShippingMethodModule {}
