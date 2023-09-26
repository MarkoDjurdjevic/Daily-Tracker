import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../user-question.test-samples';

import { UserQuestionFormService } from './user-question-form.service';

describe('UserQuestion Form Service', () => {
  let service: UserQuestionFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQuestionFormService);
  });

  describe('Service methods', () => {
    describe('createUserQuestionFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createUserQuestionFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });

      it('passing IUserQuestion should create a new form with FormGroup', () => {
        const formGroup = service.createUserQuestionFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
            question: expect.any(Object),
          })
        );
      });
    });

    describe('getUserQuestion', () => {
      it('should return NewUserQuestion for default UserQuestion initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createUserQuestionFormGroup(sampleWithNewData);

        const userQuestion = service.getUserQuestion(formGroup) as any;

        expect(userQuestion).toMatchObject(sampleWithNewData);
      });

      it('should return NewUserQuestion for empty UserQuestion initial value', () => {
        const formGroup = service.createUserQuestionFormGroup();

        const userQuestion = service.getUserQuestion(formGroup) as any;

        expect(userQuestion).toMatchObject({});
      });

      it('should return IUserQuestion', () => {
        const formGroup = service.createUserQuestionFormGroup(sampleWithRequiredData);

        const userQuestion = service.getUserQuestion(formGroup) as any;

        expect(userQuestion).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IUserQuestion should not enable id FormControl', () => {
        const formGroup = service.createUserQuestionFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewUserQuestion should disable id FormControl', () => {
        const formGroup = service.createUserQuestionFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
