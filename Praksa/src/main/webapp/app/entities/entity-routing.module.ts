import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'question',
        data: { pageTitle: 'dailyTrackerApp.question.home.title' },
        loadChildren: () => import('./question/question.module').then(m => m.QuestionModule),
      },
      {
        path: 'user-activities',
        data: { pageTitle: 'dailyTrackerApp.userActivity.home.title' },
        loadChildren: () => import('./user-activities/activities.module').then(m => m.ActivitiesModule),
      },
      {
        path: 'user-graphs',
        data: { pageTitle: 'dailyTrackerApp.userGraphs.home.title' },
        loadChildren: () => import('./user-graphs/graphs.module').then(m => m.GraphsModule),
      },
      {
        path: 'user-question',
        data: { pageTitle: 'dailyTrackerApp.userQuestion.home.title' },
        loadChildren: () => import('./user-question/user-question.module').then(m => m.UserQuestionModule),
      },
      {
        path: 'answer',
        data: { pageTitle: 'dailyTrackerApp.answer.home.title' },
        loadChildren: () => import('./answer/answer.module').then(m => m.AnswerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
