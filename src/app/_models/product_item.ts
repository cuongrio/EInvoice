export class ProductItem {
  item_line: number;
  item_code?: string;
  item_name: string;
  unit: string;
  quantity: number;
  price: number;
  total_price?: number;
  ck?: number;
  total_ck?: number;
  tax_rate: number;
}
