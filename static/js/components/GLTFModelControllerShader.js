import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelControllerShader {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container-shader",
            states: {},
        };

        this.modelContainer = document.querySelector(this.DOM.modelContainer);

        this.scene;
        this.camera;
        this.renderer;
        this.controls;
        this.mixer;
        this.clock = new THREE.Clock();

        this.gui = new dat.GUI({
            name: "Bottle config",
        });

        this.guiConf = {
            light: {
                lightIntensity: 0.8,
            },
            color: {
                color: "#0fb3a0",
            },
            autoRotation: {
                autoRotate: false,
            },
            opacity: {
                transparent: false,
                opacity: 0.5,
            },
            glossy: {
                glass: true,
                emissiveColor: "#000000",
            },
        };
    }

    init() {
        console.log("GLTFModelController init()");

        if (this.modelContainer !== null) {
            this.initFBXModel();
            this.animate();
        }
    }

    initFBXModel() {
        const path =
            "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/winter-hdri_";
        const format = ".png";
        const order = ["px", "nx", "py", "ny", "pz", "nz"];
        const urls = [];
        order.forEach(side => {
            urls.push(`${path}${side}${format}`);
        });
        const textureCube = new THREE.CubeTextureLoader().load(urls);
        textureCube.format = THREE.RGBFormat;

        // camera
        this.camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.5,
            1000,
        );
        this.camera.position.set(48, 32, 32);

        // scene
        this.scene = new THREE.Scene();
        // this.scene.background = new THREE.Color(0xa0a0a0);
        this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 400);

        this.scene.background = textureCube;

        // lights
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
        hemiLight.position.set(0, 200, 0);
        this.scene.add(hemiLight);

        this.dirLight = new THREE.DirectionalLight(0xcccccc, this.guiConf.light.lightIntensity);
        this.dirLight.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z);
        this.dirLight.castShadow = true;
        this.dirLight.shadow.camera.top = 180;
        this.dirLight.shadow.camera.bottom = -100;
        this.dirLight.shadow.camera.left = -120;
        this.dirLight.shadow.camera.right = 120;
        this.dirLight.shadow.mapSize.width = 2048;
        this.dirLight.shadow.mapSize.height = 2048;
        this.scene.add(this.dirLight);

        this.gui
            .add(this.guiConf.light, "lightIntensity", 0, 1, 0.01)
            .onChange((value) => {
                this.dirLight.intensity = value;
            });

        // shader config
        const shader = {
            uniforms: {
                mRefractionRatio: { value: 1.02 },
                mFresnelBias: { value: 0.1 },
                mFresnelPower: { value: 2.0 },
                mFresnelScale: { value: 1.0 },
                tCube: { value: null },
            },
            vertexShader: document.querySelector("#shader-vertex").textContent,
            fragmentShader: document.querySelector("#shader-fragment").textContent,
        };

        const uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms["tCube"].value = textureCube;

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader,
        });

        // get model
        let model = this.modelContainer.getAttribute("data-model-source");

        // loader
        const loader = new GLTFLoader();
        loader.load(model, (model) => {
            // dynamically change material
            // let material = new THREE.MeshPhysicalMaterial({
            //     color: this.guiConf.color.color,
            // });

            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;

                    object.position.y = 0.1;
                    // object.material.side = THREE.DoubleSide;
                    // object.material.shadowSide = 2;
                    // object.material.metalness = 0;
                    // object.material.opacity = this.guiConf.opacity.opacity;
                    // object.material.emissive.set(this.guiConf.glossy.emissiveColor);

                    // const initMaterial = object.material;

                    // if (this.guiConf.opacity.transparent === false) {
                    object.material = material;
                    // } else {
                    //     object.material = initMaterial;
                    // }

                    // if (this.guiConf.glossy.glass) {
                    //     object.material.refractionRatio = 1;
                    //     object.material.reflectivity = 1;
                    //     object.material.roughness = 0;
                    //     object.material.clearcoat = 1;
                    //     object.material.clearcoatRoughness = 0;
                    // }

                    // this.gui
                    //     .addColor(this.guiConf.color, "color")
                    //     .onChange((colorValue) => {
                    //         object.material.color.set(colorValue);
                    //     });

                    // this.gui
                    //     .add(this.guiConf.opacity, "transparent")
                    //     .onChange((value) => {
                    //         if (value === false) {
                    //             object.material = material;
                    //         } else {
                    //             object.material = initMaterial;
                    //         }
                    //
                    //         if (this.guiConf.glossy.glass) {
                    //             object.material.refractionRatio = 1;
                    //             object.material.reflectivity = 1;
                    //             object.material.roughness = 0;
                    //             object.material.clearcoat = 1;
                    //             object.material.clearcoatRoughness = 0;
                    //         }
                    //     });

                    // this.gui
                    //     .add(this.guiConf.opacity, "opacity", 0.25, 0.75, 0.01)
                    //     .onChange((opacityValue) => {
                    //         object.material.opacity = opacityValue;
                    //     });

                    // this.gui
                    //     .addColor(this.guiConf.glossy, "emissiveColor")
                    //     .onChange((colorValue) => {
                    //         object.material.emissive.set(colorValue);
                    //     });

                    // this.gui
                    //     .add(this.guiConf.glossy, "glass")
                    //     .onChange((value) => {
                    //         if (value) {
                    //             object.material.refractionRatio = 1;
                    //             object.material.reflectivity = 1;
                    //             object.material.roughness = 0;
                    //             object.material.clearcoat = 1;
                    //             object.material.clearcoatRoughness = 0;
                    //         } else {
                    //             object.material.refractionRatio = 0;
                    //             object.material.reflectivity = 0;
                    //             object.material.roughness = 0.5;
                    //             object.material.clearcoat = 0;
                    //             object.material.clearcoatRoughness = 0.5;
                    //         }
                    //     });
                }
            });

            this.scene.add(model.scene);
        });

        this.scene.matrixAutoUpdate = false;

        // renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.modelContainer.appendChild(this.renderer.domElement);

        // orbit controls
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        this.controls.target.set(0, 10, 0);
        this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
        this.controls.autoRotateSpeed = 1;

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

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
