import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelController {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container",
        };
    }

    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            console.log("GLTFModelController init()");

            this.width = this.modelContainer.offsetWidth;
            this.height = this.modelContainer.offsetHeight;

            THREE.Cache.enabled = true;

            // gui
            this.gui = new dat.GUI({
                name: "Bottle config",
            });

            // gui config
            this.guiConf = {
                light: {
                    lightIntensity: 6,
                },
                color: {
                    color: "#0005a0",
                },
                autoRotation: {
                    autoRotate: true,
                },
                opacity: {
                    transparent: false,
                    opacity: 0.3,
                },
                glossy: {
                    glass: true,
                    emissiveColor: "#1e0f0f",
                },
            };

            this.initFBXModel();
            this.animate();
        }
    }

    initFBXModel() {
        // camera
        this.camera = new THREE.PerspectiveCamera(
            35,
            this.width / this.height,
            0.5,
            400,
        );
        this.camera.updateProjectionMatrix();
        this.camera.position.set(35, 10, 32);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        // this.scene.background = new THREE.Color(0xa0a0a0);
        // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 400);

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
        hemiLight.position.set(0, 200, 0);
        this.scene.add(hemiLight);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.ambientLight.matrixAutoUpdate = false;
        this.scene.add(this.ambientLight);

        // this is just back light - without it back side of model would be barely visible
        this.dirSubLight = new THREE.DirectionalLight(0xcccccc, 1);
        this.dirSubLight.position.set(-20, 20, -20);
        this.dirSubLight.matrixAutoUpdate = false;
        this.scene.add(this.dirSubLight);

        this.dirLight = new THREE.DirectionalLight(0xcccccc, this.guiConf.light.lightIntensity);
        this.dirLight.position.set(20, 30, 20);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.top = 180;
        this.dirLight.shadow.camera.bottom = -100;
        this.dirLight.shadow.camera.left = -120;
        this.dirLight.shadow.camera.right = 120;
        this.dirLight.shadow.mapSize.width = 4096;
        this.dirLight.shadow.mapSize.height = 4096;
        this.dirLight.matrixAutoUpdate = false;
        this.dirLight.shadow.radius = 4;
        this.dirLight.shadow.bias = 0.0001;
        this.scene.add(this.dirLight);

        // add gui for light intensity
        this.gui
            .add(this.guiConf.light, "lightIntensity", 1, 10, 0.1)
            .onChange((value) => {
                this.dirLight.intensity = value;
            });

        // ground
        // const mesh = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(1000, 1000, 1, 1),
        //     new THREE.MeshPhongMaterial({ color: 0xeeeeee, depthWrite: false }),
        // );
        // mesh.material.color.convertSRGBToLinear();
        // mesh.rotation.x = -Math.PI / 2;
        // mesh.receiveShadow = true;
        // this.scene.add(mesh);

        // ground grid
        // const grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
        // grid.material.opacity = 0.3;
        // grid.material.transparent = true;
        // this.scene.add(grid);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            depth: false,
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
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.controls.target.set(0, 10, 0);
        this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
        this.controls.autoRotateSpeed = 1;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;

        // this.controls.maxPolarAngle = Math.PI / 2;
        // this.controls.minPolarAngle = Math.PI / 3;

        this.gui
            .add(this.guiConf.autoRotation, "autoRotate")
            .onChange((value) => {
                console.log(value);
                if (value === false) {
                    this.controls.autoRotate = false;
                } else {
                    this.controls.autoRotate = true;
                }
            });

        // handle resize
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    loadModel() {
        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();
        loader.load(model, (model) => {
            // dynamically change material
            let material = new THREE.MeshPhysicalMaterial({
                color: this.guiConf.color.color,
                depthFunc: false,
            });

            material.color.convertSRGBToLinear();

            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.position.y = 0.1;
                    object.castShadow = true;
                    object.material.side = 2;
                    object.material.shadowSide = 1;
                    object.material.metalness = 0;
                    object.material.opacity = this.guiConf.opacity.opacity;
                    object.material.emissive.set(this.guiConf.glossy.emissiveColor);
                    object.material.depthFunc = false;
                    object.material.color.convertSRGBToLinear();
                    object.matrixAutoUpdate = false;

                    // reflection map
                    const path = `/three.js-playground/static/images/maps/`;
                    const mapUrls = [
                        path + "posx.jpg",
                        path + "negx.jpg",
                        path + "posy.jpg",
                        path + "negy.jpg",
                        path + "posz.jpg",
                        path + "negz.jpg",
                    ];

                    const cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
                    cubeMap.format = THREE.RGBFormat;
                    cubeMap.encoding = THREE.sRGBEncoding;
                    object.material.envMap = cubeMap;
                    object.material.needsUpdate = false;

                    // store material
                    const initMaterial = object.material;

                    // initial material setup
                    if (this.guiConf.opacity.transparent === false) {
                        object.material = material;
                    } else {
                        object.material = initMaterial;
                    }

                    // if initial glass state is true
                    if (this.guiConf.glossy.glass) {
                        this.glassOptions(object.material);
                    }

                    this.gui
                        .addColor(this.guiConf.color, "color")
                        .onChange((colorValue) => {
                            object.material.color.set(colorValue);
                        });

                    this.gui
                        .add(this.guiConf.opacity, "transparent")
                        .onChange((value) => {
                            if (value === false) {
                                object.material = material;
                            } else {
                                object.material = initMaterial;
                            }

                            if (this.guiConf.glossy.glass) {
                                this.glassOptions(object.material);
                            }
                        });

                    this.gui
                        .add(this.guiConf.opacity, "opacity", 0.25, 0.75, 0.01)
                        .onChange((opacityValue) => {
                            object.material.opacity = opacityValue;
                        });

                    this.gui
                        .addColor(this.guiConf.glossy, "emissiveColor")
                        .onChange((colorValue) => {
                            object.material.emissive.set(colorValue);
                        });

                    this.gui
                        .add(this.guiConf.glossy, "glass")
                        .onChange((value) => {
                            if (value) {
                                this.glassOptions(object.material);
                            } else {
                                this.matteOptions(object.material);
                            }
                        });
                }
            });

            this.scene.add(model.scene);
            this.dirLight.updateMatrix();
            this.dirSubLight.updateMatrix();
            this.ambientLight.updateMatrix();
        });
    }

    glassOptions(material) {
        material.refractionRatio = 1;
        material.reflectivity = 1;
        material.roughness = 0;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0;
    }

    matteOptions(material) {
        material.refractionRatio = 0;
        material.reflectivity = 0;
        material.roughness = 0.5;
        material.clearcoat = 0;
        material.clearcoatRoughness = 0.5;
    }

    onWindowResize() {
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
