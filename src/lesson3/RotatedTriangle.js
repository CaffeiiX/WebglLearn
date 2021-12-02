var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadShaderFromFile, initBuffer } from "../../lib/webgl-tool.js";
import { getWebGLContext } from "../../lib/cuon-utils.js";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const canvas = document.getElementById('webgl');
        const gl = getWebGLContext(canvas, undefined);
        const fsPathFile = "../src/shader/RotatedTriangle.fs";
        const vsPathFile = "../src/shader/RotatedTriangle.vs";
        let res = yield loadShaderFromFile(gl, vsPathFile, fsPathFile);
        if (res instanceof Error) {
            console.log(res);
            return res;
        }
        let program = res;
        let a_Position = gl.getAttribLocation(program, "a_Position");
        // let u_CosB = gl.getUniformLocation(program, 'u_CosB');
        // let u_SinB = gl.getUniformLocation(program, 'u_SinB');
        let u_xformMatrix = gl.getUniformLocation(program, 'u_xformMatrix');
        let vertex = new Float32Array([-0.5, -0.5, 0., 0.5, 0.5, -0.5]);
        let args = [gl.ARRAY_BUFFER, gl.ARRAY_BUFFER, gl.STATIC_DRAW, 2, gl.FLOAT, false, 0, 0];
        let n = initBuffer(gl, [a_Position, vertex, args]);
        // gl.uniform1f(u_CosB, Math.cos(60/180 * Math.PI));
        // gl.uniform1f(u_SinB, Math.sin(60/180 * Math.PI));
        let cosB = Math.cos(60 / 180 * Math.PI);
        let sinB = Math.sin(60 / 180 * Math.PI);
        let xformMatrix = new Float32Array([
            1, 0, 0, 0,
            0, 1.5, 0, 0,
            0, 0, 1.0, 0.0,
            0, 0, 0, 1.0
        ]);
        gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
        gl.clearColor(0., 0., 0., 1.);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, n[0]);
    });
}
main();
