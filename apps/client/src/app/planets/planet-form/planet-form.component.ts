import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PlanetsService } from '../planets.service';
import { ConfirmationService } from '../../shared/confirmation.service';
import { Planet } from '../planet.schema';

@Component({
  selector: 'app-planet-form',
  imports: [ReactiveFormsModule],
  templateUrl: './planet-form.component.html',
  styleUrl: './planet-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanetFormComponent implements OnInit {
  @Input()
  mode: 'CREATE' | 'EDIT' = 'CREATE';
  @Input()
  planet: Planet | undefined = undefined;

  readonly #fb = inject(NonNullableFormBuilder);
  readonly #planetsService = inject(PlanetsService);
  readonly #active = inject(NgbActiveModal);
  readonly #confirmation = inject(ConfirmationService);

  protected preview: string | undefined = undefined;
  protected selectedFile: File | undefined = undefined;

  protected readonly form = this.#fb.group({
    name: ['', [Validators.required]],
    description: [''],
    color: [''],
    radiusKM: [0, [Validators.min(0)]],
    distSun: [0, [Validators.min(0)]],
    distEarth: [0, Validators.min(0)],
  });

  ngOnInit() {
    if (!this.planet) {
      return;
    }

    this.form.patchValue({
      name: this.planet.planetName ?? '',
      description: this.planet.description ?? '',
      color: this.planet.planetColor ?? '',
      radiusKM: this.planet.planetRadiusKM ?? 0,
      distSun: this.planet.distInMillionsKM?.fromSun ?? 0,
      distEarth: this.planet.distInMillionsKM?.fromEarth ?? 0,
    });
    this.preview = this.planet.imageUrl ?? undefined;
  }

  protected async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const confirmed = await this.#confirmation.confirm(
      this.mode,
      this.form.value.name ?? 'planet'
    );

    if (!confirmed) {
      return;
    }

    const formData = new FormData();

    formData.append('planetName', this.form.value.name ?? '');
    formData.append('planetColor', this.form.value.color ?? '');
    formData.append('description', this.form.value.description ?? '');

    formData.append(
      'planetRadiusKM',
      this.form.value.radiusKM?.toString() ?? ''
    );

    formData.append(
      'distInMillionsKM[fromSun]',
      this.form.value.distSun?.toString() ?? ''
    );
    formData.append(
      'distInMillionsKM[fromEarth]',
      this.form.value.distEarth?.toString() ?? ''
    );

    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    if (this.mode === 'EDIT' && this.planet && !this.selectedFile) {
      if (this.planet.imageUrl) {
        formData.append('imageUrl', this.planet.imageUrl);
      }
      if (this.planet.imageName) {
        formData.append('imageName', this.planet.imageName);
      }
    }

    if (this.planet?.id && this.mode === 'EDIT') {
      this.#planetsService
        .updatePlanet(this.planet.id, formData)
        .subscribe(() => this.#active.close());
    }

    if (this.mode === 'CREATE') {
      this.#planetsService
        .addPlanet(formData)
        .subscribe(() => this.#active.close());
    }
  }

  protected onFileChange(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const input = event.target;

      if (!input.files || input.files.length === 0) {
        return;
      }

      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.preview = reader.result?.toString());
      reader.readAsDataURL(this.selectedFile);
    }
  }

  protected onCancelClick() {
    this.form.reset();
    this.#active.dismiss();
  }
}
