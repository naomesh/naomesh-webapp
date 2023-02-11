import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts'

type Task = {
  name: string
}

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnInit {

  constructor() { }

  public tasks: Task[] = [
    { name: "reconstruction1" },
    { name: "reconstruction2" },
    { name: "reconstruction3" }
  ]

  public selected = 0;

  public clickList(index: number) {
    this.selected = index
  }

  ngOnInit(): void {
    const ctx = document.getElementById('chart-consumption') as HTMLCanvasElement;

    var chart = new ApexCharts(ctx, {
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        height: "130px",
        type: 'area',
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#fbbf24"],
      stroke: {
        curve: 'smooth',
      },
      series: [{
        name: 'sales',
        data: [30,40,35,50,49,60,70,91,125]
      }],
      xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
      }
    });

    chart.render();
  }

}
