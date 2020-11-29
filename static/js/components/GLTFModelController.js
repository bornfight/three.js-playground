import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelController {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container",
            states: {},
        };

        this.modelContainer = document.querySelector(this.DOM.modelContainer);

        this.scene;
        this.camera;
        this.renderer;
        this.mixer;
        this.clock = new THREE.Clock();
    }

    init() {
        console.log("GLTFModelController init()");

        if (this.modelContainer !== null) {
            this.initFBXModel();
            this.animate();
        } else {
            console.error(
                `${this.DOM.modelContainer} does not exist in the DOM!`,
            );
        }
    }

    initFBXModel() {
        this.camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.5,
            1000,
        );
        this.camera.position.set(48, 32, 32);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
        hemiLight.position.set(0, 200, 0);
        this.scene.add(hemiLight);

        const dirLight = new THREE.DirectionalLight(0xffffff);
        dirLight.position.set(0, 200, 100);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -120;
        dirLight.shadow.camera.right = 120;
        this.scene.add(dirLight);

        // ground
        const mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000),
            new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.scene.add(mesh);

        const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add(grid);

        let model = this.modelContainer.getAttribute("data-model-source");
        const loader = new GLTFLoader();

        loader.load(model, (object) => {
            object.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            this.scene.add(object.scene);
        });

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.modelContainer.appendChild(this.renderer.domElement);

        const controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        controls.target.set(0, 10, 0);
        controls.update();

        window.addEventListener("resize", this.onWindowResize, false);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
    }
}
