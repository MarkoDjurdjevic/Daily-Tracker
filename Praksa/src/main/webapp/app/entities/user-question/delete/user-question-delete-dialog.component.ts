import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserQuestion } from '../user-question.model';
import { UserQuestionService } from '../service/user-question.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-question-delete-dialog.component.html',
})
export class UserQuestionDeleteDialogComponent {
  userQuestion?: IUserQuestion;

  constructor(protected userQuestionService: UserQuestionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userQuestionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
