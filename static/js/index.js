/**
 * MAIN JS FILE
 */

/**
 * Helpers
 * Imports of helper functions are stripped out of bundle
 * Include them within "start-strip-code" and "end-strip-code" comments
 */
/* start-strip-code */
import GridHelper from "./helpers/GridHelper";
/* end-strip-code */
/**
 * Components
 */
import NavigationController from "./components/NavigationController";
import GLTFModelController from "./components/GLTFModelController";
import GLTFModelControllerShader from "./components/GLTFModelControllerShader";
import GLTFModelControllerEnvironment from "./components/GLTFModelControllerEnvironment";
import SofaModelController from "./components/SofaModelController";
import SofaModel from "./components/SofaModel";

/**
 * Check if document is ready cross-browser
 * @param callback
 */
const ready = (callback) => {
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
ready(() => {
    /**
     * HELPERS INIT
     * Only init helpers if they exist
     * Will be undefined on production because of import stripping
     */
    if (typeof GridHelper == "function") {
        const grid = new GridHelper();
        grid.init();
    }

    /**
     * CREDITS INIT
     */
    const credits = [
        "background-color: #000000",
        "color: white",
        "display: block",
        "line-height: 24px",
        "text-align: center",
        "border: 1px solid #ffffff",
        "font-weight: bold",
    ].join(";");
    console.info("dev by: %c Bornfight ", credits);

    /**
     * COMPONENTS INIT
     */

    /**
     * Navigation
     * @type {NavigationController}
     */
    const navigation = new NavigationController();
    navigation.init();

    const gltfModelController = new GLTFModelController();
    gltfModelController.init();

    const gLTFModelControllerShader = new GLTFModelControllerShader();
    gLTFModelControllerShader.init();

    const gLTFModelControllerEnvironment = new GLTFModelControllerEnvironment();
    gLTFModelControllerEnvironment.init();

    const sofaModelController = new SofaModelController();
    sofaModelController.init();

    const sofaModel = new SofaModel();
    sofaModel.init();
});
