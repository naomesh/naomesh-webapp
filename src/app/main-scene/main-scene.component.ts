import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';

@Component({
  selector: 'app-main-scene',
  templateUrl: './main-scene.component.html',
  styleUrls: ['./main-scene.component.scss']
})
export class MainSceneComponent implements OnInit, OnDestroy, AfterViewInit {

  public page: string = "";
  private sub: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
       this.page = params['page'];
    });
  }

  ngAfterViewInit(): void {
    console.log(this.page)
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  clickLauncher(): void {
    this.router.navigate(['/scene/launch'])
  }

  clickPanels(): void {
    this.router.navigate(['/scene/panels'])
  }

  clickServer(): void {
    this.router.navigate(['/scene/server'])
  }

  clickResult(): void {
    this.router.navigate(['/scene/result'])
  }

}
