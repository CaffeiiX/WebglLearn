import {
    getWebGLContext,
    initShaders
} from '../lib/cuon-utils.js';
import {loadShaderFromFile} from "../lib/webgl-tool.js";

async function main() {
    //init gl
    let canvas = document.getElementById('webgl');
    let gl = getWebGLContext(canvas);
    let vsFile = "../src/shader/helloCanvas.vs";
    let fsFile = "../src/shader/helloCanvas.fs";

    //load shader
    let res = await loadShaderFromFile(gl, vsFile, fsFile);
    if (res instanceof Error) {
        console.log(res);
        return;
    }
    //get position
    let a_position = gl.getAttribLocation(gl.program, 'a_position');
    if (a_position === -1) {
        console.log("can not get a_position");
        return;
    }

    gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);

}
main();