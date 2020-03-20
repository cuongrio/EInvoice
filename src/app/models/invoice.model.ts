import { CustomerData } from './data/customer.data';
import { ProductData } from './data/product.data';

export class InvoiceModel {
  form: string;
  serial: string;
  invoice_id?: number;
  invoice_no?: string;
  status?: string;
  note_id?: string;
  note_date?: string;
  invoice_date: string;
  order_no: string;
  customer: CustomerData;
  payment_method: string;
  total_before_tax: number;
  total_tax: number;
  total: number;

  invoice_type?: string;
  ref_invoice_id?: number;
  ref_invoice_form?: string;
  ref_invoice_serial?: string;
  ref_invoice_no?: string;
  ref_invoice_date?: string;
  secure_id?: string;

  items: Array<ProductData>;
}
