!function i(o,r,a){function s(t,e){if(!r[t]){if(!o[t]){var n="function"==typeof require&&require;if(!e&&n)return n(t,!0);if(l)return l(t,!0);throw(n=new Error("Cannot find module '"+t+"'")).code="MODULE_NOT_FOUND",n}n=r[t]={exports:{}},o[t][0].call(n.exports,function(e){return s(o[t][1][e]||e)},n,n.exports,i,o,r,a)}return r[t].exports}for(var l="function"==typeof require&&require,e=0;e<a.length;e++)s(a[e]);return s}({1:[function(e,t,n){"use strict";function a(e){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==a(e)&&"function"!=typeof e)return{default:e};var t=l();if(t&&t.has(e))return t.get(e);var n,i={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(n in e){var r;Object.prototype.hasOwnProperty.call(e,n)&&((r=o?Object.getOwnPropertyDescriptor(e,n):null)&&(r.get||r.set)?Object.defineProperty(i,n,r):i[n]=e[n])}i.default=e,t&&t.set(e,i);return i}(e("three")),r=e("three/examples/jsm/controls/OrbitControls"),s=e("three/examples/jsm/loaders/GLTFLoader");function l(){if("function"!=typeof WeakMap)return null;var e=new WeakMap;return l=function(){return e},e}function c(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}e=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.DOM={modelContainer:".js-model-container",states:{}},this.modelContainer=document.querySelector(this.DOM.modelContainer),this.scene,this.camera,this.renderer,this.mixer,this.clock=new o.Clock}var t,n,i;return t=e,(n=[{key:"init",value:function(){null!==this.modelContainer?(this.initFBXModel(),this.animate()):console.error("".concat(this.DOM.modelContainer," does not exist in the DOM!"))}},{key:"initFBXModel",value:function(){var t=this;this.camera=new o.PerspectiveCamera(35,window.innerWidth/window.innerHeight,.5,1e3),this.camera.position.set(48,32,32),this.scene=new o.Scene,this.scene.background=new o.Color(10526880),this.scene.fog=new o.Fog(10526880,200,1e3);var e=new o.HemisphereLight(16777215,4473924);e.position.set(0,200,0),this.scene.add(e);e=new o.DirectionalLight(16777215);e.position.set(0,200,100),e.castShadow=!0,e.shadow.camera.top=180,e.shadow.camera.bottom=-100,e.shadow.camera.left=-120,e.shadow.camera.right=120,this.scene.add(e);e=new o.Mesh(new o.PlaneBufferGeometry(2e3,2e3),new o.MeshPhongMaterial({color:10066329,depthWrite:!1}));e.rotation.x=-Math.PI/2,e.receiveShadow=!0,this.scene.add(e);e=new o.GridHelper(2e3,20,0,0);e.material.opacity=.2,e.material.transparent=!0,this.scene.add(e);e=this.modelContainer.getAttribute("data-model-source");(new s.GLTFLoader).load(e,function(e){e.scene.traverse(function(e){e.isMesh&&(e.castShadow=!0,e.receiveShadow=!0)}),t.scene.add(e.scene)}),this.renderer=new o.WebGLRenderer({antialias:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.modelContainer.appendChild(this.renderer.domElement);e=new r.OrbitControls(this.camera,this.renderer.domElement);e.target.set(0,10,0),e.update(),window.addEventListener("resize",this.onWindowResize,!1)}},{key:"onWindowResize",value:function(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight)}},{key:"animate",value:function(){var e=this;requestAnimationFrame(function(){return e.animate()}),this.renderer.render(this.scene,this.camera)}}])&&c(t.prototype,n),i&&c(t,i),e}();n.default=e},{three:"three","three/examples/jsm/controls/OrbitControls":"three/examples/jsm/controls/OrbitControls","three/examples/jsm/loaders/GLTFLoader":"three/examples/jsm/loaders/GLTFLoader"}],2:[function(e,t,n){"use strict";function o(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var i=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.DOM={navigation:".js-navigation-wrapper",states:{navigationScrolled:"has-scrolled",navigationFixed:"is-fixed",navigationSlideUp:"slide-up"}},this.scrolling=!1,this.scrollNavigationOffset=200,this.previousTop=0,this.currentTop=0,this.scrollDelta=0,this.scrollOffset=0,this.navigation=document.querySelector(this.DOM.navigation)}var t,n,i;return t=e,(n=[{key:"init",value:function(){null!==this.navigation?this.navigationController():console.error("".concat(this.DOM.navigation," does not exist in the DOM!"))}},{key:"navigationController",value:function(){var e=this;document.addEventListener("scroll",function(){e.scrolling||(e.scrolling=!0,window.requestAnimationFrame?requestAnimationFrame(function(){return e.checkScroll()}):setTimeout(e.checkScroll(),250))})}},{key:"checkScroll",value:function(){var e=window.pageYOffset|document.body.scrollTop;this.changeNavigationState(e),this.previousTop=e,this.scrolling=!1}},{key:"changeNavigationState",value:function(e){e>this.scrollNavigationOffset?this.navigation.classList.add(this.DOM.states.navigationScrolled):this.navigation.classList.remove(this.DOM.states.navigationScrolled),this.previousTop>=e?this.scrollingUp(e):this.scrollingDown(e)}},{key:"scrollingUp",value:function(e){(e<this.scrollNavigationOffset||this.previousTop-e>this.scrollDelta)&&this.navigation.classList.remove(this.DOM.states.navigationSlideUp)}},{key:"scrollingDown",value:function(e){e>this.scrollNavigationOffset+this.scrollOffset?this.navigation.classList.add(this.DOM.states.navigationSlideUp):e>this.scrollNavigationOffset&&this.navigation.classList.remove(this.DOM.states.navigationSlideUp)}}])&&o(t.prototype,n),i&&o(t,i),e}();n.default=i},{}],3:[function(e,t,n){"use strict";var i=r(e("./components/NavigationController")),o=r(e("./components/GLTFModelController"));function r(e){return e&&e.__esModule?e:{default:e}}var a;a=function(){"function"==typeof GridHelper&&(new GridHelper).init();var e=["background-color: #000000","color: white","display: block","line-height: 24px","text-align: center","border: 1px solid #ffffff","font-weight: bold"].join(";");console.info("dev by: %c Bornfight ",e),(new i.default).init(),(new o.default).init()},"loading"!==document.readyState?a():document.addEventListener?document.addEventListener("DOMContentLoaded",a):document.attachEvent("onreadystatechange",function(){"complete"===document.readyState&&a()})},{"./components/GLTFModelController":1,"./components/NavigationController":2}]},{},[3]);