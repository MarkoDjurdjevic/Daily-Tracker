import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserActivitiesComponent } from '../user-activities.component';
import { ASC } from 'app/config/navigation.constants';

const ActivitiesRoute: Routes = [
  {
    path: '',
    component: UserActivitiesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ActivitiesRoute)],
  exports: [RouterModule],
})
export class ActivitiesRoutingModule {}
