import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserQuestionDetailComponent } from './user-question-detail.component';

describe('UserQuestion Management Detail Component', () => {
  let comp: UserQuestionDetailComponent;
  let fixture: ComponentFixture<UserQuestionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserQuestionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userQuestion: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserQuestionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserQuestionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userQuestion on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userQuestion).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
