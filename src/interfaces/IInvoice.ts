export interface IInvoice {
  invoiceNumber: string;
  recipientName: string;
  recipientEmail: string;
  clientName: string;
  clientEmail: string;
  projectDescription: string;
  issuedOn: string;
  dueOn: string;
  billFrom: string;
  billTo: string;
  currency: string;
  notes?: string;
  items: Item[];
  invoiceStyle?: INVOICESTYLES
}

interface Item {
  item: string;
  desc?: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export enum INVOICESTYLES {
  MINIMALIST = "MINIMALIST",
  MODERN = "MODERN",
  SIMPLE = "SIMPLE",
}
