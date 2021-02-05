import * as THREE from "three";
import ColorPicker from "simple-color-picker";
import gsap from "gsap";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelControllerEnvironment {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container-environment",
            download: ".js-download-image",

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

        // config
        this.config = {
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
            finish: {
                clear: true,
            },
            environment: {
                showEnvironment: true,
                color: "#0005a0",
            },
        };
    }

    /**
     * main init - all dom elements and method calls
     */
    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            console.log("GLTFModelController init()");

            THREE.Cache.enabled = true;

            this.colorWrapper = document.querySelector(this.DOM.colorWrapper);
            this.colorInput = this.colorWrapper.querySelector(this.DOM.colorInput);
            this.colorPreview = this.colorWrapper.querySelector(this.DOM.colorPreview);

            this.opacityWrapper = document.querySelector(this.DOM.opacityWrapper);
            this.opacityInput = this.opacityWrapper.querySelector(this.DOM.opacityInput);
            this.opacityPreview = this.opacityWrapper.querySelector(this.DOM.opacityPreview);

            this.transparentWrapper = document.querySelector(this.DOM.transparentWrapper);
            this.transparentInputs = this.transparentWrapper.querySelectorAll("input");

            // preset transparency radio btns
            this.transparentInputs.forEach((input) => {
                if (this.config.opacity.transparent && input.value === "transparent") {
                    input.checked = true;
                    this.opacityWrapper.style.display = "";
                } else if (!this.config.opacity.transparent && input.value === "tinted") {
                    input.checked = true;
                    this.opacityWrapper.style.display = "none";
                }
            });

            this.finishWrapper = document.querySelector(this.DOM.finishWrapper);
            this.finishInputs = this.finishWrapper.querySelectorAll("input");

            // preset finish radio btns
            this.finishInputs.forEach((input) => {
                if (this.config.finish.clear && input.value === "clear") {
                    input.checked = true;
                } else if (!this.config.finish.clear && input.value === "matte") {
                    input.checked = true;
                }
            });

            this.colorPicker = new ColorPicker();
            this.colorPicker.appendTo(this.colorInput);

            // preset color picker
            this.colorPicker.setColor(this.config.color.color);

            this.width = this.modelContainer.offsetWidth;
            this.height = this.modelContainer.offsetHeight;

            this.isPlaying = false;

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

            this.cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
            this.cubeMap.format = THREE.RGBFormat;
            this.cubeMap.encoding = THREE.sRGBEncoding;

            this.initCamera();
            this.initScene();
            this.initLights();
            this.initEnvironment();
            this.initRenderer();
            this.initControls();
            this.initModel();

            // this will remove model and stop animation and after 3s will create new model
            // setTimeout(() => {
            //     this.clearModel();
            // }, 3000);

            // handle resize
            window.addEventListener("resize", () => this.onWindowResize(), false);

            this.downloadAnchor = document.querySelector(this.DOM.download);
            this.downloadAnchor.addEventListener("click", (ev) => {
                ev.preventDefault();
                this.saveImage(ev.currentTarget);
            });
        }
    }

    /**
     * camera setup
     */
    initCamera() {
        this.camera = new THREE.PerspectiveCamera(
            35,
            this.width / this.height,
            0.5,
            600,
        );
        this.camera.position.set(10, 10, 40);
    }

    /**
     * scene setup
     */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
    }

    /**
     * lights setup - because of performance > all in one object
     */
    initLights() {
        const lightWrapper = new THREE.Object3D();
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
        hemiLight.position.set(0, 200, 0);
        lightWrapper.add(hemiLight);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.ambientLight.matrixAutoUpdate = false;
        lightWrapper.add(this.ambientLight);

        // this is just back light - without it back side of model would be barely visible
        this.dirSubLight = new THREE.DirectionalLight(0xcccccc, 3);
        this.dirSubLight.position.set(-20, 20, -20);
        this.dirSubLight.matrixAutoUpdate = false;
        lightWrapper.add(this.dirSubLight);

        this.dirLight = new THREE.DirectionalLight(0xdddddd, this.config.light.lightIntensity);
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
        lightWrapper.add(this.dirLight);
        this.scene.add(lightWrapper);
    }

    /**
     * environment setup - box geometry
     */
    initEnvironment() {
        this.environment = new THREE.Mesh(
            new THREE.BoxBufferGeometry(100, 100, 100),
            new THREE.MeshStandardMaterial({
                depthWrite: false,
                refractionRatio: 0,
                roughness: 1,
                side: THREE.BackSide,
            }),
        );

        this.environment.position.y = 50;
        this.environment.receiveShadow = true;
        this.environment.material.color.set(this.config.environment.color);
        this.scene.add(this.environment);

        if (!this.config.environment.showEnvironment) {
            this.environment.visible = false;
        }
    }

    /**
     * renderer setup
     */
    initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            depth: false,
            powerPreference: "high-performance",
            preserveDrawingBuffer: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        // this.renderer.gammaFactor = 2.2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.physicallyCorrectLights = true;
        this.renderer.shadowMap.type = THREE.PCFShadowMap;
        this.modelContainer.appendChild(this.renderer.domElement);
    }

    /**
     * orbit controls setup
     */
    initControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.controls.target.set(0, 10, 0);
        this.controls.autoRotate = this.config.autoRotation.autoRotate;
        this.controls.autoRotateSpeed = 1;
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.1;

        this.controls.maxPolarAngle = Math.PI / 1.8;
        this.controls.minPolarAngle = Math.PI / 3.5;
    }

    /**
     * model setup and load call
     */
    initModel() {
        this.isPlaying = true;
        this.animate();

        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();
        this.model = null;
        loader.load(model, (model) => {
            model.scene.traverse((object) => {
                this.loadModel(object);
            });
            this.model = model.scene;

            model.scene.name = "3d-model";

            this.scene.add(model.scene);
            this.dirLight.updateMatrix();
            this.dirSubLight.updateMatrix();
            this.ambientLight.updateMatrix();
        });
    }

    /**
     * moadel loading and controller call
     * @param [object] object
     */
    loadModel(object) {
        if (object.isMesh) {
            object.position.y = 0.1;
            object.castShadow = true;
            object.material.side = 2;
            object.material.shadowSide = 1;
            object.material.metalness = 0;
            object.material.opacity = this.config.opacity.opacity;
            object.material.depthFunc = false;
            object.material.depthWrite = !this.config.opacity.transparent;
            object.material.transparent = this.config.opacity.transparent;
            object.material.color.set(this.colorPicker.getHexNumber());
            object.material.color.convertSRGBToLinear();

            if (!this.config.opacity.transparent) {
                object.material.side = null;
                object.material.shadowSide = null;
            }

            object.matrixAutoUpdate = false;
            object.material.needsUpdate = false;

            if (this.config.opacity.transparent) {
                object.material.envMap = this.cubeMap;
            }

            // if initial glass state is true
            if (this.config.finish.clear) {
                this.clearOptions(object.material);
            }

            this.filtersController(object);

            this.revealAnimation(object);
        }
    }

    revealAnimation(object) {
        object.scale.set(0.001, 0.001, 0.001);
        object.rotation.y = -4.5;
        object.updateMatrix();

        setTimeout(() => {
            gsap.to(object.rotation, {
                duration: 1,
                ease: "power3.out",
                y: 0,
            });

            gsap.to(object.scale, {
                duration: 1,
                ease: "elastic.out(1, 0.5)",
                x: 1,
                y: 1,
                z: 1,
                onUpdate: () => {
                    object.updateMatrix();
                },
            });
        }, 600);
    }

    /**
     * filters controller
     * @param [object] object
     */
    filtersController(object) {
        // color change
        this.colorPicker.onChange(() => {
            object.material.color.set(this.colorPicker.getHexNumber());
            this.colorPreview.innerHTML = this.colorPicker.getHexString();
        });

        // opacity change
        this.opacityInput.value = this.config.opacity.opacity * 100;
        this.opacityInput.addEventListener("input", () => {
            object.material.opacity = this.opacityInput.value / 100;
            this.opacityPreview.innerHTML = `${this.opacityInput.value}%`;
        });

        // transparency change
        this.transparentInputs.forEach((input) => {
            input.addEventListener("change", () => {
                object.material.transparent = input.value === "transparent";
                object.material.depthWrite = input.value !== "transparent";
                this.opacityWrapper.style.display = input.value === "transparent" ? "" : "none";

                object.material.envMap = input.value !== "transparent" ? null : this.cubeMap;
                object.material.side = input.value !== "transparent" ? null : 2;
                object.material.shadowSide = input.value !== "transparent" ? null : 1;

                object.material.needsUpdate = true;
            });
        });

        // finish change
        this.finishInputs.forEach((input) => {
            input.addEventListener("change", () => {
                if (input.value === "clear") {
                    this.clearOptions(object.material);
                } else {
                    this.matteOptions(object.material);
                }
            });
        });
    }

    /**
     * finish clear method
     * @param material
     */
    clearOptions(material) {
        material.refractionRatio = 1;
        material.reflectivity = 1;
        material.roughness = 0;
        material.clearcoat = 1;
        material.clearcoatRoughness = 0;
    }

    /**
     * finish matte method
     * @param material
     */
    matteOptions(material) {
        material.refractionRatio = 0;
        material.reflectivity = 0;
        material.roughness = 0.5;
        material.clearcoat = 0;
        material.clearcoatRoughness = 0.5;
    }

    /**
     *
     */
    onWindowResize() {
        this.camera.aspect = this.modelContainer.offsetWidth / this.modelContainer.offsetHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(this.modelContainer.offsetWidth, this.modelContainer.offsetHeight);
    }

    /**
     * requestAnimationFrame
     */
    animate() {
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
        if (this.renderer != null && this.isPlaying) {
            requestAnimationFrame(() => this.animate());
        }
    }

    /**
     * will remove model from scene and clear all props
     */
    clearModel() {
        console.log(this.scene);
        this.isPlaying = false;
        this.scene.remove(this.model);
        this.renderer.render(this.scene, this.camera);
        this.resetFilters();

        setTimeout(() => {
            this.initModel();

            setTimeout(() => {
                this.clearModel();
            }, 5000);
        }, 3000);
    }

    /**
     * will reset configurator filters
     */
    resetFilters() {
        // reset transparency radio btns
        this.transparentInputs.forEach((input) => {
            if (this.config.opacity.transparent && input.value === "transparent") {
                input.checked = true;
                this.opacityWrapper.style.display = "";
            } else if (!this.config.opacity.transparent && input.value === "tinted") {
                input.checked = true;
                this.opacityWrapper.style.display = "none";
            }
        });

        // reset finish radio btns
        this.finishInputs.forEach((input) => {
            if (this.config.finish.clear && input.value === "clear") {
                input.checked = true;
            } else if (!this.config.finish.clear && input.value === "matte") {
                input.checked = true;
            }
        });

        // reset color picker
        this.colorPicker.setColor(this.config.color.color);

        // reset download btn
        this.downloadAnchor.dataset.empty = true;
    }

    /**
     *
     */
    saveImage(anchor) {
        if (anchor == null) {
            return;
        }

        const strDownloadMime = "image/octet-stream";
        const strMime = "image/jpeg";
        const imgData = this.renderer.domElement.toDataURL(strMime);
        const link = document.createElement("a");
        document.body.appendChild(link);
        link.download = "model-preview.jpg";
        link.href = imgData.replace(strMime, strDownloadMime);
        link.click();
        document.body.removeChild(link);
    }
}
