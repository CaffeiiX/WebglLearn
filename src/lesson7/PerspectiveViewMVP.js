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
    const vsFile = "../src/shader/PerspectiveViewMVP.vs";
    const fsFile = "../src/shader/PerspectiveViewMVP.fs";
    let program = yield loadShaderFromFile(gl, vsFile, fsFile);
    if (program instanceof Error)
        return;
    // get location
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_ViewMatrix = getLocation(gl, program, 'u_ViewMatrix', false);
    const u_ProjMatrix = getLocation(gl, program, 'u_ProjMatrix', false);
    const u_ModelMatrix = getLocation(gl, program, 'u_ModelMatrix', false);
    // init buffer
    const vertexData = new Float32Array([
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, .4, 0.4,
        0., 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, .4, 0.4,
        0., 1.0, .0, 0.4, 1.0, 0.4,
        -0.5, -1.0, .0, 0.4, 0.4, 1.,
        0.5, -1.0, .0, 1.0, .4, 0.4,
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
    gl.clearColor(0., 0., 0., 1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    let [eyeX, eyeY, eyeZ] = [0, 0, 5];
    let modelMatrix = new Matrix4(undefined);
    modelMatrix.setTranslate(0.75, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    //???????????????????????????????????????
    draw(gl, u_ViewMatrix, u_ProjMatrix, eyeX, eyeY, eyeZ);
    // matrix
    modelMatrix.setTranslate(-0.75, 0., 0.);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    draw(gl, u_ViewMatrix, u_ProjMatrix, eyeX, eyeY, eyeZ);
});
function draw(gl, u_ViewMatrix, u_ProjMatrix, eyeX, eyeY, eyeZ) {
    let viewMatrix = new Matrix4(undefined);
    viewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0., 0., 0., 0., 1., 0.);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
    let projMatrix = new Matrix4(undefined);
    projMatrix.setPerspective(30, 1, 1, 100);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}
main();
