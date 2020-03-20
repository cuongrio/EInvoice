import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import { environment } from '@env/environment';

@Injectable()
export class SocketService {

    connected$ = new Subject<any>();
    error$ = new Subject<any>();
    private subject: Subject<MessageEvent>;

    connect(): Subject<MessageEvent> {
        if (!this.subject) {
            this.subject =
                this.create(`${environment.socketUrl}`);
        }
        return this.subject;
    }

    private create(url: string): Subject<MessageEvent> {
        const ws = new WebSocket(url);
        ws.addEventListener('error', () => { 
            this.error$.next({ 
                error: true
            });
        });

        ws.addEventListener('open', () => { 
            this.connected$.next({ 
                sucess: true
            });
        });

        const observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                return ws.close.bind(ws);
            });

        const observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };

        return Subject.create(observer, observable);
    }

}
