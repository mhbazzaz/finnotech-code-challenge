import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { GetProductDto } from './dto/response/get-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDto } from './dto/response/get-all-products.dto';
import { GetUserProductsDto } from './dto/response/get-user-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly db: PrismaService) {}

  //----------------------------------
  async createProduct(
    userId: number,
    data: CreateProductDto,
  ): Promise<GetProductDto> {
    try {
      const body = { ...data, creatorId: userId };
      const newProduct = await this.db.product.create({ data: body });

      return new GetProductDto(newProduct);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //----------------------------------
  async getAllProducts(
    page: number,
    pageSize: number,
  ): Promise<GetAllProductsDto> {
    try {
      const currentPage = page ? Number(page) : 0;
      const limit = pageSize ? Number(pageSize) : 10;

      const [products, totalCount] = await Promise.all([
        this.db.product.findMany({
          orderBy: {
            createdAt: 'asc',
          },
          skip: limit * currentPage,
          take: limit,
        }),
        this.db.product.count(),
      ]);

      if (!products.length) throw new NotFoundException();

      const productsResult = products.map((product) => {
        return new GetProductDto(product);
      });

      return new GetAllProductsDto({
        totalCount,
        products: productsResult,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  //----------------------------------
  async getUserProducts(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<GetUserProductsDto> {
    try {
      const currentPage = page ? Number(page) : 0;
      const limit = pageSize ? Number(pageSize) : 10;

      const [products, totalCount] = await Promise.all([
        this.db.product.findMany({
          where: { creatorId: userId },
          orderBy: {
            createdAt: 'asc',
          },
          skip: limit * currentPage,
          take: limit,
        }),
        this.db.product.count({ where: { creatorId: userId } }),
      ]);

      if (!products.length) throw new NotFoundException();

      const productsResult = products.map((product) => {
        return new GetProductDto(product);
      });

      return new GetUserProductsDto({
        totalCount,
        creatorId: userId,
        products: productsResult,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
