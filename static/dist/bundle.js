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
      modelContainer: ".js-model-container",
      states: {}
    };
    this.modelContainer = document.querySelector(this.DOM.modelContainer);
    this.scene;
    this.camera;
    this.renderer;
    this.controls;
    this.mixer;
    this.clock = new THREE.Clock();
    this.gui = new dat.GUI({
      name: "Bottle config"
    });
    this.guiConf = {
      color: {
        color: "#3cabab"
      },
      autoRotation: {
        autoRotate: true
      },
      opacity: {
        transparent: true,
        opacity: 0.5
      },
      glossy: {
        glass: false,
        emissiveColor: "#000000"
      }
    };
  }

  _createClass(GLTFModelController, [{
    key: "init",
    value: function init() {
      console.log("GLTFModelController init()");

      if (this.modelContainer !== null) {
        this.initFBXModel();
        this.animate();
      } else {
        console.error("".concat(this.DOM.modelContainer, " does not exist in the DOM!"));
      }
    }
  }, {
    key: "initFBXModel",
    value: function initFBXModel() {
      var _this = this;

      // camera
      this.camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.5, 1000);
      this.camera.position.set(48, 32, 32); // scene

      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xa0a0a0);
      this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 400); // lights

      var hemiLight = new THREE.HemisphereLight(0xffffff, 0x999999);
      hemiLight.position.set(0, 200, 0);
      this.scene.add(hemiLight);
      var dirLight = new THREE.DirectionalLight(0xcccccc);
      dirLight.position.set(20, 20, 20);
      dirLight.castShadow = true;
      dirLight.shadow.camera.top = 180;
      dirLight.shadow.camera.bottom = -100;
      dirLight.shadow.camera.left = -120;
      dirLight.shadow.camera.right = 120;
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      this.scene.add(dirLight); // ground

      var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000, 10, 10), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
      }));
      mesh.rotation.x = -Math.PI / 2;
      mesh.receiveShadow = true;
      this.scene.add(mesh); // ground grid

      var grid = new THREE.GridHelper(2000, 40, 0x000000, 0x000000);
      grid.material.opacity = 0.1;
      grid.material.transparent = true;
      this.scene.add(grid); // get model

      var model = this.modelContainer.getAttribute("data-model-source"); // loader

      var loader = new _GLTFLoader.GLTFLoader();
      loader.load(model, function (model) {
        // dynamically change material
        var material = new THREE.MeshPhysicalMaterial({
          color: _this.guiConf.color.color
        });
        model.scene.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
            var initMaterial = object.material; // additional modifications of position, color etc. — model properties can be changed

            object.position.y = 0.1; // object.material = material;

            object.material.side = 2;
            object.material.shadowSide = 1;
            object.material.opacity = _this.guiConf.opacity.opacity;
            object.material.emissive.set(_this.guiConf.glossy.emissiveColor);

            _this.gui.addColor(_this.guiConf.color, "color").onChange(function (colorValue) {
              object.material.color.set(colorValue);
            });

            _this.gui.add(_this.guiConf.opacity, "transparent").onChange(function (value) {
              if (value === false) {
                object.material = material;
              } else {
                object.material = initMaterial;
              }

              if (_this.guiConf.glossy.glass) {
                object.material.refractionRatio = 1;
                object.material.reflectivity = 1;
                object.material.roughness = 0;
                object.material.clearcoat = 1;
                object.material.clearcoatRoughness = 1;
              }
            });

            _this.gui.add(_this.guiConf.opacity, "opacity", 0.25, 0.75, 0.01).onChange(function (opacityValue) {
              object.material.opacity = opacityValue;
            });

            _this.gui.addColor(_this.guiConf.glossy, "emissiveColor").onChange(function (colorValue) {
              object.material.emissive.set(colorValue);
            });

            _this.gui.add(_this.guiConf.glossy, "glass").onChange(function (value) {
              if (value) {
                object.material.refractionRatio = 1;
                object.material.reflectivity = 1;
                object.material.roughness = 0;
                object.material.clearcoat = 1;
                object.material.clearcoatRoughness = 1;
              } else {
                object.material.refractionRatio = 0;
                object.material.reflectivity = 0;
                object.material.roughness = 0.5;
                object.material.clearcoat = 0;
                object.material.clearcoatRoughness = 0;
              }
            });
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
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 1;
      this.gui.add(this.guiConf.autoRotation, "autoRotate").onChange(function (value) {
        console.log(value);

        if (value === false) {
          _this.controls.autoRotate = false;
        } else {
          _this.controls.autoRotate = true;
        }
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

  return GLTFModelController;
}();

exports.default = GLTFModelController;

},{"dat.gui":"dat.gui","three":"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";

var _GridHelper = _interopRequireDefault(require("./helpers/GridHelper"));

var _NavigationController = _interopRequireDefault(require("./components/NavigationController"));

var _GLTFModelController = _interopRequireDefault(require("./components/GLTFModelController"));

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
});

},{"./components/GLTFModelController":1,"./components/NavigationController":2,"./helpers/GridHelper":3}]},{},[4])

//# sourceMappingURL=bundle.js.map
