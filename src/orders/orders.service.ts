import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto, UpdateOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(OrdersService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected')
  }

  async create(createOrderDto: CreateOrderDto) {
    const order = await  this.order.create({
      data: createOrderDto,
    })

    return order;
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
      where: { id }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${ id } not found`
      })
    }

    return order;
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
