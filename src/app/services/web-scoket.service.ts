import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {debounceTime, distinctUntilChanged, map, merge, mergeAll, multicast, share, switchMap, zip} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, Observable, ReplaySubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WebScoketService {

  constructor() {
  }

  myWebSocket: WebSocketSubject<any>;


  webSocketInit() {
    this.myWebSocket = webSocket('ws://159.89.15.214:8080/');
  }

  sendMessage(msg): Observable<any> {
    this.myWebSocket.next({subscribe: msg});
    return this.myWebSocket.asObservable().pipe(distinctUntilChanged());
  }

  unsubscribeSocket(msg) {
    this.myWebSocket.next({unsubscribe: msg});
  }

}
