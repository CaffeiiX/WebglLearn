import {
    initShaders, getWebGLContext
} from '../lib/cuon-utils.js'
/**
 * 
 * @param {*} gl  gl context
 * @param {*} vsFileName vs file path
 * @param {*} fsFileName fs file path
 * @returns 
 */
async function loadShaderFromFile(gl, vsFileName, fsFileName) {
    if(!gl) {
        console.log("failed to get the rendering context for WebGL");
        return new Error("gl not exists");
    }
    let vsData = await fetch(vsFileName);
    let fsData = await fetch(fsFileName);
    if (vsData.ok && fsData.ok) {
        let vs_shader = await vsData.text();
        let fs_shader = await fsData.text();
        //init shaders of gl
        if (!initShaders(gl, vs_shader, fs_shader)) {
            console.log("init shader fail");
            return new Error("init shader fail");
        }
        return gl.program;
    }
    return new Error("load file fail");
}
/**
* create buffer
* @param gl GL context
* @param args Array save the data
* arg[0] position
* arg[1] data
* arg[2] => bufferArg create use the args
* bindBuffer(bufferArg[0], buffer) , bufferArg[0] replace data/index
* bufferData(bufferArg[1], data, bufferArg[2]) 1 => data/index 2 => write dato to buffer times and draw times
* vertextAttribPointer(position, ...bufferArg), size: vector length, type: data type, normalize: false/true
* stride the bytes between two point, offset start location 
*/
function initBuffer(gl, ...args){
    if(args.length == 0){
        console.log("no data need to address");
        return;
    }
    let n_col  = [];
    for(let arg of args){
        let position = arg[0];
        let data = arg[1];
        let bufferArgs = arg[2];
        let buffer = gl.createBuffer();
        if(!buffer){
            console.log('failed to create the buffer object');
            return;
        }
        gl.bindBuffer(bufferArgs[0], buffer);
        gl.bufferData(bufferArgs[1], data, bufferArgs[2]);
        gl.vertexAttribPointer(position, ...bufferArgs.slice(3,));
        gl.enableVertexAttribArray(position);
        n_col.push(Math.round(data.length / bufferArgs[3]));
    }
    return n_col;
}
/**
 * @param {*} gl webgl
 * @param {*} program  gl.program
 * @param {*} location need to get location
 * @param {*} type true attribute location false uniform location
 */
function getLocation(gl, program, location, type=true){
    let target;
    if(type) target = gl.getAttribLocation(program, location);
    else target = gl.getUniformLocation(program, location);
    if(target === -1) {
        console.log(`${location} is not exist`);
        return null;
    }
    else return target
}

/**
 * 
 * @param {*} canvas  string
 * @returns 
 */
function initGL(canvas){
    let canvasElement = document.getElementById(canvas);
    if(!canvasElement){
        console.log("canvas not exists");
        return;
    }
    return getWebGLContext(canvasElement);
}
export {loadShaderFromFile, initBuffer, getLocation, initGL} 