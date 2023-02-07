import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Constants from 'src/app/config/constants';

@Injectable({
  providedIn: 'root'
})
export class WeatherEnergyService {

  constructor(private http: HttpClient) { }

  getSolarPanelProduction() {
    return this.http.get(Constants.WEB_API_ENDPOINT + 'test');
  }

  getTemperature() {

  }

  getWeatherType() {

  }

  getServersConsumption() {

  }
}
