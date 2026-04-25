import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { AsyncPipe, DecimalPipe } from '@angular/common';
import { PlanetsService } from '../planets.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationService } from '../../shared/confirmation.service';
import { PlanetFormComponent } from '../planet-form/planet-form.component';
import { Planet } from '../planet.schema';

@Component({
  selector: 'app-planet-detail',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe],
  templateUrl: './planet-detail.component.html',
  styleUrl: './planet-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetDetailComponent {
  readonly #planetsService = inject(PlanetsService);
  readonly #route = inject(ActivatedRoute);
  readonly #modal = inject(NgbModal);
  readonly #confirm = inject(ConfirmationService);
  readonly #router = inject(Router);

  protected readonly planet$ = this.#route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    switchMap((id) => this.#planetsService.fetchPlanet(id))
  );

  protected onEditClick(planet: Planet) {
    const ref = this.#modal.open(PlanetFormComponent, {
      size: 'md',
      centered: true,
    });
    ref.componentInstance.mode = 'EDIT';
    ref.componentInstance.planet = planet;

    ref.result.then(() => {
      location.reload();
    });
  }

  protected async onDeleteClick(planet: Planet) {
    const ok = await this.#confirm.confirm('DELETE', planet.planetName);
    if (!ok) {
      return;
    }

    this.#planetsService
      .deletePlanet(planet.id)
      .subscribe(() => this.#router.navigate(['/']));
  }
}
