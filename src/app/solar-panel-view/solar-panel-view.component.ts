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
  public temperature: number = 0;
  public city: string = "Nantes";
  public meteo: string = "";
  public date: string = "";

  async updateMeteo() {
    const response = await fetch( `https://wttr.in/${this.city}?format={"meteo":"%c%C","temperature":"%t"}`);
    const data = await response.json();
    this.meteo = data.meteo;
    this.temperature = data.temperature;
  }

  async ngOnInit() {

    await this.updateMeteo();

    const locale = new Date().toLocaleDateString('fr-fr', { weekday:"short", year:"numeric", month:"short", day:"numeric"});
    this.date = locale.charAt(0).toUpperCase() + locale.slice(1);

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
