export class ProductData {
  invoice_item_id?: number;
  item_line?: number;
  item_code?: string;
  item_name: string;
  unit: string;
  quantity: number;
  price: number;
  price_before_tax: number;

  // tien chua thue
  amount_before_tax: number;
  discount_rate?: number;
  discount?: number;
  tax_rate: number;
  tax_rate_code?: string;
  tax_free?: boolean;
  tax?: number;

  // thanh tien
  amount?: number;
}
