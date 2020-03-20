import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import { SocketService } from './socket.service';

@Injectable()
export class TokenService {
    messages$: Subject<any>;
    error: any;
    connected: any;

    constructor(
        protected wsService: SocketService
    ) {
        this.messages$ =
            <Subject<any>>this.wsService.connect()
                .pipe(
                    map((res: MessageEvent) => {
                        return res.data;
                    })
                );

        this.wsService.error$
            .subscribe(() => {
                this.error = true;
            }, err => {
                this.error = true;
            });

        this.wsService.connected$
            .subscribe(() => {
                this.connected = true;
            });
    }
}
