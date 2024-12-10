import { Controller, Get, Post, Body, Param, Inject, Query, Patch, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICES } from 'src/config';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICES) private readonly client: ClientProxy
  ) { }

  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );
  }

  @Get()
  async findAllOrders(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = await firstValueFrom(this.client.send('findAllOrders', orderPaginationDto));
      return orders;
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get(':id')
  async findOneOrder(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send('findOneOrder', { id })
      )
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('status/:status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      return this.client.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status
      })
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeOrderStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto
  ) {

    return this.client.send('changeOrderStatus', {
      id,
      status: statusDto.status
    })
      .pipe(
        catchError(err => { throw new RpcException(err) })
      );

  }

}
