import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserGraphsComponent } from './user-graphs.component'; 
import { UserGraphRoutingModule } from './route/user-graphs-routing.module'; 

@NgModule({
  imports: [SharedModule, UserGraphRoutingModule],
  declarations: [UserGraphsComponent],
})
export class GraphsModule {}
