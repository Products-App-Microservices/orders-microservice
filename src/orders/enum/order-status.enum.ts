import { OrderStatus } from "@prisma/client";


export const OrderStatusEnum = [
    OrderStatus.PENDING,
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
]