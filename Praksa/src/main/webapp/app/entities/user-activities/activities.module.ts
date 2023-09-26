import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserActivitiesComponent } from './user-activities.component';
import { ActivitiesRoutingModule } from './route/user-activities-routing.module';

@NgModule({
  imports: [SharedModule, ActivitiesRoutingModule],
  declarations: [UserActivitiesComponent],
})
export class ActivitiesModule {}
