import { OrderDetailModel } from "./order-detail.model";

export class OrderModel{
    id: number = 0;
    number: string = "";
    date: string = "";
    expectedArrival: string = "";
    cargoCompany: string = "";
    cargoTrackingNumber: string = "";
    orderStatus: OrderStatusEnum = OrderStatusEnum.Confirmed;
    details: OrderDetailModel[] = [];
}

export enum OrderStatusEnum{
    Confirmed = 0,
    Shipped = 1,
    OutForDelivery = 2,
    Delivered = 3
}