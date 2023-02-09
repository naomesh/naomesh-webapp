import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { Object3D } from 'three';
import { WeatherEnergyService } from '../services/weather-energy-service/weather-energy.service';

import { EffectComposer, RenderPass, BlendFunction, EffectPass, SMAAEffect, EdgeDetectionMode, PredicationMode, SMAAPreset, DepthOfFieldEffect, DepthEffect, VignetteEffect } from "postprocessing";


@Component({
  selector: 'app-background-scene',
  templateUrl: './background-scene.component.html',
  styleUrls: ['./background-scene.component.scss']
})
export class BackgroundSceneComponent implements OnInit, AfterViewInit {

  @ViewChild('canvas') private canvasRef!: ElementRef;

  @Output() clickLauncherEvent = new EventEmitter<void>();
  @Output() clickPanelsEvent = new EventEmitter<void>();
  @Output() clickServerEvent = new EventEmitter<void>();
  @Output() clickResultEvent = new EventEmitter<void>();

  //* Stage Properties

  //? Scene properties
  private camera!: THREE.PerspectiveCamera;

  private controls!: OrbitControls;

  private model: any;

  private dragging: boolean = false;

  //? Helper Properties (Private Properties);

  private composer: any = undefined;

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
    this.controls.enablePan = false;
    this.controls.target.set( 3, 0, -18 );
    this.controls.maxDistance = 60.0
    this.controls.minDistance = 10.0
    this.controls.update();
  };

  private createScene() {
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#96d2ff');
    this.scene.fog = new THREE.Fog('#96d2ff', 80.0, 95.0 );

    // Load GLTF
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    dracoLoader.setDecoderConfig({ type: 'js' });

    this.loaderGLTF.setDRACOLoader(dracoLoader);
    this.loaderGLTF.load('assets/gtlf/main_scene.glb', (gltf: GLTF) => {
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
    this.camera.position.set(50, 19, -20);

    // Light
    const ambient = new THREE.AmbientLight('#d0e0c3', 0.9);
    this.scene.add(ambient);

    const sunLight = new THREE.DirectionalLight('#bda47b', 1.3);
    sunLight.position.set(-69, 44, 14);
    this.scene.add(sunLight);

    // Raycasting
    this.raycastingSetup();

    // Object clicking
    this.objectClickSetup();

		window.addEventListener( 'resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( width, height );
      this.composer.setSize( width, height );
  });
  }

  private initPostprocessing() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

		const depthOfFieldEffect = new DepthOfFieldEffect(this.camera, {
			focusDistance: 40.0,
			focalLength: 0.001,
			bokehScale: 0.1,
			height: 500
		});

		const vignetteEffect = new VignetteEffect({
			eskil: false,
			offset: 0.35,
			darkness: 0.5
		});

    const smaaEffect = new SMAAEffect({
      // blendFunction: BlendFunction.NORMAL,
      preset: SMAAPreset.ULTRA,
      edgeDetectionMode: EdgeDetectionMode.COLOR,
      predicationMode: PredicationMode.DEPTH
    });

		const effectPass = new EffectPass(
			this.camera,
      // depthOfFieldEffect,
			vignetteEffect,
      smaaEffect
		);


		this.composer.addPass(effectPass);
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

    window.addEventListener('mousedown', () => { this.dragging = false })
    window.addEventListener('mousemove', () => { this.dragging = true })
    window.addEventListener('mouseup', () => {
      if (!this.dragging && this.intersectedObject){
        switch(this.getParent(this.intersectedObject)) {
          case '1_LANCEUR': {
            this.clickLauncherEvent.emit();
          } break;
          case '2_PANNEAU_SOLAIRE': {
            this.clickPanelsEvent.emit();
          } break;
          case '3_SERVEURS': {
            this.clickServerEvent.emit();
          } break;
          case '4_RESULTAT': {
            this.clickResultEvent.emit();
          } break;
          default: break;
        }
    }
  });
}

  private getParent(object: any) {
    let name = '';
    let found = false;
    while (!found) {
      const objectNames = ['1_LANCEUR', '2_PANNEAU_SOLAIRE', '3_SERVEURS', '4_RESULTAT'];
      let parentObject = object.parent;
      if (objectNames.includes(parentObject.name)) {
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
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
      depth: true
    });

    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.createControls();

    let component: BackgroundSceneComponent = this;

    requestAnimationFrame(function render() {

      if (component.composer) {
        component.composer.render();
      }
      component.controls.update();
      requestAnimationFrame(render);
    });
  }

  constructor(private weatherEnergyService: WeatherEnergyService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.createScene();
    this.startRenderingLoop();
    this.initPostprocessing();
  }

}
