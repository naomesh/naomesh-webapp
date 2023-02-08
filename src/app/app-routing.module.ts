import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainSceneComponent } from './main-scene/main-scene.component';

const routes: Routes = [
  { path: 'scene/:page', component: MainSceneComponent },
  { path: '', redirectTo: '/scene/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
