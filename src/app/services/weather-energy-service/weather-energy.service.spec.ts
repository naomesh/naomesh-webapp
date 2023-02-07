import { TestBed } from '@angular/core/testing';

import { WeatherEnergyService } from './weather-energy.service';

describe('WeatherEnergyService', () => {
  let service: WeatherEnergyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherEnergyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
