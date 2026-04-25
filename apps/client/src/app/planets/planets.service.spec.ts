import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, } from '@angular/common/http/testing';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { PlanetsService } from './planets.service';
import { Planet } from './planet.schema';

describe('PlanetsService', () => {
    let service: PlanetsService;
    let http: HttpTestingController;

    const planets: Planet[] = [
        {
            id: 1,
            planetName: 'Earth',
            planetColor: 'Blue',
            planetRadiusKM: 6371,
            distInMillionsKM: {
                fromSun: 149.6,
                fromEarth: 0,
            },
            description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
            imageUrl: 'https://example.com/earth.jpg',
            imageName: 'earth.jpg',
        },
    ];

    beforeEach(async () => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });

        service = TestBed.inject(PlanetsService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        http.verify();
    });

    it('should return a list of planets when requested', async () => {
        service.fetchPlanets().subscribe();

        const req = http.expectOne('/api/planets');
        expect(req.request.method).toBe('GET');
        req.flush(planets);

        const result = await firstValueFrom(service.planets());

        expect(result.length).toBe(1);
        expect(result[0].planetName).toBe('Earth');
    });

    it('should return a list of planets when searched', async () => {
        service.setSearchTerm('e');

        service.fetchPlanets().subscribe();

        const req = http.expectOne('/api/planets');
        expect(req.request.method).toBe('GET');
        req.flush(planets);

        const result = await firstValueFrom(service.planets());

        expect(result.length).toBe(1);
        expect(result[0].planetName).toBe('Earth');
    });

    it('should return an error if planets response is invalid', async () => {
        const invalidResponse = [{ foo: 'bar' }];

        const resultPromise = firstValueFrom(service.fetchPlanets().pipe(catchError((err) => {
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toBe('Invalid planet data received.');
            return throwError(() => err);
        })));

        const req = http.expectOne('/api/planets');
        expect(req.request.method).toBe('GET');
        req.flush(invalidResponse);

        return expect(resultPromise).rejects.toThrow();
    });
});
