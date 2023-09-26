import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserQuestionService } from '../service/user-question.service';

import { UserQuestionComponent } from './user-question.component';

describe('UserQuestion Management Component', () => {
  let comp: UserQuestionComponent;
  let fixture: ComponentFixture<UserQuestionComponent>;
  let service: UserQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-question', component: UserQuestionComponent }]), HttpClientTestingModule],
      declarations: [UserQuestionComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(UserQuestionComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserQuestionComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserQuestionService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.userQuestions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userQuestionService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserQuestionIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserQuestionIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
