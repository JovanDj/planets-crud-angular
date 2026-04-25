import { beforeEach, describe, expect, it } from "vitest";
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ViewModeService } from './view-mode.service';

describe('ViewModeService', () => {
    let service: ViewModeService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ViewModeService],
        });
        service = TestBed.inject(ViewModeService);
    });

    it('should set table view', async () => {
        service.setViewMode('table');

        return expect(firstValueFrom(service.viewMode())).resolves.toEqual('table');
    });

    it('should set grid view', () => {
        service.setViewMode('grid');

        return expect(firstValueFrom(service.viewMode())).resolves.toEqual('grid');
    });
});
