import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserQuestion, NewUserQuestion } from '../user-question.model';

export type PartialUpdateUserQuestion = Partial<IUserQuestion> & Pick<IUserQuestion, 'id'>;

export type EntityResponseType = HttpResponse<IUserQuestion>;
export type EntityArrayResponseType = HttpResponse<IUserQuestion[]>;

@Injectable({ providedIn: 'root' })
export class UserQuestionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-questions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  //dodato
  getUserQuestionsForCurrentUser(): Observable<EntityArrayResponseType> { 
    return this.http.get<IUserQuestion[]>(`api/user-questions-for-current-user`, {observe: 'response' });
  }
  

  //

  create(userQuestion: NewUserQuestion): Observable<EntityResponseType> {
    return this.http.post<IUserQuestion>(this.resourceUrl, userQuestion, { observe: 'response' });
  }

  update(userQuestion: IUserQuestion): Observable<EntityResponseType> {
    return this.http.put<IUserQuestion>(`${this.resourceUrl}/${this.getUserQuestionIdentifier(userQuestion)}`, userQuestion, {
      observe: 'response',
    });
  }

  partialUpdate(userQuestion: PartialUpdateUserQuestion): Observable<EntityResponseType> {
    return this.http.patch<IUserQuestion>(`${this.resourceUrl}/${this.getUserQuestionIdentifier(userQuestion)}`, userQuestion, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserQuestion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserQuestion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserQuestionIdentifier(userQuestion: Pick<IUserQuestion, 'id'>): number {
    return userQuestion.id;
  }

  compareUserQuestion(o1: Pick<IUserQuestion, 'id'> | null, o2: Pick<IUserQuestion, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserQuestionIdentifier(o1) === this.getUserQuestionIdentifier(o2) : o1 === o2;
  }

  addUserQuestionToCollectionIfMissing<Type extends Pick<IUserQuestion, 'id'>>(
    userQuestionCollection: Type[],
    ...userQuestionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userQuestions: Type[] = userQuestionsToCheck.filter(isPresent);
    if (userQuestions.length > 0) {
      const userQuestionCollectionIdentifiers = userQuestionCollection.map(
        userQuestionItem => this.getUserQuestionIdentifier(userQuestionItem)!
      );
      const userQuestionsToAdd = userQuestions.filter(userQuestionItem => {
        const userQuestionIdentifier = this.getUserQuestionIdentifier(userQuestionItem);
        if (userQuestionCollectionIdentifiers.includes(userQuestionIdentifier)) {
          return false;
        }
        userQuestionCollectionIdentifiers.push(userQuestionIdentifier);
        return true;
      });
      return [...userQuestionsToAdd, ...userQuestionCollection];
    }
    return userQuestionCollection;
  }
}
