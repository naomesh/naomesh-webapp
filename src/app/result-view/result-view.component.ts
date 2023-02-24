import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import * as ApexCharts from 'apexcharts';
import { buffer } from 'stream/consumers';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { WebApiService } from '../../clients/webapi';
import { JobResult } from '../../clients/webapi/models';

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  providers: [WebApiService],
  styleUrls: ['./result-view.component.scss'],
})
export class ResultViewComponent implements OnInit, OnDestroy {
  @ViewChild('resultcanvas')
  private canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  public cameraZ: number = -20;
  public fieldOfView: number = -1;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  public results: JobResult[] = [];
  public selected = -1;
  public selected_result: JobResult | undefined = undefined;

  private handleIntervalRefresh: NodeJS.Timer | undefined = undefined;

  public hide_result_canvas = true;
  public wait_loading_model = false;

  constructor(private webApiService: WebApiService) {}

  public clickList(index: number) {
    this.selected = index;
    this.selected_result = this.results[index];
    this.hide_result_canvas = true;
    this.wait_loading_model = false;
  }

  public str2ab(str: string) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  public async loadModelFromDatas(
    bufferGeometry: string,
    bufferTexture: string
  ) {
    const plyLoader = new PLYLoader();
    console.log({ bufferGeometry, bufferTexture });

    const geometryURL = URL.createObjectURL(new Blob([bufferGeometry]));
    const textureURL = URL.createObjectURL(new Blob([bufferTexture]));

    const geometry = await plyLoader.loadAsync(
      'assets/gtlf/scene_dense_mesh_texture.ply'
      // geometryURL
    );

    const textureLoader = new THREE.TextureLoader();
    const texture = await textureLoader.loadAsync(
      'assets/gtlf/scene_dense_mesh_texture.png'
      // textureURL
    );

    console.log({ geometry, texture });

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);

    console.log(mesh);

    mesh.geometry.center();

    this.scene.add(mesh);
    this.wait_loading_model = false;
  }

  public loadModel() {
    // if (!this.hide_result_canvas) return;
    // if (!this.selected_result) return;

    this.hide_result_canvas = false;
    this.wait_loading_model = true;

    this.loadModelFromDatas('', '');

    /*
    this.webApiService
      // .getResultData(this.selected_result.job_id)
      .getResultData('f64b17e2-e1e8-41f5-82ba-122eb64ab544')
      .subscribe(
        async (result: any) => {
          await this.loadModelFromDatas(result.scene, result.texture);
        },
        (err) => {
          this.wait_loading_model = false;
          console.error(err);
        }
      );*/
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  public timestampToHours(timestamp: number) {
    return (
      new Date(timestamp).getHours() + 'h' + new Date(timestamp).getMinutes()
    );
  }

  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#e6e6e6');

    // Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    );
    this.camera.position.z = this.cameraZ;

    // Light
    const ambient = new THREE.AmbientLight('#d0e0c3', 0.9);
    this.scene.add(ambient);

    const sunLight = new THREE.DirectionalLight('#bda47b', 1.3);
    sunLight.position.set(-69, 44, 14);
    this.scene.add(sunLight);
  }

  /**
   * Start the rendering loop
   *
   * @private
   */
  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.createControls();

    let component: ResultViewComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.renderer.render(component.scene, component.camera);
    })();
  }

  private createControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.04;
    this.controls.enableRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.update();
  };

  ngOnInit(): void {
    const ctx = document.getElementById(
      'chart-consumption'
    ) as HTMLCanvasElement;

    var chart = new ApexCharts(ctx, {
      chart: {
        toolbar: {
          show: false,
        },
        width: '100%',
        height: '130px',
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#fbbf24'],
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          data: [],
        },
      ],
    });

    chart.render();
  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.webApiService.getResults().subscribe((results: any) => {
      this.results = results.map((res: Object) => {
        return {
          ...res,
          //@ts-ignore
          start_time: new Date(res?.start_time).getTime(),
          //@ts-ignore
          end_time: new Date(res?.end_time).getTime(),
        } as JobResult;
      });
      console.log(this.results);
    });

    this.handleIntervalRefresh = setInterval(() => {
      this.webApiService.getResults();
    });
  }

  ngOnDestroy() {
    clearTimeout(this.handleIntervalRefresh);
  }
}
