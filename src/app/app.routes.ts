import { Routes } from '@angular/router';
import { ReferanceFormComponent } from './Nannies-reference-form/Nannies-reference-form.component';

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