/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

import {
  AllocatedNodesPayload,
  JobStatusPayload,
  JobFinishedPayload,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;

  constructor() {
    this.socket = io(environment.WS, {
      transports: ['websocket'],
      upgrade: false,
    });

    console.log(this.socket);
    this.socket.on('jobsstatus', (msg) => console.log(msg));

    this.socket.onAny((msg) => console.log(msg));
  }

  public listenAllocatedNodes(): Observable<AllocatedNodesPayload> {
    return fromEvent(this.socket, 'allocatednodes');
  }

  public listenJobsStatus(): Observable<JobStatusPayload> {
    return fromEvent(this.socket, 'jobsstatus');
  }

  public listenJobsFinished(): Observable<JobFinishedPayload> {
    return fromEvent(this.socket, 'jobsfinished');
  }
}
