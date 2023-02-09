import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';

enum Route {
  HOME = 'home',
  SERVER = 'server',
  LAUNCH = 'launch',
  PANELS = 'panels',
  RESULT = 'result'
}

@Component({
  selector: 'app-main-scene',
  templateUrl: './main-scene.component.html',
  styleUrls: ['./main-scene.component.scss']
})
export class MainSceneComponent implements OnInit, OnDestroy, AfterViewInit {

  public page: Route = Route.HOME;
  private sub: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
       this.page = params['page'];
    });
  }

  pageIsHome(): boolean {
    return this.page == Route.HOME
  }

  pageIsServer(): boolean {
    return this.page == Route.SERVER
  }

  pageIsLaunch(): boolean {
    return this.page == Route.LAUNCH
  }

  pageIsPanels(): boolean {
    return this.page == Route.PANELS
  }

  pageIsResult(): boolean {
    return this.page == Route.RESULT
  }

  ngAfterViewInit(): void {
    console.log(this.page)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  clickLauncher(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/launch'])
    }
  }

  clickPanels(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/panels'])
    }
  }

  clickServer(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/server'])
    }
  }

  clickResult(): void {
    if (this.pageIsHome()) {
      this.router.navigate(['/scene/result'])
    }
  }

}
