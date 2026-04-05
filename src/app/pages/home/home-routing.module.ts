import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeModule } from './home.module';
import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
