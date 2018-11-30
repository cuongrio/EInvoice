import { Customer, ProductItem } from '.';

export class InvoiceItem {
  form: string;
  serial: string;
  invoice_date: string;
  customer: Customer;
  paymentType: string;
  total_before_tax: number;
  total_tax: number;
  total: number;
  items: Array<ProductItem>;
}
