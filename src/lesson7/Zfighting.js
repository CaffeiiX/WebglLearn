var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { loadShaderFromFile, initGL, getLocation } from "../../lib/webgl-tool.js";
import { Matrix4 } from "../../lib/cuon-matrix.js";
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const gl = initGL('webgl');
    const vsFile = "../src/shader/Zfighting.vs";
    const fsFile = "../src/shader/Zfighting.fs";
    let program = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error)
        return;
    // get location
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_ViewMatrix = getLocation(gl, program, 'u_ViewMatrix', false);
    const u_ProjMatrix = getLocation(gl, program, 'u_ProjMatrix', false);
    const vertexData = new Float32Array([
        0., 2.5, -5., 0., 1., .0,
        -2.5, -2.5, -5., 0., 1., 0.,
        2.5, -2.5, -5., 1., 0., 0.,
        0., 3., -5., 1., 0., 0.,
        -3., -3., -5., 1., 1., 0.,
        3., -3., -5., 1., 1., 0.
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6 * FSIZE, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6 * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);
    //
    let projMatrix = new Matrix4(undefined);
    projMatrix.setPerspective(50, 1, 1, 100);
    let viewMatrix = new Matrix4(undefined);
    viewMatrix.setLookAt(0., 0., 10., 0., 0., 0., 0., 1., 0.);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.clearColor(0., 0., 0., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.drawArrays(gl.TRIANGLES, 3, 6);
    gl.polygonOffset(1., 1.);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
});
main();
