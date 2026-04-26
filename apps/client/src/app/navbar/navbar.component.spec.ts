import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { ViewModeService } from '../shared/view-mode.service';
import { PlanetsService } from '../planets/planets.service';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
    let fixture: ComponentFixture<NavbarComponent>;

    let gridButton: HTMLElement;
    let tableButton: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NavbarComponent],
            providers: [provideHttpClient(), PlanetsService, ViewModeService],
        }).compileComponents();

        fixture = TestBed.createComponent(NavbarComponent);
        fixture.autoDetectChanges();

        gridButton = fixture.debugElement.query(By.css('#grid-button')).nativeElement;

        tableButton = fixture.debugElement.query(By.css('#table-button')).nativeElement;
    });

    it('should activate grid view on grid button click', async () => {
        gridButton.click();
        await fixture.whenStable();

        expect(gridButton.classList).toContain('text-bg-secondary');
        expect(tableButton.classList).not.toContain('text-bg-secondary');
    });

    it('should activate table view on table button click', async () => {
        tableButton.click();
        await fixture.whenStable();

        expect(tableButton.classList).toContain('text-bg-secondary');
        expect(gridButton.classList).not.toContain('text-bg-secondary');
    });
});
