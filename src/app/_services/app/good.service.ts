import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { ProductModel } from '@app/_models';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GoodService {

    constructor(private httpClient: HttpClient) { }

    /**** LIST *** */
    getList() {
        const goods = new Array<ProductModel>();
        for (let i = 0; i <= 100; i++) {
            const good: ProductModel = {
                goods_id: '00' + i,
                tenant_id: '00' + i,
                goods_code: 'GOOD_CODE' + i,
                goods_name: 'GOOD_NAME' + i,
                unit: 'CAI',
                price: '12344',
                tax_rate_code: '10',
                tax_rate: 10,
                goods_group: 'GOOD_GROUP' + i,
                insert_date: '2018-11-25T11:17:23.000+0000'
            };
            goods.push(good);
        }

        return of(goods);
        // return this.httpClient.get(`${environment.serverUrl}/goods`);
    }

    create(product: ProductModel) {
        return this.httpClient.post(`${environment.serverUrl}/goods/`, product);
    }

    update(product: ProductModel) {
        return this.httpClient.put(`${environment.serverUrl}/goods/`, product);
    }

    uploadFile() {

    }

    downloadFile() {
        return this.httpClient.get(`${environment.serverUrl}/goods/download`);
    }
}
