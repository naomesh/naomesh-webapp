import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts';

type Task = {
  name: string;
};

@Component({
  selector: 'app-server-view',
  templateUrl: './server-view.component.html',
  styleUrls: ['./server-view.component.scss'],
})
export class ServerViewComponent implements OnInit {
  constructor() {}

  public tasks: Task[] = [
    { name: 'reconstruction1' },
    { name: 'reconstruction2' },
    { name: 'reconstruction3' },
  ];

  public selected: number = 0;
  public consommation_totale: number = 0;

  public clickList(index: number) {
    this.selected = index;
  }

  getTasks() {
    // call service
    // assign task object
  }

  getConsumptionGraphForTask() {}

  ngOnInit(): void {
    const ctx = document.getElementById('chart-server') as HTMLCanvasElement;

    var chart = new ApexCharts(ctx, {
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
          name: 'sales',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
      ],
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      },
    });

    chart.render();
  }
}
