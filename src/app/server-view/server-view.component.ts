import { Component, Input, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { JobStatusPayload, Job } from '../../clients/webapi/models';

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  styleUrls: ['./server-view.component.scss'],
})
export class ServerViewComponent implements OnInit {
  constructor() {}

  @Input()
  jobStatus: JobStatusPayload | undefined = undefined;

  public chart: ApexCharts | undefined = undefined;
  public selected: number = -1;
  public selected_job: Job | undefined = undefined;
  public consommation_totale: number = 0;

  public clickList(index: number) {
    this.selected = index;
    this.selected_job = this.jobStatus?.jobs[index];
  }

  getConsumptionGraphForTask() {}

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
