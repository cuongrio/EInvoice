export class ProductItem {
  item_line: number;
  item_code?: string;
  item_name: string;
  unit: string;
  price: number;
  ck?: number;
  total_ck?: number;
  tax: number;
  tax_rate: number;
  price_wt: number;
  quantity: number;
  total_price?: number;
}
