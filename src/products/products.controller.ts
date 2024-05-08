import { BadRequestException, Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common/dto';
import { PRODUCT_SERVICES } from 'src/config';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICES) private readonly productsClient: ClientProxy
  ) { }


  @Post()
  createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    return this.productsClient.send({ cmd: "create_product" }, createProductDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({ cmd: "find_all_produtcs" }, paginationDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get(":id")
  async findOneProduct(
    @Param("id") id: string
  ) {
    return this.productsClient.send({ cmd: "find_one_product" }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
    // try {
    //   const product = await firstValueFrom(
    //     this.productsClient.send({ cmd: "find_one_product" }, { id })
    //   );

    //   return product;

    // } catch (error) {
    //   throw new RpcException(error);
    // }

  }

  @Delete(":id")
  deleteProduct(
    @Param("id", ParseIntPipe) id: number
  ) {
    return this.productsClient.send({ cmd: "delete_product" }, { id })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Patch(":id")
  patchProduct(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {

    return this.productsClient.send({ cmd: "update_product" }, {
      id,
      ...updateProductDto
    })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      )
  }
}
