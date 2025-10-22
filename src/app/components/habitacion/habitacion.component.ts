import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-habitacion',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css']
})
export class HabitacionComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;

  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  controls!: OrbitControls;
  currentLegs!: THREE.Object3D;
  baseModel!: THREE.Object3D;
  cachedLegs:{[key: string]: THREE.Object3D} = {};

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModels();
    this.animate();
  }

  initScene(): void {
    // Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xaaaaaa);

    // Cámara
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(2, 2, 5);

    // Renderer
    const canvasElement = this.canvasRef.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.nativeElement, antialias: true });
    this.renderer.setSize(canvasElement.clientWidth, canvasElement.clientHeight);

    //Controles orbitales
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.1;
    this.controls.target.set(0,0.5,0);
    this.controls.update();

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, 10);
    this.scene.add(directionalLight);


    window.addEventListener('resize', () => this.onWindowResize());
  }



  animate(): void {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  loadModels(): void{
    const loader = new GLTFLoader();
    loader.load(
      'assets/modelos/base-canape-fijo-15.glb',
      (gltf) => {
        this.baseModel = gltf.scene;
        this.baseModel.position.set(0,0,0);
        this.scene.add(this.baseModel);
      }
    )

    loader.load(
      'assets/modelos/patas-cilindro.glb',
      (gltf) => {
        const patas = gltf.scene;
        patas.position.set(0,0,0);
        this.cachedLegs['patas-cilindro'] = patas;

        this.currentLegs = patas.clone(true);
        this.scene.add(this.currentLegs);
      }
    );

    loader.load(
      'assets/modelos/patas-cuadrado.glb',
      (gltf) => {
        const patas = gltf.scene;
        patas.position.set(0,0,0);
        this.cachedLegs['patas-cuadrado'] = patas;
      }
    )
  }

  replaceLegs(key: string): void{
    const newLegs = this.cachedLegs[key];

    //Delete current patas if existing
    if(this.currentLegs){
      this.scene.remove(this.currentLegs);
    }

    //Clone in order to avoid shared references
    const newLegsClone = newLegs.clone(true);
    this.currentLegs = newLegsClone;
    this.scene.add(newLegsClone);
  }

  changeBaseTexture(texturePath: string): void {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(texturePath, (texture)=>{
      // Make texture repeats in both directions
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      //How many times texture repeats in X and Y
      texture.repeat.set(4,4);

      this.baseModel.traverse((child)=>{
        if((child as THREE.Mesh).isMesh){
          const mesh = child as THREE.Mesh;

          //Make sure material is standard
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

          materials.forEach((mat) => {
            const material = mat as THREE.MeshStandardMaterial;

            //Only change "material-tapa"
            if(material.name === "material-soporte"){
              material.map = texture;
              material.needsUpdate = true;
            }
          })
        }
      })
    })
  }

  setCameraView(view: string): void {
    const target = new THREE.Vector3(0, 1, 0);
    switch (view) {
      case 'top':
        this.camera.position.set(0, 15, 0.1);
        break;
      case 'front':
        this.camera.position.set(0, 5, 15);
        break;
      case 'firstPerson':
        this.camera.position.set(0, 1.6, -3);
        break;
      case 'isometric':
        this.camera.position.set(10, 10, 10);
        break;
    }
    this.camera.lookAt(target);
  }
}
