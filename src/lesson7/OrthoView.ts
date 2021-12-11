import {
    initGL, loadShaderFromFile, getLocation
} from "../../lib/webgl-tool.js"
import {
    Matrix4
}from "../../lib/cuon-matrix.js"
const main = async () => {
    // init gl
    const gl = initGL('webgl');
    const vsFile = "../src/shader/OrthoView.vs";
    const fsFile = "../src/shader/OrthoView.fs";
    let program = await loadShaderFromFile(gl, vsFile, fsFile);
    if(program instanceof Error) return;
    // get near and far elements
    let nearElement = document.getElementById('near');
    let farElement = document.getElementById('far');

    // get location
    const a_Position = getLocation(gl, program, 'a_Position');
    const a_Color = getLocation(gl, program, 'a_Color');
    const u_ProjMatrix = getLocation(gl, program, 'u_ProjMatrix', false);

    // init buffer
    const vertexData = new Float32Array([
        0.,0.5,-0.4,0.4,1.0,0.4,
        -0.5,-0.5,-0.4,0.4,1.0,0.4,
        0.5,-0.5,-0.4,1.0,0.4,0.4,

        0.5,0.4,-0.2,1.0,0.4,0.4,
        -0.5,0.4,-0.2,1.,1.0,0.4,
        0.,-0.6,-0.2,1.0,1.4,0.4,

        0.0,0.4,0.,0.4,0.4,1.,
        -0.5,-0.6,0.,0.4,0.4,1.,
        0.5,-0.6,0.,1.0,0.4,0.4,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 6*FSIZE, 0);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 6*FSIZE, 3*FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_Color);

    let [near, far] = [0., 0.5];
    document.onkeydown = (event) =>{
        switch (event.key) {
            case "ArrowRight":
                near += 0.01;
                break;
            case "ArrowLeft":
                near -= 0.01;
                break;
            case "ArrowUp":
                far += 0.01;
                break;
            case "ArrowDown":
                far -= 0.01;
                break;
            default:
                break;
        }

        draw(gl, u_ProjMatrix, near, far);
        nearElement.innerHTML = "near:" + near.toString();
        farElement.innerHTML = "far:" + far.toString();
    }
    // matrix
    draw(gl, u_ProjMatrix, near, far);
}
function draw(gl:WebGLRenderingContext,u_ProjMatrix: WebGLUniformLocation, near: number, far: number){
    let viewMatrix: Matrix4 = new Matrix4(undefined);
    viewMatrix.setOrtho(-1,1,-1,1, near, far);
    // viewMatrix.
    //viewMatrix.setLookAt(eyeX,eyeY,eyeZ,0.,0.,0.,0.,1.,0.);
    gl.uniformMatrix4fv(u_ProjMatrix, false, viewMatrix.elements);
    gl.clearColor(0.,0.,0.,1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 9);
}
main();