import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { Planet } from './planets/planet.schema';
import { PlanetsService } from './planets/planets.service';

const earth: Planet = {
  id: 1,
  planetName: 'Earth',
  planetColor: 'Blue',
  planetRadiusKM: 6371,
  distInMillionsKM: { fromSun: 150, fromEarth: 0 },
  description: 'The third planet from the sun.',
  imageName: 'earth.jpg',
  imageUrl: 'https://example.com/earth.jpg',
};

const mars: Planet = {
  id: 2,
  planetName: 'Mars',
  planetColor: 'Red',
  planetRadiusKM: 3389,
  distInMillionsKM: { fromSun: 228, fromEarth: 78 },
  description: 'The red planet.',
  imageName: 'mars.jpg',
  imageUrl: 'https://example.com/mars.jpg',
};

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), PlanetsService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;

    await fixture.whenStable();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});

describe('App routes', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideHttpClientTesting(),
        PlanetsService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
  });

  it('should render the planets page for the default route', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/');

    const req = http.expectOne('/api/planets');
    expect(req.request.method).toBe('GET');
    req.flush([earth, mars]);

    await harness.fixture.whenStable();

    expect(router.url).toBe('/');
    expect(harness.routeNativeElement?.textContent).toContain('Earth');
    expect(harness.routeNativeElement?.textContent).toContain('Mars');
  });

  it('should render a planet detail page for a planet route', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/planets/1');

    const req = http.expectOne('/api/planets/1');
    expect(req.request.method).toBe('GET');
    req.flush(earth);

    await harness.fixture.whenStable();

    const content = harness.routeNativeElement?.textContent;

    expect(router.url).toBe('/planets/1');
    expect(content).toContain('Earth');
    expect(content).toContain('third planet');
    expect(content).toContain('Radius');
  });
});
