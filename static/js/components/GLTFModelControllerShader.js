import * as THREE from "three";
import * as dat from "dat.gui";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFModelControllerShader {
    constructor() {
        this.DOM = {
            modelContainer: ".js-model-container-shader",
        };
    }

    init() {
        this.modelContainer = document.querySelector(this.DOM.modelContainer);
        if (this.modelContainer !== null) {
            console.log("GLTFModelControllerShader init()");

            this.gui = new dat.GUI({
                name: "Bottle config",
            });

            this.guiConf = {
                autoRotation: {
                    autoRotate: true,
                },
            };

            this.initFBXModel();
            this.animate();
        }
    }

    initFBXModel() {
        // environment
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
        this.camera.position.set(48, 20, 32);

        // scene
        this.scene = new THREE.Scene();
        this.scene.background = textureCube;
        this.scene.matrixAutoUpdate = false;

        // shaders config
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

        // glass material
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
            model.scene.traverse((object) => {
                if (object.isMesh) {
                    object.position.y = 0.1;
                    object.material = material;
                }
            });

            this.scene.add(model.scene);
        });

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
                this.controls.autoRotate = value !== false;
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
