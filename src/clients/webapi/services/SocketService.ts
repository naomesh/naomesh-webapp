/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { Manager, Socket } from 'socket.io-client';
import { environment } from '../../../environments/environment';

import {
  AllocatedNodesPayload,
  JobStatusPayload,
  JobFinishedPayload,
} from '../models';

@Injectable()
export class SocketService {
  manager: Manager;
  socket: Socket;

  constructor() {
    this.manager = new Manager(environment.WEBAPP_API_URL);
    this.socket = this.manager.socket('/');
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
