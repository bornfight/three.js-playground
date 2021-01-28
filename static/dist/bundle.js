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

var dat = _interopRequireWildcard(require("dat.gui"));

var _OrbitControls = require("three/examples/jsm/controls/OrbitControls");

var _GLTFLoader = require("three/examples/jsm/loaders/GLTFLoader");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GLTFModelControllerEnvironment = /*#__PURE__*/function () {
  function GLTFModelControllerEnvironment() {
    _classCallCheck(this, GLTFModelControllerEnvironment);

    this.DOM = {
      modelContainer: ".js-model-container-environment"
    };
  }

  _createClass(GLTFModelControllerEnvironment, [{
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
            autoRotate: false
          },
          opacity: {
            transparent: true,
            opacity: 0.3
          },
          glossy: {
            glass: true
          },
          environment: {
            showEnvironment: true,
            color: "#0005a0"
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
      this.camera = new THREE.PerspectiveCamera(35, this.width / this.height, 0.5, 600);
      this.camera.position.set(10, 10, 40); // scene

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xffffff); // lights

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
      hemiLight.position.set(0, 200, 0);
      this.scene.add(hemiLight);
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.ambientLight.matrixAutoUpdate = false;
      this.scene.add(this.ambientLight); // this is just back light - without it back side of model would be barely visible

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
      this.scene.add(this.dirLight); // add gui for light intensity
      // this.gui
      //     .add(this.guiConf.light, "lightIntensity", 1, 10, 0.1)
      //     .onChange((value) => {
      //         this.dirLight.intensity = value;
      //     });
      // ground

      this.environment = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 100), new THREE.MeshStandardMaterial({
        depthWrite: false,
        refractionRatio: 0,
        roughness: 1,
        side: THREE.DoubleSide
      }));
      this.environment.position.y = 50;
      this.environment.receiveShadow = true;
      this.environment.material.color.set(this.guiConf.environment.color);
      this.scene.add(this.environment); // add gui for plane

      if (!this.guiConf.environment.showEnvironment) {
        this.environment.visible = false;
      } // this.gui
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
      this.controls.enablePan = false;
      this.controls.maxPolarAngle = Math.PI / 1.8;
      this.controls.minPolarAngle = Math.PI / 3.5; // this.gui
      //     .add(this.guiConf.autoRotation, "autoRotate")
      //     .onChange((value) => {
      //         console.log(value);
      //         this.controls.autoRotate = value !== false;
      //     });
      // handle resize

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
        model.scene.traverse(function (object) {
          if (object.isMesh) {
            object.position.y = 0.1;
            object.castShadow = true;
            object.material.side = 2;
            object.material.shadowSide = 1;
            object.material.metalness = 0;
            object.material.opacity = _this2.guiConf.opacity.opacity;
            object.material.depthFunc = false;
            object.material.depthWrite = !_this2.guiConf.opacity.transparent;
            object.material.transparent = _this2.guiConf.opacity.transparent;
            object.material.color.set(_this2.guiConf.color.color);
            object.material.color.convertSRGBToLinear();
            object.matrixAutoUpdate = false; // reflection map

            var path = "/three.js-playground/static/images/maps/";
            var mapUrls = [path + "posx.jpg", path + "negx.jpg", path + "posy.jpg", path + "negy.jpg", path + "posz.jpg", path + "negz.jpg"];
            var cubeMap = new THREE.CubeTextureLoader().load(mapUrls);
            cubeMap.format = THREE.RGBFormat;
            cubeMap.encoding = THREE.sRGBEncoding;
            object.material.needsUpdate = false;

            if (_this2.guiConf.opacity.transparent) {
              object.material.envMap = cubeMap;
            } // if initial glass state is true


            if (_this2.guiConf.glossy.glass) {
              _this2.glassOptions(object.material);
            }

            _this2.gui.addColor(_this2.guiConf.color, "color").onChange(function (colorValue) {
              object.material.color.set(colorValue);
            });

            _this2.gui.add(_this2.guiConf.opacity, "transparent").onChange(function (value) {
              object.material.transparent = value;
              object.material.depthWrite = !value;

              if (!value) {
                object.material.envMap = null;
                object.material.side = null;
                object.material.shadowSide = null;
              } else {
                object.material.envMap = cubeMap;
                object.material.side = 2;
                object.material.shadowSide = 1;
              }

              object.material.needsUpdate = true;
            });

            _this2.gui.add(_this2.guiConf.opacity, "opacity", 0, 1, 0.01).onChange(function (opacityValue) {
              object.material.opacity = opacityValue;
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
      material.refractionRatio = 50;
      material.reflectivity = 1;
      material.roughness = 0;
      material.clearcoat = 1;
      material.clearcoatRoughness = 0;
      material.metalness = 0;
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
      this.camera.updateProjectionMatrix();
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

  return GLTFModelControllerEnvironment;
}();

exports.default = GLTFModelControllerEnvironment;

},{"dat.gui":"dat.gui","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],3:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
"use strict";

var _GridHelper = _interopRequireDefault(require("./helpers/GridHelper"));

var _NavigationController = _interopRequireDefault(require("./components/NavigationController"));

var _GLTFModelController = _interopRequireDefault(require("./components/GLTFModelController"));

var _GLTFModelControllerShader = _interopRequireDefault(require("./components/GLTFModelControllerShader"));

var _GLTFModelControllerEnvironment = _interopRequireDefault(require("./components/GLTFModelControllerEnvironment"));

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
});

},{"./components/GLTFModelController":1,"./components/GLTFModelControllerEnvironment":2,"./components/GLTFModelControllerShader":3,"./components/NavigationController":4,"./helpers/GridHelper":5}]},{},[6])

//# sourceMappingURL=bundle.js.map
