# E-INVOICE
CREATED = Lập mới
SIGNED = Đã ký
APPROVED = Duyệt
DISPOSED = Xóa bỏ

định dạng date
22/08/2018

tiền
1.000.000
1.230

----
form add invoiceNo
-Tổng số tiền, Tổng số thuế, Tổng tiền trước thuế

search: 
bỏ column người bán,
thêm thông tin cột KH: MST, Địa chỉ
thêm cột: %VAT

expand: Hiển thị hết thông tin sản phẩm

ctr+F : mở cái form search.


### DEPLOYMENT CONFIG
"engines": {
    "node": "10.3.0"
},
"scripts": {
	"ng": "ng",
	"build": "ng build --prod",
	"start": "http-server dist/",
	"serve:sw": "npm run build -s && npx http-server ./dist -p 4200",
	"lint": "ng lint && stylelint \"src/**/*.scss\" --syntax scss && htmlhint \"src\" --config .htmlhintrc",
	"test": "ng test",
	"test:ci": "npm run lint -s && ng test --code-coverage --watch=false",
	"e2e": "ng e2e",
	"translations:extract": "ngx-translate-extract --input ./src --output ./src/translations/template.json --format=json --clean -sort --marker extract",
	"docs": "hads ./docs -o",
	"env": "ngx-scripts env npm_package_version",
	"prettier": "prettier --write \"./{src,e2e}/**/*.{ts,js,scss}\"",
	"prettier:check": "prettier --list-different \"./{src,e2e}/**/*.{ts,js,scss}\"",
	"preinstall": "npm install -g http-server",
	"postinstall": "ng build --prod",
	"precommit": "pretty-quick --staged",
	"generate": "ng generate"
},

### DEV CONFIG
"scripts": {
    "ng": "ng",
    "build": "ng build --prod",
    "start": "ng serve",
    "postinstall": "npm run prettier -s",
    "serve:sw": "npm run build -s && npx http-server ./dist -p 4200",
    "lint": "ng lint && stylelint \"src/**/*.scss\" --syntax scss && htmlhint \"src\" --config .htmlhintrc",
    "test": "ng test",
    "test:ci": "npm run lint -s && ng test --code-coverage --watch=false",
    "e2e": "ng e2e",
    "translations:extract": "ngx-translate-extract --input ./src --output ./src/translations/template.json --format=json --clean -sort --marker extract",
    "docs": "hads ./docs -o",
    "env": "ngx-scripts env npm_package_version",
    "prettier": "prettier --write \"./{src,e2e}/**/*.{ts,js,scss}\"",
    "prettier:check": "prettier --list-different \"./{src,e2e}/**/*.{ts,js,scss}\"",
    "precommit": "pretty-quick --staged",
    "generate": "ng generate"
  },

#####
HOA DON
1. xem
	InvoiceService -> preview
	
2. In thể hiện
	InvoiceService -> print
	dowload -> print

3. In CĐ
	InvoiceService -> tranform
		sau ký | trạng thái từ approved, signed
		
4. Sửa -> Mở

5. hóa đơn ký rồi -> disabled nút

6. sign. goi theo thu tu 4 ham. data: 
7. approve: ki xong duyet. 

8. dispose huy. 
	-> chọn dòng -> hủy
	
9. Điều chỉnh 
	-> giữ nguyên thông tin khách hàng
	-> xóa items
	
	
this.router.navigate(['/dang-nhap']);

if (error.status === 401 || error.status === 402 || error.status === 403) {
	this.router.navigate(['4xx']);
}
return Observable.throw(error || 'SERVER ERROR');
	

====================================================
{
	"form": "1",
	"serial": "1",
	"invoice_date": "2018-11-25",
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
	"total_before_tax": 50000,  // amount1+amount2
	"total_tax": 5000, //(tax1*quantity) + (tax2*uantity)
	"total": 55000,  // tong tien phai tra = amount_wt1 + amount_wt2
	"items": [
		{
			"item_line": 1,
			"item_code": "",
			"item_name": "Tủ Lạnh Toshiba",
			"unit": "Cái",
			"price": 10000,
			"tax": 1000,        // tien thue = price*tax_rate
			"tax_rate": 10,     
			"tax_rate_code": 10,
			"price_wt": 11000,  // = price + tax  
			"quantity": 2,
			"amount": 20000, //=tong tien chua thue = price * quantity
			"amount_wt": 22000  // = tong tien co thue = price_wt * quantity
		},
		{
			"item_line": 2,
			"item_code": "",
			"item_name": "Dieu Hoa Toshiba",
			"unit": "Cái",
			"price": 30000,
			"tax": 3000,        // tien thue = price*tax_rate
			"tax_rate": 10,     
			"tax_rate_code": 10,
			"price_wt": 33000,  // = price + tax  
			"quantity": 1,
			"amount": 30000, //=tong tien chua thue = price * quantity
			"amount_wt": 33000  // = tong tien co thue = price_wt * quantity
		}
	]
}


#theme FE: CloudUI bootstrap4 Admin




























