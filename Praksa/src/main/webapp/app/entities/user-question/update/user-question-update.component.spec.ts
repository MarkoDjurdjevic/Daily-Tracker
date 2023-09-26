import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UserQuestionFormService } from './user-question-form.service';
import { UserQuestionService } from '../service/user-question.service';
import { IUserQuestion } from '../user-question.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IQuestion } from 'app/entities/question/question.model';
import { QuestionService } from 'app/entities/question/service/question.service';

import { UserQuestionUpdateComponent } from './user-question-update.component';

describe('UserQuestion Management Update Component', () => {
  let comp: UserQuestionUpdateComponent;
  let fixture: ComponentFixture<UserQuestionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let userQuestionFormService: UserQuestionFormService;
  let userQuestionService: UserQuestionService;
  let userService: UserService;
  let questionService: QuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UserQuestionUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UserQuestionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserQuestionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    userQuestionFormService = TestBed.inject(UserQuestionFormService);
    userQuestionService = TestBed.inject(UserQuestionService);
    userService = TestBed.inject(UserService);
    questionService = TestBed.inject(QuestionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const userQuestion: IUserQuestion = { id: 456 };
      const user: IUser = { id: 98392 };
      userQuestion.user = user;

      const userCollection: IUser[] = [{ id: 49564 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userQuestion });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Question query and add missing value', () => {
      const userQuestion: IUserQuestion = { id: 456 };
      const question: IQuestion = { id: 38010 };
      userQuestion.question = question;

      const questionCollection: IQuestion[] = [{ id: 9687 }];
      jest.spyOn(questionService, 'query').mockReturnValue(of(new HttpResponse({ body: questionCollection })));
      const additionalQuestions = [question];
      const expectedCollection: IQuestion[] = [...additionalQuestions, ...questionCollection];
      jest.spyOn(questionService, 'addQuestionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ userQuestion });
      comp.ngOnInit();

      expect(questionService.query).toHaveBeenCalled();
      expect(questionService.addQuestionToCollectionIfMissing).toHaveBeenCalledWith(
        questionCollection,
        ...additionalQuestions.map(expect.objectContaining)
      );
      expect(comp.questionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const userQuestion: IUserQuestion = { id: 456 };
      const user: IUser = { id: 13032 };
      userQuestion.user = user;
      const question: IQuestion = { id: 43283 };
      userQuestion.question = question;

      activatedRoute.data = of({ userQuestion });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.questionsSharedCollection).toContain(question);
      expect(comp.userQuestion).toEqual(userQuestion);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserQuestion>>();
      const userQuestion = { id: 123 };
      jest.spyOn(userQuestionFormService, 'getUserQuestion').mockReturnValue(userQuestion);
      jest.spyOn(userQuestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userQuestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userQuestion }));
      saveSubject.complete();

      // THEN
      expect(userQuestionFormService.getUserQuestion).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(userQuestionService.update).toHaveBeenCalledWith(expect.objectContaining(userQuestion));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserQuestion>>();
      const userQuestion = { id: 123 };
      jest.spyOn(userQuestionFormService, 'getUserQuestion').mockReturnValue({ id: null });
      jest.spyOn(userQuestionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userQuestion: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: userQuestion }));
      saveSubject.complete();

      // THEN
      expect(userQuestionFormService.getUserQuestion).toHaveBeenCalled();
      expect(userQuestionService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IUserQuestion>>();
      const userQuestion = { id: 123 };
      jest.spyOn(userQuestionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ userQuestion });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(userQuestionService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareQuestion', () => {
      it('Should forward to questionService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(questionService, 'compareQuestion');
        comp.compareQuestion(entity, entity2);
        expect(questionService.compareQuestion).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
