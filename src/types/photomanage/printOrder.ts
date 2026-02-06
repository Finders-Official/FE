import type { ReceiptMethod } from "./process";

export interface SelectedPhoto {
  scannedPhotoId: number;
  quantity: number;
}

export interface DeliveryAddressRequest {
  recipientName: string;
  phone: string;
  zipcode: string;
  address: string;
  addressDetail?: string;
}

export interface PrintQuoteRequest {
  developmentOrderId: number;
  receiptMethod: ReceiptMethod;
  filmType?: string;
  printMethod?: string;
  paperType?: string;
  size?: string;
  frameType?: string;
  photos: SelectedPhoto[];
  deliveryAddress?: DeliveryAddressRequest;
}

export interface PrintQuoteResponse {
  printAmount: number;
  deliveryFee: number;
  totalAmount: number;
}
