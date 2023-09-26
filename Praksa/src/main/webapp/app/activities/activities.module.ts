import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ActivitiesComponent } from './activities.component';
import { ACTIVITIES_ROUTE } from './activities.route';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([ACTIVITIES_ROUTE])],
  declarations: [ActivitiesComponent],
})
export class ActivitiesModule {}
