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
    this.socket = io(environment.WEBAPP_WS_URL, {
      transports: ['websocket'],
      upgrade: false,
    });
  }

  public listenAllocatedNodes(): Observable<string> {
    return fromEvent(this.socket, 'allocatednodes');
  }

  public listenJobsStatus(): Observable<string> {
    return fromEvent(this.socket, 'jobsstatus');
  }

  public listenJobsFinished(): Observable<string> {
    return fromEvent(this.socket, 'jobsfinished');
  }
}
