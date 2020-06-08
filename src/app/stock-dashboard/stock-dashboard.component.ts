import {Component, OnDestroy, OnInit} from '@angular/core';
import {WebScoketService} from '../services/web-scoket.service';
import {Observable, Subscription} from 'rxjs';


@Component({
  selector: 'app-stock-dashboard',
  templateUrl: './stock-dashboard.component.html',
  styleUrls: ['./stock-dashboard.component.css']
})
export class StockDashboardComponent implements OnInit, OnDestroy {
  stockPrices: any[] = [];
  wSubscription: Subscription;

  stockList = [{
    name: 'default',
    ISIN: 'DE000BASF111'
  },
    {
      name: 'intel',
      ISIN: 'US4581401001'
    },
    {
      name: 'whale corporation',
      ISIN: 'US0358140123'
    },

  ];

  constructor(private webSocketService: WebScoketService) {
  }

  ngOnInit(): void {
    this.webSocketService.webSocketInit();
  }

  sendISIN(message: string) {
    this.wSubscription = this.webSocketService.sendMessage(message).pipe()
      .subscribe((dataFromServer) => {
          this.filterStocks(dataFromServer);
        },
        error => {
          console.log('error');
        },
        () => {
          console.log('complete');
        }
      );
  }

  private filterStocks(stocksFromServer?) {
    const temp = this.stockPrices.find((val) => {
      return stocksFromServer.isin === val.isin;
    });
    temp ? temp.price = stocksFromServer.price : this.stockPrices.push(stocksFromServer);
  }

  unsubscribeToChannel(unsubMessage) {
    this.webSocketService.unsubscribeSocket(unsubMessage);
    this.stockPrices = this.stockPrices.filter((val) => {
      return val.isin !== unsubMessage;
    });
  }

  closeSocket() {
    this.wSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this.closeSocket();
  }

}
