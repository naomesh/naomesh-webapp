import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

type Task = {
  name: string
}

@Component({
  selector: 'app-result-view',
  templateUrl: './result-view.component.html',
  styleUrls: ['./result-view.component.scss']
})
export class ResultViewComponent implements OnInit {

  @ViewChild('resultcanvas')
  private canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;

  public cameraZ: number = 300;
  public fieldOfView: number = 1;
  public nearClippingPlane: number = 1;
  public farClippingPlane: number = 1000;

  private loaderGLTF = new GLTFLoader();

  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  public tasks: Task[] = [
    { name: "reconstruction1" },
    { name: "reconstruction2" },
    { name: "reconstruction3" }
  ]

  public selected = 0;

  constructor() { }

  public clickList(index: number) {
    this.selected = index
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private createScene() {
    //* Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#FFFFFF');

    // Load GLTF
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    this.loaderGLTF.setDRACOLoader(dracoLoader);
    this.loaderGLTF.load('assets/gtlf/dragon.glb', (gltf: GLTF) => {
      let model = gltf.scene;
      this.scene.add(model);
    });

    //*Camera
    let aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
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
    }());
  }

  private createControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.04
    this.controls.enableRotate = true
    this.controls.enableZoom = true
    // this.controls.maxPolarAngle = Math.PI /2.5
    this.controls.enablePan = false;
    // this.controls.target.set( 3, 0, -18 );
    // this.controls.maxDistance = 60.0
    // this.controls.minDistance = 10.0
    this.controls.update();
  }


  ngOnInit(): void {
    const ctx = document.getElementById('chart-consumption') as HTMLCanvasElement;

    var chart = new ApexCharts(ctx, {
      chart: {
        toolbar: {
          show: false
        },
        width: '100%',
        height: "130px",
        type: 'area',
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#fbbf24"],
      stroke: {
        curve: 'smooth',
      },
      series: [{
        name: 'sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
      }],
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    });

    chart.render();
  }



  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

}
