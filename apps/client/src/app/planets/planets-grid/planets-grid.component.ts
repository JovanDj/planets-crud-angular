import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Planet } from '../planet.schema';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-planets-grid',
  imports: [DecimalPipe],
  templateUrl: './planets-grid.component.html',
  styleUrl: './planets-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetsGridComponent {
  @Input({ required: true })
  planets: Planet[] = [];
}
