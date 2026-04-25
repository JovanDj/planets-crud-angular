import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetFormComponent } from './planet-form.component';
import { PlanetsService } from '../planets.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('PlanetFormComponent', () => {
    let component: PlanetFormComponent;
    let fixture: ComponentFixture<PlanetFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlanetFormComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                PlanetsService,
                NgbActiveModal,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanetFormComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
