import { TestBed } from '@angular/core/testing';

import { HttpHeadersService } from './http-headers.service';

describe('HttpHeaderService', () => {
  let service: HttpHeadersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpHeadersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
