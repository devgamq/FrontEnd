import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  private url = 'http://190.129.224.5:8080';
  // private url = 'http://192.168.1.7:8080';
  // private url = 'http://localhost:8080';
  private socket;

  onClasificatorio() {
    this.socket.emit('on-clasificatorio');
  }

  onChangeClasificatorio(jId, cId, labelJ, labelC, tipo: string) {
    this.socket.emit('on-changeClasificatorio', {jId: jId, cId: cId, labelJ: labelJ, labelC: labelC, tipo: tipo});
  }


  handleClasificatorio() {
    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('handle-clasificatorio', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
  handleChangeClasificatorio() {
    const observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('handle-changeClasificatorio', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }
}