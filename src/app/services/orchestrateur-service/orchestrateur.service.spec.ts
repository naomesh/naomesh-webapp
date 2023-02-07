import { TestBed } from '@angular/core/testing';

import { OrchestrateurService } from './orchestrateur.service';

describe('OrchestrateurService', () => {
  let service: OrchestrateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrchestrateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
