var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadShaderFromFile, initBuffer } from '../../lib/webgl-tool.js';
import { getWebGLContext, } from '../../lib/cuon-utils.js';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById('webgl');
        const gl = getWebGLContext(canvas, undefined);
        const vsFilePath = '../src/shader/HelloTriangle.vs';
        const fsFilePath = '../src/shader/HelloTriangle.fs';
        let res = yield loadShaderFromFile(gl, vsFilePath, fsFilePath);
        if (res instanceof Error) {
            console.log(res);
            return res;
        }
        let program = res;
        let a_Position = gl.getAttribLocation(program, 'a_Position');
        if (a_Position === -1) {
            console.log('cant get a_Position location');
            return;
        }
        // let vertices = new Float32Array([0.0,0.5,-0.5,-0.5,0.5,-0.5]);
        let vertices = new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, -0.5]);
        let args = [gl.ARRAY_BUFFER, gl.ARRAY_BUFFER, gl.STATIC_DRAW, 2, gl.FLOAT, false, 0, 0];
        let n = initBuffer(gl, [a_Position, vertices, args]);
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n[0]);
    });
}
main();
