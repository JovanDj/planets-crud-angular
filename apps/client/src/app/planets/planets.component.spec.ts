import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { PlanetsComponent } from './planets.component';
import { PlanetsListComponent } from './planets-list/planets-list.component';
import { PlanetsService } from './planets.service';
import { ViewModeService } from '../shared/view-mode.service';

import { Planet } from './planet.schema';
import { provideRouter } from '@angular/router';
import { DebugElement } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

describe('PlanetsComponent', () => {
    let fixture: ComponentFixture<PlanetsComponent>;
    let http: HttpTestingController;

    let tableButton: DebugElement;
    let gridButton: DebugElement;

    const planets: Planet[] = [
        {
            id: 1,
            planetName: 'Earth',
            planetColor: 'Blue',
            planetRadiusKM: 6371,
            distInMillionsKM: { fromSun: 150, fromEarth: 0 },
            description: 'The third planet from the sun.',
            imageName: 'earth.jpg',
            imageUrl: 'https://example.com/earth.jpg',
        },
        {
            id: 2,
            planetName: 'Mars',
            planetColor: 'Red',
            planetRadiusKM: 3389,
            distInMillionsKM: { fromSun: 228, fromEarth: 78 },
            description: 'The red planet.',
            imageName: 'mars.jpg',
            imageUrl: 'https://example.com/mars.jpg',
        },
    ];

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlanetsComponent, PlanetsListComponent, NavbarComponent],
            providers: [
                provideRouter([]),
                provideHttpClient(),
                provideHttpClientTesting(),
                PlanetsService,
                ViewModeService,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanetsComponent);
        http = TestBed.inject(HttpTestingController);

        fixture.autoDetectChanges();

        tableButton = fixture.debugElement.query(By.css('#table-button'));
        gridButton = fixture.debugElement.query(By.css('#grid-button'));
    });

    afterEach(() => {
        http.verify();
    });

    it('should render planets table when view mode is set to "table"', async () => {
        tableButton.nativeElement.click();
        await fixture.whenStable();

        const req = http.expectOne('/api/planets');
        expect(req.request.method).toBe('GET');
        req.flush([]);

        await fixture.whenStable();

        const table = fixture.debugElement.query(By.css('#planets-table'));
        expect(table).toBeTruthy();
    });

    it('should render planets grid when view mode is set to "grid"', async () => {
        gridButton.nativeElement.click();
        await fixture.whenStable();

        const req = http.expectOne('/api/planets');
        expect(req.request.method).toBe('GET');
        req.flush([]);

        await fixture.whenStable();

        const grid = fixture.debugElement.query(By.css('#planets-grid'));
        expect(grid).toBeTruthy();
    });

    it('should toggle sort direction and update the arrow icon on click', async () => {
        tableButton.nativeElement.click();
        await fixture.whenStable();

        const req = http.expectOne('/api/planets');
        req.flush(planets);
        await fixture.whenStable();

        const getPlanetNames = () => {
            return fixture.debugElement
                .queryAll(By.css("[data-testid='planet-name']"))
                .map((debug) => debug.nativeElement.textContent.trim());
        };

        const getArrow = () => {
            return fixture.debugElement.query(By.css("[data-testid='arrow-down']"))
                .nativeElement;
        };

        expect(getPlanetNames()[0]).toBe('Earth');
        expect(getArrow().classList).toContain('bi-caret-down-fill');

        const header = fixture.debugElement.query(By.css("[data-testid='toggle-radius']"));
        header.nativeElement.click();
        await fixture.whenStable();

        const arrowUp = fixture.debugElement.query(By.css("[data-testid='arrow-up']"));
        expect(arrowUp).toBeTruthy();
        expect(arrowUp.nativeElement.classList).toContain('bi-caret-up-fill');
        expect(getPlanetNames()[0]).toBe('Mars');

        header.nativeElement.click();
        await fixture.whenStable();

        const arrowDown = fixture.debugElement.query(By.css("[data-testid='arrow-down']"));
        expect(arrowDown).toBeTruthy();
        expect(arrowDown.nativeElement.classList).toContain('bi-caret-down-fill');
        expect(getPlanetNames()[0]).toBe('Earth');
    });
});
