import * as THREE from "three";
import gsap from "gsap";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";

export default class SofaModel {
    constructor() {
        this.DOM = {
            modelContainer: ".js-sofa-model-container",
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
        this.scene.background = new THREE.Color(0xbbbbbb);

        // ground grid
        const grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
        grid.material.opacity = 0.1;
        grid.material.transparent = true;
        this.scene.add(grid);

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
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.modelContainer.appendChild(this.renderer.domElement);

        const environment = new RoomEnvironment();
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.scene.environment = this.pmremGenerator.fromScene(environment).texture;

        // loader
        this.loadModel();

        // orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1, 0);
        this.controls.autoRotateSpeed = 1;
        this.controls.enableDamping = true;
        this.controls.minDistance = 4;
        this.controls.maxDistance = 30;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minPolarAngle = 0;
        this.controls.update();
    }

    loadModel() {
        const basecolor = this.texture.load("static/images/lion-texture/basecolor.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const ambientOcclusion = this.texture.load("static/images/lion-texture/ambientOcclusion.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const height = this.texture.load("static/images/lion-texture/height.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const metallic = this.texture.load("static/images/lion-texture/metallic.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const normal = this.texture.load("static/images/lion-texture/normal.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const roughness = this.texture.load("static/images/lion-texture/roughness.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const sheencolor = this.texture.load("static/images/lion-texture/sheencolor.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const sheenopacity = this.texture.load("static/images/lion-texture/sheenopacity.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        const sheenroughness = this.texture.load("static/images/lion-texture/sheenroughness.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        // MeshLambertMaterial and MeshPhongMaterial
        const specular = this.texture.load("static/images/lion-texture/specular.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        // MeshLambertMaterial and MeshPhongMaterial
        const specularLevel = this.texture.load("static/images/lion-texture/specularLevel.jpg", (tex) => {
            tex.encoding = THREE.sRGBEncoding;
        });

        let material = new THREE.MeshStandardMaterial({
            map: basecolor,
            aoMap: ambientOcclusion,
            normalMap: normal,
            displacementMap: height,
            roughnessMap: roughness,
            displacementScale: 0.1,
            metalnessMap: metallic,
            flatShading: false,
        });

        material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
        material.aoMap.wrapS = material.aoMap.wrapT = THREE.RepeatWrapping;
        material.displacementMap.wrapS = material.displacementMap.wrapT = THREE.RepeatWrapping;
        material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping;
        // material.roughnessMap.wrapS = material.roughnessMap.wrapT = THREE.RepeatWrapping;

        material.map.repeat.set(0.1, 0.1);
        material.aoMap.repeat.set(0.1, 0.1);
        material.displacementMap.repeat.set(0.1, 0.1);
        material.normalMap.repeat.set(0.1, 0.1);
        // material.roughnessMap.repeat.set(0.1, 0.1);

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
                    object.receiveShadow = true;
                    object.material.color.convertSRGBToLinear();

                    // initial material setup
                    object.material = material;

                    object.material.sheen = 0x000000;
                    object.material.sheenRoughness = 1;
                    object.material.sheenExposure = 10;

                    // object.material.sheenEoughness = sheenroughness;

                    console.log(object.material);
                }
            });

            this.scene.add(model.scene);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.camera);
        this.controls.update();
    }
}
