import {
    loadShaderFromFile,initBuffer,getLocation
} from '../../lib/webgl-tool.js';

import {
    getWebGLContext,
} from '../../lib/cuon-utils.js';

import {
    Matrix4
} from "../../lib/cuon-matrix.js"

async function main(){
    const canvas : HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('webgl');
    const gl : WebGLRenderingContext = getWebGLContext(canvas, undefined);

    const vsFilePath = '../src/shader/RotatedTranslatedTriangle.vs';
    const fsFilePath = '../src/shader/RotatedTranslatedTriangle.fs';

    let res = await loadShaderFromFile(gl, vsFilePath, fsFilePath);
    if(res instanceof Error){
        console.log(res);
        return res;
    }
    let program = res;

    //获取location 
    let a_Position = getLocation(gl,program,'a_Position');
    let u_ModelMatrix = getLocation(gl, program, 'u_ModelMatrix', false);
    if(a_Position === null || u_ModelMatrix === null) return;

    //计算模型矩阵
    let modelMatrix = new Matrix4(undefined);
    let Angle = 60.0;
    let Tx = 0.5;
    modelMatrix.setRotate(Angle, 0,0,1);
    modelMatrix.translate(Tx,0,0);
    // buffer and a_Position
    let vetices = new Float32Array([0.0,0.5,-0.5,-0.5,0.5,-0.5]);
    let bufferArgs = [gl.ARRAY_BUFFER, gl.ARRAY_BUFFER, gl.STATIC_DRAW, 2, gl.FLOAT, false, 0, 0];
    let n = initBuffer(gl, [a_Position,vetices,bufferArgs]);
    // model
    gl.uniformMatrix4fv(u_ModelMatrix,false, modelMatrix.elements);
    //draw
    gl.clearColor(0.,0.,0.,1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n[0]);
}
main()