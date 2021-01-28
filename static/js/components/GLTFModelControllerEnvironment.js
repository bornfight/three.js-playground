import * as THREE from "three";
import * as dat from "dat.gui";
import ColorPicker from "simple-color-picker";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelControllerEnvironment {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container-environment",

            // filters
            // color
            colorWrapper: ".js-color",
            colorInput: ".js-color-input",
            colorPreview: ".js-color-preview",

            // opacity
            opacityWrapper: ".js-opacity",
            opacityInput: ".js-opacity-input",
            opacityPreview: ".js-opacity-preview",

            // transparent
            transparentWrapper: ".js-transparent",

            // finish
            finishWrapper: ".js-finish",
        };
    }

    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            console.log("GLTFModelController init()");

            // gui
            // this.gui = new dat.GUI({
            //     name: "Bottle config",
            // });

            // gui config
            this.guiConf = {
                light: {
                    lightIntensity: 6,
                },
                color: {
                    color: "#0005a0",
                },
                autoRotation: {
                    autoRotate: false,
                },
                opacity: {
                    transparent: false,
                    opacity: 0.3,
                },
                glossy: {
                    glass: true,
                },
                environment: {
                    showEnvironment: true,
                    color: "#0005a0",
                },
            };

            this.colorWrapper = document.querySelector(this.DOM.colorWrapper);
            this.colorInput = document.querySelector(this.DOM.colorInput);
            this.colorPreview = document.querySelector(this.DOM.colorPreview);

            this.opacityWrapper = document.querySelector(this.DOM.opacityWrapper);
            this.opacityInput = document.querySelector(this.DOM.opacityInput);
            this.opacityPreview = document.querySelector(this.DOM.opacityPreview);

            this.transparentWrapper = document.querySelector(this.DOM.transparentWrapper);
            this.transparentInputs = this.transparentWrapper.querySelectorAll("input");

            this.transparentInputs.forEach((input) => {
                if (
                    this.guiConf.opacity.transparent &&
                    input.value === "transparent"
                ) {
                    input.checked = true;
                } else if (
                    !this.guiConf.opacity.transparent &&
                    input.value === "tinted"
                ) {
                    input.checked = true;
                }
            });

            this.finishWrapper = document.querySelector(this.DOM.finishWrapper);
            this.finishInputs = this.finishWrapper.querySelectorAll("input");

            this.finishInputs.forEach((input) => {
                if (
                    this.guiConf.glossy.glass &&
                    input.value === "clear"
                ) {
                    input.checked = true;
                } else if (
                    !this.guiConf.glossy.glass &&
                    input.value === "matte"
                ) {
                    input.checked = true;
                }
            });

            this.colorPicker = new ColorPicker();
            this.colorPicker.appendTo(this.colorInput);
            this.colorPicker.setColor(this.guiConf.color.color);

            this.width = this.modelContainer.offsetWidth;
            this.height = this.modelContainer.offsetHeight;

            THREE.Cache.enabled = true;

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
            600,
        );
        this.camera.position.set(10, 10, 40);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
        hemiLight.position.set(0, 200, 0);
        this.scene.add(hemiLight);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.ambientLight.matrixAutoUpdate = false;
        this.scene.add(this.ambientLight);

        // this is just back light - without it back side of model would be barely visible
        this.dirSubLight = new THREE.DirectionalLight(0xcccccc, 3);
        this.dirSubLight.position.set(-20, 20, -20);
        this.dirSubLight.matrixAutoUpdate = false;
        this.scene.add(this.dirSubLight);

        this.dirLight = new THREE.DirectionalLight(0xdddddd, this.guiConf.light.lightIntensity);
        this.dirLight.position.set(20, 30, 10);
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
        // this.gui
        //     .add(this.guiConf.light, "lightIntensity", 1, 10, 0.1)
        //     .onChange((value) => {
        //         this.dirLight.intensity = value;
        //     });

        // ground
        this.environment = new THREE.Mesh(
            new THREE.BoxBufferGeometry(100, 100, 100),
            new THREE.MeshStandardMaterial({
                depthWrite: false,
                refractionRatio: 0,
                roughness: 1,
                side: THREE.DoubleSide,
            }),
        );

        this.environment.position.y = 50;
        this.environment.receiveShadow = true;
        this.environment.material.color.set(this.guiConf.environment.color);
        this.scene.add(this.environment);

        // add gui for plane
        if (!this.guiConf.environment.showEnvironment) {
            this.environment.visible = false;
        }

        // this.gui
        //     .add(this.guiConf.environment, "showEnvironment")
        //     .onChange((value) => {
        //         this.environment.visible = !!value;
        //     });

        // this.gui
        //     .addColor(this.guiConf.environment, "color")
        //     .onChange((value) => {
        //         this.environment.material.color.set(value);
        //     });

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

        this.controls.maxPolarAngle = Math.PI / 1.8;
        this.controls.minPolarAngle = Math.PI / 3.5;

        // this.gui
        //     .add(this.guiConf.autoRotation, "autoRotate")
        //     .onChange((value) => {
        //         console.log(value);
        //         this.controls.autoRotate = value !== false;
        //     });

        // handle resize
        window.addEventListener("resize", () => this.onWindowResize(), false);
    }

    loadModel() {
        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();
        loader.load(model, (model) => {
            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.position.y = 0.1;
                    object.castShadow = true;
                    object.material.side = 2;
                    object.material.shadowSide = 1;
                    object.material.metalness = 0;
                    object.material.opacity = this.guiConf.opacity.opacity;
                    object.material.depthFunc = false;
                    object.material.depthWrite = !this.guiConf.opacity.transparent;
                    object.material.transparent = this.guiConf.opacity.transparent;
                    object.material.color.set(this.colorPicker.getHexNumber());
                    object.material.color.convertSRGBToLinear();

                    if (!this.guiConf.opacity.transparent) {
                        object.material.side = null;
                        object.material.shadowSide = null;
                    }

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
                    object.material.needsUpdate = false;

                    if (this.guiConf.opacity.transparent) {
                        object.material.envMap = cubeMap;
                    }

                    // if initial glass state is true
                    if (this.guiConf.glossy.glass) {
                        this.glassOptions(object.material);
                    }

                    // color change
                    this.colorPicker.onChange(() => {
                        object.material.color.set(this.colorPicker.getHexNumber());
                        this.colorPreview.innerHTML = this.colorPicker.getHexString();
                    });

                    // opacity change
                    this.opacityInput.value = this.guiConf.opacity.opacity * 100;
                    this.opacityInput.addEventListener("input", () => {
                        object.material.opacity = this.opacityInput.value / 100;
                        this.opacityPreview.innerHTML = `${this.opacityInput.value}%`;
                    });

                    // transparency change
                    this.transparentInputs.forEach((input) => {
                        input.addEventListener("change", () => {
                            object.material.transparent = input.value === "transparent";
                            object.material.depthWrite = input.value !== "transparent";

                            object.material.envMap = input.value !== "transparent" ? null : cubeMap;
                            object.material.side = input.value !== "transparent" ? null : 2;
                            object.material.shadowSide = input.value !== "transparent" ? null : 1;

                            object.material.needsUpdate = true;
                        });
                    });

                    // finish change
                    this.finishInputs.forEach((input) => {
                        input.addEventListener("change", () => {
                            if (input.value === "clear") {
                                this.glassOptions(object.material);
                            } else {
                                this.matteOptions(object.material);
                            }
                        });
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
