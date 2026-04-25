import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  map,
  tap,
  throwError,
} from 'rxjs';

import { z, ZodError } from 'zod';

import { Planet, planetSchema } from './planet.schema';

export type SortDirection = 'asc' | 'desc';

type PlanetsState = {
  readonly planets: readonly Planet[];
  readonly searchTerm: string;
  readonly sortDirection: SortDirection;
};

@Injectable({ providedIn: 'root' })
export class PlanetsService {
  readonly #http = inject(HttpClient);

  readonly #store = new BehaviorSubject<PlanetsState>({
    planets: [],
    searchTerm: '',
    sortDirection: 'desc',
  });
  readonly #state$ = this.#store.asObservable();

  readonly #sortDirection$ = this.#state$.pipe(
    map(({ sortDirection }) => sortDirection),
    distinctUntilChanged(),
  );

  readonly #filteredPlanets$ = this.#state$.pipe(
    map(({ planets, searchTerm, sortDirection }) => {
      const trimmed = searchTerm.trim().toLowerCase();

      const filtered = trimmed
        ? planets.filter((planet) => {
            return planet.planetName.toLowerCase().includes(trimmed);
          })
        : planets;

      return [...filtered].sort((a, b) => {
        if (sortDirection === 'asc') {
          return a.planetRadiusKM - b.planetRadiusKM;
        }

        if (sortDirection === 'desc') {
          return b.planetRadiusKM - a.planetRadiusKM;
        }

        return a.id - b.id;
      });
    }),
  );

  planets() {
    return this.#filteredPlanets$;
  }

  sortDirection() {
    return this.#sortDirection$;
  }

  fetchPlanets() {
    return this.#http.get<unknown>('/api/planets').pipe(
      map((planets) => {
        return z.array(planetSchema).parse(planets);
      }),
      tap((planets) => {
        this.#patchState({ planets });
      }),
      catchError((err) => {
        if (err instanceof ZodError) {
          return throwError(() => new Error('Invalid planet data received.'));
        }

        return throwError(() => err);
      }),
    );
  }

  setSearchTerm(term: string) {
    this.#patchState({ searchTerm: term });
  }

  toggleRadiusDirection() {
    this.#updateState((state) => {
      return {
        ...state,
        sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
      };
    });
  }

  addPlanet(formData: FormData) {
    return this.#http.post<unknown>('/api/planets', formData).pipe(
      map((res) => {
        return planetSchema.parse(res);
      }),
      tap((planet) => {
        this.#updateState((state) => {
          return {
            ...state,
            planets: [...state.planets, planet],
          };
        });
      }),
      catchError((err) => {
        if (err instanceof ZodError) {
          return throwError(() => new Error('Invalid planet data received.'));
        }

        return throwError(() => err);
      }),
    );
  }

  fetchPlanet(id: Planet['id']) {
    return this.#http.get<unknown>(`/api/planets/${id}`).pipe(
      map((res) => {
        return planetSchema.parse(res);
      }),
      catchError((err) => {
        if (err instanceof ZodError) {
          return throwError(() => new Error('Invalid planet data received.'));
        }

        return throwError(() => err);
      }),
    );
  }

  updatePlanet(id: number, formData: FormData) {
    return this.#http.put<unknown>(`/api/planets/${id}`, formData).pipe(
      map((res) => {
        return planetSchema.parse(res);
      }),
      tap((updated) => {
        this.#updateState((state) => {
          return {
            ...state,
            planets: state.planets.map((planet) => {
              return planet.id === id ? updated : planet;
            }),
          };
        });
      }),
      catchError((err) => {
        if (err instanceof ZodError) {
          return throwError(() => new Error('Invalid planet data received.'));
        }

        return throwError(() => err);
      }),
    );
  }

  deletePlanet(id: number) {
    return this.#http.delete<void>(`/api/planets/${id}`).pipe(
      tap(() => {
        this.#updateState((state) => {
          return {
            ...state,
            planets: state.planets.filter((p) => p.id !== id),
          };
        });
      }),
    );
  }

  #patchState(patch: Partial<PlanetsState>) {
    this.#updateState((state) => {
      return {
        ...state,
        ...patch,
      };
    });
  }

  #updateState(updater: (state: PlanetsState) => PlanetsState) {
    this.#store.next(updater(this.#store.getValue()));
  }
}
