import { IsString, IsUUID, IsUrl } from "class-validator";

export class ChargeSucceededDto {

    @IsString()
    stripePaymentId: string;
    
    @IsString()
    @IsUUID()
    paymentOrderId: string;
    
    @IsString()
    @IsUrl()
    receiptUrl: string;
}