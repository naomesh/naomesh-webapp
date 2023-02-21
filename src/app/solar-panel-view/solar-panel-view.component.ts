import { Component, OnInit } from '@angular/core';
import * as ApexCharts from 'apexcharts'
import { DefaultService } from '../../clients/seduce'

@Component({
  selector: 'app-solar-panel-view',
  templateUrl: './solar-panel-view.component.html',
  providers: [DefaultService],
  styleUrls: ['./solar-panel-view.component.scss']
})
export class SolarPanelViewComponent implements OnInit {

  constructor(private defaultService: DefaultService) { }

  public production: number | undefined = 300;
  public temperature: number = 0;
  public city: string = "Nantes";
  public meteo: string = "☀️ Ensoleillé";
  public date: string = "+13°C";

  private chartSerieData: any[] = [];


  async updateMeteo() {
    try {
      const response = await fetch(`https://wttr.in/${this.city}?format={"meteo":"%c%C","temperature":"%t"}`);
      const data = await response.json();
      this.meteo = data.meteo;
      this.temperature = data.temperature;
    } catch (err: any) {
      console.error(err)
    }
  }

  initUpdateProduction() {
    this.defaultService.getLiveProductionSolarPanels().subscribe(
      response => {
        this.production = response.data;
      }
    )
  }

  updateSolarPanelProductionGraphData() {
    this.defaultService.getProductionSolarPanels(1).subscribe(
      response => {
        let solarPanelData = response.data;

        // Format data
        solarPanelData?.forEach(data => {
          let timeFormat = new Date(data[0])
          this.chartSerieData?.push({ x: timeFormat, y: Math.floor(data[1]) });
        });

        this.chartSerieData?.sort((p1, p2) => (p1.x > p2.x) ? 1 : (p1.x < p2.x) ? -1 : 0);

        const ctx = document.getElementById('chart-sun') as HTMLCanvasElement;

        let chart = new ApexCharts(ctx, {
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
            name: 'production (W)',
            data: this.chartSerieData
          }],
          xaxis: {
            type: 'datetime',
            labels: {
              datetimeUTC: false
            }
          },
        });

        chart.render();
      }
    )
  }


  async ngOnInit() {

    await this.updateMeteo();

    this.initUpdateProduction();

    this.updateSolarPanelProductionGraphData();

    const locale = new Date().toLocaleDateString('fr-fr', { weekday: "short", year: "numeric", month: "short", day: "numeric" });
    this.date = locale.charAt(0).toUpperCase() + locale.slice(1);

  }

}
