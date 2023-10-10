import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserGraphsComponent } from '../user-graphs.component'; 
import { ASC } from 'app/config/navigation.constants';

const GraphRoute: Routes = [
  {
    path: '',
    component: UserGraphsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(GraphRoute)],
  exports: [RouterModule],
})
export class UserGraphRoutingModule {}
