import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { v4 as uuidv4 } from 'uuid';
// import { minioClient, uploadFilesToS3 } from '../../clients/minio'

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

  constructor(private readonly sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.idProject = uuidv4();
  }

  ngOnDestroy(): void {
    for (const file of this.files) {
      URL.revokeObjectURL(String(file.src))
    }
  }

  uploadFiles(): void {
    // uploadFilesToS3(this.idProject, this.files.map((f) => f.file))
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
