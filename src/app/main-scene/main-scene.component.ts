import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../../clients/webapi';

import {
  AllocatedNodesPayload,
  JobStatusPayload,
  JobFinishedPayload,
} from '../../clients/webapi/models';

enum Route {
  HOME = 'home',
  SERVER = 'server',
  LAUNCH = 'launch',
  PANELS = 'panels',
  RESULT = 'result',
}

@Component({
  selector: 'app-main-scene',
  providers: [SocketService],
  templateUrl: './main-scene.component.html',
  styleUrls: ['./main-scene.component.scss'],
})
export class MainSceneComponent implements OnInit, OnDestroy, AfterViewInit {
  public page: Route = Route.HOME;
  private sub: any;

  public allocatedNodes: AllocatedNodesPayload = { nodes: [] };
  public jobsStatus: JobStatusPayload = {
    number_of_running_jobs: 0,
    jobs: [],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.page = params['page'];
    });

    this.socketService
      .listenAllocatedNodes()
      .subscribe((allocatedNodes: string) => {
        this.allocatedNodes = JSON.parse(allocatedNodes);
        // console.log(this.allocatedNodes);
      });

    this.socketService.listenJobsStatus().subscribe((jobsStatus: string) => {
      this.jobsStatus = JSON.parse(jobsStatus);
      // console.log(this.jobsStatus);
      // console.log(this.jobsStatus);
    });

    this.socketService.listenJobsFinished().subscribe((jobFinished: string) => {
      // console.log(jobFinished);
      // TODO: display a popup with "Job finished"
    });
  }

  pageIsHome(): boolean {
    return this.page == Route.HOME;
  }

  pageIsServer(): boolean {
    return this.page == Route.SERVER;
  }

  pageIsLaunch(): boolean {
    return this.page == Route.LAUNCH;
  }

  pageIsPanels(): boolean {
    return this.page == Route.PANELS;
  }

  pageIsResult(): boolean {
    return this.page == Route.RESULT;
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  clickLauncher(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/launch']);
    }
  }

  clickPanels(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/panels']);
    }
  }

  clickServer(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/server']);
    }
  }

  clickResult(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/result']);
    }
  }
}
