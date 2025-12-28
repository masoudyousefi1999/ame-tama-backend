import { Module } from '@nestjs/common';
import { ArtWorkService } from './art-work.service';
import { ArtWorkRepository } from './repository/art-work.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtWorkEntity } from './entity/art-work.entity';
import { ArtWorkController } from './art-work.controller';
import { MediaModule } from '../media/media.module';
import { TagModule } from '../tag/tag.module';
import { ArtWorkReactionRepository } from './repository/art-work-reaction.repository';
import { ArtWorkReactionEntity } from './entity/art-work-reaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtWorkEntity, ArtWorkReactionEntity]),
    MediaModule,
    TagModule,
  ],
  providers: [ArtWorkService, ArtWorkRepository, ArtWorkReactionRepository],
  controllers: [ArtWorkController],
})
export class ArtWorkModule {}
