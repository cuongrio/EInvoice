
export const CB = {
    tax: 'COMBO_TAX_RATE_CODE',
    form: 'COMBO_FORM',
    payment: 'COMBO_PAYMENT',
    status: 'COMBO_INVOICE_STATUS',
    serial: 'COMBO_SERIAL_',
    type: 'COMBO_INVOICE_TYPE'
};

export const MODAL = {
    w_sm: 'w-modal-sm',
    w_md: 'w-modal-md',
    w_token: 'w-modal-token',
    success: 'success',
    error: 'error'
};

export const ROUTE = {
    copy: 'sao-chep',
    detail: 'chi-tiet',
    replace: 'thay-the',
    adjust: 'dieu-chinh',
    create: 'tao-moi',
    invoice: 'hoa-don',
    refresh: 'rf',
    setting: 'thiet-lap',
    utils: 'tien-ich',
    report: 'bao-cao',
    good: 'hang-hoa'
}

export const COOKIE_KEY = {
    token: 'xauth-token',
    tenant: 'tenant',
    signatureType: 'signature_type'
}

export const STORE_KEY = {
    inQ: 'inQ',
    inE: 'inE',
    serialCb: 'serialCb',
    formCb: 'formCb',
    htttCb: 'htttCb',
    taxRateCb: 'taxRateCb',
    statusCb: 'statusCb',
    typeCb: 'typeCb',
    gAutoCp: 'gAutoCp',
    gE: 'gE',
    gQ: 'gQ',
    cusAutoCp: 'cusAutoCp',
    cusQ: 'cusQ',
    cusE: 'cusE',
    userQ: 'userQ'
};

export const MSG = {
    invoicePrefix: 'Hóa đơn:',
    notify: 'Thông báo!',
    signSuccess: 'Đã ký thành công hóa đơn!',
    signError: 'Không thể ký hóa đơn! <br /> lỗi: ',
    systemErr: 'Đã có lỗi xảy ra! <br /> Vui lòng liên hệ Admin.',
    adjustErr: 'Không thể điều chỉnh hóa đơn!',
    adjustSuccess: 'Đã điều chỉnh cho hóa đơn',
    newInNo: 'Số hóa đơn mới: ',
    replaceSuccess: 'Đã thay thế hóa đơn',
    updateSuccess: 'Đã cập nhật hóa đơn thành công!',
    updateErr: 'Không thể cập nhật hóa đơn!',
    createSuccess: 'Đã tạo hóa đơn thành công!',
    createErr: 'Không thể tạo hóa đơn!',
    disposeSuccess: 'Đã hủy hóa đơn thành công!',
    disposedErr: 'Hóa đơn đã hủy.',
    empty: 'Không có dữ liệu',
    loading: 'Đang tải..',
    add: 'Thêm',
    success: 'Thành công!',
    invalid: 'Không hợp lệ',
    alreadyPrint: 'Hóa đơn đã in chuyển đổi. <br /> Chỉ được in chuyển đổi một lần!',
    approveSuccess: 'Đã duyệt hóa đơn thành công!',
    tokenRequired: 'Bạn chưa chọn chữ ký.'
};

export const DISABLED = 'disabled';

export const DATE = {
    vi: 'DD-MM-YYYY',
    en: 'YYYY-MM-DD',
    vi2: 'DD/MM/YYYY',
    bsConfig: {
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-blue'
    }
};

export const TOKEN_TYPE = {
    soft: 'SOFT',
    token: 'TOKEN'
};

export const STATE = {
    approve: 'APPROVED',
    signed: 'SIGNED'
};

export const STATUS = {
    approve: 'APPROVED',
    signed: 'SIGNED',
    replaced: 'REPLACED',
    replace: 'REPLACE',
    adjed: 'ADJED',
    adj: 'ADJ',
    created: 'CREATED',
    disposed: 'DISPOSED'
};

export const SORT = {
    desc: 'DESC',
    asc: 'ASC',
    inNo: 'invoiceNo',
    inDate: 'invoiceDate',
    form: 'form',
    cusCode: 'customerCode',
    tax: 'taxCode',
    gCode: 'goodsCode'
};

export const INIT = {
    sort: [
        { value: 'Tăng dần', code: SORT.asc },
        { value: 'Giảm dần', code: SORT.desc }
    ],
    invSortBy: [
        { value: 'Số hóa đơn', code: SORT.inNo },
        { value: 'Ngày hóa đơn', code: SORT.inDate },
        { value: 'Mẫu số', code: SORT.form }
    ],
    cSortBy: [
        { value: 'Mã đối tượng', code: SORT.cusCode },
        { value: 'Mã số thuế', code: SORT.tax }
    ],
    gSortBy: [
        { value: 'Mã hàng', code: SORT.gCode }
    ]
};

export const PAGE = {
    box: [{
        "code": 10,
        "value": '10'
    }, {
        "code": 25,
        "value": '25'
    }, {
        "code": 50,
        "value": '50'
    }, {
        "code": 100,
        "value": '100'
    }],
    size: 25,
    firstPage: 1
};

export const CONTENT_TYPE = {
    html: 'text/html',
    zip: 'application/zip',
    excel: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ahoadon: 'AHOADON.VN',
    headerDispose: 'Content-Disposition',
    afterChar: 'filename='
};

export const ID = {
    sign: '#signButton',
    open: '#openButton',
    invoiceTable: '#invoiceTable',
    customerTable: '#customerTable',
    productTable: '#productTable',
    edit: '#editButton',
    copy: '#copyButton',
    download: '#downloadButton',
    delete: '#deleteButton',
    print: '#printButton',
    printTranform: '#printTranformButton',
    approve: '#approveButton',
    dispose: '#disposeButton',
    adjust: '#adjustButton',
    replace: '#replaceButton',
    stickyChoice: 'input:checkbox[name=stickchoice]',
    cusCode: '#customer_code',
    combobox: 'input[role="combobox"]',
    taxCode: '#tax_code'
};

export const DEFAULT_ROUTER = [
    {
        navigate: 'trang-chu',
        icon: 'icon-screen-desktop',
        label: 'Trang chủ'
    }, {
        navigate: 'hoa-don',
        icon: 'icon-docs',
        label: 'Danh sách hóa đơn'
    }, {
        navigate: 'hang-hoa',
        icon: 'icon-disc',
        label: 'Hàng hóa'
    }, {
        navigate: 'khach-hang',
        icon: 'fa fa-user-circle',
        label: 'Khách hàng'
    }, {
        navigate: 'bao-cao',
        icon: 'icon-book-open',
        label: 'Báo cáo',
        sub: [{
            navigate: 'bao-cao/thong-ke',
            label: 'Thống kê'
        }, {
            navigate: 'bao-cao/bang-ke',
            label: 'Bảng kê manifest'
        }]
    }, {
        navigate: 'danh-muc',
        icon: 'fa fa-th-list',
        label: 'Danh mục',
        sub: [{
            navigate: 'thong-tin',
            label: 'Công ty'
        }, {
            navigate: 'thiet-lap/hoa-don',
            label: 'Thiết lập hóa đơn'
        }, {
            navigate: 'thiet-lap/tuy-chinh',
            label: 'Tùy chỉnh'
        }]
    }, {
        icon: 'fa fa-wrench',
        label: 'Tiện ích',
        sub: [{
            navigate: 'tien-ich/duyet-theo-lo',
            label: 'Duyệt theo lô'
        }]
    }
];
