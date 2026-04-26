import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AsyncPipe } from '@angular/common';
import { combineLatestWith, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ViewModeService } from '../shared/view-mode.service';
import { PlanetsGridComponent } from './planets-grid/planets-grid.component';
import { PlanetsListComponent } from './planets-list/planets-list.component';
import { PlanetsService } from './planets.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-planets',
  imports: [
    PlanetsListComponent,
    PlanetsGridComponent,
    AsyncPipe,
    NavbarComponent,
  ],
  templateUrl: './planets.component.html',
  styleUrl: './planets.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsComponent {
  readonly #planetsService = inject(PlanetsService);
  readonly #viewModeService = inject(ViewModeService);

  constructor() {
    this.#planetsService.fetchPlanets().pipe(takeUntilDestroyed()).subscribe();
  }

  protected readonly vm$ = this.#planetsService.planets().pipe(
    combineLatestWith(
      this.#viewModeService.viewMode(),
      this.#planetsService.sortDirection()
    ),
    map(([planets, viewMode, sortDirection]) => ({
      planets,
      viewMode,
      sortDirection,
    }))
  );

  protected onToggleSortRadius() {
    this.#planetsService.toggleRadiusDirection();
  }
}
