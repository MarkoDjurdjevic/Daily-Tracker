import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserQuestionComponent } from './list/user-question.component';
import { UserQuestionDetailComponent } from './detail/user-question-detail.component';
import { UserQuestionUpdateComponent } from './update/user-question-update.component';
import { UserQuestionDeleteDialogComponent } from './delete/user-question-delete-dialog.component';
import { UserQuestionRoutingModule } from './route/user-question-routing.module';

@NgModule({
  imports: [SharedModule, UserQuestionRoutingModule],
  declarations: [UserQuestionComponent, UserQuestionDetailComponent, UserQuestionUpdateComponent, UserQuestionDeleteDialogComponent],
})
export class UserQuestionModule {}
