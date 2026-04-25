import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanetsListComponent } from './planets-list.component';
import { By } from '@angular/platform-browser';
import { Planet } from '../planet.schema';
import { provideRouter } from '@angular/router';

describe('PlanetsListComponent', () => {
    let component: PlanetsListComponent;
    let fixture: ComponentFixture<PlanetsListComponent>;

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
            imports: [PlanetsListComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanetsListComponent);
        component = fixture.componentInstance;
        component.planets = planets;
        component.sortDirection = 'desc';

        fixture.autoDetectChanges();
    });

    it('should render all planets with correct names', () => {
        const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
        expect(rows.length).toBe(2);

        const firstRowText = rows[0].nativeElement.textContent;
        const secondRowText = rows[1].nativeElement.textContent;

        expect(firstRowText).toContain('Earth');
        expect(firstRowText).toContain('Blue');
        expect(firstRowText).toContain('6371');
        expect(firstRowText).toContain('150');
        expect(firstRowText).toContain('0');

        expect(secondRowText).toContain('Mars');
        expect(secondRowText).toContain('Red');
        expect(secondRowText).toContain('3389');
        expect(secondRowText).toContain('228');
        expect(secondRowText).toContain('78');
    });

    it('should display correct image URLs', () => {
        const images = fixture.debugElement.queryAll(By.css('img'));
        expect(images.length).toBe(2);
        expect(images[0].nativeElement.src).toContain('earth.jpg');
        expect(images[1].nativeElement.src).toContain('mars.jpg');
    });

    it('should render the correct sort icon based on input', () => {
        const arrowUp = fixture.debugElement.query(By.css('[data-testid="arrow-up"]'));
        const arrowDown = fixture.debugElement.query(By.css('[data-testid="arrow-down"]'));

        expect(arrowUp).toBeFalsy();
        expect(arrowDown).toBeTruthy();

        const header: HTMLElement = fixture.debugElement.query(By.css("[data-testid='toggle-radius'")).nativeElement;

        component.sortDirection = 'asc';
        header.click();

        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('[data-testid="arrow-down"]'))).toBeFalsy();

        expect(fixture.debugElement.query(By.css('[data-testid="arrow-up"]'))).toBeTruthy();
    });
});
