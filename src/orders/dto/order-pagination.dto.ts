import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { Type } from "class-transformer";

import { OrderStatusEnum } from "../enum/order-status.enum";


export class OrderPaginationDto {

    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;
    
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;

    @IsEnum( OrderStatusEnum )
    @IsOptional()
    status?: OrderStatus;

}