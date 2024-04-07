import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { OrderStatus } from "@prisma/client";

import { OrderStatusEnum } from '../enum/order-status.enum';

export class CreateOrderDto {

    @IsNumber()
    @IsPositive()
    totalAmount: number;
    
    
    @IsNumber()
    @IsPositive()
    totalItems: number;

    @IsEnum(OrderStatusEnum, {
        message: `The provided status must be in ${ OrderStatusEnum }`
    })
    @IsOptional()
    status: OrderStatus = OrderStatus.PENDING;

    @IsBoolean()
    @IsOptional()
    paid: boolean;

}
