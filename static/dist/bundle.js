(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var dat = _interopRequireWildcard(require("dat.gui"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GLTFModelController = /*#__PURE__*/function () {
  function GLTFModelController() {
    _classCallCheck(this, GLTFModelController);

    this.DOM = {
      modelContainer: ".js-model-container"
    };
  }

  _createClass(GLTFModelController, [{
    key: "init",
    value: function init() {
      this.modelContainer = document.querySelector(this.DOM.modelContainer);

      if (this.modelContainer !== null) {
        console.log("GLTFModelController init()");
        this.width = this.modelContainer.offsetWidth;
        this.height = this.modelContainer.offsetHeight;
        THREE.Cache.enabled = true; // gui

        this.gui = new dat.GUI({
          name: "Bottle config"
        }); // gui config

        this.guiConf = {
          light: {
            lightIntensity: 6
          },
          color: {
            color: "#0005a0"
          },
          autoRotation: {
            autoRotate: true
          },
          opacity: {
            transparent: true,
            opacity: 0.3
          },
          glossy: {
            glass: true,
            emissiveColor: "#1e0f0f"
          },
          grid: {
            showGrid: false
          }
        };
        this.initFBXModel();
        this.animate();
      }
    }
  }, {
    key: "initFBXModel",
    value: function initFBXModel() {
      var _this = this;

      // camera
      this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 400);
      this.camera.position.set(35, 10, 32); // scene

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff); // this.scene.background = new THREE.Color(0xa0a0a0);
      // this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 400);
      // lights

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
      hemiLight.position.set(0, 200, 0);
      this.scene.add(hemiLight);
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.ambientLight.matrixAutoUpdate = false;
      this.scene.add(this.ambientLight); // this is just back light - without it back side of model would be barely visible

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
      this.scene.add(this.dirLight); // add gui for light intensity

      this.gui.add(this.guiConf.light, "lightIntensity", 1, 10, 0.1).onChange(function (value) {
        _this.dirLight.intensity = value;
      }); // ground
      // const mesh = new THREE.Mesh(
      //     new THREE.PlaneBufferGeometry(1000, 1000, 1, 1),
      //     new THREE.MeshPhongMaterial({ color: 0xeeeeee, depthWrite: false }),
      // );
      // mesh.material.color.convertSRGBToLinear();
      // mesh.rotation.x = -Math.PI / 2;
      // mesh.receiveShadow = true;
      // this.scene.add(mesh);
      // ground grid

      var grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
      grid.material.opacity = 0.1;
      grid.material.transparent = true;
      this.scene.add(grid);

      if (!this.guiConf.grid.showGrid) {
        grid.visible = false;
      } // add gui for grid


      this.gui.add(this.guiConf.grid, "showGrid").onChange(function (value) {
        grid.visible = !!value;
      }); // renderer

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        depth: false,
        powerPreference: "high-performance"
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.gammaFactor = 2.2;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.modelContainer.appendChild(this.renderer.domElement); // loader

      this.loadModel(); // orbit controls

      this.controls = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 10, 0);
      this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
      this.controls.autoRotateSpeed = 1;
      this.controls.enableZoom = false;
      this.controls.enablePan = false; // this.controls.maxPolarAngle = Math.PI / 2;
      // this.controls.minPolarAngle = Math.PI / 3;

      this.gui.add(this.guiConf.autoRotation, "autoRotate").onChange(function (value) {
        console.log(value);
        _this.controls.autoRotate = value !== false;
      }); // handle resize

      window.addEventListener("resize", function () {
        return _this.onWindowResize();
      }, false);
    }
  }, {
    key: "loadModel",
    value: function loadModel() {
      var _this2 = this;

      // get model
      var model = this.modelContainer.getAttribute("data-model-source"); // loader

      var loader = new _GLTFLoader.GLTFLoader();
      loader.load(model, function (model) {
        // dynamically change material
        var material = new THREE.MeshPhysicalMaterial({
          color: _this2.guiConf.color.color,
          depthFunc: false
        });
        material.color.convertSRGBToLinear();
        model.scene.traverse(function (object) {
          if (object.isMesh) {
            object.position.y = 0.1;
            object.castShadow = true;
            object.material.side = 2;
            object.material.shadowSide = 1;
            object.material.metalness = 0;
            object.material.opacity = _this2.guiConf.opacity.opacity;
            object.material.emissive.set(_this2.guiConf.glossy.emissiveColor);
            object.material.depthFunc = false;
            object.material.color.convertSRGBToLinear();
            object.matrixAutoUpdate = false; // reflection map

            var path = "/three.js-playground/static/images/maps/";
            var mapUrls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];
            var cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
            cubeMap.format = THREE.RGBFormat;
            cubeMap.encoding = THREE.sRGBEncoding;
            object.material.envMap = cubeMap;
            object.material.needsUpdate = false; // store material

            var initMaterial = object.material; // initial material setup

            if (_this2.guiConf.opacity.transparent === false) {
              object.material = material;
            } else {
              object.material = initMaterial;
            } // if initial glass state is true


            if (_this2.guiConf.glossy.glass) {
              _this2.glassOptions(object.material);
            }

            _this2.gui.addColor(_this2.guiConf.color, "color").onChange(function (colorValue) {
              object.material.color.set(colorValue);
            });

            _this2.gui.add(_this2.guiConf.opacity, "transparent").onChange(function (value) {
              if (value === false) {
                object.material = material;
              } else {
                object.material = initMaterial;
              }

              if (_this2.guiConf.glossy.glass) {
                _this2.glassOptions(object.material);
              }
            });

            _this2.gui.add(_this2.guiConf.opacity, "opacity", 0.25, 0.75, 0.01).onChange(function (opacityValue) {
              object.material.opacity = opacityValue;
            });

            _this2.gui.addColor(_this2.guiConf.glossy, "emissiveColor").onChange(function (colorValue) {
              object.material.emissive.set(colorValue);
            });

            _this2.gui.add(_this2.guiConf.glossy, "glass").onChange(function (value) {
              if (value) {
                _this2.glassOptions(object.material);
              } else {
                _this2.matteOptions(object.material);
              }
            });
          }
        });

        _this2.scene.add(model.scene);

        _this2.dirLight.updateMatrix();

        _this2.dirSubLight.updateMatrix();

        _this2.ambientLight.updateMatrix();
      });
    }
  }, {
    key: "glassOptions",
    value: function glassOptions(material) {
      material.refractionRatio = 1;
      material.reflectivity = 1;
      material.roughness = 0;
      material.clearcoat = 1;
      material.clearcoatRoughness = 0;
    }
  }, {
    key: "matteOptions",
    value: function matteOptions(material) {
      material.refractionRatio = 0;
      material.reflectivity = 0;
      material.roughness = 0.5;
      material.clearcoat = 0;
      material.clearcoatRoughness = 0.5;
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      requestAnimationFrame(function () {
        return _this3.animate();
      });
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }
  }]);

  return GLTFModelController;
}();

exports.default = GLTFModelController;

},{"dat.gui":"dat.gui","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],2:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var _simpleColorPicker = _interopRequireDefault(require("simple-color-picker"));

var _gsap = _interopRequireDefault(require("gsap"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GLTFModelControllerEnvironment = /*#__PURE__*/function () {
  function GLTFModelControllerEnvironment() {
    _classCallCheck(this, GLTFModelControllerEnvironment);

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
      finishWrapper: ".js-finish"
    }; // config

    this.config = {
      light: {
        lightIntensity: 6
      },
      color: {
        color: "#0005a0"
      },
      autoRotation: {
        autoRotate: true
      },
      opacity: {
        transparent: false,
        opacity: 0.3
      },
      finish: {
        clear: true
      },
      environment: {
        showEnvironment: true,
        color: "#0005a0"
      }
    };
  }
  /**
   * main init - all dom elements and method calls
   */


  _createClass(GLTFModelControllerEnvironment, [{
    key: "init",
    value: function init() {
      var _this = this;

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
        this.transparentInputs = this.transparentWrapper.querySelectorAll("input"); // preset transparency radio btns

        this.transparentInputs.forEach(function (input) {
          if (_this.config.opacity.transparent && input.value === "transparent") {
            input.checked = true;
            _this.opacityWrapper.style.display = "";
          } else if (!_this.config.opacity.transparent && input.value === "tinted") {
            input.checked = true;
            _this.opacityWrapper.style.display = "none";
          }
        });
        this.finishWrapper = document.querySelector(this.DOM.finishWrapper);
        this.finishInputs = this.finishWrapper.querySelectorAll("input"); // preset finish radio btns

        this.finishInputs.forEach(function (input) {
          if (_this.config.finish.clear && input.value === "clear") {
            input.checked = true;
          } else if (!_this.config.finish.clear && input.value === "matte") {
            input.checked = true;
          }
        });
        this.colorPicker = new _simpleColorPicker.default();
        this.colorPicker.appendTo(this.colorInput); // preset color picker

        this.colorPicker.setColor(this.config.color.color);
        this.width = this.modelContainer.offsetWidth;
        this.height = this.modelContainer.offsetHeight;
        this.isPlaying = false; // reflection map

        var path = "/three.js-playground/static/images/maps/";
        var mapUrls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];
        this.cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
        this.cubeMap.format = THREE.RGBFormat;
        this.cubeMap.encoding = THREE.sRGBEncoding;
        this.initCamera();
        this.initScene();
        this.initLights();
        this.initEnvironment();
        this.initRenderer();
        this.initControls();
        this.initModel(); // this will remove model and stop animation and after 3s will create new model
        // setTimeout(() => {
        //     this.clearModel();
        // }, 3000);
        // handle resize

        window.addEventListener("resize", function () {
          return _this.onWindowResize();
        }, false);
        this.downloadAnchor = document.querySelector(this.DOM.download);
        this.downloadAnchor.addEventListener("click", function (ev) {
          ev.preventDefault();

          _this.saveImage(ev.currentTarget);
        });
      }
    }
    /**
     * camera setup
     */

  }, {
    key: "initCamera",
    value: function initCamera() {
      this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 600);
      this.camera.position.set(10, 10, 40);
    }
    /**
     * scene setup
     */

  }, {
    key: "initScene",
    value: function initScene() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);
    }
    /**
     * lights setup - because of performance > all in one object
     */

  }, {
    key: "initLights",
    value: function initLights() {
      var lightWrapper = new THREE.Object3D();
      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
      hemiLight.position.set(0, 200, 0);
      lightWrapper.add(hemiLight);
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.ambientLight.matrixAutoUpdate = false;
      lightWrapper.add(this.ambientLight); // this is just back light - without it back side of model would be barely visible

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

  }, {
    key: "initEnvironment",
    value: function initEnvironment() {
      this.environment = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 100), new THREE.MeshStandardMaterial({
        depthWrite: false,
        refractionRatio: 0,
        roughness: 1,
        side: THREE.BackSide
      }));
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

  }, {
    key: "initRenderer",
    value: function initRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        depth: false,
        powerPreference: "high-performance",
        preserveDrawingBuffer: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.shadowMap.enabled = true; // this.renderer.gammaFactor = 2.2;

      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.modelContainer.appendChild(this.renderer.domElement);
    }
    /**
     * orbit controls setup
     */

  }, {
    key: "initControls",
    value: function initControls() {
      this.controls = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
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

  }, {
    key: "initModel",
    value: function initModel() {
      var _this2 = this;

      this.isPlaying = true;
      this.animate(); // get model

      var model = this.modelContainer.getAttribute("data-model-source"); // loader

      var loader = new _GLTFLoader.GLTFLoader();
      this.model = null;
      loader.load(model, function (model) {
        model.scene.traverse(function (object) {
          _this2.loadModel(object);
        });
        _this2.model = model.scene;
        model.scene.name = "3d-model";

        _this2.scene.add(model.scene);

        _this2.dirLight.updateMatrix();

        _this2.dirSubLight.updateMatrix();

        _this2.ambientLight.updateMatrix();
      });
    }
    /**
     * moadel loading and controller call
     * @param [object] object
     */

  }, {
    key: "loadModel",
    value: function loadModel(object) {
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
        } // if initial glass state is true


        if (this.config.finish.clear) {
          this.clearOptions(object.material);
        }

        this.filtersController(object);
        this.revealAnimation(object);
      }
    }
  }, {
    key: "revealAnimation",
    value: function revealAnimation(object) {
      object.scale.set(0.001, 0.001, 0.001);
      object.rotation.y = -4.5;
      object.updateMatrix();
      setTimeout(function () {
        _gsap.default.to(object.rotation, {
          duration: 1,
          ease: "power3.out",
          y: 0
        });

        _gsap.default.to(object.scale, {
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          x: 1,
          y: 1,
          z: 1,
          onUpdate: function onUpdate() {
            object.updateMatrix();
          }
        });
      }, 600);
    }
    /**
     * filters controller
     * @param [object] object
     */

  }, {
    key: "filtersController",
    value: function filtersController(object) {
      var _this3 = this;

      // color change
      this.colorPicker.onChange(function () {
        object.material.color.set(_this3.colorPicker.getHexNumber());
        _this3.colorPreview.innerHTML = _this3.colorPicker.getHexString();
      }); // opacity change

      this.opacityInput.value = this.config.opacity.opacity * 100;
      this.opacityInput.addEventListener("input", function () {
        object.material.opacity = _this3.opacityInput.value / 100;
        _this3.opacityPreview.innerHTML = "".concat(_this3.opacityInput.value, "%");
      }); // transparency change

      this.transparentInputs.forEach(function (input) {
        input.addEventListener("change", function () {
          object.material.transparent = input.value === "transparent";
          object.material.depthWrite = input.value !== "transparent";
          _this3.opacityWrapper.style.display = input.value === "transparent" ? "" : "none";
          object.material.envMap = input.value !== "transparent" ? null : _this3.cubeMap;
          object.material.side = input.value !== "transparent" ? null : 2;
          object.material.shadowSide = input.value !== "transparent" ? null : 1;
          object.material.needsUpdate = true;
        });
      }); // finish change

      this.finishInputs.forEach(function (input) {
        input.addEventListener("change", function () {
          if (input.value === "clear") {
            _this3.clearOptions(object.material);
          } else {
            _this3.matteOptions(object.material);
          }
        });
      });
    }
    /**
     * finish clear method
     * @param material
     */

  }, {
    key: "clearOptions",
    value: function clearOptions(material) {
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

  }, {
    key: "matteOptions",
    value: function matteOptions(material) {
      material.refractionRatio = 0;
      material.reflectivity = 0;
      material.roughness = 0.5;
      material.clearcoat = 0;
      material.clearcoatRoughness = 0.5;
    }
    /**
     *
     */

  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.aspect = this.modelContainer.offsetWidth / this.modelContainer.offsetHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.modelContainer.offsetWidth, this.modelContainer.offsetHeight);
    }
    /**
     * requestAnimationFrame
     */

  }, {
    key: "animate",
    value: function animate() {
      var _this4 = this;

      this.renderer.render(this.scene, this.camera);
      this.controls.update();

      if (this.renderer != null && this.isPlaying) {
        requestAnimationFrame(function () {
          return _this4.animate();
        });
      }
    }
    /**
     * will remove model from scene and clear all props
     */

  }, {
    key: "clearModel",
    value: function clearModel() {
      var _this5 = this;

      console.log(this.scene);
      this.isPlaying = false;
      this.scene.remove(this.model);
      this.renderer.render(this.scene, this.camera);
      this.resetFilters();
      setTimeout(function () {
        _this5.initModel();

        setTimeout(function () {
          _this5.clearModel();
        }, 5000);
      }, 3000);
    }
    /**
     * will reset configurator filters
     */

  }, {
    key: "resetFilters",
    value: function resetFilters() {
      var _this6 = this;

      // reset transparency radio btns
      this.transparentInputs.forEach(function (input) {
        if (_this6.config.opacity.transparent && input.value === "transparent") {
          input.checked = true;
          _this6.opacityWrapper.style.display = "";
        } else if (!_this6.config.opacity.transparent && input.value === "tinted") {
          input.checked = true;
          _this6.opacityWrapper.style.display = "none";
        }
      }); // reset finish radio btns

      this.finishInputs.forEach(function (input) {
        if (_this6.config.finish.clear && input.value === "clear") {
          input.checked = true;
        } else if (!_this6.config.finish.clear && input.value === "matte") {
          input.checked = true;
        }
      }); // reset color picker

      this.colorPicker.setColor(this.config.color.color); // reset download btn

      this.downloadAnchor.dataset.empty = true;
    }
    /**
     *
     */

  }, {
    key: "saveImage",
    value: function saveImage(anchor) {
      if (anchor == null) {
        return;
      }

      var strDownloadMime = "image/octet-stream";
      var strMime = "image/jpeg";
      var imgData = this.renderer.domElement.toDataURL(strMime);
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = "model-preview.jpg";
      link.href = imgData.replace(strMime, strDownloadMime);
      link.click();
      document.body.removeChild(link);
    }
  }]);

  return GLTFModelControllerEnvironment;
}();

exports.default = GLTFModelControllerEnvironment;

},{"gsap":"gsap","simple-color-picker":"simple-color-picker","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],3:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var dat = _interopRequireWildcard(require("dat.gui"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GLTFModelControllerShader = /*#__PURE__*/function () {
  function GLTFModelControllerShader() {
    _classCallCheck(this, GLTFModelControllerShader);

    this.DOM = {
      modelContainer: ".js-model-container-shader"
    };
  }

  _createClass(GLTFModelControllerShader, [{
    key: "init",
    value: function init() {
      this.modelContainer = document.querySelector(this.DOM.modelContainer);

      if (this.modelContainer !== null) {
        console.log("GLTFModelControllerShader init()");
        THREE.Cache.enabled = true;
        this.gui = new dat.GUI({
          name: "Bottle config"
        });
        this.guiConf = {
          autoRotation: {
            autoRotate: true
          }
        };
        this.initFBXModel();
        this.animate();
      }
    }
  }, {
    key: "initFBXModel",
    value: function initFBXModel() {
      var _this = this;

      // environment
      var path = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1147877/winter-hdri_";
      var format = ".png";
      var order = ["px", "nx", "py", "ny", "pz", "nz"];
      var urls = [];
      order.forEach(function (side) {
        urls.push("".concat(path).concat(side).concat(format));
      });
      var textureCube = new THREE.CubeTextureLoader().load(urls);
      textureCube.format = THREE.RGBFormat; // camera

      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.5, 1000);
      this.camera.position.set(48, 20, 32); // scene

      this.scene = new THREE.Scene();
      this.scene.background = textureCube;
      this.scene.matrixAutoUpdate = false; // shaders config

      var shader = {
        uniforms: {
          mRefractionRatio: {
            value: 1.02
          },
          mFresnelBias: {
            value: 0.1
          },
          mFresnelPower: {
            value: 2.0
          },
          mFresnelScale: {
            value: 1.0
          },
          tCube: {
            value: null
          }
        },
        vertexShader: document.querySelector("#shader-vertex").textContent,
        fragmentShader: document.querySelector("#shader-fragment").textContent
      };
      var uniforms = THREE.UniformsUtils.clone(shader.uniforms);
      uniforms["tCube"].value = textureCube; // glass material

      var material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
      }); // get model

      var model = this.modelContainer.getAttribute("data-model-source"); // loader

      var loader = new _GLTFLoader.GLTFLoader();
      loader.load(model, function (model) {
        model.scene.traverse(function (object) {
          if (object.isMesh) {
            object.position.y = 0.1;
            object.material = material;
          }
        });

        _this.scene.add(model.scene);
      }); // renderer

      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.modelContainer.appendChild(this.renderer.domElement); // orbit controls

      this.controls = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 10, 0);
      this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
      this.controls.autoRotateSpeed = 1;
      this.gui.add(this.guiConf.autoRotation, "autoRotate").onChange(function (value) {
        _this.controls.autoRotate = value !== false;
      }); // handle resize

      window.addEventListener("resize", function () {
        return _this.onWindowResize();
      }, false);
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this2 = this;

      requestAnimationFrame(function () {
        return _this2.animate();
      });
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }
  }]);

  return GLTFModelControllerShader;
}();

exports.default = GLTFModelControllerShader;

},{"dat.gui":"dat.gui","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * "smart" navigation which goes off screen when scrolling down for a better overview of content and UX
 * navigation appears when scrolling up
 */
var NavigationController = /*#__PURE__*/function () {
  function NavigationController() {
    _classCallCheck(this, NavigationController);

    /**
     * Navigation DOM selectors
     * Navigation DOM state CSS classes
     * @type {{navigation: string, states: {navigationSlideUp: string, navigationScrolled: string, navigationFixed: string}}}
     */
    this.DOM = {
      navigation: ".js-navigation-wrapper",
      states: {
        navigationScrolled: "has-scrolled",
        navigationFixed: "is-fixed",
        navigationSlideUp: "slide-up"
      }
    };
    /**
     * flag, state variable for scrolling event
     * @type {boolean}
     */

    this.scrolling = false;
    /**
     * amount of pixels to scroll from top for adding "has-scrolled" state class
     * @type {number}
     */

    this.scrollNavigationOffset = 200;
    /**
     * variable for storing amount of scroll from top position value
     * @type {number}
     */

    this.previousTop = 0;
    /**
     * variable for storing current scroll position value
     * @type {number}
     */

    this.currentTop = 0;
    this.scrollDelta = 0;
    this.scrollOffset = 0;
    /**
     * fetch navigation element DOM element
     * @type {Element}
     */

    this.navigation = document.querySelector(this.DOM.navigation);
  } //region methods

  /**
   *
   */


  _createClass(NavigationController, [{
    key: "init",
    value: function init() {
      console.log("Navigation init()");

      if (this.navigation !== null) {
        this.navigationController();
      } else {
        console.error("".concat(this.DOM.navigation, " does not exist in the DOM!"));
      }
    }
    /**
     *
     */

  }, {
    key: "navigationController",
    value: function navigationController() {
      var _this = this;

      document.addEventListener("scroll", function () {
        if (!_this.scrolling) {
          _this.scrolling = true;

          if (!window.requestAnimationFrame) {
            setTimeout(_this.checkScroll(), 250);
          } else {
            requestAnimationFrame(function () {
              return _this.checkScroll();
            });
          }
        }
      });
    }
    /**
     *
     */

  }, {
    key: "checkScroll",
    value: function checkScroll() {
      /**
       *
       * @type {number}
       */
      var currentTop = window.pageYOffset | document.body.scrollTop;
      this.changeNavigationState(currentTop);
      this.previousTop = currentTop;
      this.scrolling = false;
    }
    /**
     *
     * @param currentTop
     */

  }, {
    key: "changeNavigationState",
    value: function changeNavigationState(currentTop) {
      if (currentTop > this.scrollNavigationOffset) {
        this.navigation.classList.add(this.DOM.states.navigationScrolled);
      } else {
        this.navigation.classList.remove(this.DOM.states.navigationScrolled);
      }

      if (this.previousTop >= currentTop) {
        this.scrollingUp(currentTop);
      } else {
        this.scrollingDown(currentTop);
      }
    }
    /**
     *
     * @param currentTop
     */

  }, {
    key: "scrollingUp",
    value: function scrollingUp(currentTop) {
      if (currentTop < this.scrollNavigationOffset) {
        this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
      } else if (this.previousTop - currentTop > this.scrollDelta) {
        this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
      }
    }
    /**
     *
     * @param currentTop
     */

  }, {
    key: "scrollingDown",
    value: function scrollingDown(currentTop) {
      if (currentTop > this.scrollNavigationOffset + this.scrollOffset) {
        this.navigation.classList.add(this.DOM.states.navigationSlideUp);
      } else if (currentTop > this.scrollNavigationOffset) {
        this.navigation.classList.remove(this.DOM.states.navigationSlideUp);
      }
    } //endregion

  }]);

  return NavigationController;
}();

exports.default = NavigationController;

},{}],5:[function(require,module,exports){
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var THREE = _interopRequireWildcard(require("three"));

var dat = _interopRequireWildcard(require("dat.gui"));

var _gsap = _interopRequireDefault(require("gsap"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

var _DRACOLoader = require("three/examples/jsm/loaders/DRACOLoader");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SofaModelController = /*#__PURE__*/function () {
  function SofaModelController() {
    _classCallCheck(this, SofaModelController);

    this.DOM = {
      modelContainer: ".js-sofa-container"
    };
  }

  _createClass(SofaModelController, [{
    key: "init",
    value: function init() {
      this.modelContainer = document.querySelector(this.DOM.modelContainer);

      if (this.modelContainer !== null) {
        console.log("GLTFModelController init()");
        this.width = this.modelContainer.offsetWidth;
        this.height = this.modelContainer.offsetHeight;
        THREE.Cache.enabled = true;
        this.texture = new THREE.TextureLoader(); // gui

        this.gui = new dat.GUI({
          name: "Sofa config"
        }); // gui config

        this.guiConf = {
          light: {
            lightIntensity: 10
          },
          autoRotation: {
            autoRotate: false
          },
          grid: {
            showGrid: true
          },
          material: "1"
        };
        this.initFBXModel();
        this.animate();
      }
    }
  }, {
    key: "initFBXModel",
    value: function initFBXModel() {
      var _this = this;

      // camera
      this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 400);
      this.camera.position.set(17, 10, 17); // scene

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff);
      this.ambientLight = new THREE.AmbientLight(0x404040, 1);
      this.scene.add(this.ambientLight);
      this.spotLight = new THREE.SpotLight(0xeeeeee, this.guiConf.light.lightIntensity);
      this.spotLight.position.set(5, 5, 5);
      this.spotLight.castShadow = true;
      this.spotLight.shadow.radius = 4;
      this.spotLight.shadow.bias = 0.0001;
      this.scene.add(this.spotLight); // add gui for light intensity

      this.gui.add(this.guiConf.light, "lightIntensity", 1, 30, 0.1).onChange(function (value) {
        _this.spotLight.intensity = value;
      }); // ground grid

      var grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
      grid.material.opacity = 0.1;
      grid.material.transparent = true;
      this.scene.add(grid);

      if (!this.guiConf.grid.showGrid) {
        grid.visible = false;
      } // add gui for grid


      this.gui.add(this.guiConf.grid, "showGrid").onChange(function (value) {
        grid.visible = !!value;
      }); // renderer

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance"
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.width, this.height);
      this.renderer.shadowMap.enabled = true;
      this.renderer.gammaFactor = 2.2;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.physicallyCorrectLights = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.modelContainer.appendChild(this.renderer.domElement); // loader

      this.loadModel(); // orbit controls

      this.controls = new _OrbitControls.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.target.set(0, 1, 0);
      this.controls.autoRotate = this.guiConf.autoRotation.autoRotate;
      this.controls.autoRotateSpeed = 1;
      this.gui.add(this.guiConf.autoRotation, "autoRotate").onChange(function (value) {
        _this.controls.autoRotate = value !== false;
      }); // handle resize

      window.addEventListener("resize", function () {
        return _this.onWindowResize();
      }, false);
    }
  }, {
    key: "loadModel",
    value: function loadModel() {
      var _this2 = this;

      this.mat1 = {
        base: this.texture.load("static/models/mat1/base.jpg"),
        height: this.texture.load("static/models/mat1/height.png"),
        ao: this.texture.load("static/models/mat1/ao.jpg"),
        norm: this.texture.load("static/models/mat1/norm.jpg"),
        rough: this.texture.load("static/models/mat1/rough.jpg")
      };
      this.mat2 = {
        base: this.texture.load("static/models/mat2/base.jpg"),
        height: this.texture.load("static/models/mat2/height.png"),
        ao: this.texture.load("static/models/mat2/ao.jpg"),
        norm: this.texture.load("static/models/mat2/norm.jpg"),
        rough: this.texture.load("static/models/mat2/rough.jpg")
      };
      this.mat3 = {
        base: this.texture.load("static/models/mat3/base.jpg"),
        height: this.texture.load("static/models/mat3/height.png"),
        ao: this.texture.load("static/models/mat3/ao.jpg"),
        norm: this.texture.load("static/models/mat3/norm.jpg"),
        rough: this.texture.load("static/models/mat3/rough.jpg")
      };
      this.mat4 = {
        base: this.texture.load("static/models/mat4/base.jpg"),
        height: this.texture.load("static/models/mat4/height.png"),
        ao: this.texture.load("static/models/mat4/ao.jpg"),
        norm: this.texture.load("static/models/mat4/norm.jpg"),
        rough: this.texture.load("static/models/mat4/rough.jpg")
      };
      var material = new THREE.MeshStandardMaterial({
        map: this.mat1.base,
        aoMap: this.mat1.ao,
        aoMapIntensity: 1,
        normalMap: this.mat1.norm,
        displacementMap: this.mat1.height,
        displacementScale: 0,
        roughnessMap: this.mat1.rough,
        metalness: 0,
        flatShading: false
      });
      var sphereMaterial = new THREE.MeshStandardMaterial({
        map: this.mat1.base,
        aoMap: this.mat1.ao,
        aoMapIntensity: 1,
        normalMap: this.mat1.norm,
        displacementMap: this.mat1.height,
        displacementScale: 0.025,
        roughnessMap: this.mat1.rough,
        metalness: 0,
        flatShading: false
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
      sphereMaterial.roughnessMap.repeat.set(4, 4); // get model

      var model = this.modelContainer.getAttribute("data-model-source"); // loader

      var loader = new _GLTFLoader.GLTFLoader();
      var dracoLoader = new _DRACOLoader.DRACOLoader();
      dracoLoader.setDecoderPath("draco/");
      loader.setDRACOLoader(dracoLoader);
      loader.load(model, function (model) {
        model.scene.position.x = -4;
        material.color.convertSRGBToLinear();
        model.scene.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            object.material.color.convertSRGBToLinear(); // initial material setup

            object.material = material;
          }
        });

        _this2.gui.add(_this2.guiConf, "material", {
          Material1: 1,
          Material2: 2,
          Material3: 3,
          Material4: 4
        }).onChange(function (value) {
          _this2.transformMaterial(value, material, sphereMaterial);
        });

        _this2.sphere(sphereMaterial);

        _this2.scene.add(model.scene);
      });
    }
  }, {
    key: "sphere",
    value: function sphere(material) {
      var geometry = new THREE.SphereGeometry(1.5, 400, 400);
      var sphere = new THREE.Mesh(geometry, material); // sphere.material.wireframe = true;

      sphere.position.set(4, 2, 0);
      this.scene.add(sphere);

      _gsap.default.to(sphere.rotation, {
        duration: 20,
        ease: "none",
        y: Math.PI * 2,
        repeat: -1
      });
    }
  }, {
    key: "transformMaterial",
    value: function transformMaterial(index, material, sphereMaterial) {
      var mat = null;

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
      material.displacementMap.wrapS = material.displacementMap.wrapT = sphereMaterial.displacementMap.wrapS = sphereMaterial.displacementMap.wrapT = THREE.RepeatWrapping;
      material.normalMap.wrapS = material.normalMap.wrapT = sphereMaterial.normalMap.wrapS = sphereMaterial.normalMap.wrapT = THREE.RepeatWrapping;
      material.roughnessMap.wrapS = material.roughnessMap.wrapT = sphereMaterial.roughnessMap.wrapS = sphereMaterial.roughnessMap.wrapT = THREE.RepeatWrapping;
      material.map.repeat.set(1, 1);
      material.aoMap.repeat.set(1, 1);
      material.displacementMap.repeat.set(1, 1);
      material.normalMap.repeat.set(1, 1);
      material.roughnessMap.repeat.set(1, 1); // sphereMaterial.map.repeat.set(4, 4);
      // sphereMaterial.aoMap.repeat.set(4, 4);
      // sphereMaterial.displacementMap.repeat.set(4, 4);
      // sphereMaterial.normalMap.repeat.set(4, 4);
      // sphereMaterial.roughnessMap.repeat.set(4, 4);
    }
  }, {
    key: "onWindowResize",
    value: function onWindowResize() {
      this.camera.aspect = this.width / this.height;
      this.renderer.setSize(this.width, this.height);
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      requestAnimationFrame(function () {
        return _this3.animate();
      });
      this.renderer.render(this.scene, this.camera);
      this.controls.update();
    }
  }]);

  return SofaModelController;
}();

exports.default = SofaModelController;

},{"dat.gui":"dat.gui","gsap":"gsap","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/DRACOLoader":"three/examples/jsm/loaders/DRACOLoader","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Grid helper
 * Show grid overlay when developing
 * Not included in production bundle JS file
 */
var GridHelper = /*#__PURE__*/function () {
  function GridHelper() {
    _classCallCheck(this, GridHelper);

    /**
     * Grid DOM selector
     * @type {{grid: string}}
     */
    this.DOM = {
      grid: "grid"
    };
    /**
     * Grid options
     * @type {{gutterFixed: boolean, initialDisplay: string, gridFixed: boolean, gutterWidth: number, gridColor: string, columnCount: number, gridWidth: number, columnBgColor: string}}
     */

    this.gridOptions = {
      initialDisplay: "none",
      // "flex" or "none"
      columnCount: 24,
      gridWidth: 1440,
      // px
      gridFixed: true,
      gutterWidth: 0,
      // px
      gutterFixed: false,
      gridColor: "rgb(255, 0, 255, 0.15)",
      columnBgColor: "rgb(255, 0, 255, 0.025)"
    };
    var consoleLogStyle = ["background-color: #a6a6a6", "color: black", "display: block", "line-height: 24px", "text-align: center", "border: 1px solid #ffffff", "font-weight: bold"].join(";");
    console.info("toggle grid: %c Alt/Option + G ", consoleLogStyle);
    this.grid = null;
    this.columnWidth = (this.gridOptions.gridWidth - (this.gridOptions.columnCount - 1) * this.gridOptions.gutterWidth) / this.gridOptions.columnCount;
    this.columnWidthPercentage = "".concat(this.columnWidth / this.gridOptions.gridWidth * 100, "%");
    this.gutterWidthPercentage = "".concat(this.gridOptions.gutterWidth / this.gridOptions.gridWidth * 100, "%");
  }

  _createClass(GridHelper, [{
    key: "init",
    value: function init() {
      console.log("GridHelper init()");
      this.initGrid();
      this.keyboardShortcut();
    }
  }, {
    key: "initGrid",
    value: function initGrid() {
      // create grid overlay element
      this.grid = document.createElement("div");
      this.grid.id = this.DOM.grid; // style grid element

      this.grid.style.cssText = "\n            pointer-events: none;\n            display: ".concat(this.gridOptions.initialDisplay, ";\n            flex-direction: row;\n            width: 100%;\n            height: 100%;\n            position: absolute;\n            top: 0;\n            left: 50%;\n            transform: translateX(-50%);\n            z-index: 999;\n        ");

      if (this.gridOptions.gridFixed === true) {
        this.grid.style.maxWidth = "".concat(this.gridOptions.gridWidth, "px");
      }

      if (!this.gridOptions.gutterWidth > 0) {
        this.grid.style.borderLeft = "none";
      } // add grid container to page


      document.body.appendChild(this.grid); // add columns to grid

      for (var i = 0; i < this.gridOptions.columnCount; i++) {
        var column = document.createElement("i");
        this.grid.appendChild(column);
        column.style.cssText = "\n                height: auto;\n                flex-grow: 1;\n                background-color: ".concat(this.gridOptions.columnBgColor, ";\n                border-left: 1px solid ").concat(this.gridOptions.gridColor, ";\n            ");

        if (this.gridOptions.gutterWidth > 0) {
          column.style.borderRight = "1px solid ".concat(this.gridOptions.gridColor);
        } else {
          this.grid.style.borderRight = "1px solid ".concat(this.gridOptions.gridColor);
        }

        if (this.gridOptions.gutterFixed === true) {
          column.style.marginRight = "".concat(this.gridOptions.gutterWidth, "px");
        } else {
          column.style.marginRight = this.gutterWidthPercentage;
          column.style.width = this.columnWidthPercentage;
        }
      }

      this.grid.lastChild.style.marginRight = 0;
    }
  }, {
    key: "keyboardShortcut",
    value: function keyboardShortcut() {
      var _this = this;

      document.addEventListener("keyup", function (ev) {
        if (ev.keyCode === 71 && ev.altKey) {
          if (_this.grid.style.display === "none") {
            _this.grid.style.display = "flex";
          } else {
            _this.grid.style.display = "none";
          }
        }
      });
    }
  }]);

  return GridHelper;
}();

exports.default = GridHelper;

},{}],7:[function(require,module,exports){
"use strict";

var _GridHelper = _interopRequireDefault(require("./helpers/GridHelper"));

var _NavigationController = _interopRequireDefault(require("./components/NavigationController"));

var _GLTFModelController = _interopRequireDefault(require("./components/GLTFModelController"));

var _GLTFModelControllerShader = _interopRequireDefault(require("./components/GLTFModelControllerShader"));

var _GLTFModelControllerEnvironment = _interopRequireDefault(require("./components/GLTFModelControllerEnvironment"));

var _SofaModelController = _interopRequireDefault(require("./components/SofaModelController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * MAIN JS FILE
 */

/**
 * Helpers
 * Imports of helper functions are stripped out of bundle
 * Include them within "start-strip-code" and "end-strip-code" comments
 */

/* start-strip-code */

/* end-strip-code */

/**
 * Components
 */

/**
 * Check if document is ready cross-browser
 * @param callback
 */
var ready = function ready(callback) {
  if (document.readyState !== "loading") {
    /**
     * Document is already ready, call the callback directly
     */
    callback();
  } else if (document.addEventListener) {
    /**
     * All modern browsers to register DOMContentLoaded
     */
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    /**
     * Old IE browsers
     */
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState === "complete") {
        callback();
      }
    });
  }
};
/**
 * Document ready callback
 */


ready(function () {
  /**
   * HELPERS INIT
   * Only init helpers if they exist
   * Will be undefined on production because of import stripping
   */
  if (typeof _GridHelper.default == "function") {
    var grid = new _GridHelper.default();
    grid.init();
  }
  /**
   * CREDITS INIT
   */


  var credits = ["background-color: #000000", "color: white", "display: block", "line-height: 24px", "text-align: center", "border: 1px solid #ffffff", "font-weight: bold"].join(";");
  console.info("dev by: %c Bornfight ", credits);
  /**
   * COMPONENTS INIT
   */

  /**
   * Navigation
   * @type {NavigationController}
   */

  var navigation = new _NavigationController.default();
  navigation.init();
  var gltfModelController = new _GLTFModelController.default();
  gltfModelController.init();
  var gLTFModelControllerShader = new _GLTFModelControllerShader.default();
  gLTFModelControllerShader.init();
  var gLTFModelControllerEnvironment = new _GLTFModelControllerEnvironment.default();
  gLTFModelControllerEnvironment.init();
  var sofaModelController = new _SofaModelController.default();
  sofaModelController.init();
});

},{"./components/GLTFModelController":1,"./components/GLTFModelControllerEnvironment":2,"./components/GLTFModelControllerShader":3,"./components/NavigationController":4,"./components/SofaModelController":5,"./helpers/GridHelper":6}]},{},[7])

//# sourceMappingURL=bundle.js.map
