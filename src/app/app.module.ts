import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainSceneComponent } from './main-scene/main-scene.component';
import { SolarPanelViewComponent } from './solar-panel-view/solar-panel-view.component';
import { ResultViewComponent } from './result-view/result-view.component';
import { LaunchViewComponent } from './launch-view/launch-view.component';
import { ServerViewComponent } from './server-view/server-view.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    MainSceneComponent,
    SolarPanelViewComponent,
    ResultViewComponent,
    LaunchViewComponent,
    ServerViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
