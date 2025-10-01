import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from './repository/comment.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import type { UserEntity } from '../../modules/user/user.entity';
import { ProductService } from '../../modules/product/product.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly productService: ProductService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: UserEntity) {
    const userId = user.id;
    const productId = createCommentDto.productId;

    const product = await this.productService.findOneProduct({
      uuid: productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const payload = {
      text: createCommentDto.text,
      userId,
      productId: product.id,
    };

    const comment = await this.commentRepository.create(payload);

    return comment.toDto();
  }

  async getComments(productId: Uuid) {
    const product = await this.productService.findOneProduct({
      uuid: productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { document } = await this.commentRepository.find({
      filter: {
        productId: product.id,
        isPublished: true,
      },
      relations: ['user'],
    });

    return document.map((comment) => comment.toDto());
  }

  async getLastComments(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const { document } = await this.commentRepository.find({
      filter: { isPublished: true },
      relations: ['user'],
      order: { createdAt: 'desc' },
      limit,
      page,
    });

    return document.map((comment) => comment.toDto());
  }
}
