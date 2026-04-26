import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { Planet } from '../planet.schema';
import { SortDirection } from '../planets.service';

@Component({
  selector: 'app-planets-list',
  templateUrl: './planets-list.component.html',
  styleUrl: './planets-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class PlanetsListComponent {
  @Input({ required: true })
  planets: Planet[] = [];

  @Input({ required: true })
  sortDirection: SortDirection = 'desc';

  @Output()
  toggleSortRadius = new EventEmitter<void>();

  protected onToggleRadiusClick() {
    this.toggleSortRadius.emit();
  }
}
