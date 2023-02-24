import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {
  JobStatusPayload,
  Job,
  AllocatedNodesPayload,
} from '../../clients/webapi/models';
import { NodeService, DefaultService } from '../../clients/seduce';
import { copyFile } from 'fs';
import { SocketService } from '../../clients/webapi';

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  providers: [NodeService, DefaultService, SocketService],
  styleUrls: ['./server-view.component.scss'],
})
export class ServerViewComponent implements OnInit, OnDestroy {
  inc: number = 0;
  constructor(
    private nodeService: NodeService,
    private defaultService: DefaultService,
    private socketService: SocketService
  ) {}

  @Input()
  jobsStatus: JobStatusPayload | undefined = undefined;

  @Input()
  allocatedNodes: AllocatedNodesPayload | undefined = undefined;

  public totalNodesConsumption: number = 0;
  private handleIntervalRefresh: NodeJS.Timer | undefined = undefined;

  private ctx = document.getElementById('chart-server') as HTMLCanvasElement;
  public chart: ApexCharts | undefined = undefined;
  public selected: number = -1;
  public selected_job: Job | undefined = undefined;
  public consommation_totale: number = 0;
  private chartSerieData: any[] = [];

  public nombre_steps = '15';
  public steps_mapping = {
    '-1': '-1. Prepare node allocation',
    '0': '0. Intrinsics analysis',
    '1': '1. Compute features',
    '2': '2. Compute pairs',
    '3': '3. Compute matches',
    '4': '4. Filter matches',
    '5': '5. Incremental reconstruction',
    '11': '11. Export to openMVS',
    '12': '12. Densify point-cloud',
    '13': '13. Reconstruct the mesh',
    '14': '14. Refine the mesh',
    '15': '15. Texture the mesh',
    '99': '99. Push results to bucket',
  };

  public getStepFromIndex(index: number): string {
    // @ts-ignore
    return this.steps_mapping[index.toString()];
  }

  public loadJobGraphData() {
    this.consommation_totale = 0;
    if (!this.selected_job || this.selected_job.node_id == 'N/A') {
      this.chart = new ApexCharts(this.ctx, {
        chart: {
          toolbar: {
            show: false,
          },
          width: '100%',
          height: '400px',
          type: 'area',
        },
        dataLabels: {
          enabled: false,
        },
        colors: ['#fbbf24'],
        stroke: {
          curve: 'smooth',
        },
        series: [
          {
            data: [],
          },
        ],
        xaxis: {
          type: 'datetime',
          labels: {
            datetimeUTC: false,
          },
        },
      });

      this.chart.render();
      return;
    }

    this.nodeService
      .getConsumptionOfNodeHistorical(
        this.selected_job.node_id,
        500,
        `${this.selected_job.last_started_date}:${
          this.selected_job.state == 'running'
            ? new Date().getTime()
            : this.selected_job.last_paused_date
        }`
      )
      .subscribe((response) => {
        if (response.sum != null && response.data != undefined) {
          this.consommation_totale = response.sum;
          const dataRange = response.data[0];
          if (dataRange.data == undefined) return;

          dataRange.data.forEach((data) => {
            let timeFormat = new Date(data[0]);
            this.chartSerieData?.push({
              x: timeFormat,
              y: Math.floor(data[1]),
            });
            this.chartSerieData?.sort((p1, p2) =>
              p1.x > p2.x ? 1 : p1.x < p2.x ? -1 : 0
            );
          });

          this.chart = new ApexCharts(this.ctx, {
            chart: {
              toolbar: {
                show: false,
              },
              width: '100%',
              height: '400px',
              type: 'area',
            },
            dataLabels: {
              enabled: false,
            },
            colors: ['#fbbf24'],
            stroke: {
              curve: 'smooth',
            },
            series: [
              {
                data: this.chartSerieData,
              },
            ],
            xaxis: {
              type: 'datetime',
              labels: {
                datetimeUTC: false,
              },
            },
          });

          this.chart.render();
        }
      });
  }

  public clickList(index: number) {
    this.selected = index;
    this.selected_job = this.jobsStatus?.jobs[index];
    this.loadJobGraphData();
  }

  public timestampToHours(timestamp: number) {
    return (
      new Date(timestamp).getHours() + 'h' + new Date(timestamp).getMinutes()
    );
  }

  public durationSince(timestamp: number) {
    return this.timestampToHours(
      new Date().getTime() - new Date(timestamp).getTime() - 60 * 60 * 1000
    );
  }

  ngOnInit(): void {
    this.ctx = document.getElementById('chart-server') as HTMLCanvasElement;
    this.socketService.listenJobsStatus().subscribe((jobsStatus: string) => {
      this.jobsStatus = JSON.parse(jobsStatus);
      if (this.selected_job) {
        this.inc++;
        if (this.inc === 0 || this.inc % 10 == 0) {
          this.loadJobGraphData();
        }
      }
    });
    this.loadJobGraphData();

    this.defaultService
      .getLiveConsumptionOfAllNodes(this.allocatedNodes?.nodes)
      .subscribe((result) => {
        this.totalNodesConsumption = result.data || 0;
      });

    this.handleIntervalRefresh = setInterval(() => {
      this.defaultService.getLiveConsumptionOfAllNodes(
        this.allocatedNodes?.nodes
      );
    }, 10000);
  }

  ngOnDestroy() {
    clearTimeout(this.handleIntervalRefresh);
  }
}
