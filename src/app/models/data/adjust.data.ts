export class AdjData {
    invoice_type?: string;
    refs?: RefData[];
    secure_id?: string;
}

export class RefData {
    id?: number;
    form?: string;
    serial?: string;
    no?: string;
    date?: string;
}
