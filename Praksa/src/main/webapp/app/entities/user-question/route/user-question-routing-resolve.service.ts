import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserQuestion } from '../user-question.model';
import { UserQuestionService } from '../service/user-question.service';

@Injectable({ providedIn: 'root' })
export class UserQuestionRoutingResolveService implements Resolve<IUserQuestion | null> {
  constructor(protected service: UserQuestionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserQuestion | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userQuestion: HttpResponse<IUserQuestion>) => {
          if (userQuestion.body) {
            return of(userQuestion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
