import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entity/comment.entity';
import { CommentRepository } from './repository/comment.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([CommentEntity]), ProductModule],
  providers: [CommentService, CommentRepository],
  controllers: [CommentController]
})
export class CommentModule {}
