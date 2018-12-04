export class ProductData {
  item_line?: number;
  item_code?: string;
  item_name: string;
  unit: string;
  quantity: number;
  price: number;
  tax?: number;
  total_tax?: number;
  tax_rate: number;
  tax_rate_code?: string;
  price_wt?: number; // gia tien + VAT
  amount?: number; // tong chua thue
  amount_wt?: number; //
  ck?: number;
  total_ck?: number;
}
