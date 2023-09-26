import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUserQuestion } from '../user-question.model';

@Component({
  selector: 'jhi-user-question-detail',
  templateUrl: './user-question-detail.component.html',
})
export class UserQuestionDetailComponent implements OnInit {
  userQuestion: IUserQuestion | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userQuestion }) => {
      this.userQuestion = userQuestion;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
