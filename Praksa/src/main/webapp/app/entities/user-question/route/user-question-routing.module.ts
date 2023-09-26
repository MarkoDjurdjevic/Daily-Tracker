import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserQuestionComponent } from '../list/user-question.component';
import { UserQuestionDetailComponent } from '../detail/user-question-detail.component';
import { UserQuestionUpdateComponent } from '../update/user-question-update.component';
import { UserQuestionRoutingResolveService } from './user-question-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userQuestionRoute: Routes = [
  {
    path: '',
    component: UserQuestionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserQuestionDetailComponent,
    resolve: {
      userQuestion: UserQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserQuestionUpdateComponent,
    resolve: {
      userQuestion: UserQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserQuestionUpdateComponent,
    resolve: {
      userQuestion: UserQuestionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userQuestionRoute)],
  exports: [RouterModule],
})
export class UserQuestionRoutingModule {}
