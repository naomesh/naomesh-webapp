import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts'

@Component({
  selector: 'app-solar-panel-view',
  templateUrl: './solar-panel-view.component.html',
  styleUrls: ['./solar-panel-view.component.scss']
})
export class SolarPanelViewComponent implements OnInit {

  constructor() { }

  public production: number = 300;
  public temperature: number = 30;
  public meteo: string = "Ensoleillé";
  public date: string = new Date().toString();

  ngOnInit(): void {
    const ctx = document.getElementById('chart-sun') as HTMLCanvasElement;

    var chart = new ApexCharts(ctx, {
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        height: "200px",
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
