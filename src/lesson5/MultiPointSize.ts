import {
    initGL, loadShaderFromFile, getLocation
} from "../../lib/webgl-tool.js"

const main = async () => {
    let gl = initGL('webgl');
    const vsFile = '../src/shader/MultiPointSize.vs';
    const fsFile = '../src/shader/MultiPointSize.fs';

    // get 
    let res = await loadShaderFromFile(gl, vsFile, fsFile);
    if(res instanceof Error){
        console.log(res);
        return;
    }
    let program: WebGLProgram = res;

    // get Location
    let a_Position = gl.getAttribLocation(program, 'a_Position');
    let a_PointSize = gl.getAttribLocation(program, 'a_PointSize');
    if(a_PointSize === -1 || a_Position === -1) return;

    // set Buffer
    let vertexData = new Float32Array([
        0.0,0.5,10.0,
        -0.5,-0.5,20.0,
        0.5,-0.5,30.0
    ])
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const FSIZE = vertexData.BYTES_PER_ELEMENT;
    
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 3* FSIZE, 0);
    gl.vertexAttribPointer(a_PointSize, 1, gl.FLOAT, false, 3*FSIZE, 2* FSIZE);
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_PointSize);
    
    gl.clearColor(0.,0.,0.,1.);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 3);
}
main();