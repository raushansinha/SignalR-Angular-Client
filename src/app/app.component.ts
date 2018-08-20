import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import * as signalR from '@aspnet/signalr';
import { IMessage, Messageseverity } from './IMessage';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private _hubConnection;
  msgs: IMessage[] = [];

  constructor(public toastr: ToastrService) {  }

  showSuccess(message: string) {
    this.toastr.success(message, 'Success!');
  }

  ngOnInit(): void {
    //this._hubConnection = new HubConnection('http://localhost:1874/notify');
    this._hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Trace)
      .withUrl('https://localhost:44341/notify')
      .build();

    this._hubConnection
      .start()
      .then(() => console.log('Connection started!'))
      .catch(err => console.log('Error while establishing connection :('));

    this._hubConnection.on('BroadcastMessage', (type: Messageseverity, payload: string) => {
      this.msgs.push({ type: type, payload: payload });
      console.log("Messages: " + JSON.stringify(this.msgs));
      this.showSuccess(payload);
    });
  }

  ngOnDestroy() {
    this._hubConnection.stop()
      .then(() => {
        console.log('Hub stopped.');
      });
  }

}
