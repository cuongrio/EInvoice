export class ProductData {
  item_line?: number;
  item_code?: string;
  item_name: string;
  unit: string;
  quantity: number;
  price: number;
  tax_rate: number;
  tax_rate_code?: string;
  discount_rate?: number;
  discount?: number;

  // keep old
  price_wt?: number;

  tax?: number;
  amount?: number;
  amount_wt?: number;
}
