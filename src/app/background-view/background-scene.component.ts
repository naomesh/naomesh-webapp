import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Object3D, Vector3 } from 'three';
import { WeatherEnergyService } from '../services/weather-energy-service/weather-energy.service';


@Component({
  selector: 'app-background-scene',
  templateUrl: './background-scene.component.html',
  styleUrls: ['./background-scene.component.scss']
})
export class BackgroundSceneComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  //* Stage Properties

  //? Scene properties
  private camera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  private model: any;

  //? Helper Properties (Private Properties);

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  private loaderGLTF = new GLTFLoader();

  private renderer!: THREE.WebGLRenderer;

  private scene!: THREE.Scene;

  private pickableObjects: Object3D[] = [];
  private intersectedObject!: any;


  private createControls = () => {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.04
    this.controls.enableRotate = true
    this.controls.enableZoom = true
    this.controls.maxPolarAngle = Math.PI /2.5
    // this.controls.autoRotate = true;
    this.controls.enableZoom = true;
    this.controls.enablePan = true;
    // this.controls.target = new Vector3(0, 0, 0);
    this.controls.update();
  };

  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#c8f0f9');

    // Load GLTF
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    this.loaderGLTF.setDRACOLoader(dracoLoader);
    this.loaderGLTF.load('assets/gtlf/test04.glb', (gltf: GLTF) => {
      this.model = gltf.scene;
      this.model.children.forEach((child: THREE.Object3D<THREE.Event>) => {
        if (child.name === '1_LANCEUR' || child.name === '2_PANNEAU_SOLAIRE' || child.name === '3_SERVEURS' || child.name === '4_RESULTAT'){
          this.pickableObjects.push(child);
        }
      });
      console.log(this.model);
      this.scene.add(this.model);
    });
    // Camera
    this.camera =  new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(34,16,-20);

    // Light
    const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82);
    this.scene.add(ambient);

    const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96);
    sunLight.position.set(-69,44,14);
    this.scene.add(sunLight);

    // Raycasting
    this.raycastingSetup();
    // Object clicking
    this.objectClickSetup();



  }

  private raycastingSetup() {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    let intersects;

    const onMouseMove = (event: any) => {

      pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

      raycaster.setFromCamera( pointer, this.camera );

      intersects = raycaster.intersectObjects(this.pickableObjects)
      if (intersects.length > 0) {
        this.intersectedObject = intersects[0].object;
      }
      else {
        this.intersectedObject = null;
      }

      if (this.intersectedObject){
        if (document.getElementById('body')!.style.cursor != 'pointer') {
          document.getElementById('body')!.style.cursor = 'pointer';
        }
      }
      else {
        if (document.getElementById('body')!.style.cursor == 'pointer') {
          document.getElementById('body')!.style.cursor = 'default';
        }
      }
    }

    window.addEventListener( 'mousemove' , onMouseMove );
  }

  private objectClickSetup() {

    const onClick = (event: any) => {
      if(this.intersectedObject){
          // cameraSmoothLookAt(this.intersectedObject)
          // console.log("click on intersected");
          // console.log(this.intersectedObject);
          // console.log(this.getParent(this.intersectedObject));
      }
    }

    window.addEventListener('click', onClick);
  }

  private getParent(object: any) {
    let name = '';
    let found = false;
    while (!found) {
      let parentObject = object.parent;
      if (parentObject.name === '1_LANCEUR' || parentObject.name === '2_PANNEAU_SOLAIRE' || parentObject.name === '3_SERVEURS' || parentObject.name === '4_RESULTAT'){
        found = true;
        name = parentObject.name;
      }
      else {
        object = parentObject;
      }
    }
    return name;
  }


  /**
 * Start the rendering loop
 *
 * @private
 * @memberof CubeComponent
 */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.createControls();
    let component: BackgroundSceneComponent = this;
    (function render() {
      component.renderer.render(component.scene, component.camera);
      component.controls.update();
      requestAnimationFrame(render);
    }());
  }

  constructor(private weatherEnergyService: WeatherEnergyService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
  }

}
