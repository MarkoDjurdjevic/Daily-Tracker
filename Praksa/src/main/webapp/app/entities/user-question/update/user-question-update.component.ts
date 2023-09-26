import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { UserQuestionFormService, UserQuestionFormGroup } from './user-question-form.service';
import { IUserQuestion } from '../user-question.model';
import { UserQuestionService } from '../service/user-question.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

@Component({
  selector: 'jhi-user-question-update',
  templateUrl: './user-question-update.component.html',
})
export class UserQuestionUpdateComponent implements OnInit {
  isSaving = false;
  userQuestion: IUserQuestion | null = null;

  usersSharedCollection: IUser[] = [];
  questionsSharedCollection: IQuestion[] = [];

  editForm: UserQuestionFormGroup = this.userQuestionFormService.createUserQuestionFormGroup();

  constructor(
    protected userQuestionService: UserQuestionService,
    protected userQuestionFormService: UserQuestionFormService,
    protected userService: UserService,
    protected questionService: QuestionService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareQuestion = (o1: IQuestion | null, o2: IQuestion | null): boolean => this.questionService.compareQuestion(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userQuestion }) => {
      this.userQuestion = userQuestion;
      if (userQuestion) {
        this.updateForm(userQuestion);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userQuestion = this.userQuestionFormService.getUserQuestion(this.editForm);
    if (userQuestion.id !== null) {
      this.subscribeToSaveResponse(this.userQuestionService.update(userQuestion));
    } else {
      this.subscribeToSaveResponse(this.userQuestionService.create(userQuestion));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserQuestion>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(userQuestion: IUserQuestion): void {
    this.userQuestion = userQuestion;
    this.userQuestionFormService.resetForm(this.editForm, userQuestion);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, userQuestion.user);
    this.questionsSharedCollection = this.questionService.addQuestionToCollectionIfMissing<IQuestion>(
      this.questionsSharedCollection,
      userQuestion.question
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.userQuestion?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.questionService
      .query()
      .pipe(map((res: HttpResponse<IQuestion[]>) => res.body ?? []))
      .pipe(
        map((questions: IQuestion[]) =>
          this.questionService.addQuestionToCollectionIfMissing<IQuestion>(questions, this.userQuestion?.question)
        )
      )
      .subscribe((questions: IQuestion[]) => (this.questionsSharedCollection = questions));
  }
}
