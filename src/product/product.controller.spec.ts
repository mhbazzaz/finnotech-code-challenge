import { Test, TestingModule } from '@nestjs/testing';
import * as httpMocks from 'node-mocks-http';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { GetAllProductsDto } from './dto/response/get-all-products.dto';
import { GetUserProductsDto } from './dto/response/get-user-product.dto';
import { AuthGuard } from '../auth/guards/auth-jwt.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { GetProductDto } from './dto/response/get-product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockRequest = httpMocks.createRequest();
  mockRequest.userId = 1;

  const mockCreateProduct: CreateProductDto = {
    title: 'Mobile',
    description: 'iPhone 15',
  };

  const mockGetAllProducts: GetAllProductsDto = {
    totalCount: 1,
    products: [
      {
        id: 1,
        title: 'Mobile',
        description: 'iPhone 15',
        creatorId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };

  const mockGetUserProducts: GetUserProductsDto = {
    ...mockGetAllProducts,
    creatorId: 1,
  };

  let createdProduct: GetProductDto;
  let getAllProducts: GetAllProductsDto;
  let getUserProducts: GetUserProductsDto;

  const mockProductService = {
    createProduct: jest
      .fn()
      .mockImplementation(async (mockCreateProduct: CreateProductDto) => {
        return {
          ...mockCreateProduct,
          ...mockGetAllProducts.products[0],
        };
      }),

    getAllProducts: jest.fn().mockResolvedValue(mockGetAllProducts),

    getUserProducts: jest.fn().mockResolvedValue(mockGetUserProducts),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation(() => true),
        },
      ],
      imports: [PrismaModule],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductService)
      .compile();

    productService = moduleRef.get<ProductService>(ProductService);
    productController = moduleRef.get<ProductController>(ProductController);

    createdProduct = await productController.createProduct(
      mockCreateProduct,
      mockRequest,
    );

    getAllProducts = await productController.getAllProducts();
    getUserProducts = await productController.getUserProducts(mockRequest);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  it('should create a product', async () => {
    expect(createdProduct).toEqual({
      ...getAllProducts.products[0],
    });
  });

  it('should get all products that are created', () => {
    expect(getAllProducts).toEqual(mockGetAllProducts);
  });

  it('should get all user products that are created', () => {
    expect(getUserProducts).toEqual(mockGetUserProducts);
  });
});
