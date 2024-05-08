import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCT_SERVICES, envs } from 'src/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICES,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroservicesHost,
          port: envs.productMicroservicesPort
        }
      },
    ])
  ],
  controllers: [ProductsController],
  providers: [],
})
export class ProductsModule { }
