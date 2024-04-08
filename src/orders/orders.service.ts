import { HttpStatus, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

import { OrderPaginationDto, UpdateOrderStatusDto } from './dto';
import { CreateOrderDto } from './dto/create-order.dto';

import { NATS_SERVICE } from 'src/config/services';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected')
  }

  async create(createOrderDto: CreateOrderDto) {

    try {
      const productIds = createOrderDto.items.map( item => item.productId);

      const products = await firstValueFrom(
        this.client.send({ cmd: 'validate_product' }, productIds),
      );

      const totalAmount = createOrderDto.items.reduce(( acc, item ) => {
        const proudctPrice = products.find( p => p.id === item.productId).price;
        return acc + proudctPrice * item.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, item) => acc + item.quantity, 0);

      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map( item => ({
                price: products.find( product => product.id === item.productId).price,
                productId: item.productId,
                quantity: item.quantity,
              }))
            }
          }
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true
            }
          }
        }
      })

      return {
        ...order,
        OrderItem: order.OrderItem.map( orderItem => ({
          ...orderItem,
          name: products.find( product => product.id === orderItem.productId).name
        }))
      };
      
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: error.message
      })
    }

  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const where = orderPaginationDto.status ? { status: orderPaginationDto.status } : {}; 
    const offset = (orderPaginationDto.page - 1) * orderPaginationDto.limit;
    const ordersTotal = await this.order.count({ where });

    const orders = await this.order.findMany({
      where: where,
      take: orderPaginationDto.limit,
      skip: offset       
    })

    return {
      pagination: {
        count: ordersTotal,
        page: orderPaginationDto.page,
      },
      results: orders.length,
      data: orders,
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price: true,
            quantity: true,
            productId: true,
          }
        }
      }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${ id } not found`
      })
    }

    const productIds = order.OrderItem.map(product => product.productId);

    const products = await firstValueFrom(
      this.client.send({ cmd: 'validate_product' }, productIds),
    );

    return {
      ...order,
      OrderItem: order.OrderItem.map( orderItem => ({
        ...orderItem,
        name: products.find( product => product.id === orderItem.productId).name
      }))
    };
  }

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto) {
    const { id, status } = updateOrderStatusDto;

    const order = await this.order.findFirst({
      where: { id }
    });

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: {
        status: status
      }
    })

  }

}
