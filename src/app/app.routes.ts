import { Routes } from '@angular/router';
import { ReferanceFormComponent } from './referance-form/referance-form.component';

export const routes: Routes = [
    {
        path: 'reference-form',
        pathMatch: 'full',
        component: ReferanceFormComponent
    },
    {
        path: '**',
        redirectTo: 'reference-form'
    }
]