import { CustomerData } from './data/customer.data';
import { ProductData } from './data/product.data';


export class InvoiceModel {
  form: string;
  serial: string;
  invoice_date: string;
  customer: CustomerData;
  paymentType: string;
  total_before_tax: number;
  total_tax: number;
  total: number;
  items: Array<ProductData>;
}
