import { Route } from '@angular/router';

import { ActivitiesComponent } from './activities.component';

export const ACTIVITIES_ROUTE: Route = {
  path: '',
  component: ActivitiesComponent,
  data: {
    pageTitle: 'login.title',
  },
};
