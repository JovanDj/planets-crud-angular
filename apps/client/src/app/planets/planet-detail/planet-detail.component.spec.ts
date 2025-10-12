import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';

import { PlanetDetailComponent } from './planet-detail.component';
import { PlanetsService } from '../planets.service';
import { ConfirmationService } from '../../shared/confirmation.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Planet } from '../planet.schema';
import { of } from 'rxjs';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';

const routeParams$ = of(convertToParamMap({ id: '1' }));

describe('PlanetDetailComponent (strict behavioral)', () => {
  let fixture: ComponentFixture<PlanetDetailComponent>;
  let http: HttpTestingController;

  const mockPlanet: Planet = {
    id: 1,
    planetName: 'Earth',
    planetColor: 'Blue',
    planetRadiusKM: 6371,
    distInMillionsKM: { fromSun: 150, fromEarth: 0 },
    description: 'The third planet from the sun.',
    imageName: 'earth.jpg',
    imageUrl: 'https://example.com/earth.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetDetailComponent, ConfirmationDialogComponent],
      providers: [
        provideRouter([
          { path: 'planets/:id', component: PlanetDetailComponent },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        PlanetsService,
        ConfirmationService,
        NgbModal,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: routeParams$ },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanetDetailComponent);
    http = TestBed.inject(HttpTestingController);
    fixture.autoDetectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('shows loading state before planet data is loaded', () => {
    const text = fixture.nativeElement.textContent.trim();
    expect(text).toContain('Loading');

    const req = http.expectOne('/api/planets/1');
    req.flush(mockPlanet);
  });

  it('renders complete planet details after fetch', () => {
    const req = http.expectOne('/api/planets/1');
    expect(req.request.method).toBe('GET');

    req.flush(mockPlanet);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    const image = fixture.debugElement.query(By.css('img')).nativeElement;
    const description = fixture.debugElement.query(
      By.css('.card-title + p')
    ).nativeElement;
    const stats = fixture.debugElement.queryAll(By.css('.card .fs-4.fw-bold'));

    expect(header.textContent.trim()).toBe('Earth');
    expect(image.src).toContain(mockPlanet.imageUrl);
    expect(description.textContent).toContain('third planet');
    expect(stats[0].nativeElement.textContent).toContain('6,371');
    expect(stats[1].nativeElement.textContent).toContain('150');
    expect(stats[2].nativeElement.textContent).toContain('Blue');
    expect(stats[3].nativeElement.textContent).toContain('0');
  });

  it('maintains UI stability after clicking Edit', async () => {
    const req = http.expectOne('/api/planets/1');
    req.flush(mockPlanet);

    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('button.btn-outline-secondary')
    );
    editButton.triggerEventHandler('click');

    const header = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(header.textContent.trim()).toBe('Earth');
  });

  it('performs deletion flow then navigates away', async () => {
    const req = http.expectOne('/api/planets/1');

    req.flush(mockPlanet);
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(
      By.css('button.btn-primary')
    );

    deleteButton.triggerEventHandler('click');

    const modalConfirmButton = fixture.debugElement.query(
      By.css('.modal-footer #confirm-button')
    );

    modalConfirmButton.triggerEventHandler('click');

    await fixture.whenStable();

    const deleteReq = http.expectOne('/api/planets/1');
    expect(deleteReq.request.method).toBe('DELETE');

    deleteReq.flush({});
    fixture.detectChanges();
  });

  it('preserves visual structure after sequential Edit and Delete', async () => {
    const req = http.expectOne('/api/planets/1');
    req.flush(mockPlanet);
    fixture.detectChanges();

    const editButton = fixture.debugElement.query(
      By.css('button.btn-outline-secondary')
    );
    const deleteButton = fixture.debugElement.query(
      By.css('button.btn-primary')
    );

    editButton.triggerEventHandler('click');
    deleteButton.triggerEventHandler('click');

    const textSnapshot = fixture.nativeElement.textContent;

    expect(textSnapshot).toContain('Earth');
    expect(textSnapshot).toContain('Radius');
  });
});
