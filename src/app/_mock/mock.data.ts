import { Injectable } from '@angular/core';
@Injectable()
export class AppConstant {
    public listToken = JSON.parse(`
    [
        {
            "alias": "plugintest",
            "name": "EMAILADDRESS=aa@gmail.com, CN=plugintest, O=aa, OU=aa, C=VN",
            "notBefore": "02/12/2018 20:00:59",
            "notAfter": "01/12/2023 20:00:59",
            "effectiveDate": "02/12/2018 - 01/12/2023",
            "isExpired": false
        }
    ]
    `);
    public customerDetail = JSON.parse(`
    {
        "customer_id": 1,
        "tenant_id": 1,
        "customer_code": "VT",
        "customer_name": "Nguyễn Tuần Linh",
        "org": "Công ty TNHH Viettel",
        "tax_code": "183923383",
        "address": "Hà Nội",
        "bank_account": "12313123123",
        "bank": "Ngân hàng quân đội",
        "email": "admin@viettel.com",
        "phone": "091383838",
        "insert_date": "2018-11-25T17:50:05.000+0000"
    }
    `);
    public customerList = JSON.parse(`
    [
        {
            "customer_id": 1,
            "tenant_id": 1,
            "customer_code": "VT",
            "customer_name": "Nguyễn Tuần Linh",
            "org": "Công ty TNHH Viettel",
            "tax_code": "183923383",
            "address": "Hà Nội",
            "bank_account": "12313123123",
            "bank": "Ngân hàng quân đội",
            "email": "admin@viettel.com",
            "phone": "091383838",
            "insert_date": "2018-11-25T17:50:05.000+0000"
        },
        {
            "customer_id": 3,
            "tenant_id": 1,
            "customer_code": "FPT",
            "customer_name": "Pham Van An",
            "org": "Tap doan FPT",
            "tax_code": "0101597865",
            "address": "Ha Noi",
            "bank_account": "A123456789",
            "bank": "Vietcombank",
            "email": "fpt@mail.com",
            "phone": "0987654321",
            "insert_date": "2018-11-30T02:57:14.000+0000"
        },
        {
            "customer_id": 4,
            "tenant_id": 1,
            "customer_code": "BIDV",
            "customer_name": "Tran Bac Ha",
            "org": "Ngan hang BIDV",
            "tax_code": "0101597865",
            "address": "Ha Noi",
            "bank_account": "A123456789",
            "bank": "Vietcombank",
            "email": "fpt@mail.com",
            "phone": "0987654321",
            "insert_date": "2018-11-30T03:13:03.000+0000"
        },
        {
            "customer_id": 5,
            "tenant_id": 1,
            "customer_code": "BIDV 2",
            "customer_name": "Tran Bac Ha",
            "org": "Ngan hang BIDV",
            "tax_code": "0101597865",
            "address": "Ha Noi",
            "bank_account": "A123456789",
            "bank": "Vietcombank",
            "email": "fpt@mail.com",
            "phone": "0987654321",
            "insert_date": "2018-11-30T03:15:56.000+0000"
        },
        {
            "customer_id": 6,
            "tenant_id": 1,
            "customer_code": "BIDV 3",
            "customer_name": "Tran Bac Ha Tay",
            "org": "Ngan hang BIDV",
            "tax_code": "0101597865",
            "address": "Ha Noi",
            "bank_account": "A123456789",
            "bank": "Vietcombank",
            "email": "fpt@mail.com",
            "phone": "0987654321",
            "insert_date": "2018-11-30T03:16:30.000+0000"
        },
        {
            "customer_id": 65,
            "tenant_id": 1,
            "customer_code": "0000000005",
            "customer_name": "Phạm Quý Ngọ",
            "org": "Công ty TNHH Công nghệ mới",
            "tax_code": "0108531824",
            "address": "Số 1 đường Trường Chinh, Đống Đa, Hà Nội",
            "bank_account": "000000000001",
            "bank": "VIETCOMBANK CHI NHÁNH HÀ TÂY",
            "email": "ngopq@cnm.com",
            "phone": "0987654321",
            "insert_date": "2018-12-02T15:54:21.000+0000"
        },
        {
            "customer_id": 66,
            "tenant_id": 1,
            "customer_code": "0000000006",
            "customer_name": "Đỗ Ngọc Thạch",
            "org": "CÔNG TY TNHH 3F STUDIO",
            "tax_code": "0315414413",
            "address": "832 Trần Hưng Đạo, Phường 07, Quận 5, TP Hồ Chí Minh",
            "bank_account": "000000000002",
            "bank": "Ngân hàng Nông nghiệp và phát triển nông thôn",
            "email": null,
            "phone": "0123456789",
            "insert_date": "2018-12-02T15:54:22.000+0000"
        }
    ]
    `);
    public goodDetail = JSON.parse(`
    {
        "goods_id": 1,
        "tenant_id": 1,
        "goods_code": "TVSS24",
        "goods_name": "Tivi Samsung 24inch",
        "unit": "Cái",
        "price": 15000000,
        "tax_rate_code": "10",
        "tax_rate": 10,
        "goods_group": "HH",
        "insert_date": "2018-11-25T11:17:23.000+0000"
    }
    `);
    public goodList = JSON.parse(`
    [
        {
            "goods_id": 1,
            "tenant_id": 1,
            "goods_code": "TVSS24",
            "goods_name": "Tivi Samsung 24inch",
            "unit": "Cái",
            "price": 15000000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "HH",
            "insert_date": "2018-11-25T11:17:23.000+0000"
        },
        {
            "goods_id": 2,
            "tenant_id": 1,
            "goods_code": "TLTSB2C",
            "goods_name": "Tủ Lạnh Toshiba 2 cánh 215l",
            "unit": "Cái",
            "price": 22500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "HH",
            "insert_date": "2018-11-25T11:17:23.000+0000"
        },
        {
            "goods_id": 43,
            "tenant_id": 1,
            "goods_code": "TLTSB2C 33",
            "goods_name": "Tủ Lạnh Toshiba 2 cánh 215l 555",
            "unit": "Cái",
            "price": 22500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "HH",
            "insert_date": "2018-11-30T03:21:04.000+0000"
        },
        {
            "goods_id": 121,
            "tenant_id": 1,
            "goods_code": "ABA1",
            "goods_name": "Xe máy",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:00.000+0000"
        },
        {
            "goods_id": 122,
            "tenant_id": 1,
            "goods_code": "ABA2",
            "goods_name": "Bột giặt",
            "unit": "gói",
            "price": 600000,
            "tax_rate_code": "9",
            "tax_rate": 9,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:00.000+0000"
        },
        {
            "goods_id": 123,
            "tenant_id": 1,
            "goods_code": "ABA3",
            "goods_name": "Tivi",
            "unit": "cái",
            "price": 700000,
            "tax_rate_code": "8",
            "tax_rate": 8,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:00.000+0000"
        },
        {
            "goods_id": 124,
            "tenant_id": 1,
            "goods_code": "ABA4",
            "goods_name": "Ghế",
            "unit": "chiếc",
            "price": 800000,
            "tax_rate_code": "7",
            "tax_rate": 7,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:01.000+0000"
        },
        {
            "goods_id": 125,
            "tenant_id": 1,
            "goods_code": "ABA5",
            "goods_name": "Bàn",
            "unit": "chiếc",
            "price": 900000,
            "tax_rate_code": "6",
            "tax_rate": 6,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:01.000+0000"
        },
        {
            "goods_id": 126,
            "tenant_id": 1,
            "goods_code": "ABA6",
            "goods_name": "Oto",
            "unit": "chiếc",
            "price": 1000000,
            "tax_rate_code": "5",
            "tax_rate": 5,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:01.000+0000"
        },
        {
            "goods_id": 127,
            "tenant_id": 1,
            "goods_code": "ABA7",
            "goods_name": "Dầu gội",
            "unit": "chai",
            "price": 1100000,
            "tax_rate_code": "4",
            "tax_rate": 4,
            "goods_group": "TD",
            "insert_date": "2018-12-02T13:42:01.000+0000"
        },
        {
            "goods_id": 81,
            "tenant_id": 1,
            "goods_code": "ATE",
            "goods_name": "TV LG 55 inch",
            "unit": "chiếc",
            "price": 15000000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-12-02T02:41:38.000+0000"
        },
        {
            "goods_id": 44,
            "tenant_id": 1,
            "goods_code": "AAA1",
            "goods_name": "Tủ lạnh 1",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:42.000+0000"
        },
        {
            "goods_id": 45,
            "tenant_id": 1,
            "goods_code": "AAA2",
            "goods_name": "Tủ lạnh 2",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:42.000+0000"
        },
        {
            "goods_id": 46,
            "tenant_id": 1,
            "goods_code": "AAA3",
            "goods_name": "Tủ lạnh 3",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:42.000+0000"
        },
        {
            "goods_id": 47,
            "tenant_id": 1,
            "goods_code": "AAA4",
            "goods_name": "Tủ lạnh 4",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:42.000+0000"
        },
        {
            "goods_id": 48,
            "tenant_id": 1,
            "goods_code": "AAA5",
            "goods_name": "Tủ lạnh 5",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:42.000+0000"
        },
        {
            "goods_id": 49,
            "tenant_id": 1,
            "goods_code": "AAA6",
            "goods_name": "Tủ lạnh 6",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 50,
            "tenant_id": 1,
            "goods_code": "AAA7",
            "goods_name": "Tủ lạnh 7",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 51,
            "tenant_id": 1,
            "goods_code": "AAA8",
            "goods_name": "Tủ lạnh 8",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 52,
            "tenant_id": 1,
            "goods_code": "AAA9",
            "goods_name": "Tủ lạnh 9",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 53,
            "tenant_id": 1,
            "goods_code": "AAA10",
            "goods_name": "Tủ lạnh 10",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 54,
            "tenant_id": 1,
            "goods_code": "AAA11",
            "goods_name": "Tủ lạnh 11",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:43.000+0000"
        },
        {
            "goods_id": 55,
            "tenant_id": 1,
            "goods_code": "AAA12",
            "goods_name": "Tủ lạnh 12",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:44.000+0000"
        },
        {
            "goods_id": 56,
            "tenant_id": 1,
            "goods_code": "AAA13",
            "goods_name": "Tủ lạnh 13",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:44.000+0000"
        },
        {
            "goods_id": 57,
            "tenant_id": 1,
            "goods_code": "AAA14",
            "goods_name": "Tủ lạnh 14",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:44.000+0000"
        },
        {
            "goods_id": 58,
            "tenant_id": 1,
            "goods_code": "AAA15",
            "goods_name": "Tủ lạnh 15",
            "unit": "chiếc",
            "price": 500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "DL",
            "insert_date": "2018-11-30T08:25:44.000+0000"
        },
        {
            "goods_id": 61,
            "tenant_id": 1,
            "goods_code": "TLTSB2C11",
            "goods_name": "Tủ Lạnh Toshiba 2 cánh 215l",
            "unit": "Cái",
            "price": 22500000,
            "tax_rate_code": "10",
            "tax_rate": 10,
            "goods_group": "HH",
            "insert_date": "2018-12-01T09:06:57.000+0000"
        }
    ]`);
    public references = JSON.parse(`
    [
        {
            "type": "COMBO_PAYMENT",
            "code": "TMCK",
            "value": "Tiền mặt / Chuyển khoản",
            "description": null
        },
        {
            "type": "COMBO_PAYMENT",
            "code": "TM",
            "value": "Tiền mặt",
            "description": null
        },
        {
            "type": "COMBO_PAYMENT",
            "code": "CK",
            "value": "Chuyển khoản",
            "description": null
        },
        {
            "type": "COMBO_TAX_RATE_CODE",
            "code": "MT",
            "value": "0",
            "description": "Hàng miễn thuế"
        },
        {
            "type": "COMBO_TAX_PRICE_TYPE",
            "code": "PNT",
            "value": "PNT",
            "description": "Khai giá hàng chưa thuế"
        },
        {
            "type": "COMBO_INVOICE_STATUS",
            "code": "DISPOSED",
            "value": "Đã hủy",
            "description": null
        },
        {
            "type": "COMBO_AUTO_EMAIL",
            "code": "SIGNED",
            "value": "SIGNED",
            "description": "Thời điểm ký"
        },
        {
            "type": "COMBO_AUTO_EMAIL",
            "code": "APPROVED",
            "value": "APPROVED",
            "description": "Thời điểm duyệt"
        },
        {
            "type": "COMBO_INVOICE_TYPE",
            "code": "ORG",
            "value": "Hóa đơn gốc",
            "description": null
        },
        {
            "type": "COMBO_INVOICE_TYPE",
            "code": "ADJ",
            "value": "Hóa đơn điều chỉnh",
            "description": null
        },
        {
            "type": "COMBO_INVOICE_TYPE",
            "code": "ADJED",
            "value": "Hóa đơn bị điều chỉnh",
            "description": null
        },
        {
            "type": "COMBO_INVOICE_STATUS",
            "code": "CREATED",
            "value": "Đã lập",
            "description": null
        },
        {
            "type": "COMBO_INVOICE_STATUS",
            "code": "SIGNED",
            "value": "Đã ký",
            "description": null
        },
        {
            "type": "COMBO_INVOICE_STATUS",
            "code": "APPROVED",
            "value": "Đã duyệt",
            "description": null
        },
        {
            "type": "COMBO_TAX_RATE_CODE",
            "code": "10",
            "value": "10",
            "description": "10%"
        },
        {
            "type": "COMBO_TAX_RATE_CODE",
            "code": "5",
            "value": "5",
            "description": "5%"
        },
        {
            "type": "COMBO_TAX_RATE_CODE",
            "code": "0",
            "value": "0",
            "description": "0%"
        },
        {
            "type": "COMBO_TAX_PRICE_TYPE",
            "code": "PWT",
            "value": "PWT",
            "description": "Khai Giá hàng có thuế"
        },
        {
            "type": "COMBO_FORM",
            "code": "1",
            "value": "1",
            "description": ""
        },
        {
            "type": "COMBO_FORM",
            "code": "01GTKT0/001",
            "value": "01GTKT0/001",
            "description": ""
        },
        {
            "type": "COMBO_SERIAL_1",
            "code": "1",
            "value": "1",
            "description": ""
        },
        {
            "type": "COMBO_SERIAL_01GTKT0/001",
            "code": "NV/18E",
            "value": "NV/18E",
            "description": ""
        },
        {
            "type": "COMBO_SERIAL_01GTKT0/001",
            "code": "NV/18F",
            "value": "NV/18F",
            "description": ""
        }
    ]
    `);
    public invoiceList = JSON.parse(`{
        "page": 0,
        "total_elements": 20,
        "total_pages": 7,
        "contents": [
            {
                "invoice_id": 361,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000127",
                "status": "CREATED",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 391,
                "form": "1",
                "status": "SIGNED",
                "serial": "1",
                "invoice_no": "0000141",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 385,
                "form": "1",
                "serial": "1",
                "status": "DISPOSED",
                "invoice_no": "0000135",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 384,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000134",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 383,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000133",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 364,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000130",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 363,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000129",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 362,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000128",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 390,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000140",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 389,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000139",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 388,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000138",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 387,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000137",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 386,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000136",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 382,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000132",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 381,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000131",
                "invoice_date": "2018-12-02",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 302,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000119",
                "invoice_date": "2018-11-27",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 304,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000121",
                "invoice_date": "2018-11-27",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 303,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000120",
                "invoice_date": "2018-11-27",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": {
                    "customer_name": "Phạm Ngọc Hoài",
                    "org": "Công ty TNHH Nova",
                    "tax_code": "143243242342",
                    "bank_account": "111222333",
                    "bank": "Ngân hàng Vietcombank",
                    "email": "hoaipn@gmail.com",
                    "address": "Vui vui",
                    "phone": "092834833"
                },
                "total_before_tax": 10000,
                "total_tax": 1000,
                "total": 11000
            },
            {
                "invoice_id": 282,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000102",
                "invoice_date": "2018-11-26",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": null,
                "total_before_tax": null,
                "total_tax": null,
                "total": null
            },
            {
                "invoice_id": 281,
                "form": "1",
                "serial": "1",
                "invoice_no": "0000099",
                "invoice_date": "2018-11-26",
                "seller": {
                    "name": "Công ty TNHH Dịch Vụ Nova XXX",
                    "address": "Bắc Ninh",
                    "tax_code": "123456789",
                    "phone": "0916868234",
                    "email": "hoaipn@gmail.com",
                    "bank_account": null,
                    "bank": null
                },
                "customer": null,
                "total_before_tax": null,
                "total_tax": null,
                "total": null
            }
        ]
    }`);
}
