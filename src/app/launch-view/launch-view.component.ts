import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { WebApiService } from '../../clients/webapi';

@Component({
  selector: 'app-launch-view',
  templateUrl: './launch-view.component.html',
  providers: [WebApiService],
  styleUrls: ['./launch-view.component.scss'],
})
export class LaunchViewComponent implements OnInit, OnDestroy {
  public files: { file: File; src: SafeResourceUrl }[] = [];
  public energy: number = 0;
  public quality: number = 0;
  public idProject: string = '';

  constructor(
    private readonly sanitizer: DomSanitizer,
    private router: Router,
    private webApiService: WebApiService
  ) {}

  ngOnInit() {
    this.idProject = uuidv4();
  }

  ngOnDestroy() {
    for (const file of this.files) {
      URL.revokeObjectURL(String(file.src));
    }
  }

  uploadFiles() {
    if (!this.files) {
      console.error('No file selected');
      return;
    }

    this.webApiService
      .postStartTask(
        this.idProject,
        this.files.map((f) => f.file),
        ['green', 'bypass'][this.energy],
        ['good', 'bad'][this.quality]
      )
      .subscribe((response) => {
        this.router.navigate(['/scene/server']);
      });
  }

  filesSize(): string {
    const size =
      this.files.map((f) => f.file.size).reduce((acc, val) => acc + val, 0) ||
      0;
    return (size / 1024 / 1024).toFixed(2);
  }

  deleteFile(index: number) {
    URL.revokeObjectURL(String(this.files[index].src));
    this.files.splice(index, 1);
  }

  onFileSelected(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    for (const i in target.files) {
      const file = target.files[i] as File;

      const url = window.URL.createObjectURL(file);
      const src = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      this.files.push({ file, src });
    }
  }
}
