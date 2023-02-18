import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-launch-view',
  templateUrl: './launch-view.component.html',
  styleUrls: ['./launch-view.component.scss']
})
export class LaunchViewComponent implements OnInit, OnDestroy {

  public files: { file: File, src: SafeResourceUrl }[] = [];
  public priority: number = 0;
  public quality: number = 0;
  public idProject: string = "";

  constructor(private readonly sanitizer: DomSanitizer, private router: Router) { }

  ngOnInit(): void {
    this.idProject = uuidv4();
  }

  ngOnDestroy(): void {
    for (const file of this.files) {
      URL.revokeObjectURL(String(file.src))
    }
  }

  async uploadFiles(): Promise<void> {
    if (!this.files) {
      console.error("No file selected")
      return
    }

    console.log(this.idProject, this.files.map((f) => f.file))

    const formData = new FormData();

    for (const file of this.files.map((f) => f.file)) {
      formData.append(file.name, file, file.name);
    }

    console.log(this.idProject,formData)

    await fetch(`${environment.WEBAPP_API_URL}/upload/${this.idProject}`, {
      method: 'POST',
      body: formData
    })
    .then((res) => {
      if (res.ok) {
        this.router.navigate(['/scene/server'])
      } else {
        throw new Error(res.statusText);
      }
    })
    .catch((err) => console.error(err))
  }

  filesSize(): string {
    const size = this.files.map((f) => f.file.size).reduce((acc, val) => acc + val, 0) || 0
    return (size / 1024 / 1024).toFixed(2);
  }

  deleteFile(index: number) {
    URL.revokeObjectURL(String(this.files[index].src))
    this.files.splice(index, 1)
  }

  onFileSelected(e: Event): void {
    const target = e.target as HTMLInputElement;

    if (!target.files) {
      return;
    }

    for (const i in target.files) {
      const file = target.files[i] as File;

      const url = window.URL.createObjectURL(file)
      const src = this.sanitizer.bypassSecurityTrustResourceUrl(url);

      this.files.push({ file, src })
    }
  }

}
