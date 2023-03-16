import * as THREE from "three";
import * as dat from "dat.gui";
import gsap from "gsap";

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
                material: "1",
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
            height: this.texture.load("static/models/mat1/height.png"),
            ao: this.texture.load("static/models/mat1/ao.jpg"),
            norm: this.texture.load("static/models/mat1/norm.jpg"),
            rough: this.texture.load("static/models/mat1/rough.jpg"),
        };

        this.mat2 = {
            base: this.texture.load("static/models/mat2/base.jpg"),
            height: this.texture.load("static/models/mat2/height.png"),
            ao: this.texture.load("static/models/mat2/ao.jpg"),
            norm: this.texture.load("static/models/mat2/norm.jpg"),
            rough: this.texture.load("static/models/mat2/rough.jpg"),
        };

        this.mat3 = {
            base: this.texture.load("static/models/mat3/base.jpg"),
            height: this.texture.load("static/models/mat3/height.png"),
            ao: this.texture.load("static/models/mat3/ao.jpg"),
            norm: this.texture.load("static/models/mat3/norm.jpg"),
            rough: this.texture.load("static/models/mat3/rough.jpg"),
        };

        this.mat4 = {
            base: this.texture.load("static/models/mat4/base.jpg"),
            height: this.texture.load("static/models/mat4/height.png"),
            ao: this.texture.load("static/models/mat4/ao.jpg"),
            norm: this.texture.load("static/models/mat4/norm.jpg"),
            rough: this.texture.load("static/models/mat4/rough.jpg"),
        };

        let material = new THREE.MeshStandardMaterial({
            map: this.mat1.base,
            aoMap: this.mat1.ao,
            aoMapIntensity: 1,
            normalMap: this.mat1.norm,
            displacementMap: this.mat1.height,
            displacementScale: 0,
            roughnessMap: this.mat1.rough,
            metalness: 0,
            flatShading: false,
        });

        let sphereMaterial = new THREE.MeshStandardMaterial({
            map: this.mat1.base,
            aoMap: this.mat1.ao,
            aoMapIntensity: 1,
            normalMap: this.mat1.norm,
            displacementMap: this.mat1.height,
            displacementScale: 0.025,
            roughnessMap: this.mat1.rough,
            metalness: 0,
            flatShading: false,
        });

        material.map.minFilter = sphereMaterial.map.minFilter = THREE.NearestFilter;
        material.map.generateMipmaps = sphereMaterial.map.generateMipmaps = false;
        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.displacementMap.wrapS = material.displacementMap.wrapT = THREE.RepeatWrapping;
        material.aoMap.wrapS = material.aoMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping;
        material.roughnessMap.wrapS = material.roughnessMap.wrapT = THREE.RepeatWrapping;

        material.map.repeat.set(0.15, 0.15);
        material.displacementMap.repeat.set(0.15, 0.15);
        material.aoMap.repeat.set(0.15, 0.15);
        material.normalMap.repeat.set(0.15, 0.15);
        material.roughnessMap.repeat.set(0.15, 0.15);

        sphereMaterial.map.repeat.set(4, 4);
        sphereMaterial.displacementMap.repeat.set(4, 4);
        sphereMaterial.aoMap.repeat.set(4, 4);
        sphereMaterial.normalMap.repeat.set(4, 4);
        sphereMaterial.roughnessMap.repeat.set(4, 4);

        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("draco/");
        loader.setDRACOLoader(dracoLoader);

        loader.load(model, (model) => {
            model.scene.position.x = -4;
            material.color.convertSRGBToLinear();

            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    object.material.color.convertSRGBToLinear();

                    // initial material setup
                    object.material = material;
                }
            });

            this.gui.add(this.guiConf, "material", { Material1: 1, Material2: 2, Material3: 3, Material4: 4 }).onChange((value) => {
                this.transformMaterial(value, material, sphereMaterial);
            });

            this.sphere(sphereMaterial);

            this.scene.add(model.scene);
        });
    }

    sphere(material) {
        const geometry = new THREE.SphereGeometry(1.5, 400, 400);
        const sphere = new THREE.Mesh(geometry, material);
        // sphere.material.wireframe = true;
        sphere.position.set(4, 2, 0);
        this.scene.add(sphere);

        gsap.to(sphere.rotation, {
            duration: 20,
            ease: "none",
            y: Math.PI * 2,
            repeat: -1,
        });
    }

    transformMaterial(index, material, sphereMaterial) {
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

        mat.base.minFilter = THREE.NearestFilter;
        mat.base.generateMipmaps = false;
        material.map = sphereMaterial.map = mat.base;
        material.aoMap = sphereMaterial.aoMap = mat.ao;
        material.displacementMap = sphereMaterial.displacementMap = mat.height;
        material.normalMap = sphereMaterial.normalMap = mat.norm;
        material.roughnessMap = sphereMaterial.roughnessMap = mat.rough;

        material.map.wrapS = material.map.wrapT = sphereMaterial.map.wrapS = sphereMaterial.map.wrapT = THREE.RepeatWrapping;
        material.aoMap.wrapS = material.aoMap.wrapT = sphereMaterial.aoMap.wrapS = sphereMaterial.aoMap.wrapT = THREE.RepeatWrapping;
        material.displacementMap.wrapS = material.displacementMap.wrapT = sphereMaterial.displacementMap.wrapS = sphereMaterial.displacementMap.wrapT =
            THREE.RepeatWrapping;
        material.normalMap.wrapS = material.normalMap.wrapT = sphereMaterial.normalMap.wrapS = sphereMaterial.normalMap.wrapT = THREE.RepeatWrapping;
        material.roughnessMap.wrapS = material.roughnessMap.wrapT = sphereMaterial.roughnessMap.wrapS = sphereMaterial.roughnessMap.wrapT =
            THREE.RepeatWrapping;

        material.map.repeat.set(1, 1);
        material.aoMap.repeat.set(1, 1);
        material.displacementMap.repeat.set(1, 1);
        material.normalMap.repeat.set(1, 1);
        material.roughnessMap.repeat.set(1, 1);

        // sphereMaterial.map.repeat.set(4, 4);
        // sphereMaterial.aoMap.repeat.set(4, 4);
        // sphereMaterial.displacementMap.repeat.set(4, 4);
        // sphereMaterial.normalMap.repeat.set(4, 4);
        // sphereMaterial.roughnessMap.repeat.set(4, 4);
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
