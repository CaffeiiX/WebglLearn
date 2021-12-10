var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initGL, loadShaderFromFile } from "../../lib/webgl-tool.js";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let gl = initGL('webgl');
    const vsFile = '../src/shader/MultiPointSize.vs';
    const fsFile = '../src/shader/MultiPointSize.fs';
    // get 
    let res = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (res instanceof Error) {
        console.log(res);
        return;
    }
    let program = res;
    // get Location
    let a_Position = gl.getAttribLocation(program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    if (a_PointSize === -1 || a_Position === -1)
        return;
    // set Buffer
    let vertexData = new Float32Array([
        0.0, 0.5, 10.0,
        -0.5, -0.5, 20.0,
        0.5, -0.5, 30.0
    ]);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3 * FSIZE, 0);
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_PointSize);
    gl.clearColor(0., 0., 0., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);
});
main();
