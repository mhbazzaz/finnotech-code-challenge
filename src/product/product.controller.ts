import { ProductService } from './product.service';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/request/create-product.dto';
import { GetProductDto } from './dto/response/get-product.dto';
import { GetAllProductsDto } from './dto/response/get-all-products.dto';
import { GetUserProductsDto } from './dto/response/get-user-product.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //----------------------------------
  @ApiOperation({ summary: 'Create Product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product has been created successfully!',
    type: GetProductDto,
  })
  // @UseGuards(AuthGuard)
  @Post()
  async createProduct(@Body() data: CreateProductDto): Promise<GetProductDto> {
    return await this.productService.createProduct(data);
  }

  //----------------------------------
  @ApiOperation({ summary: 'Get All Products With Paggination' })
  @ApiQuery({ name: 'page', required: true, description: 'Page Number' })
  @ApiQuery({ name: 'pageSize', required: true, description: 'Page Size' })
  @ApiResponse({
    status: 200,
    description: 'Products have been retrieved successfully!',
    type: GetAllProductsDto,
  })
  // @UseGuards(AuthGuard)
  @Get()
  async getAllProducts(
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ): Promise<GetAllProductsDto> {
    return await this.productService.getAllProducts(page, pageSize);
  }

  //----------------------------------
  @ApiOperation({ summary: 'Get Products By Creator-ID' })
  @ApiQuery({ name: 'page', required: true, description: 'Page Number' })
  @ApiQuery({ name: 'pageSize', required: true, description: 'Page Size' })
  @ApiResponse({
    status: 200,
    description: 'Products has been retrieved successfully!',
    type: GetUserProductsDto,
  })
  // @UseGuards(AuthGuard)
  @Get(':userId')
  async getUserProducts(
    @Param('userId') userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('pageSize', ParseIntPipe) pageSize?: number,
  ): Promise<GetUserProductsDto> {
    return await this.productService.getUserProducts(userId, page, pageSize);
  }
}
