import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class SofaModelController {
    constructor() {
        this.DOM = {
            modelContainer: ".js-sofa-container",
        };
    }

    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            console.log("GLTFModelController init()");

            this.width = this.modelContainer.offsetWidth;
            this.height = this.modelContainer.offsetHeight;

            THREE.Cache.enabled = true;

            this.texture = new THREE.TextureLoader();

            // gui
            this.gui = new dat.GUI({
                name: "Sofa config",
            });

            // gui config
            this.guiConf = {
                light: {
                    lightIntensity: 10,
                },
                autoRotation: {
                    autoRotate: false,
                },
                grid: {
                    showGrid: true,
                },
                material: null,
            };

            this.initFBXModel();
            this.animate();
        }
    }

    initFBXModel() {
        // camera
        this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 400);
        this.camera.position.set(17, 10, 17);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        this.ambientLight = new THREE.AmbientLight(0x404040, 1);
        this.scene.add(this.ambientLight);

        this.spotLight = new THREE.SpotLight(0xeeeeee, this.guiConf.light.lightIntensity);
        this.spotLight.position.set(5, 5, 5);
        this.spotLight.castShadow = true;
        this.spotLight.shadow.radius = 4;
        this.spotLight.shadow.bias = 0.0001;
        this.scene.add(this.spotLight);

        // add gui for light intensity
        this.gui.add(this.guiConf.light, "lightIntensity", 1, 30, 0.1).onChange((value) => {
            this.spotLight.intensity = value;
        });

        // ground grid
        const grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.1;
        grid.material.transparent = true;
        this.scene.add(grid);
        if (!this.guiConf.grid.showGrid) {
            grid.visible = false;
        }

        // add gui for grid
        this.gui.add(this.guiConf.grid, "showGrid").onChange((value) => {
            grid.visible = !!value;
        });

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.gammaFactor = 2.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.modelContainer.appendChild(this.renderer.domElement);

        // loader
        this.loadModel();

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1, 0);
        this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
        this.controls.autoRotateSpeed = 1;

        this.gui.add(this.guiConf.autoRotation, "autoRotate").onChange((value) => {
            this.controls.autoRotate = value !== false;
        });

        // handle resize
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    loadModel() {
        this.mat1 = {
            base: this.texture.load("static/models/mat1/base.jpg"),
            ao: this.texture.load("static/models/mat1/ao.jpg"),
            norm: this.texture.load("static/models/mat1/norm.jpg"),
            rough: this.texture.load("static/models/mat1/rough.jpg"),
        };

        this.mat2 = {
            base: this.texture.load("static/models/mat2/base.jpg"),
            ao: this.texture.load("static/models/mat2/ao.jpg"),
            norm: this.texture.load("static/models/mat2/norm.jpg"),
            rough: this.texture.load("static/models/mat2/rough.jpg"),
        };

        this.mat3 = {
            base: this.texture.load("static/models/mat1/base.jpg"),
            ao: this.texture.load("static/models/mat1/ao.jpg"),
            norm: this.texture.load("static/models/mat1/norm.jpg"),
            rough: this.texture.load("static/models/mat1/rough.jpg"),
        };

        this.mat4 = {
            base: this.texture.load("static/models/mat2/base.jpg"),
            ao: this.texture.load("static/models/mat2/ao.jpg"),
            norm: this.texture.load("static/models/mat2/norm.jpg"),
            rough: this.texture.load("static/models/mat2/rough.jpg"),
        };

        let material = new THREE.MeshStandardMaterial({
            map: this.mat1.base,
            aoMap: this.mat1.ao,
            normalMap: this.mat1.norm,
            roughnessMap: this.mat1.rough,
            roughness: 1,
            metalness: 0,
            flatShading: false,
        });

        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.aoMap.wrapS = material.aoMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping;
        material.roughnessMap.wrapS = material.roughnessMap.wrapT = THREE.RepeatWrapping;

        material.map.repeat.set(3, 3);
        material.aoMap.repeat.set(3, 3);
        material.normalMap.repeat.set(3, 3);
        material.roughnessMap.repeat.set(3, 3);

        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        loader.setDRACOLoader(dracoLoader);

        loader.load(model, (model) => {
            material.color.convertSRGBToLinear();

            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.material.color.convertSRGBToLinear();

                    // initial material setup
                    object.material = material;
                }
            });

            this.gui.add(this.guiConf, "material", { Material1: 1, Material2: 2, Material3: 3, Material4: 4 }).onChange((value) => {
                this.transformMaterail(value, material, model.scene);
            });

            this.scene.add(model.scene);
            this.spotLight.updateMatrix();
        });
    }

    transformMaterail(index, material, model) {
        let mat = null;

        if (index === "2") {
            mat = this.mat2;
        } else if (index === "3") {
            mat = this.mat3;
        } else if (index === "4") {
            mat = this.mat4;
        } else {
            mat = this.mat1;
        }

        material.map = mat.base;
        material.aoMap = mat.ao;
        material.normalMap = mat.norm;
        material.roughnessMap = mat.rough;

        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.aoMap.wrapS = material.aoMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping;
        material.roughnessMap.wrapS = material.roughnessMap.wrapT = THREE.RepeatWrapping;

        material.map.repeat.set(3, 3);
        material.aoMap.repeat.set(3, 3);
        material.normalMap.repeat.set(3, 3);
        material.roughnessMap.repeat.set(3, 3);
    }

    onWindowResize() {
        this.camera.aspect = this.width / this.height;

        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
