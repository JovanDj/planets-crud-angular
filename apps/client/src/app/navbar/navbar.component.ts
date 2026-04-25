import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ViewModeService } from '../shared/view-mode.service';
import { PlanetsService } from '../planets/planets.service';
import { PlanetFormComponent } from '../planets/planet-form/planet-form.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  readonly #viewModeService = inject(ViewModeService);
  readonly #planetsService = inject(PlanetsService);
  readonly #fb = inject(NonNullableFormBuilder);
  readonly #modalService = inject(NgbModal);

  protected readonly term = this.#fb.control('');

  constructor() {
    this.term.valueChanges
      .pipe(
        takeUntilDestroyed(),
        distinctUntilChanged(),
        debounceTime(300),
        tap((term) => {
          this.#planetsService.setSearchTerm(term);
        })
      )
      .subscribe();
  }

  protected viewMode() {
    return this.#viewModeService.viewMode();
  }

  protected setTableView() {
    this.#viewModeService.setViewMode('table');
  }

  protected setGridView() {
    this.#viewModeService.setViewMode('grid');
  }

  protected onNewPlanetClick() {
    this.#modalService.open(PlanetFormComponent, {
      size: 'md',
      centered: true,
    });
  }
}
