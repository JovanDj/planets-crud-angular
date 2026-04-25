import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetsGridComponent } from './planets-grid.component';
import { By } from '@angular/platform-browser';
import { Planet } from '../planet.schema';

describe('PlanetsGridComponent', () => {
    let component: PlanetsGridComponent;
    let fixture: ComponentFixture<PlanetsGridComponent>;

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
            imports: [PlanetsGridComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanetsGridComponent);
        component = fixture.componentInstance;
        component.planets = planets;

        fixture.autoDetectChanges();
    });

    it('should render planets in grid view', () => {
        const gridCards = fixture.debugElement.queryAll(By.css("[data-testid='grid-planet']"));
        expect(gridCards.length).toBe(2);
        expect(gridCards[0].nativeElement.textContent).toContain('Earth');
        expect(gridCards[1].nativeElement.textContent).toContain('Mars');
    });
});
