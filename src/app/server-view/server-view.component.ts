import { Component, Input, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { JobStatusPayload, Job } from '../../clients/webapi/models';
import { NodeService} from "../../clients/seduce";

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  providers: [NodeService],
  styleUrls: ['./server-view.component.scss'],
})
export class ServerViewComponent implements OnInit {
  constructor(private nodeService: NodeService) {}

  @Input()
  jobStatus: JobStatusPayload | undefined = undefined;
  ctx = document.getElementById('chart-server') as HTMLCanvasElement;
  public chart: ApexCharts | undefined = undefined;
  public selected: number = -1;
  public selected_job: Job | undefined = undefined;
  public consommation_totale: number = 0;
  private chartSerieData: any[] = [];
  public clickList(index: number) {
    this.selected = index;
    this.selected_job = this.jobStatus?.jobs[index];
    if(this.selected_job?.last_paused_date == null) return;
    this.nodeService.getConsumptionOfNodeHistorical(this.selected_job?.node_id,500,`${this.selected_job?.last_started_date}:${this.selected_job?.last_paused_date}`)
      .subscribe((response) => {
        if (response.sum != null && response.data != undefined) {
          this.consommation_totale = response.sum;
          const dataRange = response.data[0]
          if(dataRange.data == undefined) return;
          dataRange.data.forEach((data) => {
            let timeFormat = new Date(data[0]);
            this.chartSerieData?.push({ x: timeFormat, y: Math.floor(data[1]) });
            this.chartSerieData?.sort((p1, p2) =>
              p1.x > p2.x ? 1 : p1.x < p2.x ? -1 : 0
            );
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
            });
          });

        }
      })
  }

  public timestampToHours(timestamp: number) {
    return (
      new Date(timestamp).getHours() + 'h' + new Date(timestamp).getMinutes()
    );
  }

  public durationSince(timestamp: number) {
    return this.timestampToHours(timestamp - new Date().getTime());
  }

  ngOnInit(): void {
    const ctx = document.getElementById('chart-server') as HTMLCanvasElement;

    this.chart = new ApexCharts(ctx, {
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
    });

    this.chart.render();
  }
}
