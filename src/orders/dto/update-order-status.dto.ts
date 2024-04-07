import { IsEnum, IsUUID } from "class-validator";
import { OrderStatusEnum } from "../enum/order-status.enum";
import { OrderStatus } from "@prisma/client";



export class UpdateOrderStatusDto {

    @IsUUID()
    id: string;

    @IsEnum(OrderStatusEnum, {
        message: `Valid status are ${ OrderStatusEnum }`,
    })
    status: OrderStatus;

}