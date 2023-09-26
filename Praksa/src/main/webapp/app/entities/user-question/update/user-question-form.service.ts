import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserQuestion, NewUserQuestion } from '../user-question.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserQuestion for edit and NewUserQuestionFormGroupInput for create.
 */
type UserQuestionFormGroupInput = IUserQuestion | PartialWithRequiredKeyOf<NewUserQuestion>;

type UserQuestionFormDefaults = Pick<NewUserQuestion, 'id'>;

type UserQuestionFormGroupContent = {
  id: FormControl<IUserQuestion['id'] | NewUserQuestion['id']>;
  user: FormControl<IUserQuestion['user']>;
  question: FormControl<IUserQuestion['question']>;
};

export type UserQuestionFormGroup = FormGroup<UserQuestionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserQuestionFormService {
  createUserQuestionFormGroup(userQuestion: UserQuestionFormGroupInput = { id: null }): UserQuestionFormGroup {
    const userQuestionRawValue = {
      ...this.getFormDefaults(),
      ...userQuestion,
    };
    return new FormGroup<UserQuestionFormGroupContent>({
      id: new FormControl(
        { value: userQuestionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user: new FormControl(userQuestionRawValue.user),
      question: new FormControl(userQuestionRawValue.question),
    });
  }

  getUserQuestion(form: UserQuestionFormGroup): IUserQuestion | NewUserQuestion {
    return form.getRawValue() as IUserQuestion | NewUserQuestion;
  }

  resetForm(form: UserQuestionFormGroup, userQuestion: UserQuestionFormGroupInput): void {
    const userQuestionRawValue = { ...this.getFormDefaults(), ...userQuestion };
    form.reset(
      {
        ...userQuestionRawValue,
        id: { value: userQuestionRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserQuestionFormDefaults {
    return {
      id: null,
    };
  }
}
