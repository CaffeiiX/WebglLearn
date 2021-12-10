var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { initGL, loadShaderFromFile, getLocation } from "../../lib/webgl-tool.js";
import { Matrix4 } from "../../lib/cuon-matrix.js";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const gl = initGL('webgl');
    const vsFile = "../src/shader/LookAtTriangles.vs";
    const fsFile = "../src/shader/LookAtTriangles.fs";
    let program = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error)
        return;
    // get location
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_ViewMatrix = getLocation(gl, program, 'u_ViewMatrix', false);
    // init buffer
    const vertexData = new Float32Array([
        0., 0.5, -0.4, 0.4, 1.0, 0.4,
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,
        0.5, 0.4, -0.2, 1.0, 0.4, 0.4,
        -0.5, 0.4, -0.2, 1., 1.0, 0.4,
        0., -0.6, -0.2, 1.0, 1.4, 0.4,
        0., 0.5, 0., 0.4, 0.4, 1.,
        -0.5, -0.5, 0., 0.4, 0.4, 1.,
        0.5, -0.5, 0., 1.0, 0.4, 0.4,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    // matrix
    let viewMatrix = new Matrix4(undefined);
    viewMatrix.setLookAt(0.2, 0.25, 0.25, 0., 0., 0., 0., 1., 0.);
    let modelMatrix = new Matrix4(undefined);
    modelMatrix.setRotate(-10, 0, 0, 1);
    let modelViewMatrix = viewMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_ViewMatrix, false, modelViewMatrix.elements);
    // 
    gl.clearColor(0., 0., 0., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
});
main();
