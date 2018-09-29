import { TestBed, inject } from '@angular/core/testing';

import { MapApiService } from './map-api.service';

describe('MapApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MapApiService]
    });
  });

  it('should be created', inject([MapApiService], (service: MapApiService) => {
    expect(service).toBeTruthy();
  }));
});
